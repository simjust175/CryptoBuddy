const urlLoader = async url => await fetch(url);
const DOMselecor = (elementName)=>{
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


var mainCoinDiv = DOMselecor(".coins");
const coinGecko = urlLoader("https://api.coingecko.com/api/v3/coins/");

coinGecko
    .then(res => res.json())
    .then(data => {data.forEach((coin)=>{
        // document.querySelector(".coins").innerHTML = `<span>${coin.name}</span>`;
        // const coinDiv1 = ElementCreater("div", "", mainCoinDiv)
        const coinDiv = document.createElement("div");
        coinDiv.classList.add("coinDisplay");
        coinDiv.setAttribute("data-id" ,coin.id)
        mainCoinDiv.appendChild(coinDiv);

        // coins name
        const h3 = document.createElement("h3");
        h3.innerHTML = `<b>${coin.name}</b>`;
        coinDiv.appendChild(h3);

        // load the coins icon
        const img = document.createElement("img")
        img.src = coin.image.small;
        coinDiv.appendChild(img);
        
        //create button
        const click = document.createElement("button");
        click.classList.add("button");
        click.innerHTML = "get rate";
        coinDiv.appendChild(click)
        click.addEventListener("click", setRate);   

    })});


const apiPrinter = (api) =>{
    api.forEach(element => {
        console.log(element);
    });
} 

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