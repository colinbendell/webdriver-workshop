const { BrowserUtils, Reporter } = require("wdio-allure-ts");

/**
 * Button widget
 */
class Button {
    constructor(selector) {
        this._selector = selector;
    }

    /**
     * Click the button
     */
    click() {
        Reporter.debug("Will click button");
        return BrowserUtils.click(this._selector);
    }

    /**
     * Validate button not visible
     */
    notVisible() {
        Reporter.debug("Validate button not visible");
        return BrowserUtils.notVisible(this._selector);
    }
}

module.exports = Button;