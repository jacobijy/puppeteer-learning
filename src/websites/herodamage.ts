import * as puppeteer from 'puppeteer';

interface IAzeritePowerWeights {
    [key: string]: { [key: string]: string };
}

const classesWithAzerites: { [key: string]: string[] } = Object.freeze({
    'death-knight': ['blood', 'frost', 'unholy'],
    'mage': ['arcane', 'frost', 'fire'],
    'demon-hunter': ['havoc', 'vengeance'],
    'druid': ['balance', 'feral', 'guardian'],
    'hunter': ['beast-mastery', 'marksmanship', 'survival'],
    'monk': ['brewmaster', 'windwalker'],
    'paladin': ['protection', 'retribution'],
    'priest': ['shadow'],
    'rogue': ['assassination', 'outlaw', 'subtlety'],
    'shaman': ['elemental', 'enhancement'],
    'warlock': ['affliction', 'demonology', 'destruction'],
    'warrior': ['arms', 'fury']
});

const azeritePowerWeights: IAzeritePowerWeights = {};

const GameTier = Object.freeze('1t-t22');

export default async function getHeroDamageInfo(browser: puppeteer.Browser) {
    const page = await browser.newPage();
    const array = Object.keys(classesWithAzerites).reduce((prev: string[][], value, index) => {
        let profession = classesWithAzerites[value];
        return prev.concat(profession.map(pro => [value, pro]));
    }, []);
    // const readPage = async (value: string[])=> {
    //     let className = value[1];
    //     let professionex = value[0];
    //     let url = `https://www.herodamage.com/${professionex}/azerite-levels/${GameTier}-${className}`;
    //     await page.goto(url);
    //     let result = await page.evaluate(() => {
    //         let texaArea: HTMLTextAreaElement = document.querySelector('#azerite-power-weights');
    //         return texaArea.value;
    //     });
    //     if (!azeritePowerWeights[professionex]) {
    //         Object.assign(azeritePowerWeights, { [professionex]: { [className]: result } });
    //     }
    //     else {
    //         Object.assign(azeritePowerWeights[professionex], { [className]: result });
    //     }
    // };
    for await (let value of array) {
        let className = value[1];
        let professionex = value[0];
        let url = `https://www.herodamage.com/${professionex}/azerite-levels/${GameTier}-${className}`;
        try {
            await page.goto(url, { timeout: 0 });
            let result = await page.evaluate(() => {
                let texaArea: HTMLTextAreaElement = document.querySelector('#azerite-power-weights');
                return texaArea.value;
            });
            if (!azeritePowerWeights[professionex]) {
                Object.assign(azeritePowerWeights, { [professionex]: { [className]: result } });
            }
            else {
                Object.assign(azeritePowerWeights[professionex], { [className]: result });
            }
        } catch (error) {
            console.log(error);
            continue;
        }
    }
    // for (let index = 0; index < array.length; index++) {
    //     // await readPage(array[index]);
    //     const pros = array[index];
    //     let className = pros[1];
    //     let professionex = pros[0];
    //     let url = `https://www.herodamage.com/${professionex}/azerite-levels/${GameTier}-${className}`;
    //     await page.goto(url);
    //     let result = await page.evaluate(() => {
    //         let texaArea: HTMLTextAreaElement = document.querySelector('#azerite-power-weights');
    //         return texaArea.value;
    //     });
    //     if (!azeritePowerWeights[professionex]) {
    //         Object.assign(azeritePowerWeights, { [professionex]: { [className]: result } });
    //     }
    //     else {
    //         Object.assign(azeritePowerWeights[professionex], { [className]: result });
    //     }
    // }
}

export { azeritePowerWeights };
