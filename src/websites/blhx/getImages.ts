import { Browser } from 'puppeteer';
import axios from 'axios';
import * as fs from 'fs';
import { getUrl, pages } from './commonFunc';

// 获取loading图
export async function getLoadingImg(browser: Browser) {
    let page = await browser.newPage();
    await page.goto(getUrl(pages.picture), { timeout: 0 });
    // page.$(a)
    let imgURL: string[] = await page.evaluate(() => {
        let imgURL: string[] = []
        let selectorId = '#mc_collapse-2';
        let loadingImageDiv = document.querySelector<HTMLDivElement>(selectorId);
        let images = loadingImageDiv.querySelectorAll('img');
        images.forEach((value, index) => {
            let url = value.src;
            // let reg = /http\:\/\/p[0-9].qhimg.com\/dr\/120__\/(*)/;
            url = url.replace('dr/120__/', '');
            imgURL.push(url);
        })
        // loadingImageDiv.childNodes.forEach()
        // imgUrlList.forEach(e => {
        //     imgURL.push(e.href)
        // })
        return imgURL;
    });
    await console.log(imgURL);
    let currentNumber = 0;
    imgURL.forEach((url, index) => {
        //console.log(e)
        if (currentNumber === 200) {
            browser.close();
            console.log('All pictures downloaded complete!')
            return
        }
        axios.get(url, {
            responseType: 'stream'
        }).then(res => {
            res.data.pipe(fs.createWriteStream(`./images/blhx${currentNumber}.${url.substr(url.length-3)}`));
            currentNumber++;
        })
    });
}
