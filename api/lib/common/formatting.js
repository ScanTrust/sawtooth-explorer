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
  let normalizedMessage = error.message
  if (!Object.values(errToMessage).includes(err.message)) // if normalized
    normalizedMessage = errToMessage[err.message] || 'unknown_error'
  err.message = normalizedMessage
  err.status = errToStatus[err.message] || 500
  return err
/* 
  console.log({err})
  console.log(err.message)
  if (Object.values(errToMessage).includes(err.message)) // if normalized
    return err
  const error = new Error()
  error.message = errToMessage[err.message] || 'unknown_error'
  error.status = errToStatus[err.message] || 500
  return error */
}

function deleteEmptyArrayFields (query) {
  for (let key in query) {
    if (Array.isArray(query[key]) && query[key].length == 0)
      delete query[key]
  }
  return query
}

module.exports = { deleteEmptyArrayFields, normalizeError }
