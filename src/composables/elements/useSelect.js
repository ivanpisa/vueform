import _ from 'lodash'
import normalize from './../../utils/normalize'
import spliceMultiple from './../../utils/spliceMultiple'

const base = function(props, context, dependencies)
{
  // ============ DEPENDENCIES ============
  
  const value = dependencies.value
  
  
  // =============== PRIVATE ==============
  
  /**
   * Whether an option is already selected.
   *
   * @param {object} option* value of the option
   * @returns {boolean}
   * @private
   */
  const inValue = (option) => {
    return value.value.indexOf(option) !== -1
  }
  
  // =============== METHODS ==============
  
  /**
   * Selects one or more options.
   *
   * @param {string|array} options* value(s) of the option(s) to select
   * @returns {void}
   */
  const select = (options) => {
    if (!_.isArray(options)) {
      options = [options]
    }
    
    let val = _.clone(value.value)
    
    _.each(options, (option) => {
      if (inValue(normalize(option))) {
        return
      }
      
      val.push(option)
    })
    
    value.value = val
  }
  
  /**
   * Deselects one or more options.
   *
   * @param {string|array} options* value(s) of the option(s) to deselect
   * @returns {void}
   */
  const deselect = (options) => {
    if (!_.isArray(options)) {
      options = [options]
    }
    
    let val = _.clone(value.value)
    let indexes = []
    
    _.each(options, (option) => {
      let i = value.value.indexOf(option)
      
      if (i === -1 || indexes.indexOf(i) !== -1) {
        return
      }
      
      indexes.push(i)
    })
    
    value.value = spliceMultiple(val, indexes)
  }
  
  return {
    select,
    deselect,
  }
}

export default base