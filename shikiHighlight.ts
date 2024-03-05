import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';

async function processFilesInDirectory(directory: string) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      // Skip directories or optionally recurse into them
      await processFilesInDirectory(fullPath);
    } else if (entry.isFile() && extname(entry.name) === '.mdx') {
      console.log('Reading: ', fullPath);
      let content = await readFile(fullPath, 'utf8');
      const modifiedContent = modifyContentBasedOnPattern(content);
      await writeFile(fullPath, modifiedContent);
    }
  }
}

function modifyContentBasedOnPattern(content: string): string {
  const codeBlockRegex = /```(\w+)(.*)([^`]+)``/g;
  return content.replace(codeBlockRegex, (match, lang, rest, code) => {
    console.log('match', match, lang, code);
    // First, check if there are any lines specified for highlighting
    const highlightedLines = getHighlightedLines(match);

    // If no lines were specified, return the original code block unchanged
    if (highlightedLines.length === 0) {
      return match;
    }

    const lines = code.split('\n');
    const highlightSyntax = getCommentSyntax(lang);

    let highlightedCode = lines
      .map((line, index) => {
        // Adjust index by 1 since lines are 1-based, not 0-based
        if (highlightedLines.includes(index)) {
          return line + ` ${highlightSyntax} [!code highlight]`;
        } else {
          return line;
        }
      })
      .join('\n');

    return '```' + lang + rest + highlightedCode + '``';
  });
}

function getHighlightedLines(code: string): number[] {
  const lineHighlightRegex = /\{([\d,-]+)\}/;
  const match = code.match(lineHighlightRegex);
  let lines: number[] = [];
  console.log('code', code);
  console.log('match', match);
  if (match) {
    const parts = match[1].split(',');
    parts.forEach((part) => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          lines.push(i);
        }
      } else {
        lines.push(Number(part));
      }
    });
  }

  return lines;
}

function getCommentSyntax(lang: string): string {
  switch (lang) {
    case 'python':
      return '#';
    case 'javascript':
    case 'typescript':
    case 'astro':
    case 'go':
    case 'mdx':
      return '//';
    default:
      return '//'; // Default to '//' but adjust based on languages you expect
  }
}

const currentDirectory = '.'; // Adjust as necessary
processFilesInDirectory(currentDirectory).then(() => console.log('Done processing files.'));
