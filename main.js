$(document).ready(init);

function init(){
  $('.search').submit(lookup);
  $('.stocks').on("click", ".card", store);
  $('.render-stocks').on("click", ".details", remove);
  displayQuotes();
}

function displayQuotes() {
  var stocks = Storage.get();
  stocks.forEach(function(stock){
    var searchKey = stock.split("-").shift();
    $.getJSON(`http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=${searchKey}&callback=?`)
    .done(function(data) {
      renderStocks(data);
    })
    .fail(function(err) {
      console.error('err: ', err);
    })
  });

}

function remove() {
  var index = $(this).index();
  var stocks = Storage.get();
  stocks.splice(index, 1);
  Storage.set(stocks);
}

function renderStocks(data){
  var $card = $('<tr>').addClass('details');
  var $symbol = $('<td>').text(data.Symbol);
  var $high = $('<td>').text(data.High);
  var $low = $('<td>').text(data.Low);
  var $lastPrice = $('<td>').text(data.LastPrice);
  var $minus = $('<td><a>').addClass("glyphicon glyphicon-minus");

  $card.append($symbol, $high, $low, $lastPrice, $minus);
  $('.render-stocks').append($card);
}
// Storage

var Storage = {
  get: function() {
    try {
      var stocks = JSON.parse(localStorage.stocks);
    } catch (err) {
      var stocks = [];
    }
    return stocks;
  },
  set: function(stocks) {
    localStorage.stocks = JSON.stringify(stocks);
  }
};

// store() function

function store() {
  var stocks = Storage.get();
  newStock = $(this).data("stock-data");
  if(stocks.indexOf(newStock) < 0) {
    stocks.push(newStock);
  }
  Storage.set(stocks);
}

// lookup() function

function lookup(event) {
  event.preventDefault();
  $('.card').remove();
  var searchKey = $('.searchBar').val();

  $.getJSON(`http://dev.markitondemand.com/MODApis/Api/v2/Lookup/jsonp?input=${searchKey}&callback=?`)
  .done(function(data) {
    var stockArr = data;
    var $stockCards = stockArr.map(makeStockCard);
    $('.stocks').append($stockCards);
  })
  .fail(function(err) {
    console.error('err: ', err);
  })
}

function makeQuoteCard(stock) {
  var $card = $('<div>').addClass('quote-card').data("quote-data", stockData);

}

// makeStockCard() function

function makeStockCard(obj) {
  var stockData = obj.Symbol + '-' + obj.Exchange;
  var $card = $('<tr>').addClass('card').data("stock-data", stockData);
  var $symbol = $('<td>').text(obj.Symbol);
  var $name = $('<td>').text(obj.Name);
  var $exchange = $('<td>').text(obj.Exchange);
  var $plus = $('<td><a>').addClass("glyphicon glyphicon-plus");

  $card.append($symbol, $name, $exchange, $plus);
  return $card;
}
