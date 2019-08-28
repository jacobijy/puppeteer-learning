import { Browser } from 'puppeteer';
import { getUrl, pages } from './commonFunc';

export async function getAllWarshipNames(browser: Browser) {
    let url = getUrl(pages.illustrated);
    let page = await browser.newPage();
    await page.goto(url, { timeout: 0 });
    return await page.evaluate(() => {
        let shipClasses: string[] = []
        for (let i = 1; i <= 12; i++) {
            let li = document.getElementById(i.toString());
            shipClasses.push(li.textContent);
        }
        let divContentbox2 = document.querySelector('#Contentbox2');
        let divs = divContentbox2.children;
        const namesJson = {};
        for (let index = 0; index < divs.length; index++) {
            if (divs.hasOwnProperty(index)) {
                let names = [];
                const div = divs[index];
                let tbody = div.querySelector<HTMLTableSectionElement>('table>tbody');
                let divsEx = tbody.children[1].querySelector('td').children;
                for (const nameDiv of divsEx) {
                    let nameTbody = nameDiv.querySelector('table>tbody');
                    let a = nameTbody.children[1].querySelector('td>a');
                    let shipName = a.textContent;
                    if (shipName.includes('.改')) {
                        shipName = shipName.replace('.改', '')
                    }
                    names.push(shipName);
                }
                Object.assign(namesJson, { [shipClasses[index]]: names });
            }
        }
        return namesJson;
    })
}
