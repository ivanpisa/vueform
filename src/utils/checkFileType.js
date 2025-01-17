import _ from 'lodash'

export default function checkFileType (file, accept) {
  if (!accept) {
    return true
  } 

  if (!_.isArray(accept)) {
    accept = accept.split(',')

    _.each(accept, (one, i) => {
      accept[i] = one.trim()
    })
  }

  return _.some(accept, (a) => {
    let universal = a.match(/^([^\/]+)\/\*$/)

    if (universal) {
      return !!(new RegExp(`^${universal[1]}\/`)).exec(file.type)
    } else if (a == file.type) {
      return true
    } else if (a == `.${file.name.split('.').pop()}`) {
      return true
    }

    return false
  })
}