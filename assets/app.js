//Array containing all the symbols from the URL
const validationList = [];
// Array containing original stock list
const stocksList = ["AVB", "XOM", "LMT", "BA"];

//The ajax call that retrieves symbols and populates the validationList array
$.ajax({
    url: "https://api.iextrading.com/1.0/ref-data/symbols",
    method: "GET"
}).then(function(result) {
    // console.log(result);
    for (let i = 0; i < result.length; i++) {
        validationList.push(result[i].symbol);
    }
    // console.log(validationList);
});


//showInfo function re-displays the HTML to display the correct content
const showInfo = function() {
    // Grab the stock symbol from the button clicked and add it to the queryURL
    const stock = $(this).attr('data-name');
    const queryURLDisplay = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news&range=5y&last=10`;

    // The ajax method that will retrieve the display info for the button
    $.ajax({
        url: queryURLDisplay,
        method: "GET"
    }).then(function(result) {
        console.log(result);
        // This 'div' holds the stock
        const stocksDiv = $("<div>").addClass("stocksClass card");
        // This variable stores the company name
        const companyName = result.quote.companyName;
        // Creating an element to display the company name
        const name = $("<p>").text(`Company Name: ${companyName}`).addClass("card-header bg-secondary text-white");
        // Appending the name to our stocksDiv
        stocksDiv.append(name);
        // This variable stores the stock symbol
        const stockSymbol = result.quote.symbol;
        // Creating an element to display the stock symbol
        const symbol = $("<p>").text(`Stock Symbol: ${stockSymbol}`).addClass("card-header");
        // Appending the symbol to our stockDiv
        stocksDiv.append(symbol);
        // Storing the price
        const stockPrice = result.quote.latestPrice;
        // This variable stores the price 
        const price = $("<p>").text(`Stock Price: $${stockPrice}`).addClass("card-header");
        // Appending the price to our stocksDiv
        stocksDiv.append(price);
        //Array to store the news summaries
        const companyNews = [];
        // for loop to fill up the array
        for (let r = 0; r < result.news.length; r++) {
            companyNews.push(result.news[r].summary);
        }
        //for loop to append the summaries to stocksDiv
        for (let s = 0; s < companyNews.length; s++) {
            stocksDiv.append($("<p>").text(`News Summary: ${companyNews[s]}`).addClass("card-body"));
        }
        // Finally adding the stocksDiv to the DOM
        $("#stocksView").prepend(stocksDiv);
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
        //Adding an id attribute
        newButton.attr("id", "stkButton");
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
    //for loop to check presence of new stock
    for (let a = 0; a < validationList.length; a++) {
        if (validationList[a] === newStock && !stocksList.includes(newStock)) {
            // The new stock from the textbox is then added to our array
            // if found in validationList
            stocksList.push(newStock);
        } else {
            if (validationList[a] === newStock && stocksList.includes(newStock)) {
                // displays a modal if an item is already present
                $("#inputModal").modal();
            }
        }
    }
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