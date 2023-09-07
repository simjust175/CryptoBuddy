
const showProtifolio = async (protifolio) => {
    protifolioDisplay.classList.toggle("hidden");
    protifolioDisplay.innerHTML = "";
    protifolioDisplay.innerHTML = `<div class="exitProtifolio">X</div>`;
    addEventToExit()
    for (const item of protifolio) {
    const protifolioItem = await protifolioItems(item);
    protifolioDisplay.innerHTML += protifolioItem;
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