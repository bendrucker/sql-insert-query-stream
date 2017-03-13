'use strict'

var test = require('tape')
var toStream = require('from2-array')
var concat = require('concat-stream')
var InsertStream = require('./')

test('one column', function (t) {
  toStream.obj([
    {foo: 'bar'},
    {foo: 'baz'},
    {foo: 'qux'}
  ])
  .pipe(InsertStream({
    table: 'mesa'
  }))
  .pipe(concat(function (data) {
    t.equal(data, `
insert into "mesa"
  ("foo")
values
  ("bar"),
  ("baz"),
  ("qux");`.trim()
    )

    t.end()
  }))
})

test('one row', function (t) {
  toStream.obj([
    {foo: 'bar'}
  ])
  .pipe(InsertStream({
    table: 'mesa'
  }))
  .pipe(concat(function (data) {
    t.equal(data, `
insert into "mesa"
  ("foo")
values
  ("bar");`.trim()
    )

    t.end()
  }))
})

test('multiple columns', function (t) {
  toStream.obj([
    {foo: 'bar', baz: 1},
    {foo: 'baz', baz: 2}
  ])
  .pipe(InsertStream({
    table: 'mesa'
  }))
  .pipe(concat(function (data) {
    t.equal(data, `
insert into "mesa"
  ("foo", "baz")
values
  ("bar", 1),
  ("baz", 2);`.trim()
    )

    t.end()
  }))
})
