import remarkPresetLintConsistent from 'remark-preset-lint-consistent';
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide';
import remarkPresetLintRecommended from 'remark-preset-lint-recommended';
import presetPrettier from 'remark-preset-prettier';
import remarkFrontmatter from 'remark-frontmatter';
import remarkLintFrontmatterSchema from 'remark-lint-frontmatter-schema';
/* —————————————————————————————————————————————————————————————————————————— */

const remarkConfig = {
  plugins: [
    remarkPresetLintConsistent,
    remarkPresetLintMarkdownStyleGuide,
    remarkPresetLintRecommended,
    presetPrettier,
    remarkFrontmatter,
    /* v————— Use it without settings, with local '$schema' associations only */
    // rlFmSchema

    /* v————— Or with global schemas associations */
    [
      remarkLintFrontmatterSchema,
      {
        schemas: {
          /* One schema for many files */
          './doc.schema.yaml': ['**/*.mdx']
        }
      }
    ]
  ]
};

export default remarkConfig;
