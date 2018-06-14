const { BrowserUtils, Reporter, SpecialKeys} = require("wdio-allure-ts");

/**
 * TextBox widget
 */
class TextBox {
    constructor(selector) {
        this._selector = selector;
    }

    /**
     * Add value passed to function and add 'Enter' to submit the text
     * @param value value to add to text box
     */
    addValue(value) {
        Reporter.debug("Will add text to text box");
        return BrowserUtils.sendText(this._selector, `${value}${SpecialKeys.Enter}`);
    }
}

module.exports = TextBox;