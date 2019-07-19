const errToStatus = {
  'No auth token': 401,
  'Unauthorized': 401,
  'invalid signature': 401,
  'Cannot read property \'nested\' of undefined': 400,
}

const errToMessage = {
  'No auth token': 'no_session_try_to_sign_in_again',
  'Unauthorized': 'unauthorized',
  'invalid signature': 'no_session_try_to_sign_in_again',
  'Cannot read property \'nested\' of undefined': 'invalid_protos_set'
}

function normalizeError (err) {
  console.log({err})
  let normalizedMessage = err.message
  if (!Object.values(errToMessage).includes(err.message)) // if normalized
    normalizedMessage = errToMessage[err.message] || 'unknown_error'
  err.status = errToStatus[err.message] || 500
  err.message = normalizedMessage
  return err
}

function deleteEmptyArrayFields (query) {
  for (let key in query) {
    if (Array.isArray(query[key]) && query[key].length == 0)
      delete query[key]
  }
  return query
}

module.exports = { deleteEmptyArrayFields, normalizeError }
