# sql-insert-query-stream [![Build Status](https://travis-ci.org/bendrucker/sql-insert-query-stream.svg?branch=master)](https://travis-ci.org/bendrucker/sql-insert-query-stream)

> A Transform stream that generates a bulk SQL insert query 


## Install

```
$ npm install --save sql-insert-query-stream
```


## Usage

```json
[
  {"foo": "bar"},
  {"foo": "baz"}
]
```

```js
var InsertQueryStream = require('sql-insert-query-stream')
var JSONStream = require('JSONStream')

fs.createReadStream('data.json')
  .pipe(JSONStream.parse())
  .pipe(InsertQueryStream({
    table: 'stuff'
  }))
  .pipe(process.stdout)
```

```sql
# produces
insert into "stuff"
  ("foo")
values
  ("bar"),
  ("baz");
```

## API

#### `InsertQueryStream(options)` -> `stream.Transform`

##### options

###### table

*Required*  
Type: `string`

The table name.

###### quote

Type: `string`  
Default: `"`

The quoting character that will be used to wrap string values.

###### indent

Type: `string`  
Default: `  `

The string that will be used to indent lines. Defaults to two spaces.


## License

MIT © [Ben Drucker](http://bendrucker.me)
