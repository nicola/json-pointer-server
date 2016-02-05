# json-pointer-server
> Server on top of [RFC6901]

or simpler..

> Server on top of JSON documents

## Use

Consider the following JSON:

```javascript
var data = {
  people: [{
    name: 'Nicola',
    surname: 'Greco'
  }, ..]
}
```

Using this module, you can navigate the JSON like it was a path. For example:

```
GET http://example.com/people/1
{
  name: 'Nicola',
  surname: 'Greco'
}
```

```
GET http://example.com/people/1/name
'Nicola'
```

## Install

```bash
$ npm install --save json-pointer-server
```

Use it

```javascript
var router = require('json-pointer-server')
var http = require('http')
var server = http.createServer(router({your: json: {'here'}}))
server.listen(8080)
```

## License

MIT