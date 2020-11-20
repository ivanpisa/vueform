import { createLocalVue } from '@vue/test-utils'
import { createForm, findAllComponents, change } from './.test-helpers'

jest.mock("axios", () => ({
  get: () => Promise.resolve({ data: true }),
  post: () => Promise.resolve({ data: true }),
}))

describe('Active URL Rule', () => {
  it('should be valid if active url returns true', (done) => {
    let form = createForm({
      schema: {
        a: {
          type: 'text',
          rules: 'active_url',
        }
      }
    })

    let a = findAllComponents(form, { name: 'TextElement' }).at(0)

    a.vm.validate()

    setTimeout(() => {
      expect(a.vm.invalid).toBe(false)

      done()
    }, 1);
  })
})