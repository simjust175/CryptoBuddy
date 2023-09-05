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
      <i class='bx bxs-heart' id="favorite${name}"></i>
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
`};

// Function to attach event listeners to get rate buttons
const attachRateButtonListeners = () => {
  const getRateButtons = document.querySelectorAll(".getRateButton")
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
  mainDiv.innerHTML = ""
  //mainDiv.innerHTML = coins.map(coinCard);
  coins.forEach((coin) => {
    mainDiv.innerHTML += coinCard(coin);
  });
};

// Function to filter coin results based on search
const filterResults = (data, query) => data.filter((coin) =>
  coin.name.toLowerCase().includes(query.toLowerCase())
);

// Async function to load coins and setup event listeners
const loadCoins = async () => {
  const res = await fetch("https://api.coingecko.com/api/v3/coins/");
  const coins = await res.json();

  renderCards(coins);
  attachRateButtonListeners();
  attachAddCoinButtonListeners();

  DOMselector("#searchBar").addEventListener("input", (e) => {
    const filteredCoins = filterResults(coins, e.target.value);
    renderCards(filteredCoins);
    attachRateButtonListeners();
    attachAddCoinButtonListeners();
  });
};

// Event handler for get rate button click
const handleRateButtonClick = (e) => {
  
  // remove the overlay
  const target = e.target.parentElement;
  target.classList.add("hidden");

  const card = e.target.closest(".coinCard");
  const coinId = card.getAttribute("data-id");
  getRate(coinId, true);
};

// Async function to fetch coin rate
const getRate = async (coinId, main) => {
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    const data = await res.json();
    selectedCurrency = currency;
    main ? renderRate(data, selectedCurrency) : data;
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// Function to render coin rate
const renderRate = ({ id, market_data: { current_price, price_change_24h_in_currency } }, currency) => {
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


// gets the selected currency from the buttons
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

const protifolio = [];
const sortedProtifolio = protifolio.sort();
const addedMessage = DOMselector(".addToCoinStatus");

// 'regular' function in-order to use 'this'
function handleAddCoinButtonClick(e) {
  const target = e.target;
  const eventOnChild = target.localName === 'h3';
  const button = eventOnChild ? target.parentNode : target;
  const coinName = button.dataset.name;

  if (coinName && !protifolio.some((coin) => coin.coin === coinName)) {
    protifolio.push({
      coin: coinName,
      img: button.dataset.img,
      id: button.dataset.id
    });

    button.classList.toggle('coinAdded');
    addedMessage.classList.toggle('hidden');
    const favorite = DOMselector(`#favorite${coinName}`);
    favorite.classList.add("favorite")
    button.innerHTML = '-';
  }
}

const protifolioButton = DOMselector(".protifolio");
const protifolioDisplay = DOMselector(".protifolioDisplay");

const protifolioItems = async (protifolio) => {
  const { img, coin, id } = protifolio;
  try {
    const rateData = await getRate(id, false);
    const rate = console.log(rateData);;
    return `
      <div class="protifolioDisplayCard">
        <img src="${img}" alt="${coin}">
        ${coin} ${rate}
        <div class="removeFromProtifolio"> - </div>
      </div>`;
  } catch (error) {
    console.error(error);
  }
};

const showProtifolio = async (protifolio) => {
  protifolioDisplay.classList.toggle("hidden");
  protifolioDisplay.innerHTML = "";
  protifolioDisplay.innerHTML = `<div class="exitProtifolio">X</div>`;
  addEventToExit()
  for (const item of protifolio) {
    const protifolioItem = await protifolioItems(item);
    protifolioDisplay.innerHTML += protifolioItem;
    addEventToExit()
    addEventToRemoveCoin()
  }
};

const removeCoin = (e) => {
    console.log(e.target.coin);
    
}

protifolioButton.addEventListener("click", function () { showProtifolio(sortedProtifolio) })

const addEventToRemoveCoin = () => {
  const removeFromProtifolio = document.querySelectorAll(".removeFromProtifolio");
  removeFromProtifolio.forEach( (button) => button.addEventListener("click", removeCoin))
 ;
}

const addEventToExit = () => {
  const exitProtifolio = DOMselector(".exitProtifolio");
  console.log("i am still here!");
  exitProtifolio.addEventListener("click", () => protifolioDisplay.classList.add("hidden"))
}