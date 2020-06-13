import extractPrice from './helpers/extractPrice'
import formatPricePretty from './helpers/formatPricePretty'

export default function getPricePerSquareMeter(squareMeterElement, basePrice, priceList) {
  const squareMetres = squareMeterElement.textContent.includes('-')
    ? parseInt(squareMeterElement.textContent.split('-')[1])
    : parseInt(squareMeterElement.textContent.split('m²')[0].replace(/\s+/g, ''));
  const finalBasenumber = extractPrice(basePrice, priceList);
  const baseCalculatedPrice = finalBasenumber / squareMetres;
  const pricePerSquareMetre = formatPricePretty(baseCalculatedPrice);
  return pricePerSquareMetre;
}