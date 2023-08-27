const urlLoader = async url => await fetch(url);
const DOMselector = (elementName)=>{
    return document.querySelector(elementName)
}

// creater function

const ElementCreater = (tags, textContent, parentElement)=>{
    tags.forEach((tag, index)=>{
        const element = document.createElement(tag);
        element.innerHTML = textContent[index];
        parentElement.appendChild(element)
    })
}




const loadCoin = async () => {
    const res = await fetch("https://api.coingecko.com/api/v3/coins/");
    const data = await res.json();
    renderCard(data);
  };

 const coinCard = (coin)=>{
    return `<div class="coinDisplay" id=${coin.id}>
    <div class="coinName"><h3>${coin.name}</h3></div>
    <div><img src=${coin.image.large} alt=${coin.id}></div>
    '
    ]
    <div class="coinPrice"></div>
    <div class="overlay">
        <button type="submit" class="button"> "Get rate" <button>
    </div>
</div>`
 } 

const mainCoinDiv = DOMselector(".coins");
const overlay = DOMselector(".overlay");

const renderCard = (coins) => {
    coins.forEach((coin)=>{
        mainCoinDiv.innerHTML += coinCard(coin)

    })}

loadCoin()


let priceView = false;
const setRate = (e) => {
    target = e.target;
    const h4 = document.createElement("h4");
    h4.innerHTML = ""
    const div = target.parentElement;
    const coin = div.getAttribute("data-id");
    let currentCoin = urlLoader(`https://api.coingecko.com/api/v3/coins/${coin}`);
    currentCoin
        .then(res => res.json())
        .then(data => {
            console.log(data);
            h4.innerHTML = `<b>$${data.market_data.current_price.usd}</b>`;
            div.appendChild(h4);
        })
    }