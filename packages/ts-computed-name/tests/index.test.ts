import { compiler } from '../../../tests/compiler'
import { IOptions, computeClassBemName } from '../src'

// tslint:disable max-line-length
describe('naming::origin', () => {
  const compile = compiler<IOptions>('ts-computed-name/tests/fixtures/origin/blocks', computeClassBemName)

  it('should add block, elem, and displayName property', () => {
    expect(compile('my-block-1/my-block-1.ts')).toMatchSnapshot()
    expect(compile('my-block-1/__elem/my-block-1__elem.ts')).toMatchSnapshot()
  })

  it('should add block, elem property', () => {
    expect(compile('my-block-1/my-block-1.ts', { availibleDisplayName: false })).toMatchSnapshot()
    expect(compile('my-block-1/__elem/my-block-1__elem.ts', { availibleDisplayName: false })).toMatchSnapshot()
  })

  it('should add displayName property', () => {
    expect(compile('my-block-1/my-block-1.ts', { availibleBemName: false })).toMatchSnapshot()
    expect(compile('my-block-1/__elem/my-block-1__elem.ts', { availibleBemName: false })).toMatchSnapshot()
  })

  it('should override block, elem, and displayName property', () => {
    expect(compile('my-block-2/my-block-2.ts')).toMatchSnapshot()
    expect(compile('my-block-2/__elem/my-block-2__elem.ts')).toMatchSnapshot()
  })

  it('should not add block, elem, and displayName property if they already defined', () => {
    expect(compile('my-block-2/my-block-2.ts', { overrideExistingProperties: false })).toMatchSnapshot()
    expect(compile('my-block-2/__elem/my-block-2__elem.ts', { overrideExistingProperties: false })).toMatchSnapshot()
  })

  it('should not add block, elem, and displayName if parent class not incorrect', () => {
    expect(compile('my-block-1/my-block-1.ts', { availableClassParent: ['YBlock', 'YElem'] })).toMatchSnapshot()
    expect(compile('my-block-1/__elem/my-block-1__elem.ts', { availableClassParent: ['YBlock', 'YElem'] })).toMatchSnapshot()
  })
})
