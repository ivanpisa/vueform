import { ref, watch, onMounted, toRefs } from 'composition-api'
import useElementComponent from './../../composables/useElementComponent'

export default {
  name: 'TrixWrapper',
  emits: ['input', 'alert', 'error'],
  props: {
    value: {
      required: false,
      default: null
    },
    placeholder: {
      required: false,
      type: [String, Number],
      default: null
    },
    name: {
      required: false,
      type: [String, Number],
      default: null
    },
    id: {
      required: false,
      type: [String, Number],
      default: null
    },
    accept: {
      required: false,
      type: Array,
      default: () => ([])
    },
    acceptMimes: {
      required: false,
      type: Array,
      default: () => ([])
    },
    endpoint: {
      required: false,
      type: String,
      default: null
    },
    method: {
      required: false,
      type: String,
      default: 'post'
    },
    disabled: {
      required: false,
      type: Boolean,
      default: false
    },
  },
  setup(props, context)
  {
    const {
      value,
      disabled,
      acceptMimes,
      accept,
      endpoint
    } = toRefs(props)

    // ============ DEPENDENCIES ============

    const {
      el$,
      form$,
      classes,
      components,
      theme
    } = useElementComponent(props, context)

    // ================ DATA ================

    /**
     * The [`Trix`](https://github.com/basecamp/trix) DOM instance.
     * 
     * @type {HTMLElement}
     * @default null
     */
    const trix$ = ref(null)

    // =============== METHODS ==============

    /**
     * Updates the value of Trix editor.
     * 
     * @param {string} value* the value to update with
     * @returns {void}
     */
    const update = (val) => {
      if (typeof val == 'number') {
        val = String(val)
      }

      trix$.value.editor.loadHTML(val)
    }

    /**
     * Sets an option for Trix editor.
     * 
     * @param {string} key* the option key
     * @param {string} value* the option value
     * @returns {void}
     */
    const setOption = (key, val) => {
      trix$.value[key] = val
    }

    /**
     * Handles `change` event.
     * 
     * @returns {void}
     * @private
     */
    const handleChange = () => {
      // If the change is only triggered because of `update`
      // method (which implies an external call) we should
      // not emit any events because that would duplicate the
      // effects of the value change.
      if (trix$.value.value == value.value || (!trix$.value.value && !value.value)) {
        return
      }

      context.emit('input', { target: { value: trix$.value.value }})
    }

    /**
     * Handles `fileAccept` event.
     * 
     * @param {Event} e event
     * @returns {void}
     * @private
     */
    const handleFileAccept = (e) => {
      if (disabled.value) {
        e.preventDefault()
        return
      }

      if (!e.file) {
        e.preventDefault()
        return
      }

      if (acceptMimes.value.length && acceptMimes.value.indexOf(e.file.type) === -1) {
        e.preventDefault()

        context.emit('alert', form$.value.__('laraform.trix.acceptedMimesError', {
          mimes:acceptMimes.value.join(', ')
        }))
      }

      var extension = e.file.name.split('.').pop()

      if (accept.value.length && accept.value.indexOf(extension) === -1) {
        e.preventDefault()

        context.emit('alert', form$.value.__('laraform.trix.acceptedExtensionsError', {
          extensions:accept.value.join(', ')
        }))
      }
    }

    /**
     * Handles `attachmentAdd` event.
     * 
     * @param {Event} e event
     * @returns {void}
     * @private
     */
    const handleAttachmentAdd = (e) => {
      if (!e.attachment.file) {
        return
      }

      if (!endpoint.value) {
        throw new Error('Property `endpoint` must be defined to upload')
      }

      const data = new FormData()

      data.append('Content-Type', e.attachment.file.type)
      data.append('file', e.attachment.file)

      el$.value.$laraform.services.axios[method.value](endpoint.value, data, {
        onUploadProgress: (progress) => {
          e.attachment.setUploadProgress(
            Math.round((progress.loaded * 100) / progress.total)
          )
        }
      })
      .then((response) => {
        return e.attachment.setAttributes({
          url: response.data.url,
          href: response.data.href,
        })
      })
      .catch((error) => {
        context.emit('error', error)
      })
    }

    // ============== WATCHERS ==============

    watch(disabled, (val) => {
      trix$.value.contentEditable = !val
    })

    // ================ HOOKS ===============

    onMounted(() => {
      if (disabled.value) {
        trix$.value.contentEditable = false
      }
    })

    return {
      el$,
      form$,
      theme,
      classes,
      components,
      trix$,
      update,
      setOption,
      handleChange,
      handleFileAccept,
      handleAttachmentAdd,
    }
  },
}