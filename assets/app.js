// company name, logo, price, and up to 
// 10 news articles related to the stock from the iexTrading


//Array containing all the symbols from the URL
//There are over 8000 of them
const validationList = [];
// Array containing original stock list
const stocksList = ["AVB", "XOM", "LMT", "BA"];

// https: //api.iextrading.com/1.0/stock/${stock}/ batch?types=quote,news,chart&range=1m&last=1
//     https: //api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news&range=1m&last=1

//showInfo function re-displays the HTML to display the correct content
// const validateInfo = function() {
const queryURLAllsymbol = "https://api.iextrading.com/1.0/stock/ref-data/symbols";
// The ajax method that will retrieve the display info for the button
$.ajax({
    url: queryURLAllsymbol,
    method: "GET"
}).then(function(result) {
    console.log(result);
    const allSymbols = result.quote.symbol;
    validationList.push(allSymbols);
    console.log(validationList);
    // if input.val === validationList[k]
    // /ref-data/symbols
});
// }

//showInfo function re-displays the HTML to display the correct content
const showInfo = function() {
    // Grab the stock symbol from the button clicked and add it to the queryURL
    const stock = $(this).attr('data-name');
    const queryURLDisplay = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news&range=1m&last=1`;

    // The ajax method that will retrieve the display info for the button
    $.ajax({
        url: queryURLDisplay,
        method: "GET"
    }).then(function(result) {
        console.log(result);
        // This 'div' holds the stock
        const stocksDiv = $("<div>").addClass("stocksClass");
        // This variable stores the company name
        const companyName = result.quote.companyName;
        // Creating an element to display the company name
        const name = $("<p>").text(`Company Name: ${companyName}`);
        // Appending the name to our stocksDiv
        stocksDiv.append(name);
        // This variable stores the stock symbol
        const stockSymbol = result.quote.symbol;
        // Creating an element to display the stock symbol
        const symbol = $("<p>").text(`Stock Symbol: ${stockSymbol}`);
        // Appending the symbol to our stockDiv
        stocksDiv.append(symbol);
        // Storing the price
        const stockPrice = result.quote.latestPrice;
        // This variable stores the price 
        const price = $("<p>").text(`Stock Price: $${stockPrice}`);
        // Appending the price to our stocksDiv
        stocksDiv.append(price);
        // Storing the first news summary
        const companyNews = result.news[0].summary;
        // Creating an element to display the news summary
        const summaryHolder = $("<p>").text(`News Headline: ${companyNews}`);
        // Appending the summary to our stocksDiv
        stocksDiv.append(summaryHolder);
        // Finally adding the stocksDiv to the DOM
        $("#stocksView").append(stocksDiv);
    });
}

// The function that displays button data
const display = function() {
    // Deleting the stocks prior to adding new stocks
    $("#buttonsView").empty();
    // for loop
    for (let k = 0; k < stocksList.length; k++) {
        // Dynamic generation of buttons for each stock
        const newButton = $("<button>");
        // Adding a class of stockButton to the button
        newButton.addClass("stockButton");
        // Adding a data-attribute
        newButton.attr("data-name", stocksList[k]);
        // Providing the initial button text
        newButton.text(stocksList[k]);
        // Adding the button to the buttons-view div
        $("#buttonsView").append(newButton);
    }
}

// Event handler for button clicks
const addButton = function(event) {
    // We're using a form so that the user can hit enter instead of clicking the button if they want
    event.preventDefault();
    // This line will grab the text from the input box
    const newStock = $("#stockInput").val().trim().toUpperCase();
    // The stock from the textbox is then added to our array
    stocksList.push(newStock);
    // Deletes the contents of the input
    $("#stockInput").val("");
    // calling display which handles the processing of the stocksList array
    display();
}

// Even listener for #add-stock button
$("#addStock").on("click", addButton);

// Adding a click event listener to all elements with a class of 'stockButton'
$("#buttonsView").on("click", ".stockButton", showInfo);

// Calling the display function to display the intial buttons
display();