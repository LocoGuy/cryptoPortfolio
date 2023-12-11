/*let coins = [];

function initCoins() {
  coins = getCoins();
  //const url = "./coins.json";
  //const json = fetchJson(url);
}
*/

let coins = [];
async function initCoins() {
  const url = "./coins.json";
  const jsonCoins = await fetchJson(url);
  var coins = jsonCoins; //JSON.parse(jsonCoins);
  console.log("coins-before", coins);
  coins = coins.map((coin) => ({
    ...coin,
    priceValue: 0,
    priceCalcValue: 0,
  }));

  //coins = getCoins();
}

function initCards() {
  const coinsDiv = document.getElementById("card-group");
  coinsDiv.innerHTML = "";

  for (let i = 0; i < coins.length; i++) {
    if (coins[i].amount < 0.1) return;

    // Wenn i gerade ist (d.h., 0, 2, 4, ...), erstellen Sie eine neue Zeile
    if (i % 4 === 0) {
      var rowDiv = document.createElement("div");
      rowDiv.className = "row justify-content-center";
      coinsDiv.appendChild(rowDiv);
    }

    // Holen Sie die Zeile basierend auf dem aktuellen Index (i)
    let row = coinsDiv.getElementsByClassName("row")[Math.floor(i / 4)];

    var coin = coins[i];

    var col = document.createElement("div");
    // col-lg-3 ermöglicht es, vier Elemente pro Zeile in größeren Ansichten anzuzeigen.
    col.className = "col-lg-3 col-md-4 col-sm-6";

    var coinCard = createCoinCard(coin);

    col.appendChild(coinCard);
    row.appendChild(col);
  }
}

/*
function initCards() {
  const coinsDiv = document.getElementById("card-group");
  coinsDiv.innerHTML = "";

  for (let i = 0; i < coins.length; i++) {
    if (coins[i].amount < 0.1) return;

    if (i % 5 === 0) {
      var rowDiv = document.createElement("div");
      rowDiv.className = "row justify-content-center";
      coinsDiv.appendChild(rowDiv);
    }

    let row = coinsDiv.getElementsByClassName("row")[Math.floor(i / 5)];

    var coin = coins[i];

    var col = document.createElement("div");
    col.className = "col-lg-2 col-sm-6";

    var coinCard = createCoinCard(coin);

    col.appendChild(coinCard);
    row.appendChild(col);
  }

}
*/

function createCoinCard(coinData) {
  const cardDiv = document.createElement("div");
  cardDiv.className = "card mt-3 text-center";

  const img = document.createElement("img");
  img.src = coinData.imageUrl;
  img.className = "card-img-top mx-auto mt-3";
  img.style.left = "50%";
  img.style.width = "24px";
  img.style.height = "24px";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const cardTitle = document.createElement("h5");
  cardTitle.className = "card-title";
  cardTitle.innerText = coinData.amount + " " + coinData.symbol;

  const cardPrice = document.createElement("p");
  cardPrice.className = "card-footer";
  cardPrice.id = `coinPrice-${coinData.coingecko}`;
  const coinPriceValue = coinData.priceValue * coinData.amount;
  //cardPrice.setAttribute("data-price", coinPriceValue);
  cardPrice.innerText = `CHF ${coinPriceValue.toFixed(
    2
  )}\n(CHF ${coinData.priceValue.toFixed(4)})`;

  cardBody.appendChild(cardTitle);
  //cardBody.appendChild(cardAmount);

  cardDiv.appendChild(img);
  cardDiv.appendChild(cardBody);
  cardDiv.appendChild(cardPrice);

  return cardDiv;
}

function resetPriceValue(isRefresh) {
  if (isRefresh) {
    var spinner = document.createElement("i");
    spinner.className = "fa fa-spinner fa-spin";

    const paraCoinPrices = document.getElementById("paraCoinPrices");
    paraCoinPrices.innerHTML = "";
    paraCoinPrices.appendChild(spinner);

    spinner = document.createElement("i");
    spinner.className = "fa fa-spinner fa-spin";
    const profitElement = document.getElementById("profitElement");
    profitElement.innerHTML = "";
    profitElement.appendChild(spinner);
  }

  let pElements = document.getElementsByTagName("p");
  //let selectedDivs = [];
  for (let i = 0; i < pElements.length; i++) {
    if (pElements[i].id.startsWith("coinPrice-")) {
      //console.log(selectedDivs);
      if (isRefresh) {
        pElements[i].innerHTML = "";
        var spinner = document.createElement("i");
        spinner.className = "fa fa-spinner fa-spin";
        pElements[i].appendChild(spinner);
      }
      //selectedDivs.push(divs[i]);
    }
  }
  //console.log(selectedDivs);
}
// Funktion zum Sortieren der Kind-Divs absteigend anhand des "data-price"-Attributs im "p"-Element
function sortChildDivsByDataPrice() {
  const cardGroup = document.getElementById("card-group");
  const rows = Array.from(
    cardGroup.getElementsByClassName("row justify-content-center")
  );

  rows.forEach((row) => {
    const childDivs = Array.from(
      row.getElementsByClassName("col-lg-2 col-sm-6")
    );
    childDivs.sort((a, b) => {
      const priceA = parseFloat(
        a.querySelector('p[id^="coinPrice-"]').getAttribute("data-price")
      );
      const priceB = parseFloat(
        b.querySelector('p[id^="coinPrice-"]').getAttribute("data-price")
      );
      return priceB - priceA;
    });

    childDivs.forEach((div) => row.appendChild(div));
  });
}

// Beispielaufruf der Funktion zum Sortieren der Kind-Divs
sortChildDivsByDataPrice();

function SetProfitLine(text, intValue) {
  var profitCard = document.getElementById("profitCard");
  var profitElement = document.getElementById("profitElement");
  profitElement.innerText = text;

  if (intValue < 0) {
    //profitElement.style.color = "red";
    profitCard.classList.remove("bg-success");
    profitCard.classList.add("bg-danger");
  } else {
    //profitElement.style.color = "green";
    profitCard.classList.remove("bg-danger");
    profitCard.classList.add("bg-success");
  }
}

async function fetchJson(apiUrl) {
  //console.log(apiUrl);
  let response = await fetch(apiUrl);
  if (response.ok) {
    let json = await response.json();
    return json;
  } else {
    alert("HTTP-Error: " + response.status);
  }
  return "";
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function GetCryptoInfos() {
  var refreshButton = document.getElementById("refreshIcon");
  refreshButton.classList.add("fa-spin");

  await sleep(750);

  var currencies = ["chf"];

  var selectedCoins = coins.map((coin) => {
    return coin.coingecko;
  });
  console.log("selectedCoins", selectedCoins);

  var apiCoins = selectedCoins.join("%2C");
  //console.log("apiCoins", apiCoins);
  var apiCurrencies = currencies.join("%2C");
  var apiUrl =
    "https://api.coingecko.com/api/v3/simple/price?ids=" +
    apiCoins +
    "&vs_currencies=" +
    apiCurrencies;

  //console.log("apiUrl", apiUrl);

  var jsonData = await fetchJson(apiUrl);
  //console.log("jsonData", jsonData);

  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);

  var totalPrice = 0;

  selectedCoins.forEach((coinElement) => {
    var coinPriceValue = jsonData[coinElement]["chf"];

    const coinData = coins.find((c) => c.coingecko === coinElement);
    coinData.priceValue = coinPriceValue;
    const coinValueCalc = coinPriceValue * coinData.amount;
    totalPrice += coinValueCalc;
  });

  coins.sort((a, b) => {
    return b.priceValue * b.amount - a.priceValue * a.amount;
  });

  initCards();

  var sumValue = parseFloat(totalPrice).toFixed(2);
  const totalPriceElement = document.getElementById("paraCoinPrices");
  totalPriceElement.innerText = `CHF ${sumValue}`; // \n (Pro Person: CHF ${(  sumValue / 3  ).toFixed(2)})`;

  //const paraCoinPricesFooter = document.getElementById("paraCoinPricesFooter");
  //paraCoinPricesFooter.innerText = "CHF " + (sumValue / 3).toFixed(2);

  var investment = 30000;
  var percentageValue = (sumValue / investment) * 100 - 100;
  SetProfitLine(parseFloat(percentageValue).toFixed(2) + " %", percentageValue);
  refreshButton.classList.remove("fa-spin");

  //sortChildDivsByDataPrice();
}

async function RefreshData() {
  resetPriceValue(true);
  await GetCryptoInfos();
  window.scrollTo(0, document.body.scrollHeight);
}

async function RunMainScript() {
  await initCoins();
  initCards();
  await RefreshData();
}
