const browserUtils = require("wdio-allure-ts").BrowserUtils;

/**
 * fd
 */
class ToDoItem {
    constructor(todoValue) {
        this._selector = `//*[contains(@ng-repeat,'todo in todos ') and descendant-or-self::*[text()='${todoValue}']]`;
    }

    isVisible() {
        browserUtils.isVisible(this._selector);
    }
}

module.exports = ToDoItem;