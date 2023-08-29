// DOM selector utility function
const DOMselector = (elementName) => {
    return document.querySelector(elementName);
};

// Coin card template
const coinCard = (coin) => {
    const { id, name, image: { large }, } = coin;
    return `
      <div class="coinCard" data-id="${id}">
        <button type="button" class="addCoinButton"><h3>+</h3></button>
        <div class="coinName">
          <h3>${name}</h3>
        </div>
        <div>
          <img src="${large}" alt="${id}">
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
    const getRateButtons = document.querySelectorAll('.getRateButton');
    getRateButtons.forEach((button) => {
        button.addEventListener('click', priceEventHandler);
    });
};

const addEventListenersToAddCoinButtons = () => {
    const addCoinButtons = document.querySelectorAll('.addCoinButton');
    addCoinButtons.forEach((button) => {
        button.addEventListener('click', addCoinEventHandler)
    })
}

// Search bar element
const searchBar = DOMselector("#searchBar");

// Render coin cards
const renderCard = (coins) => {
    const mainCoinDiv = DOMselector(".coins");
    mainCoinDiv.innerHTML = "";
    coins.forEach((coin) => {
        mainCoinDiv.innerHTML += coinCard(coin);
    });
};

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

    searchBar.addEventListener('input', () => {
        const filteredCoins = filterResults(data);
        renderCard(filteredCoins);
        addEventListenersToButtons();
    });


};

// Event handler for price button
const priceEventHandler = (event) => {
    const target = event.target.parentElement;
    console.log(target);
    target.classList.add("hidden")
    const currentCard = target.parentElement;
    const currentCoin = currentCard.getAttribute("data-id");
    getRate(currentCoin);
};

// Fetch coin rate
const getRate = async (currentCoin) => {
    try {
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/${currentCoin}`);
        const data = await res.json();
        renderRate(data);
    }
    catch (error) {
        throw new Error('An error occurred: ' + error);
    }
};

// Render coin rate
const renderRate = (data) => {
    const { id, market_data: { current_price, price_change_24h } } = data;
    const priceDisplay = DOMselector(`#coinPrice${id}`);
    const pastDayChange = DOMselector(`#pastDayChange${id}`)
    const currencyOfChoice = "usd";
    const currencyDisplay = {
        usd: "$",
        ils: "₪"
    };
    const marketStatus = price_change_24h > 0 ? "up" : "down";
    priceDisplay.innerHTML = `${currencyDisplay[currencyOfChoice]}${current_price[currencyOfChoice]}`;
    priceDisplay.classList.add(`${marketStatus}`)
    pastDayChange.innerHTML = `<i class='bx bxs-${marketStatus}-arrow ${marketStatus}'></i> ${currencyDisplay[currencyOfChoice]}${price_change_24h}`;
};

// add coin to protofolio

// regular 'function' in-order to use 'this'
function addCoinEventHandler() {
    this.classList.toggle('active');
}

// Call the loadCoin function to initiate loading of coins
loadCoin();



