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
        prev = prev.concat(profession.map(pro => [value, pro]));
        return prev;
    }, []);
    for (let index = 0; index < array.length; index++) {
        const pros = array[index];
        let className = pros[1];
        let professionex = pros[0];
        let url = `https://www.herodamage.com/${professionex}/azerite-levels/${GameTier}-${className}`;
        await page.goto(url);
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
    }
    // Object.keys(classesWithAzerites).forEach(key => {
    //     let classes = classesWithAzerites[key];
    //     classes.forEach(async className => {
    //         let url = `https://www.herodamage.com/${key}/azerite-levels/${GameTier}-${className}`;
    //         await page.goto(url);
    //         let result = await page.evaluate(() => {
    //             let texaArea: HTMLTextAreaElement = document.querySelector('#azerite-power-weights');
    //             return texaArea.value;
    //         });
    //         azeritePowerWeights[key][className] = result;
    //     });
    // });
    // await page.goto(url);
}

export { azeritePowerWeights };
