const crypto = require('crypto');
const { BrowserUtils, Reporter } = require("wdio-allure-ts");

const TodoAngularPage = require('./pages/todo-angular-page');

const BASE_URL = "http://todomvc.com/";

/**
 * Exercise 3 - Add and remove entries on ToDoMVC.com
 */
describe("Exercise 3 - TodoAngularTest with POM",  function() {

    const todoValue = crypto.randomBytes(Math.ceil(10 * 3 / 4)).toString('base64').replace(/\W/g, ''); //10-ish digit random hash

    beforeEach(function() {
        Reporter.step(`navigate to ${BASE_URL}`);
        BrowserUtils.navigateToUrl(BASE_URL);
        browser.saveScreenshot();
    });

    it("Add new ToDo", function() {
        Reporter.step("Validate url");
        BrowserUtils.expectCurrentUrl(BASE_URL);

        Reporter.step("Navigate to ToDoMVC Angular implementation");
        TodoAngularPage.navigate();

        Reporter.step(`Add new todo with text ${todoValue}`);
        TodoAngularPage.addNewToDo(todoValue);

        Reporter.step("Validate new added todo is visible");
        TodoAngularPage.todo(todoValue).isVisible();
        browser.saveScreenshot();
    });

    /**
     * TearDown reporter
     */
    afterEach(function() {
        TodoAngularPage.removeAll();
        TodoAngularPage.expectListEmpty();
        browser.saveScreenshot();
    });
});