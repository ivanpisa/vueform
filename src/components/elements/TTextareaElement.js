import TextareaElement from './TextareaElement'
import MultilingualElement from './../../mixins/MultilingualElement'
import MultilingualValidation from './../../mixins/MultilingualValidation'

export default {
  mixins: [TextareaElement, MultilingualElement, MultilingualValidation],
  name: 'TTextareaElement',
  mounted() {
    this.form$.on('language', () => {
      this.autosize()
    })
  }
}