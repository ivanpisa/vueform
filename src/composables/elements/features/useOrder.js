import { computed, toRefs, ref, watch, nextTick } from 'composition-api'
import computedOption from './../../../utils/computedOption'

const base = function(props, context, dependencies, options)
{
  const { schema } = toRefs(props)

  // ============ DEPENDENCIES ============

  const isObject = dependencies.isObject
  const storeOrder = dependencies.storeOrder
  const children$ = dependencies.children$

  // ============== COMPUTED ==============

  /**
  * The default order direction of list items when data is loaded. Possible values: `null`, `'ASC'`, `'DESC'`.
  * 
  * @type {string}
  * @default null
  */
  const order = computedOption('order', schema, null)

  /**
  * When using an object list the list items will be ordered by this element's values. If `storeOrder` is defined, `orderBy` will be equal to that unless specified otherwise.
  * 
  * @type {string}
  * @default null
  */
  const orderBy = computedOption('orderBy', schema, storeOrder.value || null)

  // =============== METHODS ==============

  /**
   * Helper method used to refresh the element's value which stores the order.
   *
   * @private
   * @returns {void}
   */
  const refreshOrderStore = () => {
    if (isObject.value && storeOrder.value) {
      _.each(children$.value, (element$, index) => {
        element$.update({
          [storeOrder.value]: parseInt(index) + 1
        })
      })
    }
  }

  return {
    // Computed
    order,
    orderBy,

    // Methods
    refreshOrderStore,
  }
}

export default base