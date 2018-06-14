# Exercise 1: Basic navigation

1. With WebDriver.io, open a chrome window and navigate to https://duckduckgo.com. A few hints:
    * use `.remote(yourWebDriverOptions)` to setup the wdio connection
    * call `.init()` then `.url(yourUrl)` to start the process
2. Enter a search term in the input box (eg: 'Mr. Dress-up')
3. click on the search button
4. write the title to the console
5. close the browser window using `.end()` [Hint: dont forget to catch any uncalled promises]

Bonus: 
5. Find the 4th search result and navigate to this destination

# Selectors

* `#search_form_input_homepage` - Search input field
* `#search_button_homepage` - Search button
* `.result__a` (or more accurately `a.result__a`) - all results have the css class `result__a`