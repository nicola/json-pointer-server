// Require jsonpointer-http
var router = require('../')
var http = require('http')
var MemoryStore = require('jsonpointer-store-abstract')

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

var store = MemoryStore(data)
var server = http.createServer(router(store))

// Lets start our server
var PORT = process.env.PORT || 8080
server.listen(PORT, function () {
  console.log('Server listening on: http://localhost:%s', PORT)
})
