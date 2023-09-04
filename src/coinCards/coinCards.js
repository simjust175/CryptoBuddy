// DOM selector utility function
const DOMselector = (elementName) => {
  return document.querySelector(elementName);
};

// function to add commas to numbers using .toLocaleString() function
const addCommatoNumber = (number) => number.toLocaleString();


// Coin card template
const coinCard = (coin) => {
  const { id, name, image: { large, small }, } = coin;
  return `
      <div class="coinCard" data-id="${id}">
        <button type="button" class="addCoinButton" data-id="${id}" data-name="${name}" data-img="${small}"><h3>+</h3></button>
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
  getRate(currentCoin, 'main');
};

// Fetch coin rate
const getRate = async (currentCoin, main) => {
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${currentCoin}`
    );
    const data = await res.json();
    const selectedCurrency = currency; // Get the selected currency
    main ? renderRate(data, selectedCurrency) : data;
  } catch (error) {
    throw new Error("An error occurred: " + error);
  }
};

// Select currency
const usd = DOMselector("#usd");
const ils = DOMselector("#ils");

// gets the selected currency from the buttons
let currency = "usd"
const currencySelector = (e) => {
  currency = e.target.id;
  console.log(`is it true? ${currency}`);
  const clickedCurrency = currency ? currency : "usd";
  usd.classList.toggle("selectedCurrency", clickedCurrency === "usd");
  ils.classList.toggle("selectedCurrency", clickedCurrency === "ils");
  return currency;
};


usd.addEventListener("click", currencySelector);
ils.addEventListener("click", currencySelector);



// Render coin rate
const renderRate = (data, selectedCurrency) => {
  const { id, market_data: { current_price, price_change_24h_in_currency } } = data;

  const priceDisplay = DOMselector(`#coinPrice${id}`);
  const pastDayChange = DOMselector(`#pastDayChange${id}`);

  const currencyDisplay = {
    usd: "$",
    ils: "₪",
  };

  const marketStatus = price_change_24h_in_currency > 0 ? "up" : "down";

  priceDisplay.innerHTML = `${currencyDisplay[selectedCurrency]}${addCommatoNumber(current_price[selectedCurrency])}`;

  priceDisplay.classList.add(`${marketStatus}`);

  pastDayChange.innerHTML = `<i class='bx bxs-${marketStatus}-arrow ${marketStatus}'></i>
   ${currencyDisplay[selectedCurrency]}${addCommatoNumber(price_change_24h_in_currency[selectedCurrency])}`;
};

// Call the loadCoin function to initiate loading of coins
loadCoin();

// add coin to protofolio

const protifolio = [];
const sortedProtifolio = protifolio.sort();

// 'regular' function in-order to use 'this'
function addCoinEventHandler(e) {
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
    button.innerHTML = '-';
  }
}

const removeCoinFromProtifolio = () =>{

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
    return '';
  }
};

const showProtifolio = async (protifolio) => {
  protifolioDisplay.classList.toggle("hidden");
  protifolioDisplay.innerHTML = "";
  for (const item of protifolio) {
    console.log(item);
    const protifolioItem = await protifolioItems(item);
    protifolioDisplay.innerHTML += protifolioItem;
  }
};

protifolioButton.addEventListener("click", function () { showProtifolio(sortedProtifolio) })

