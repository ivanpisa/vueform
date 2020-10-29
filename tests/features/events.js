import { createForm, findAllComponents, testComputedOption } from 'test-helpers'

const testHasFireEvent = function(elementType, elementName, event) {
  let e = event

  if (_.isPlainObject(event)) {
    e = _.keys(event)[0]
  }

  it('should have `fire` method for "'+e+'" event', () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
        }
      }
    })

    let el = findAllComponents(form, { name: elementName }).at(0)

    expect(typeof el.vm[`fire${_.upperFirst(e)}`]).toBe('function')
  })
}

const testFireEvent = function(elementType, elementName, event, params = []) {
  let e = event

  if (_.isPlainObject(event)) {
    e = _.keys(event)[0]
  }

  it('should `fire` "'+e+'" event', () => {
    let form = createForm({
      schema: {
        el: {
          type: elementType,
        }
      }
    })

    let el = findAllComponents(form, { name: elementName }).at(0)

    let onEventMock = jest.fn()

    el.vm.on(e, onEventMock)

    el.vm.fire(e)

    if (params.length) {
      expect(onEventMock.mock.calls.length).toBe(1)

      _.each(params, (param, index) => {
        expect(onEventMock.mock.calls[0][index]).toBe(el.vm[param])
      })
    }
    else {
      expect(onEventMock).toHaveBeenCalled()      
    }
  })
}

export default function events (elementType, options) {
  const elementName = `${_.upperFirst(elementType)}Element`

  return () => {
    it('should be able to subscribe for `events`', () => {
      let form = createForm({
        schema: {
          el: {
            type: elementType,
          }
        }
      })

      let el = findAllComponents(form, { name: elementName }).at(0)

      let onEventMock = jest.fn()

      el.vm.on('event', onEventMock)

      expect(onEventMock).not.toHaveBeenCalled()

      el.vm.fire('event', 'a', 'b')

      expect(onEventMock).toHaveBeenLastCalledWith('a', 'b')
    })
    
    it('should be able to unsubscribe from `events`', () => {
      let form = createForm({
        schema: {
          el: {
            type: elementType,
          }
        }
      })

      let el = findAllComponents(form, { name: elementName }).at(0)

      let onEventMock = jest.fn()

      el.vm.on('event', onEventMock)

      expect(onEventMock).not.toHaveBeenCalled()

      el.vm.off('event')

      el.vm.fire('event')

      expect(onEventMock).not.toHaveBeenCalled()
    })
    
    _.each(options.events, (event) => {
      testHasFireEvent(elementType, elementName, event)
    })
    
    _.each(options.events, (event) => {
      testFireEvent(elementType, elementName, event)
    })
  }
}