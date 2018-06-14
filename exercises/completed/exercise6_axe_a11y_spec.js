const axeSource = require('axe-core').source;
const expect = require('chai').expect;

const BASE_URL = "https://amazon.com/";

/**
 * Exercise 3 - Add and remove entries on ToDoMVC.com
 */
describe("Exercise 6 - AXE-Core A11y checker",  function() {


    it("should have performance entries", function() {
        browser.url(BASE_URL);
        // add axe to the browser
        browser.execute(axeSource);

        const axeBrowserInit = async function () {
            // run axe in the browser context
            return await axe.run().catch(e => e);
            // axe.run(function (err, results) {
            //     if (err) done(err);
            //     done(results);
            // });
        };

        // run inside browser and get results
        let results = browser.execute(axeBrowserInit);

        expect(results.value.violations).to.be.an('array').that.is.empty;

    });

});