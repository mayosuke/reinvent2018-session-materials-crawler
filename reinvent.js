'use strict';

const puppeteer = require('puppeteer');
const [,, ...searchWords] = process.argv;

(async () => {
    // console.log(`searchWords: ${searchWords}`);
    const browser = await puppeteer.launch();

    const url = `https://www.portal.reinvent.awsevents.com/connect/search.ww#loadSearch-searchPhrase=${searchWords.join('+')}&searchType=session&tc=0&sortBy=abbreviationSort&p=`
    // console.log(`loading URL: ${url}`);
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle2'});
    let sessionCount = 0;
    while (true) {
        const currentCount = await page.evaluate(_ => {
            return document.querySelectorAll('.sessionRow').length;
        });
        // console.log(`session count: ${currentCount}`);
        if (sessionCount == currentCount) {
            break;
        }
        sessionCount = currentCount;
        await page.evaluate(_ => {
            document.querySelector('#getMoreResults').click();
        });
        await page.waitFor(1000);
    }
    const sessionWithMaterialsUrls = await page.evaluate(_ => {
        var sessionWithMaterials = document.querySelectorAll('.sessionRow > div > a > .title > .sessionVideo');
        var links = [];
        for (var i = 0; i < sessionWithMaterials.length; i++) {
            links.push(sessionWithMaterials[i].parentElement.parentElement.href);
        }
        return links;
    });
    // console.log(sessionWithMaterialsUrls.join('\n'));

    const sessions = [];
    for (let i = 0; i < sessionWithMaterialsUrls.length; i++) {
        const url = sessionWithMaterialsUrls[i];
        await page.goto(url, {waitUntil: 'networkidle2'});
        const session = await page.evaluate(_ => {
            var mediaList = [];
            for (var i = 0; i < document.querySelectorAll('#mediaList > li > a').length; i++) {
                mediaList.push({
                    type: document.querySelectorAll('#mediaList > li > a')[i].innerText.includes('PowerPoint Presentation') ? 'Slide' : 'Video',
                    url: document.querySelectorAll('#mediaList > li > a')[i].getAttribute('data-url')
                });
            }
            return {
                title: document.querySelector('.detailHeader > h1').innerText,
                abstract: document.querySelector('#abstract').innerText,
                media: mediaList
            }
        });
        session.sessionUrl = url;
        sessions.push(session);
    };
    console.log(JSON.stringify(sessions));

    await browser.close();
})();
