// If this fails, FINN might have changed their HTML

describe('Finn extracter', () => {
  beforeAll(async () => {
    browser.on('disconnected', () => {
      browser.close()
    })
  })

  beforeEach(async () => {
    await jestPuppeteer.resetPage()
    return page.goto('https://www.finn.no/realestate/homes/search.html')
  })

  it('extracts the price and square meter data correctly correctly', async () => {
    expect(await page.title()).toBe("Bolig til salgs | FINN Eiendom")
    const extractedData = await page.$$eval('.ads__unit__content', list => list.map(node => {
      const keys = node.querySelector('.ads__unit__content__keys')
      const [squareMeterElement, priceElement] = keys.children
      const sqm = squareMeterElement.innerHTML
      const price = priceElement.innerHTML
      const stripRegex = /kr|&nbsp;+|\s+/ig
      return { 
        sqm: sqm.replace(' m²', ''), 
        priceBase: price.replace(stripRegex, ''),
      }
    }))
    extractedData.forEach((data) => {
      expect(data.sqm.length).not.toBe(0)
      expect(data.priceBase.length).not.toBe(0)
      expect(Number.isNaN(parseInt(data.sqm))).toBe(false)
      expect(Number.isNaN(parseInt(data.priceBase))).toBe(false)
    })
  })
})