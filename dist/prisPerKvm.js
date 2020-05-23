(function(modules) {
  var installedModules = {};
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) return installedModules[moduleId].exports;
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    module.l = true;
    return module.exports;
  }
  __webpack_require__.m = modules;
  __webpack_require__.c = installedModules;
  __webpack_require__.d = function(exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) Object.defineProperty(exports, name, {
      enumerable: true,
      get: getter
    });
  };
  __webpack_require__.r = function(exports) {
    if ("undefined" !== typeof Symbol && Symbol.toStringTag) Object.defineProperty(exports, Symbol.toStringTag, {
      value: "Module"
    });
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
  };
  __webpack_require__.t = function(value, mode) {
    if (1 & mode) value = __webpack_require__(value);
    if (8 & mode) return value;
    if (4 & mode && "object" === typeof value && value && value.__esModule) return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, "default", {
      enumerable: true,
      value: value
    });
    if (2 & mode && "string" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {
      return value[key];
    }.bind(null, key));
    return ns;
  };
  __webpack_require__.n = function(module) {
    var getter = module && module.__esModule ? function() {
      return module["default"];
    } : function() {
      return module;
    };
    __webpack_require__.d(getter, "a", getter);
    return getter;
  };
  __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  __webpack_require__.p = "";
  return __webpack_require__(__webpack_require__.s = 0);
})([ function(module, exports) {
  const adList = document.querySelector(".ads--list");
  const RENDER_CHECK = 10;
  const mutationObserver = new MutationObserver((function(mutations) {
    let removedCount = 0;
    let addedCount = 0;
    mutations.forEach(mutation => {
      if (mutation.removedNodes.length) ++removedCount;
      if (mutation.addedNodes.length) ++addedCount;
    });
    if (removedCount > RENDER_CHECK || addedCount > RENDER_CHECK) main();
  }));
  function main() {
    const housingCardList = document.querySelectorAll("article > .ads__unit__content");
    function setPricesInDOM(pricePerSquareMetre, housingCard) {
      const priceKvmContentDiv = document.createElement("div");
      const priceKvmTextDiv = document.createElement("div");
      const priceKvmPriceDiv = document.createElement("div");
      priceKvmContentDiv.classList.add("ads__unit__content__keys", "priceSqm");
      priceKvmPriceDiv.textContent = pricePerSquareMetre;
      priceKvmTextDiv.textContent = "Pris per kvadratmeter";
      priceKvmContentDiv.append(priceKvmTextDiv, priceKvmPriceDiv);
      housingCard.appendChild(priceKvmContentDiv);
    }
    function formatPricePretty(price) {
      const initialPrice = price.toFixed(0);
      const priceArray = initialPrice.split("");
      let finalPrice = "";
      if (priceArray.length < 4) {
        finalPrice = priceArray.join("");
        return finalPrice + " kr";
      }
      let size = priceArray.length % 3;
      let counter = 0;
      while (finalPrice.trim().replace(/\s+/g, "").length !== initialPrice.length) {
        if (0 !== size) {
          finalPrice += `${priceArray.slice(counter, size).join("")} `;
          counter = size;
          size = 0;
          continue;
        }
        finalPrice += `${priceArray.slice(counter, counter + 3).join("")} `;
        counter += 3;
      }
      return finalPrice + "kr";
    }
    for (const housingCard of housingCardList) try {
      const alreadyAppended = housingCard.querySelector(".priceSqm");
      if (alreadyAppended) continue;
      const contentKeys = housingCard.querySelector(".ads__unit__content__keys");
      const [squareMetreElement, priceElement] = [ ...contentKeys.childNodes ];
      const isAdCampaign = !squareMetreElement || !priceElement;
      if (isAdCampaign) continue;
      const priceStats = [ ...housingCard.querySelector("div > .u-float-left").children ];
      const totalPriceDiv = priceStats.find(e => e.textContent && e.textContent.toLowerCase().includes("totalpris"));
      const priceList = priceElement.textContent.replace("kr", "").trim().split(/\s/);
      const basePrice = !!totalPriceDiv && totalPriceDiv.textContent.length ? totalPriceDiv.textContent.split("kr")[0] : priceList;
      if ("solgt" === priceList[0].toLowerCase()) continue;
      const squareMetres = squareMetreElement.textContent.includes("-") ? parseInt(squareMetreElement.textContent.split("-")[1]) : parseInt(squareMetreElement.textContent.split("m²")[0].replace(/\s+/g, ""));
      const finalBasenumber = extractPrice(basePrice, priceList);
      const inPrice = finalBasenumber / squareMetres;
      const pricePerSquareMetre = formatPricePretty(inPrice);
      setPricesInDOM(pricePerSquareMetre, housingCard);
    } catch (error) {
      console.error(error);
      break;
    }
    function extractPrice(basePrice, priceList) {
      let finalBasenumber;
      if ("string" === typeof basePrice && basePrice.toLowerCase().includes("totalpris")) {
        finalBasenumber = basePrice.toLowerCase().replace("totalpris: ", "");
        finalBasenumber = finalBasenumber.includes("-") ? finalBasenumber.split("-")[1] : finalBasenumber;
        finalBasenumber = finalBasenumber.replace(/\s+/g, "");
      } else finalBasenumber = priceList.join("");
      return parseInt(finalBasenumber);
    }
  }
  main();
  mutationObserver.observe(adList, {
    childList: true
  });
} ]);