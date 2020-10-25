import { computed, ref, toRefs } from 'composition-api'

export default function useView(props, context, dependencies)
{
  // ============ DEPENDENCIES ============

  const available = dependencies.available

  // ================ DATA ================

  /**
   * Whether the element was hidden programmatically with `.show()` / `.hide()` methods.
   * 
   * @type {boolean} 
   * @default false
   */
  const hidden = ref(false)

  /**
   * Whether the element is hidden internally by other components, like tabs or wizard steps.
   * 
   * @type {boolean} 
   * @default true
   */
  const active = ref(true)


  // ============== COMPUTED ==============


  /**
   * Whether the element is visible. It's `false` if `available` or `active` is `false` or `hidden` is `true`.
   * 
   * @type {boolean} 
   */
  const visible = computed(() => {
    return available.value && !hidden.value && active.value
  })

  // =============== METHODS ==============

  /**
   * Sets the `hidden` property of the element to `false`.
   *
   * @public
   * @returns {void}
   */
  const hide = () => {
    hidden.value = true
  }

  /**
   * Sets the `hidden` property of the element to `true`.
   *
   * @public
   * @returns {void}
   */
  const show = () => {
    hidden.value = false
  }

  /**
   * Sets the `active` property of the element to `true`.
   *
   * @private
   * @returns {void}
   */
  const activate = () => {
    active.value = true
  }

  /**
   * Sets the `active` property of the element to `false`.
   *
   * @private
   * @returns {void}
   */
  const deactivate = () => {
    active.value = false
  }

  return {
    // Data
    hidden,
    active,

    // Computed
    visible,

    // Methods
    hide,
    show,
    activate,
    deactivate,
  }
}