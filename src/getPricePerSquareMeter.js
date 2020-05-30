import extractPrice from './helpers/extractPrice'
import formatPricePretty from './helpers/formatPricePretty'

export default function getPricePerSquareMeter(squareMetreElement, basePrice, priceList) {
  const squareMetres = squareMetreElement.textContent.includes('-')
    ? parseInt(squareMetreElement.textContent.split('-')[1])
    : parseInt(squareMetreElement.textContent.split('m²')[0].replace(/\s+/g, ''));
  const finalBasenumber = extractPrice(basePrice, priceList);
  const inPrice = finalBasenumber / squareMetres;
  const pricePerSquareMetre = formatPricePretty(inPrice);
  return pricePerSquareMetre;
}