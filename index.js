module.exports = router

function router (store) {
  return function (req, res) {
    if (req.method === 'GET') {
      get(req, res, store)
    } else if (req.method === 'HEAD') {
      head(req, res, store)
    } else if (req.method === 'PUT') {
      put(req, res, store)
    } else {
      res.statusCode = 406
      res.end('Only GET, HEAD and PUT available')
    }
  }
}

function get (req, res, store) {
  store.get(req.url, function (err, content) {
    if (err) {
      res.statusCode = 500
      return
    }
    if (content === null) {
      res.statusCode = 404
      res.end('Not Found')
      return
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
  })
}

function head (req, res, store) {
  store.get(req.url, function (err, content) {
    if (err) {
      res.statusCode = 500
      res.end()
      return
    }
    if (content === null) {
      res.statusCode = 404
      res.end()
      return
    }
    res.statusCode = 200
    res.end()
  })
}

function put (req, res, store) {
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

    store.set(req.url, json, function (err) {
      if (err) {
        res.statusCode = 500
        return
      }
      res.statusCode = 200
      res.end()
    })
  })
}
