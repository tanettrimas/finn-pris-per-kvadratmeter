import setPricesInDOM from "./helpers/dom/setPricesInDOM";
import createTransportButton from "./helpers/dom/setTransportButton";
import getPricePerSquareMeter from "./getPricePerSquareMeter";
import findTrips from "./services/entur";
import { getItemFromStorage, setItemInStorage } from "./localStorage";

const adList = document.querySelector(".ads--list");
const RENDER_CHECK = 10;
// Observer for catching DOM changes
const mutationObserver = new MutationObserver((mutations) => {
  let removedCount = 0;
  let addedCount = 0;
  mutations.forEach((mutation) => {
    if (mutation.removedNodes.length) {
      ++removedCount;
    }

    if (mutation.addedNodes.length) {
      ++addedCount;
    }
  });
  // Pageturn or filter changes will re-render the main function if more than 10 items are removed or added
  if (removedCount > RENDER_CHECK || addedCount > RENDER_CHECK) {
    main();
  }
});

function main() {
  const housingCardList = document.querySelectorAll(
    "article > .ads__unit__content"
  );
  for (const housingCard of housingCardList) {
    try {
      const alreadyAppended = housingCard.querySelector(".priceSqm");

      if (alreadyAppended) {
        continue;
      }

      const contentKeys = housingCard.querySelector(
        ".ads__unit__content__keys"
      );
      const [squareMeterElement, priceElement] = [...contentKeys.childNodes];
      const isAdCampaign = !squareMeterElement || !priceElement;

      if (isAdCampaign) {
        // Ad without price
        continue;
      }

      const priceStats = [
        ...housingCard.querySelector("div > .u-float-left").children,
      ];
      const totalPriceDiv = priceStats.find(
        (e) =>
          e.textContent && e.textContent.toLowerCase().includes("totalpris")
      );
      const priceList = priceElement.textContent
        .replace("kr", "")
        .trim()
        .split(/\s/);
      // If the card does not have totalprice at all in the element, just use the prisantydning element
      const basePrice =
        !!totalPriceDiv && totalPriceDiv.textContent.length
          ? totalPriceDiv.textContent.split("kr")[0]
          : priceList;

      if (priceList[0].toLowerCase() === "solgt") {
        // Drop to calculate if the property is sold
        continue;
      }

      // When there is a square metre range, use the highest value as factor
      const pricePerSquareMetre = getPricePerSquareMeter(
        squareMeterElement,
        basePrice,
        priceList
      );

      setPricesInDOM(pricePerSquareMetre, housingCard);
      // const aTestDiv = document.createElement('div')
      // aTestDiv.classList.add('mySimpleTest')
      // adList.append(aTestDiv)

      createTransportButton(housingCard, () => {
        findTrips("Karenslyst alle 56", "Montebellobakken 3A");
      });
    } catch (error) {
      console.error(error);
      break;
    }
  }
}

main();

mutationObserver.observe(adList, { childList: true });
