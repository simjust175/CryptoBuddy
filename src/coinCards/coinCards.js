// DOM selector utility function
const DOMselector = (elementName) => {
  return document.querySelector(elementName);
};

// function to add commas to numbers using .toLocaleString() function
const addCommatoNumber = (number) => number.toLocaleString();


// Coin card template
const coinCard = (coin) => {
  const { id, name, image: { large }, } = coin;
  return `
      <div class="coinCard" data-id="${id}">
        <button type="button" class="addCoinButton" data-id="${name}"><h3>+</h3></button>
        <div class="coinName">
          <h3>${name}</h3>
        </div>
        <div>
          <img class="cryptoIcons" src="${large}" alt="${id}">
        </div>
        <div class="coinPrice" id="coinPrice${id}"></div>
        <div class="pastDayChange" id="pastDayChange${id}"></div>
        <div class="overlay">
          <button type="button" class="getRateButton">Get rate</button>
        </div>
      </div>
    `;
};

// Event listener function for getRate buttons
const addEventListenersToButtons = () => {
  const getRateButtons = document.querySelectorAll(".getRateButton");
  getRateButtons.forEach((button) => {
    button.addEventListener("click", priceEventHandler);
  });
};

const addEventListenersToAddCoinButtons = () => {
  const addCoinButtons = document.querySelectorAll(".addCoinButton");
  addCoinButtons.forEach((button) => {
    button.addEventListener("click", addCoinEventHandler);
  });
};

// Render coin cards
const renderCard = (coins) => {
  const mainCoinDiv = DOMselector(".coins");
  mainCoinDiv.innerHTML = "";
  coins.forEach((coin) => {
    mainCoinDiv.innerHTML += coinCard(coin);
  });
};

// Search bar element
const searchBar = DOMselector("#searchBar");

// Filter coin results based on search
const filterResults = (data) => {
  const searchResults = searchBar.value.toLowerCase();
  return data.filter((coin) => {
    return coin.name.toLowerCase().includes(searchResults);
  });
};

// Load coins and set up event listeners
const loadCoin = async () => {
  const res = await fetch("https://api.coingecko.com/api/v3/coins/");
  const data = await res.json();
  renderCard(data);
  addEventListenersToButtons();
  addEventListenersToAddCoinButtons();

  searchBar.addEventListener("input", () => {
    const filteredCoins = filterResults(data);
    renderCard(filteredCoins);
    addEventListenersToButtons();
    addEventListenersToAddCoinButtons();
  });
};

// Event handler for price button
const priceEventHandler = (event) => {
  const target = event.target.parentElement;
  target.classList.add("hidden");
  const currentCard = target.parentElement;
  const currentCoin = currentCard.getAttribute("data-id");
  getRate(currentCoin);
};

// Fetch coin rate
const getRate = async (currentCoin) => {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${currentCoin}`
    );
    const data = await res.json();
    renderRate(data);
  } catch (error) {
    throw new Error("An error occurred: " + error);
  }
};


//  select currency  //

const usd = DOMselector("#usd");
const ils = DOMselector("#ils");

const currencySelector = (e) => {
  const target = e.target.id;
  let currency = ""
  usd.classList.toggle("selectedCurrency", currency === "usd");
  ils.classList.toggle("selectedCurrency", currency === "ils");
  console.log(currency);
  return currency;
};

usd.addEventListener("click", currencySelector);
ils.addEventListener("click", currencySelector);



// Render coin rate //

const renderRate = (data) => {
  const { id, market_data: { current_price, price_change_24h } } = data;

  const priceDisplay = DOMselector(`#coinPrice${id}`);
  const pastDayChange = DOMselector(`#pastDayChange${id}`);

  const currencyOfChoice = currencySelector();
  const currencyDisplay = {
    usd: "$",
    ils: "₪",
  };

  const marketStatus = price_change_24h > 0 ? "up" : "down";

  priceDisplay.innerHTML =
   `${currencyDisplay[currencyOfChoice]}${addCommatoNumber(current_price[currencyOfChoice])}`;

  priceDisplay.classList.add(`${marketStatus}`);

  pastDayChange.innerHTML = `<i class='bx bxs-${marketStatus}-arrow ${marketStatus}'></i>
   ${currencyDisplay[currencyOfChoice]}${addCommatoNumber(price_change_24h)}`;
};

// Call the loadCoin function to initiate loading of coins
loadCoin();

// add coin to protofolio

const protifolio = [];
// 'regular' function in-order to use 'this'
function addCoinEventHandler(e) {
  this.classList.toggle("active");
  const coinToAdd = e.target.parentElement.dataset.id;
  protifolio.push(coinToAdd);
  console.log(protifolio.sort());
}

