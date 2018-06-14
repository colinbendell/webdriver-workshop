const expect = require('chai').expect;

const BASE_URL = "https://amazon.com/";

/**
 * Exercise 3 - Add and remove entries on ToDoMVC.com
 */
describe("Exercise 5 - Performance Budget",  function() {
    it(`should load ${BASE_URL}`, function() {
        browser.url(BASE_URL);
        browser.saveScreenshot();
    });

    it("should be fully loaded with performance entries", function() {
        browser.waitUntil(() => {
            let length = browser.execute(() => window.performance.getEntries().length);
            return length.value > 50;
        });
        let entries = browser.execute(() => window.performance.getEntries());
        expect(entries.length).to.be.above(300);
    });

    it('should be less than 2MB downloaded', function() {
        let entries = browser.execute(() => window.performance.getEntries());
        let bytes = entries.value
            .filter(v => v.entryType === 'resource')
            .reduce((p, c) => p += c.transferSize || 0, 0);
        expect(bytes).to.be.below(2*1024*1024);
    });

    it('should have DOM complete in less than 2s', function() {
        let timing = browser.execute(() => window.performance.timing);

        let bytes = entries.value
            .filter(v => v.entryType === 'resource')
            .reduce((p, c) => p += c.transferSize || 0, 0);
        expect(bytes).to.be.below(2*1024*1024);
    });

});