import setPricesInDOM from './helpers/setPricesInDOM'
import getPricePerSquareMeter from './getPricePerSquareMeter'

let buttons = document.getElementsByClassName("button")
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function (event) {
    setTimeout(() => { main(); }, 5000);
  });
}

let inputs = document.getElementsByTagName("input")
for (var i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener('click', function (event) {
    setTimeout(() => { main(); }, 3000);
  });
}

  function main() {
    const housingCardList = document.querySelectorAll('article > .ads__unit__content')
    
    for (const housingCard of housingCardList) {
      try {
        const alreadyAppended = housingCard.querySelector('.priceSqm')

        if (alreadyAppended) {
          continue;
        }

        const contentKeys = housingCard.querySelector('.ads__unit__content__keys')
        const [squareMeterElement, priceElement] = [...contentKeys.childNodes]
        const isAdCampaign = !squareMeterElement || !priceElement
    
        if (isAdCampaign) {
          // Ad without price
          continue
        }

        const priceStats = [...housingCard.querySelector('div > .u-float-left').children]
        const totalPriceDiv = priceStats.find(e => e.textContent && e.textContent.toLowerCase().includes('totalpris'))
        const priceList = priceElement.textContent.replace('kr', '').trim().split(/\s/)
        // If the card does not have totalprice at all in the element, just use the prisantydning element
        const basePrice = !!totalPriceDiv && totalPriceDiv.textContent.length 
          ? totalPriceDiv.textContent.split('kr')[0] 
          : priceList      
        
        if (priceList[0].toLowerCase() === 'solgt') {
          // Drop to calculate if the property is sold
          continue
        }

        // When there is a square metre range, use the highest value as factor
        const pricePerSquareMetre = getPricePerSquareMeter(squareMeterElement, basePrice, priceList);

        setPricesInDOM(pricePerSquareMetre, housingCard)
      } catch (error) { 
        console.error(error)
        break;
      }
    }
  }

  main()
