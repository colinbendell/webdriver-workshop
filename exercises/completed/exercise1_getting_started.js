const webdriverio = require('webdriverio');

async function main() {
    let options = {  host: "localhost",
        port: 9515,
        path: "/",
        desiredCapabilities: { browserName: 'chrome' },
        chromeOptions: {args: ["--headless"]}
    };

    let browser = webdriverio.remote(options);

    browser.init();
    try {
        browser.url('https://duckduckgo.com/');
        browser.setValue('#search_form_input_homepage', 'Mr. Dressup');
        browser.click('#search_button_homepage');
        let title = browser.getTitle();

        console.log(`DDG Search Title: ${title}`); // outputs: "DDG Search Title is: WebdriverIO (Software) at DuckDuckGo"

        // demonstrating how Wdio can switch to async / promises from synchronous mode
        await browser.getUrl()
            .then(url => browser
                    .elements('a.result__a')
                    .then(anchors => browser.elementIdClick(anchors.value[4].ELEMENT))
                    .waitUntil(() => browser.getUrl() !== url)
            );

        title = browser.getTitle();
        console.log(`4th Search Result: ${title}`);
    }
    catch (e) {
        console.error(e);
    }

    //always cleanup
    browser.end();
}

main();