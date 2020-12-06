import { createForm } from 'test-helpers'

export const component = function (elementType, elementName, options) {
  it('should return FormButton by default for `component` if button type is not defined', () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
        }
      }
    })

    let el = form.vm.el$('el')
    
    expect(el.component({ label: 'Button' })).toStrictEqual(el.components.FormButton)
  })

  it('should return anchor or submit for `component` if button type is defined', () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
        }
      }
    })

    let el = form.vm.el$('el')
    
    expect(el.component({
      label: 'Button',
      type: 'anchor'
    })).toStrictEqual(el.components.FormButtonAnchor)
    
    expect(el.component({
      label: 'Button',
      type: 'submit'
    })).toStrictEqual(el.components.FormButtonSubmit)
  })

  it('should throw error for `component` if button type not founc', () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
        }
      }
    })

    let el = form.vm.el$('el')
    
    expect(() => {
      el.component({
        label: 'Button',
        type: 'not-button'
      })
    }).toThrowError()
  })
}