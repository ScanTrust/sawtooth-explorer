function deleteEmptyArrayFields (query) {
  for (let key in query) {
    if (Array.isArray(query[key]) && query[key].length == 0)
      delete query[key]
  }
  return query
}

module.exports = { deleteEmptyArrayFields }
