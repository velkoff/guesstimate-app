import {expect} from 'chai';
import numberShow from './numberShower.js'

describe('NumberShower', () => {
  describe.only('#two uncertain units', () => {
    const examples = [
      [-20, {value: '-20', symbol: undefined, power: undefined}],
      [-0.5, {value: '-0.50', symbol: undefined, power: undefined}],

      [0.5, {value: '0.50', symbol: undefined, power: undefined}],
      [0.501, {value: '0.50', symbol: undefined, power: undefined}],
      [0.01, {value: '0.010', symbol: undefined, power: undefined}],
      [0.000001, {value: '0.0000010', symbol: undefined, power: undefined}],

      [1, {value: '1.0', symbol: undefined, power: undefined}],
      [1.1, {value: '1.1', symbol: undefined, power: undefined}],
      [1, {value: '1.0', symbol: undefined, power: undefined}],
      [1, {value: '1.0', symbol: undefined, power: undefined}],
      [10, {value: '10', symbol: undefined, power: undefined}],
      [10, {value: '10', symbol: undefined, power: undefined}],
      [100, {value: '100', symbol: undefined, power: undefined}],
      [1000, {value: '1.0', symbol: 'K', power: undefined}],
      [10000, {value: '10', symbol: 'K', power: undefined}],
      [100000, {value: '100', symbol: 'K', power: undefined}],
      [100001, {value: '100', symbol: 'K', power: undefined}],
      [110001, {value: '110', symbol: 'K', power: undefined}],
      [1000000, {value: '1.0', symbol: 'M', power: undefined}],
      [10000000, {value: '10', symbol: 'M', power: undefined}],
      [1000000000, {value: '1.0', symbol: 'G', power: undefined}],
      [1000000000000, {value: '1.0', symbol: 'T', power: undefined}],
      [100000000000000, {value: '100', symbol: 'T', power: undefined}],
      [110000000000000, {value: '110', symbol: 'T', power: undefined}],
      [1000000000000000, {value: '1.0', symbol: undefined, power: 15}],
      [1200000000000000, {value: '1.2', symbol: undefined, power: 15}],
      [1.2e+25, {value: '1.2', symbol: undefined, power: 25}],
    ]

    const foo = examples.map(e => () => {
      it(`works for number ${e[0]}`, () => {
        expect(numberShow(e[0]).value).to.equal(e[1].value)
        expect(numberShow(e[0]).symbol).to.equal(e[1].symbol)
        expect(numberShow(e[0]).power).to.equal(e[1].power)
      })
    })
    //console.log(examples.map(e => {
      //return `[${e[0]}, {value: ${value.value}, symbol: ${value.symbol}, power: ${value.power}}]\n`
    //}))
    foo.map(e => e())
  })
})

