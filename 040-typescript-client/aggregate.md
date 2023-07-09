---
sidebar_position: 9
sidebar_label: Aggregating
keywords: aggregate, aggregate data, aggregations, aggregate request
---

# Aggregations

> ⚠️ **Warning**: This feature is Beta. It is still under active development. While we are avoiding breaking changes, we do not guarantee backwards compatibility
> until the functionality is GA.

The `/aggregate` API allows you to use the search/analytics engine to perform aggregations on your data. Similar to the [search API](/typescript-client/search),
it is important to understand that the Aggregation API is served from a different store, which means: it is eventually consistent with the main store,
and it cannot access the linked fields from a table. If these limitations are not acceptable for your use case, you should use the Summarize API. The advantages of using the Aggregation API, over the Summarize API, are:

- it generally offers better performance, because the underlying store is column oriented.
- it offers composable aggregations that can be combined into complex aggregations / visualizations.

Operations which are available both in the Aggregation and the Summarize API, such as `sum`, may present small deviations due to differences in the order of reading data from storage and subsequent rounding, as well as in case of in-flight data until consistency is achieved across the different stores.

An example of a relatively complex visualization that can be created with the Aggregation API could be: a multi-line chart, where each line represents a movie genre,
and the Y axis represents the average rating of the movies in that genre, per year. This chart can be obtained with a single aggregation request, looking something
like this:

````ts|json
  ```ts
  const results = await xata.db.titles.aggregate({
    "movieGenres": {
      topValues: {
        column: "genre",
        size: 50
        aggs: {
          "byReleaseDate": {
            dateHistogram: {
              column: "releaseDate",
              calendarInterval: "year",
            },
            aggs: {
              "avgRating": {
                average: {
                  column: "rating"
                }
              }
            }
          }
        }
      }
    },
  })
  ```
  ```json
  // POST https://tutorial-ng7s8c.us-east-1.xata.sh/db/tutorial:main/tables/titles/aggregate
  {
    "aggs": {
      "movieGenres": {
        "topValues": {
          "column": "genre",
          "size": 50,
          "aggs": {
            "byReleaseDate": {
              "dateHistogram": {
                "column": "releaseDate",
                "calendarInterval": "year"
              },
              "aggs": {
                "avgRating": {
                  "average": {
                    "column": "rating"
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ```
````

The code above combines three aggregations: `topValues`, `dateHistogram` and `average`. The `topValues` aggregations splits the data into buckets based on the `genre` column, and takes the top 50 genres by the number of movies in each. The `dateHistogram` aggregation splits the data into buckets based on the `releaseDate` column, and groups the data by calendaristic year. The `average` aggregation is a metric aggregation that is executed on the resulting buckets.

## Filtering

The `/aggregate` API can be combined with top-level filters using the syntax of the [filtering API](/typescript-client/filtering).

````ts|json
  ```ts
    const results = await xata.db.titles.aggregate({
    "movieGenres": {
      topValues: {
        column: "genre",
        size: 50
        aggs: {
          "byReleaseDate": {
            dateHistogram: {
              column: "releaseDate",
              calendarInterval: "year",
            },
            aggs: {
              "avgRating": {
                average: {
                  column: "rating"
                }
              }
            }
          }
        }
      }
    },
  },
  {
    "director":"Peter Jackson"
  })
  ```
  ```json
  // POST https://tutorial-ng7s8c.us-east-1.xata.sh/db/tutorial:main/tables/titles/aggregate
  {
    "aggs": {
      "movieGenres": {
        "topValues": {
          "column": "genre",
          "size": 50,
          "aggs": {
            "byReleaseDate": {
              "dateHistogram": {
                "column": "releaseDate",
                "calendarInterval": "year"
              },
              "aggs": {
                "avgRating": {
                  "average": {
                    "column": "rating"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  {
  "filter": {
      "director":"Peter Jackson"
      }
  }
  ```
````

Additionally, certain aggregation types support internal filters to apply on records before calculating aggregate values. Refer to the aggregation type's documentation sections below for more details.

## Aggregation Types

There are two types of aggregations:

- _bucket aggregations_, which split the data into buckets based on a column value. Examples of bucket aggregations are: `topValues`, `dateHistogram` and `numericHistogram`.
- _metric aggregations_, which compute a value based on the data in the bucket. Examples of metric aggregations are: `average`, `sum`, `min`, `max`, `count` and `uniqueCount`.

## Response type

The response for the example aggregation above has the following form:

```json
{
  "aggs": {
    "movieGenres": {
      "values": [
        {
          "$key": "Drama",
          "$count": 1123,
          "byReleaseDate": {
            "values": [{
              "$key": "1970-01-01T00:00:00.000Z",
              "$count": 78,
              "avgRating": 7.5
            }, {
              "$key": "1971-01-01T00:00:00.000Z",
              "$count": 53,
              "avgRating": 7.6
            }
            ...
            ]
          }
        },
        ...
      ]
    }
  }
}
```

The metric aggregation (`avgRating` of type `average`) returns a single value, in this case a floating point value.

The bucket aggregations (`movieGenres` of type `topValues` and `byReleaseDate` of type `dateHistogram`) return a list of objects in the `values` array, with the following fields:

- `$key` is the key of the bucket, typically representing the start of the interval. In case of a `dateHistogram` it is a date, in case of `numericHistogram` it is a number, and in case of `topValues` it is a string.
- `$count` is the number of records in that bucket.
- the rest of the keys are the sub-aggregations requested, which can be both metric or bucket aggregations.

## Bucket aggregations

### Top Values

`topValues` is a bucket-aggregation that splits the data into buckets by the unique values in a column. It is configured with the following parameters:

- `column`: the name of the column to split the data by. Accepted types are `string`, `email`, `int`, `float`, or `bool`.
- `size`: the maximum number of buckets to return. Default is 10, maximum is 1000.
- `aggs`: sub-aggregations to execute on the resulting buckets.

Example:

````ts|json
  ```ts
  const records = await xata.db.Teams.aggregate({
    topTeams: {
      topValues: {
          column: "name",
      },
    },
  });
  ```
  ```json
  // POST https://tutorial-ng7s8c.us-east-1.xata.sh/db/tutorial:main/tables/Teams/aggregate
  {
    "aggs": {
      "topTeams": {
        "topValues": {
          "column": "name"
        }
      }
    }
  }
  ```
````

### Date Histogram

`dateHistogram` is a bucket-aggregation that splits the data into buckets by a datetime column. It is configured with the following parameters:

- `column`: The column to use for bucketing. Must be of type datetime.
- `interval`: The fixed interval to use when bucketing. It is formatted as number + units, for example: `5d`, `20m`, `10s`.
- `calendarInterval`: The calendar-aware interval to use when bucketing. Possible values are: `minute`, `hour`, `day`, `week`, `month`, `quarter`, `year`.
- `timezone`: The timezone to use for bucketing. By default, UTC is assumed. The accepted format is as an ISO 8601 UTC offset. For example: `+01:00` or
  `-08:00`.
- `aggs`: sub-aggregations to execute on the resulting buckets.

Either `interval` or `calendarInterval` must be specified. The `calendarInterval` always starts at the boundary of the calendar unit, for example, if the
`calendarInterval` is `month`, the buckets will start at the beginning of the month.

Example:

````ts|json
  ```ts
  const records = await xata.db.titles.aggregate({
    byReleaseDate: {
      dateHistogram: {
        column: "releaseDate",
        calendarInterval: "year",
      },
    },
  });
  ```
  ```json
  // POST https://tutorial-ng7s8c.us-east-1.xata.sh/db/tutorial:main/tables/titles/aggregate
  {
    "aggs": {
      "byReleaseDate": {
        "dateHistogram": {
          "column": "releaseDate",
          "calendarInterval": "year"
        }
      }
    }
  }
  ```
````

### Numeric Histogram

`numericHistogram` is a bucket-aggregation that splits the data into buckets by dynamic numeric ranges.. It is configured with the following parameters:

- `column`: The column to use for bucketing. Must be of numeric type.
- `interval`: The numeric interval to use for bucketing. The resulting buckets will be ranges with this value as size.
- `offset`: By default the bucket keys start with 0 and then continue in `interval` steps. The bucket
  boundaries can be shifted by using the `offset` option. For example, if the `interval` is 100,
  but you prefer the bucket boundaries to be `[50, 150), [150, 250), etc.`, you can set `offset`
  to 50.

Example:

````ts|json
  ```ts
  const records = await xata.db.titles.aggregate({
    viewsHistogram: {
      numericHistogram: {
        column: "views",
        interval: 100,
      },
    },
  });
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/titles/aggregate
  {
    "aggs": {
      "viewsHistogram": {
        "numericHistogram": {
          "column": "views",
          "interval": 100
        }
      }
    }
  }
  ```
````

## Metric aggregations

### Count

`count` is a metric-aggregation that counts the number of records.

It accepts a `filter` setting to filter the records before counting. The filter object accepts the same syntax as the query filter.

Example:

````ts|json
  ```ts
  const records = await xata.db.titles.aggregate({
    ratingsAboveEight: {
      count: {
        filter: {
          rating: { $gt: 8 },
        },
      },
    },
    ratingsBelowEight: {
      count: {
        filter: {
          rating: { $le: 8 },
        },
      },
    },
  });
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/titles/aggregate

  {
    "aggs": {
      "ratingsAboveEight": {
        "count": {
          "filter": {
            "rating": { "$gt": 8 }
          }
        }
      },
      "ratingsBelowEight": {
        "count": {
          "filter": {
            "rating": { "$le": 8 }
          }
        }
      }
    }
  }
  ```
````

If you don't need to specify any filter you can use the special `count: "*"` syntax:

````ts|json
  ```ts
  const records = await xata.db.titles.aggregate({
    totalCount: {
      count: "*",
    },
  });
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/titles/aggregate

  {
    "aggs": {
      "totalCount": {
        "count": "*"
      }
    }
  }
  ```
````

### Unique Count

`uniqueCount` is a metric-aggregation that counts the number of distinct values in a column. It uses
an approximate algorithm ([HyperLogLog++](https://static.googleusercontent.com/media/research.google.com/fr//pubs/archive/40671.pdf))
in order to reduce the amount of memory required, but it is exact for low values (up to the `preicisionThreshold`).

It accepts the following parameters:

- `column`: The column from where to count the unique values.
- `precisionThreshold`: The threshold under which the unique count is exact. If the number of unique
  values in the column is higher than this threshold, the results are approximate.
  Maximum value is 40,000, default value is 3000.

Example:

````ts|json
  ```ts
  const records = await xata.db.titles.aggregate({
    uniqueGenres: {
      uniqueCount: {
        column: "genre",
      },
    },
  });
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/titles/aggregate

  {
    "aggs": {
      "uniqueGenres": {
        "uniqueCount": {
          "column": "genre"
        }
      }
    }
  }
  ```
````

### Average

`average` is a metric-aggregation that computes the average value of a numeric column.

Example:

````ts|json
  ```ts
  const records = await xata.db.titles.aggregate({
    avgRating: {
      average: {
        column: "rating",
      },
    },
  });
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/titles/aggregate
  {
    "aggs": {
      "avgRating": {
        "average": {
          "column": "rating"
        }
      }
    }
  }
  ```
````

### Max

`max` is a metric-aggregation that computes the maximum value of a numeric column.

Example:

````ts|json
  ```ts
  const records = await xata.db.titles.aggregate({
    maxRating: {
      max: {
        column: "rating",
      },
    },
  });
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/titles/aggregate
  {
    "aggs": {
      "maxRating": {
        "max": {
          "column": "rating"
        }
      }
    }
  }
  ```
````

### Min

`min` is a metric-aggregation that computes the minimum value of a numeric column.

Example:

````ts|json
  ```ts
  const records = await xata.db.titles.aggregate({
    minRating: {
      min: {
        column: "rating",
      },
    },
  });
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/titles/aggregate
  {
    "aggs": {
      "minRating": {
        "min": {
          "column": "rating"
        }
      }
    }
  }
  ```
````

### Sum

`sum` is a metric-aggregation that computes the sum of a numeric column.

Example:

````ts|json
  ```ts
  const records = await xata.db.titles.aggregate({
    sumRating: {
      sum: {
        column: "rating",
      },
    },
  });
  ```
  ```json
  // POST https://tutorial-ngs8c.us-east-1.xata.sh/db/tutorial:main/tables/titles/aggregate
  {
    "aggs": {
      "sumRating": {
        "sum": {
          "column": "rating"
        }
      }
    }
  }
  ```
````
