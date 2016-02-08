module.exports = LdpStore

var jsonpointer = require('jsonpointer')
var traverse = require('json-to-ldp').traverse

function LdpStore (data, opts) {
  if (!(this instanceof LdpStore)) return new LdpStore(data, opts)
  opts = opts || {}
  this.data = data || {}
  this.depth = opts.depth
}

LdpStore.prototype.get = function (url, cb) {
  var content = traverse(this.data, url)
  cb(null, content)
}

LdpStore.prototype.set = function (url, content, cb) {
  cb(null, jsonpointer.set(this.data, url, content))
}

LdpStore.prototype.delete = function (url, cb) {
  cb(new Error('Delete is not implemented'))
}

var router = require('../')
var http = require('http')

// Create a http server and load the router
var data = {
  people: [{
    name: 'Nicola',
    surname: 'Greco'
  }, {
    name: 'Virginia',
    surname: 'Alonso Navarro'
  }, {
    name: 'Adam',
    surname: 'Yala'
  }]
}

var store = LdpStore(data)
var server = http.createServer(router(store))

// Lets start our server
var PORT = process.env.PORT || 8080
server.listen(PORT, function () {
  console.log('Server listening on: http://localhost:%s', PORT)
})
