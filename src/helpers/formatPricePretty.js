export default function formatPricePretty(price) {
  const initialPrice = price.toFixed(0)
  const priceArray = initialPrice.split('')
  let finalPrice = ''

  if (priceArray.length < 4) {
    finalPrice = priceArray.join('')
    return finalPrice += ' kr'
  }

  let size = priceArray.length % 3;
  let counter = 0;
  

  while (finalPrice.trim().replace(/\s+/g, '').length !== initialPrice.length) {
    if (size !== 0) {
      finalPrice += `${priceArray.slice(counter, size).join('')} `
      counter = size
      size = 0;
      continue
    }
    finalPrice += `${priceArray.slice(counter, counter + 3).join('')} `
    counter += 3;
    continue;
  }

  return finalPrice += 'kr'
}