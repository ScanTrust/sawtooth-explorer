const request = require('request')

function get (url, callback) {
  return request(url, (error, response, body) => handleResponse(error, response, body, callback))
}

function post (url, authToken, data, callback) {
  const options = {
    url,
    headers: {
      'Authorization': 'key=' + authToken
    },
    body: data,
    json: true
  }
  return request.post(options, (error, response, body) => handleResponse(error, response, body, callback))
}

function handleResponse(error, response, body, callback) {
  callback = callback || new Function()
  if (!error) {
    console.log(response.req.path + ' response code is ' + response.statusCode)
    if (response.statusCode == 200) {
      callback(true, body)
    } else {
      callback(false)
      if (response.statusCode == 502) {
        console.log('Proxy error')
      }
    }
  } else {
    console.log('Error is', error);
  }
}

module.exports = { get, post }