import * as puppeteer from 'puppeteer';
import chalk from 'chalk';
import { formatProgress } from './utils/progress';
import { getLoadingImg } from './websites/blhx/getImages'
import './mysql';
import getAcitivityInfo from './websites/blhx/getActivityInfos';
import { getWarshipInfo } from './websites/blhx/getWarshipInfo';

// String.prototype.
process.setMaxListeners(50);
const log = console.log;
const TOTAL_PAGE = 50;
const platform = process.platform;

let args = process.argv.splice(2);

// 定义要爬去的数据结构
interface WriteData {
    link: string; // 爬取到的商品详情链接
    picture: string; // 爬取到的图片链接
    price: number; // 价格，number类型，需要从爬取下来的数据进行转型
    title: string; // 爬取到的商品标题
}

interface RentData {
    topicId: number;
    url: string;
    title: string;
    author: string;
    authorUrl: string;
    count: number;
    time: string;
}

async function logIntoTaobao(browser: puppeteer.Browser) {
    const page = await browser.newPage();
    let url = 'https://login.taobao.com/member/login.jhtml';
    await page.goto(url);
    const btnChange2Static = await page.$('#J_Quick2Static');
    await btnChange2Static.click();
    const inputUserName = await page.$('#TPL_username_1');
    const inputPassword = await page.$('#TPL_password_1');
    // const submit = await page.$('#J_SubmitStatic');
    log(inputUserName);
    log(inputPassword);
    await inputUserName.type('kawaii_roy');
    await inputPassword.type('11050622jyqdt');
    const slide = await page.$('.nc_iconfont.btn_slide');
    // await page.mouse.move(slide.x, 0);
    await page.mouse.down();
    await slide.click({ delay: 1500 });
    // submit.click();
}

async function getDoubanRentInfo(browser: puppeteer.Browser) {
    const page = await browser.newPage();
    let url = 'https://www.douban.com/group/shanghaizufang/';
    await page.goto(url);

    const data = await page.evaluate(() => {
        const result: RentData[] = [];
        let table = document.querySelectorAll('.olt')[0];
        let list = table.children[0].children;
        for (const tr of list) {
            if (tr.className === 'th') {
                continue;
            }
            let tdlist = tr.querySelectorAll('td');
            let tdUrl = tdlist[0];
            let uri = tdUrl.querySelector('a').href;
            let reg = /https:\/\/www.douban.com\/group\/topic\/([0-9]+)\//;
            let topicId = parseInt(uri.match(reg)[1], 10);
            let title = tdUrl.querySelector('a').innerText;
            let author = tdlist[1];
            let authorUrl = author.querySelector('a').href;
            let authorName = author.querySelector('a').innerText;
            let count = parseInt(tdlist[2].innerText, 10);
            let time = tdlist[3].innerText;
            result.push({ topicId, url: uri, title, author: authorName, authorUrl, count, time });
        }
        return result;
        // table.children
    });
    log(data);
}

// 进入代码的主逻辑
async function main() {
    // 首先通过Puppeteer启动一个浏览器环境
    const browser = await puppeteer.launch({
        // 设置超时时间
        timeout: 300000,
        // 如果是访问https页面 此属性会忽略https错误
        ignoreHTTPSErrors: true,
        // 打开开发者工具, 当此值为true时, headless总为false
        devtools: false,
        // 关闭headless模式, 不会打开浏览器
        headless: platform === 'linux',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: {
            width: 1200,
            height: 800
        }
    });
    log(chalk.green('服务正常启动'));
    switch(args[0]) {
        case 'spex':
            await getAcitivityInfo(browser);
            break;
        case 'warships':
            await getWarshipInfo(browser, '');
            break;
        case 'bg':
            await getLoadingImg(browser);
            break;
    }
    await browser.close();
    return;
    // 使用 try catch 捕获异步中的错误进行统一的错误处理

    // await logIntoTaobao(browser);
    // await getDoubanRentInfo(browser);
    // await getExhibitors(browser);
    // await browser.close();
    // try {
    //     await getHeroDamageInfo(browser);
    //     log(azeritePowerWeights);
    //     await promises.writeFile('./herodamage.json', JSON.stringify(azeritePowerWeights, null, '\t'));
    //     await browser.close();
    // } catch (error) {
    //     log(error);
    //     browser.close();
    // }
    // 打开一个新的页面
    const page = await browser.newPage();
    // 监听页面内部的console消息
    page.on('console', msg => {
        if (typeof msg === 'object') {
            console.dir(msg);
        } else {
            log(chalk.blue(msg));
        }
    });

    // 打开我们刚刚看见的淘宝页面
    let url = 'https://s.taobao.com/search?q=gtx2080ti&imgfile=&js=1&stats_click=search_radio_all%3A1&initiative_id=staobaoz_20181109&ie=utf8';
    await page.goto(url);
    log(chalk.yellow('页面初次加载完毕'));

    // 使用一个 for await 循环，不能一个时间打开多个网络请求，这样容易因为内存过大而挂掉
    for (let i = 1; i <= TOTAL_PAGE; i++) {
        // 找到分页的输入框以及跳转按钮
        const pageInput = await page.$(`.J_Input[type='number']`);
        const submit = await page.$('.J_Submit');
        // 模拟输入要跳转的页数
        await pageInput.type('' + i);
        // 模拟点击跳转
        await submit.click();
        // 等待页面加载完毕，这里设置的是固定的时间间隔，之前使用过page.waitForNavigation()，
        // 但是因为等待的时间过久导致报错（Puppeteer默认的请求超时是30s,可以修改）,因为这个页面总有一些不需要的资源要加载，
        // 而我的网络最近日了狗，会导致超时，因此我设定等待2.5s就够了
        await page.waitFor(2500);

        // 清除当前的控制台信息
        console.clear();
        // 打印当前的爬取进度
        log(chalk.yellow(formatProgress(i)));
        log(chalk.yellow('页面数据加载完毕'));

        // 处理数据，这个函数的实现在下面
        await handleData();
        // 一个页面爬取完毕以后稍微歇歇，不然太快淘宝会把你当成机器人弹出验证码（虽然我们本来就是机器人）
        await page.waitFor(2500);
    }

    // 所有的数据爬取完毕后关闭浏览器
    await browser.close();
    log(chalk.green('服务正常结束'));

    // 这是一个在内部声明的函数，之所以在内部声明而不是外部，是因为在内部可以获取相关的上下文信息，如果在外部声明我还要传入 page 这个对象
    async function handleData() {
        // 现在我们进入浏览器内部搞些事情，通过page.evaluate方法，该方法的参数是一个函数，这个函数将会在页面内部运行，这个函数的返回的数据将会以Promise的形式返回到外部
        const list = await page.evaluate(() => {

            // 先声明一个用于存储爬取数据的数组
            const writeDataList: WriteData[] = [];

            // 获取到所有的商品元素
            let itemList = document.querySelectorAll('.item.J_MouserOnverReq');
            // 遍历每一个元素，整理需要爬取的数据
            for (let item of itemList) {
                // 首先声明一个爬取的数据结构
                let writeData: WriteData = {
                    picture: undefined,
                    link: undefined,
                    title: undefined,
                    price: undefined
                };

                // 找到商品图片的地址
                let img = item.querySelector('img');
                writeData.picture = img.src;

                // 找到商品的链接
                let link: HTMLAnchorElement = item.querySelector('.pic-link.J_ClickStat.J_ItemPicA');
                writeData.link = link.href;

                // 找到商品的价格，默认是string类型 通过~~转换为整数number类型
                let price = item.querySelector('strong');
                writeData.price = ~~price.innerText;

                // 找到商品的标题，淘宝的商品标题有高亮效果，里面有很多的span标签，不过一样可以通过innerText获取文本信息
                let title: HTMLAnchorElement = item.querySelector('.title>a');

                writeData.title = title.innerText;

                // 将这个标签页的数据push进刚才声明的结果数组
                writeDataList.push(writeData);
            }
            // 当前页面所有的返回给外部环境
            return writeDataList;

        });
        // 得到数据以后写入到mongodb
        // const result = await mongo.insertMany('GTX1080', list);
        const result = list;

        log(chalk.yellow('写入数据库完毕'));
        log(result);
    }

}

main();
