const adList = document.querySelector('.ads--list')
const RENDER_CHECK = 10;
// Observer for catching DOM changes
const mutationObserver = new MutationObserver(function(mutations) {
  let removedCount = 0
  let addedCount = 0;
  mutations.forEach((mutation) => {
    if (mutation.removedNodes.length) {
      ++removedCount
    }

    if (mutation.addedNodes.length) {
      ++addedCount
    }
  });
  // Pageturn or filter changes will re-render the main function if more than 10 items are removed or added
    if (removedCount > RENDER_CHECK || addedCount > RENDER_CHECK) {
      main()
    }
});

  function main() {
    const housingCardList = document.querySelectorAll('article > .ads__unit__content')

    function setPricesInDOM(pricePerSquareMetre, housingCard) {
      const priceKvmContentDiv = document.createElement('div')
      const priceKvmTextDiv = document.createElement('div')
      const priceKvmPriceDiv = document.createElement('div')
      priceKvmContentDiv.classList.add('ads__unit__content__keys', 'priceSqm')
      priceKvmPriceDiv.textContent = pricePerSquareMetre
      priceKvmTextDiv.textContent = "Pris per kvadratmeter"
      priceKvmContentDiv.append(priceKvmTextDiv, priceKvmPriceDiv)
      housingCard.appendChild(priceKvmContentDiv)
    }
    
    function formatPricePretty(price) {
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
    
    for (const housingCard of housingCardList) {
      try {
        const alreadyAppended = housingCard.querySelector('.priceSqm')

        if (alreadyAppended) {
          continue;
        }

        const contentKeys = housingCard.querySelector('.ads__unit__content__keys')
        const [squareMetreElement, priceElement] = [...contentKeys.childNodes]
        const isAdCampaign = !squareMetreElement || !priceElement
    
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
        const squareMetres = squareMetreElement.textContent.includes('-') 
          ? parseInt(squareMetreElement.textContent.split('-')[1]) 
          : parseInt(squareMetreElement.textContent.split('m²')[0].replace(/\s+/g, ''))
        const finalBasenumber = extractPrice(basePrice, priceList);
        const inPrice = finalBasenumber / squareMetres
        const pricePerSquareMetre = formatPricePretty(inPrice)
        setPricesInDOM(pricePerSquareMetre, housingCard)
      } catch (error) { 
        console.error(error)
        break;
      }
    }

    function extractPrice(basePrice, priceList) {
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
  }

  main()

  mutationObserver.observe(adList, { childList: true })  