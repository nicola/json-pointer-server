module.exports = router

var jsonpointer = require('jsonpointer')

function router (data) {
  return function (req, res) {
    if (req.method === 'GET') {
      get(req, res, data)
    } else if (req.method === 'HEAD') {
      head(req, res, data)
    } else {
      res.statusCode = 406
      res.end('Only GET and HEAD available')
    }
  }
}

function retrieve (data, url) {
  var content = jsonpointer.get(data, url)
  if (content === null && url === '/') {
    content = data
  }
  return content
}

function get (req, res, data) {
  var content = retrieve(data, req.url)
  if (content === null) {
    res.statusCode = 404
    return res.end('Not Found')
  }
  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(JSON.stringify(content))
}

function head (req, res, data) {
  var content = retrieve(data, req.url)
  if (content === null) {
    res.statusCode = 404
    return res.end()
  }
  res.statusCode = 200
  res.end()
}
