import { toRefs, computed, onMounted, ref } from 'composition-api'

const base = function (props, context, dependencies)
{
  const {
    endpoint,
    method,
  } = toRefs(props)

  // ============ DEPENDENCIES ============
  
  const form$ = dependencies.form$
  const input = dependencies.input

  // ================ DATA ================

  /**
   * Whether the editor is focused.
   * 
   * @type {boolean}
   */
  const focused = ref(false)

  // ============== COMPUTED ==============

  /**
  * The endpoint that uploads attachment. Can be changed by setting [`endpoint`](#endpoint) option.
  * 
  * @type {string}
  * @default `config.endpoints.attachment.url`
  * @private
  */
  const trixEndpoint = computed(() => {
    return endpoint.value || form$.value.$laraform.config.endpoints.attachment.url
  })

  /**
  * The method to use to upload attachment. Can be changed by setting [`method`](#method) option.
  * 
  * @type {string}
  * @default `config.endpoints.attachment.method`
  * @private
  */
  const trixMethod = computed(() => {
    return method.value || form$.value.$laraform.config.endpoints.attachment.method
  })


  // =============== HOOKS ================

  onMounted(() => {
    input.value.trix$.addEventListener('focus', () => {
      focused.value = true
    })

    input.value.trix$.addEventListener('blur', () => {
      focused.value = false
    })
  })

  return {
    trixEndpoint,
    trixMethod,
    focused,
  }
}

export default base