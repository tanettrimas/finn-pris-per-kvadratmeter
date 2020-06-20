import formatPricePretty from '../../src/helpers/formatPricePretty'

describe('formatPricePretty', () => {
  it('should return a string', () => {
    const price = formatPricePretty(12345666)
    expect(typeof price).toBe("string")
  })

  it('should be postfixed with "kr"', () => {
    const price = formatPricePretty(12345666)
    expect(price.endsWith('kr')).toBeTruthy()
  })

  it('should format properly by thousands properly', () => {
    const oneK = formatPricePretty(1000)
    const tenK = formatPricePretty(10000)
    const hundredK = formatPricePretty(100000)
    const oneMill = formatPricePretty(1000000)
    const hundredMill = formatPricePretty(100000000)
    const minusMill = formatPricePretty(-100000000)

    expect(oneK).toBe("1 000 kr")
    expect(tenK).toBe("10 000 kr")
    expect(hundredK).toBe("100 000 kr")
    expect(oneMill).toBe("1 000 000 kr")
    expect(hundredMill).toBe("100 000 000 kr")
    expect(minusMill).toBe("- 100 000 000 kr")

  })

  it('should throw on invalid input', () => {
    expect(() => {
      formatPricePretty()
    }).toThrowError('No price parameter provided')

    expect(() => {
      formatPricePretty(null)
    }).toThrowError('No price parameter provided')

    expect(() => {
      formatPricePretty({})
    }).toThrowError('Invalid property price, must be a number or string-representation of number')

    expect(() => {
      formatPricePretty([])
    }).toThrowError('Invalid property price, must be a number or string-representation of number')

    expect(() => {
      formatPricePretty(true)
    }).toThrowError('Invalid property price, must be a number or string-representation of number')
  })
})