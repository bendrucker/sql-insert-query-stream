'use strict'

var Transform = require('stream').Transform
var inherits = require('util').inherits

module.exports = InsertQueryStream

function InsertQueryStream (options) {
  if (!(this instanceof InsertQueryStream)) {
    return new InsertQueryStream(options)
  }

  this.table = options.table
  this.columns = null
  this.quote = options.quote || '"'
  this.indent = options.indent || '  '

  this.first = true

  Transform.call(this, {
    objectMode: true
  })
}

inherits(InsertQueryStream, Transform)

/*

I wrote this with the odd-looking handling of this.previous via this.unshift
in order to only flush each line when the next line is received. This way the
stream can know whether this.previous is the last line (written in _flush) or
should be followed by a comma (normal _transform). The first line will push
the prefixes (insert + values) and each subsequent line will push a line of
values.

*/

InsertQueryStream.prototype._transform = function transform (chunk, enc, callback) {
  if (this.first) {
    this.prefix(chunk)
    this.first = false
  }

  if (this.previous) this.unshift()
  this.previous = this.columns.map((column) => chunk[column])

  callback()
}

InsertQueryStream.prototype._flush = function flush (callback) {
  this.unshift(this.previous, true)
  callback()
}

InsertQueryStream.prototype.unshift = function unshift (last) {
  this.push(this.indent + this.list(this.previous) + (last ? ';' : ',\n'))
}

InsertQueryStream.prototype.prefix = function prefix (chunk, enc, callback) {
  this.columns = Object.keys(chunk)

  this.push('insert into ' + this.wrap(this.table) + '\n')
  this.push(this.indent + this.list(this.columns) + '\n')
  this.push('values' + '\n')
}

InsertQueryStream.prototype.wrap = function wrap (value) {
  if (typeof value !== 'string') return value
  return this.quote + value + this.quote
}

InsertQueryStream.prototype.list = function list (values) {
  return '(' + values.map(this.wrap.bind(this)).join(', ') + ')'
}
