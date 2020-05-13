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
    
      if (priceArray.length < 4) {
        return priceArray.join('')
      }
    
      let size = priceArray.length % 3;
      let counter = 0;
      let finalPrice = ''
    
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
        const contentKeys = housingCard.querySelector('.ads__unit__content__keys')
        const alreadyAppended = housingCard.querySelector('.priceSqm')
        if (alreadyAppended) {
          continue;
        }
        const [squareMetreElement, priceElement] = [...contentKeys.childNodes]
        const isAdCampaign = !squareMetreElement || !priceElement
    
        if(isAdCampaign) {
          // Ad without price
          continue
        }
    
        const priceList = priceElement.textContent.replace('kr', '').trim().split(/\s/)
    
        if (priceList[0].toLowerCase() === 'solgt') {
          // Drop to calculate if the property is sold
          continue
        }

        const squareMetres = parseInt(squareMetreElement.textContent.split(' ')[0])
        const initialPrice = parseInt(priceList.join(''))
        const pricePerSquareMetre = formatPricePretty(initialPrice / squareMetres)
    
        setPricesInDOM(pricePerSquareMetre, housingCard)
      } catch (error) { 
        console.error(error)
        break;
      }
    }
  }

  main()

  mutationObserver.observe(adList, { childList: true })  