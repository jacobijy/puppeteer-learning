import * as puppeteer from 'puppeteer';
import * as fs from 'fs';

let url = 'https://exhibitors.electronica.de/onlinecatalog/2018/Exhibitors';
let newUrl = new URL('https://exhibitors.electronica.de/onlinecatalog/2018/Exhibitors');

export default async function getExhibitors(browser: puppeteer.Browser) {
    console.time('begin');
    const page = await browser.newPage();
    await page.goto(url, { timeout: 0 });
    const confirmCookie = await page.$('.jl_ckdatabutar');
    await confirmCookie.click();
    let tipPerPage = await page.$$('.pagRowsSubmit');
    await tipPerPage[2].click();
    await page.waitForNavigation({ timeout: 0 });
    // URL
    let maxPage = await page.evaluate(() => {
        let maxInput = document.querySelector<HTMLInputElement>('.paging_textSubmit.SRFieldSubmiter').value;
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
    let newPage = await browser.newPage();
    for (const key in companyInfo) {
        if (companyInfo.hasOwnProperty(key)) {
            const pageInfo = companyInfo[key];
            await newPage.goto(pageInfo.url, { timeout: 0 });
            let detail = await getCompanyDetail();
            Object.assign(pageInfo, detail);
        }
    }
    await fs.promises.writeFile('./electronica.json', JSON.stringify(companyInfo, null, '\t'));
    console.timeEnd('begin');
    async function getData() {
        try {
            let result = await page.evaluate(() => {
                const info = {};
                let selector = '.jl_lsectionsub.jl_lgroupsub.jl_lentriedivcolor';
                let divs = document.querySelectorAll<HTMLDivElement>(selector);
                for (const div of divs) {
                    let divName = div.querySelector<HTMLDivElement>('.jl_lexname');
                    let divAddr = div.querySelector('.jl_lexadr').children[0];
                    let divDesc = div.querySelector('.jl_lspcTextDiv');
                    let companyAddr = divAddr ? divAddr.textContent : '';
                    let companyDesc = divDesc ? divDesc.textContent : '';
                    let companyName = divName ? divName.textContent : '';
                    let compurl = divName.querySelector('a').href;
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
    async function getCompanyDetail() {
        try {
            let detail = newPage.evaluate(() => {
                const info = {};
                const applications = [];
                let applicationDivs = document.querySelectorAll<HTMLDivElement>('.jl_dtdestarea');
                for (const app of applicationDivs) {
                    applications.push(app.textContent);
                }
                return info;
            });
            let tipsHover = await newPage.$$('.jl_anwarea>.jl_anw_1_ges_akt.showToolTip');
            const applicationsTypes = [];
            for await (const tip of tipsHover) {
                await tip.hover();
                let result = await newPage.evaluate(() => {
                    let divElement = document.querySelector<HTMLDivElement>('#tiptip_holder');
                    let tipContent = divElement.querySelector<HTMLDivElement>('#tiptip_content');
                    return tipContent.textContent;
                })
                console.log(result);
                applicationsTypes.push(result);
            }
            return { detail, applicationsTypes };
        } catch (error) {
            console.log(error);
        }
    }
}
