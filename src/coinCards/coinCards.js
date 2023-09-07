// DOM selector utility function
const DOMselector = (element) => document.querySelector(element);

// Function to add commas to numbers
const formatNumber = (number) => number.toLocaleString();

// Template to generate a coin card
const coinCard = (coin) => {
  const { id, name, image: { large, small } } = coin;
  return `
    <div class="coinCard" data-id="${id}">
      <button type="button" class="addCoinButton" data-id="${id}" data-name="${name}" data-img="${small}">
        <h3>+</h3>
      </button>
      <i class='bx bxs-heart' id="favorite${id}"></i>
      <div class="coinName">
        <h3>${name}</h3>
      </div>
      <img class="cryptoIcons" src="${large}" alt="${id}">
      <div class="coinPrice" id="coinPrice${id}"></div>
      <div class="pastDayChange" id="pastDayChange${id}"></div>
      <div class="overlay">
        <button type="button" class="getRateButton">Get rate</button>
      </div>
    </div>
  `;
};

// Function to attach event listeners to get rate buttons
const attachRateButtonListeners = () => {
  const getRateButtons = document.querySelectorAll(".getRateButton");
  getRateButtons.forEach((button) => {
    button.addEventListener("click", handleRateButtonClick);
  });
};

// Function to attach event listeners to add coin buttons
const attachAddCoinButtonListeners = () => {
  const addCoinButtons = document.querySelectorAll(".addCoinButton");
  addCoinButtons.forEach((button) => {
    button.addEventListener("click", handleAddCoinButtonClick);
  });
};

// Function to render coin cards
const renderCards = (coins) => {
  const mainDiv = DOMselector(".coins");
  mainDiv.innerHTML = "";

  coins.forEach((coin) => {
    mainDiv.innerHTML += coinCard(coin);
  });

  // Attaching the event listeners to the buttons.
  attachRateButtonListeners();
  attachAddCoinButtonListeners();
};

// Function to filter coin results based on search
const filterResults = (data, query) => data.filter((coin) =>
  coin.name.toLowerCase().includes(query.toLowerCase())
);

// Async function to load coins
const loadCoins = async () => {
  const res = await fetch("https://api.coingecko.com/api/v3/coins/");
  const coins = await res.json();
  renderCards(coins);

  DOMselector("#searchBar").addEventListener("input", (e) => {
    const filteredCoins = filterResults(coins, e.target.value);
    renderCards(filteredCoins);
  });
};

// Event handler for get rate button click
const handleRateButtonClick = (e) => {
  const target = e.target.parentElement;
  target.classList.add("hidden"); // Remove the overlay

  const card = e.target.closest(".coinCard");
  const coinId = card.getAttribute("data-id");
  getRate(coinId, renderRate);
};

// Async function to fetch coin rate
const getRate = async (coinId, rateInfo) => {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    const data = await res.json();
    selectedCurrency = currency;
    rateInfo(data);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// Function to render coin rate
const renderRate = ({ id, market_data: { current_price, price_change_24h_in_currency } }) => {
  const priceDisplay = DOMselector(`#coinPrice${id}`);
  const changeDisplay = DOMselector(`#pastDayChange${id}`);

  const currencySymbols = { usd: "$", ils: "₪" };
  const marketStatus = price_change_24h_in_currency > 0 ? "up" : "down";
  const currencySymbol = currencySymbols[currency];

  priceDisplay.innerHTML = `${currencySymbol}${formatNumber(current_price[currency])}`;
  priceDisplay.classList.add(marketStatus);

  changeDisplay.innerHTML = `
    <i class='bx bxs-${marketStatus}-arrow ${marketStatus}'></i>
    ${currencySymbol}${formatNumber(price_change_24h_in_currency[currency])}
  `;
};

// Gets the selected currency from the buttons
let currency = "usd";
const currencySelector = (e) => {
  currency = e.target.id;
  const clickedCurrency = currency ? currency : "usd";
  usd.classList.toggle("selectedCurrency", clickedCurrency === "usd");
  ils.classList.toggle("selectedCurrency", clickedCurrency === "ils");
  return currency;
};
usd.addEventListener("click", currencySelector);
ils.addEventListener("click", currencySelector);

// Call the loadCoins function to initiate loading of coins
loadCoins();

// add coin to protofolio

let protifolio = [];
let sortedProtifolio = protifolio.sort();
const addedMessage = DOMselector(".addToCoinStatus");

let counter = 0;
// 'regular' function in-order to use 'this'
function handleAddCoinButtonClick(e) {
  const target = e.target;
  const eventOnChild = target.localName === 'h3';
  const button = eventOnChild ? target.parentNode : target;
  const coinId = button.dataset.id;
  console.log(coinId);
  if (coinId && !protifolio.some((coin) => coin.id === coinId)) {
    protifolio.push({
      index: counter++,
      id: coinId,
      coin: button.dataset.coinName,
      img: button.dataset.img,
      // price: ({market_data: {current_price}}, currency) => current_price[currency]
      
    });

    button.classList.toggle('coinAdded');
    addedMessage.classList.toggle('hidden');
    const favorite = DOMselector(`#favorite${coinId}`);
    console.log(protifolio);
    favorite.classList.add("favorite")
    button.innerHTML = '-';
  }
}

const protifolioButton = DOMselector(".protifolio");
const protifolioDisplay = DOMselector(".protifolioDisplay");

const loadPriceToProfile = ({ market_data: { current_price }}) => price = current_price[currency];

const protifolioItems = (item, price) => {
  const { img, coin, id } = item
  
  return `
      <div class="protifolioDisplayCard">
        <img src="${img}" alt="${coin}">
        ${coin} ${price}
        <div class="removeFromProtifolio" data-id="${coin}"> - </div>
      </div>`;
};

const showProtifolio = () => {
  protifolioDisplay.classList.toggle("hidden");
  protifolioDisplay.innerHTML = "";
  protifolioDisplay.innerHTML = `<div class="exitProtifolio">X</div>`;
  addEventToExit()
  const price = "$2.35" // fake price util function's fixed
  for (const item of protifolio) {
    getRate(item.id, loadPriceToProfile);
    protifolioDisplay.innerHTML += protifolioItems(item, price);
  }
};

// 
const removeCoin = (e) => {console.log(e.target)}

const removeCoinEventHandler = (e) => removeCoin(e.target.dataset.id)

protifolioButton.addEventListener("click", function () { showProtifolio(sortedProtifolio) })

const addEventToRemoveCoin = () => {
  const removeFromProtifolio = document.querySelectorAll(".removeFromProtifolio");
  removeFromProtifolio.forEach((button) => button.addEventListener("click", removeCoinEventHandler))
    ;
}

const addEventToExit = () => {
  const exitProtifolio = DOMselector(".exitProtifolio");
  exitProtifolio.addEventListener("click", () => protifolioDisplay.classList.add("hidden"))
  exitProtifolio.removeEventListener("click", () => protifolioDisplay.classList.add("hidden"))
}