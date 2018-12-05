import * as puppeteer from 'puppeteer';
import * as fs from 'fs';

let url = 'https://exhibitors.electronica.de/onlinecatalog/2018/Exhibitors';

export default async function getExhibitors(browser: puppeteer.Browser) {
    console.time('begin');
    const page = await browser.newPage();
    await page.goto(url, { timeout: 0 });
    const confirmCookie = await page.$('.jl_ckdatabutar');
    await confirmCookie.click();
    let tipPerPage = await page.$$('.pagRowsSubmit');
    await tipPerPage[2].click();
    await page.waitForNavigation({ timeout: 0 });
    let maxPage = await page.evaluate(() => {
        let maxInput = (document.querySelector('.paging_textSubmit.SRFieldSubmiter') as HTMLInputElement).value;
        return parseInt(maxInput, 10);
    });
    let companyInfo = {};
    for (let pageNum = 1; pageNum <= maxPage; pageNum++) {
        console.log('page', pageNum, '/', maxPage);
        try {
            if (pageNum !== 1) {
                let selector = '.vam.paging_textArrows.SRFieldSubmiter.jl_p_act.jl_p_actnext.showToolTip';
                let btnNextPage = await page.$(selector + '[type="submit"]');
                await btnNextPage.click();
                await page.waitForNavigation({ timeout: 0 });
            }
            let pageInfo = await getData();
            companyInfo = { ...companyInfo, ...pageInfo };
        } catch (error) {
            console.log('button error', error);
        }
    }
    await fs.promises.writeFile('./electronica.json', JSON.stringify(companyInfo, null, '\t'));
    console.timeEnd('begin');
    console.log(companyInfo);
    async function getData() {
        try {
            let result = await page.evaluate(() => {
                const info = {};
                let selector = '.jl_lsectionsub.jl_lgroupsub.jl_lentriedivcolor';
                let divs: NodeListOf<HTMLDivElement> = document.querySelectorAll(selector);
                for (const div of divs) {
                    let divName: HTMLDivElement = div.querySelector('.jl_lexname');
                    let divAddr = div.querySelector('.jl_lexadr').children[0];
                    let divDesc = div.querySelector('.jl_lspcTextDiv');
                    let companyAddr = divAddr ? divAddr.textContent : '';
                    let companyDesc = divDesc ? divDesc.textContent : '';
                    let companyName = divName ? divName.textContent : '';
                    let compurl = (divName.children[0] as HTMLAnchorElement).href;
                    Object.assign(info, {
                        [companyName]: {
                            url: compurl,
                            address: companyAddr,
                            description: companyDesc
                        }
                    });
                }
                return info;
            });
            return result;
        } catch (error) {
            console.log(error);
        }
    }
}
