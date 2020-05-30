export default function extractPrice(basePrice, priceList) {
  let finalBasenumber
  if (typeof basePrice === 'string' && basePrice.toLowerCase().includes('totalpris')) {
    finalBasenumber = basePrice.toLowerCase().replace('totalpris: ', '');
    // When there is a price range, use the highest value as factor
    finalBasenumber = finalBasenumber.includes('-') ? finalBasenumber.split('-')[1] : finalBasenumber;
    finalBasenumber = finalBasenumber.replace(/\s+/g, '')
  }
  else {
    // Use "prisantydning"
    finalBasenumber = priceList.join('')
  }
  return parseInt(finalBasenumber)
}