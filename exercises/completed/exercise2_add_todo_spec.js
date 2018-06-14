const crypto = require('crypto');

const expect = require('chai').expect;

/**
 * Exercise 2 - Add and remove entries on ToDoMVC.com
 */
describe("Exercise 2 - TodoAngularTest", function() {
    const todoValue = crypto.randomBytes(Math.ceil(10 * 3 / 4)).toString('base64').replace(/\W/g, ''); //10-ish digit random hash

    it("Should launch TodoMVC.com", function() {
        let destUrl = browser.url('http://todomvc.com/').getUrl();
        expect(destUrl).to.equal('http://todomvc.com/');
    });

    it("Should navigate to TodoMVC Angular implementation", function() {
        browser.click('=AngularJS');
        browser.waitUntil(() => /angularjs/.test(browser.getUrl()));

        let angularUrl = browser.url('http://todomvc.com/examples/angularjs/#/').getUrl();
        expect(angularUrl).to.equal('http://todomvc.com/examples/angularjs/#/'); // bad pattern

    });
    it("Should be ready for input", function() {
        browser.waitForExist("#new-todo");
        let visible = browser.isVisible("#new-todo");
        expect(visible).to.be.true;
    });

    it(`should add new todo with text '${todoValue}'`, function() {
        browser.addValue("#new-todo", `${todoValue}\uE007`);
        let newTodoVisible = browser.isVisible(`//*[contains(@ng-repeat,'todo in todos ') and descendant-or-self::*[text()='${todoValue}']]`);
        expect(newTodoVisible).to.be.true;
    });

    /**
     * TearDown reporter
     */
    after(function() {
        browser.click("//section[@id='main']//input[@id='toggle-all']");
        browser.click("//button[@id='clear-completed']");

        let clearButtonVisible = browser.isVisible("//button[@id='clear-completed']");
        expect(clearButtonVisible).to.be.false;

    });
});