module.exports = router

var jsonpointer = require('jsonpointer')

function router (data) {
  return function (req, res) {
    if (req.method === 'GET') {
      get(req, res, data)
    } else if (req.method === 'HEAD') {
      head(req, res, data)
    } else if (req.method === 'PUT') {
      put(req, res, data)
    } else {
      res.statusCode = 406
      res.end('Only GET and HEAD available')
    }
  }
}

function getter (data, url) {
  var content = jsonpointer.get(data, url)
  if (content === null && url === '/') {
    content = data
  }
  return content
}

function setter (data, url, content) {
  jsonpointer.set(data, url, content)
}

function get (req, res, data) {
  var content = getter(data, req.url)
  if (content === null) {
    res.statusCode = 404
    return res.end('Not Found')
  }

  var string
  try {
    string = JSON.stringify(content, null, '  ')
  } catch (e) {
    res.statusCode = 500
    res.end('invalid json')
    return
  }

  res.writeHead(200, {'Content-Type': 'application/json'})
  res.end(string)
}

function head (req, res, data) {
  var content = getter(data, req.url)
  if (content === null) {
    res.statusCode = 404
    res.end()
    return
  }
  res.statusCode = 200
  res.end()
}

function put (req, res, data) {
  console.log('put')
  var content = ''
  req.on('data', function (chunk) {
    content += chunk.toString()
    console.log('content', content)
  })

  req.on('end', function () {
    var json = content
    var isJson = json[0] === '[' || json[0] === '{'
    if (isJson && req.headers.accept === 'application/json') {
      try {
        json = JSON.parse(content)
      } catch (e) {
        res.statusCode = 500
        res.end('invalid json')
        return
      }
    }

    setter(data, req.url, json)
    res.statusCode = 200
    res.end()
  })
}
