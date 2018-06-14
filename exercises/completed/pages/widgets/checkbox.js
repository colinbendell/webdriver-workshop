const { BrowserUtils, Reporter} = require("wdio-allure-ts");

/**
 * CheckBox widget
 */
class CheckBox {
    constructor(selector) {
        this._selector = selector;
    }

    /**
     * Click CheckBox
     */
    click() {
        Reporter.debug("Will click check box");
        return BrowserUtils.click(this._selector);
    }
}

module.exports = CheckBox;