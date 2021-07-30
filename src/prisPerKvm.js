import setPricesInDOM from "./helpers/dom/setPricesInDOM";
import createTransportButton from "./helpers/dom/setTransportButton";
import getPricePerSquareMeter from "./getPricePerSquareMeter";
import findTrips from "./services/entur";

const adList = document.querySelector(".ads");
const RENDER_CHECK = 10;
// Observer for catching DOM changes
const mutationObserver = new MutationObserver((mutations) => {
  let removedCount = 0;
  let addedCount = 0;
  console.log("is observing....");
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
  const addressInformationStorageRequest = browser.storage.local.get("address");
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
      addressInformationStorageRequest.then((addressData) => {
        if (addressData && addressData.address && addressData.address.value) {
          const storedAddress = addressData.address.value;
          createTransportButton(housingCard, async () => {
            const loaderDiv = document.createElement("div");
            const addressDiv = housingCard.querySelector(
              ".ads__unit__content__details > div"
            );
            loaderDiv.textContent = `Nå henter jeg reiseavstand mellom ${storedAddress} og ${addressDiv.innerHTML}... - bare å smøre seg med tålmodighetskrem :)`;
            housingCard.appendChild(loaderDiv);
            const data = await findTrips(storedAddress, addressDiv.innerHTML);
            housingCard.removeChild(loaderDiv);
            const calculateButton =
              housingCard.querySelector(".button--transport");
            setTripInfo(housingCard, data);
            calculateButton.remove();
          });
        }
      });
    } catch (error) {
      console.error(error);
      break;
    }
  }
}

function setupIcons() {
  let headID = document.getElementsByTagName("head")[0];
  let link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";

  link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
  headID.appendChild(link);
}
setupIcons();

function setTripInfo(housingCard, data) {
  const div = document.createElement("div");
  div.textContent = "Avstand til " + data[0].destinations.from.name;
  div.classList.add("ads__unit__content__keys", "timeBox");
  housingCard.appendChild(div);

  if (data[0].non_transit.bicycle != null) {
    housingCard.appendChild(
      getDiv("directions_bike", data[0].non_transit.bicycle.duration)
    );
  }
  if (data[0].non_transit.foot != null) {
    housingCard.appendChild(
      getDiv("directions_walk", data[0].non_transit.foot.duration)
    );
  }
  if (data[0].non_transit.car != null) {
    housingCard.appendChild(
      getDiv("directions_car", data[0].non_transit.car.duration)
    );
  }
  if (data[0].transit != null) {
    housingCard.appendChild(getDiv("directions_bus", data[0].transit.duration));
  }
}

function getDiv(iconName, time) {
  const parentDiv = document.createElement("div");
  const iconDiv = document.createElement("div");
  const timeDiv = document.createElement("div");
  parentDiv.classList.add("ads__unit__content__keys", "timeBox");

  timeDiv.textContent = time + "min";
  iconDiv.append(getIcon(iconName));

  parentDiv.append(iconDiv, timeDiv);

  return parentDiv;
}

function getIcon(name) {
  let i = document.createElement("i");
  i.className = "material-icons";
  i.textContent = name;

  return i;
}

console.log("adlist", adList);
mutationObserver.observe(adList, { childList: true });

main();
