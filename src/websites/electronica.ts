import * as puppeteer from 'puppeteer';

let url = 'https://exhibitors.electronica.de/onlinecatalog/2018/Exhibitors';

export default async function getExhibitors(browser: puppeteer.Browser) {
    const page = await browser.newPage();
    await page.goto(url, { timeout: 0 });
    let maxPage = await page.evaluate(() => {
        let maxInput = document.querySelector('.paging_textSubmit.SRFieldSubmiter')[0].value;
        return parseInt(maxInput, 10);
    });
    let pageNum = 1;
    let btnNextPage = await page.$('.vam.paging_textArrows.SRFieldSubmiter.jl_p_act.jl_p_actnext.showToolTip[type="submit"]');
    if (pageNum !== 1) {
        btnNextPage.click();
    }
    async function getData() {
        try {
            let result = await page.evaluate(() => {
                const companyInfo = {};
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
                    Object.assign(companyInfo, {
                        [companyName]: {
                            url: compurl,
                            address: companyAddr,
                            description: companyDesc
                        }
                    });
                }
                return companyInfo;
            });
            return result;
        } catch (error) {
            console.log(error);
        }
    }
}
