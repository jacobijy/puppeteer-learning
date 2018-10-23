"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require("puppeteer");
(() => __awaiter(this, void 0, void 0, function* () {
    const browser = yield puppeteer.launch({
        // 设置超时时间
        timeout: 15000,
        // 如果是访问https页面 此属性会忽略https错误
        ignoreHTTPSErrors: true,
        // 打开开发者工具, 当此值为true时, headless总为false
        devtools: false,
        // 关闭headless模式, 不会打开浏览器
        headless: false
    });
    const page = yield browser.newPage();
    yield page.goto('https://www.jianshu.com/u/40909ea33e50');
    // await page.
    yield page.screenshot({
        path: 'jianshu.png',
        type: 'png',
        // quality: 100, 只对jpg有效
        fullPage: true,
    });
    browser.close();
}))();
//# sourceMappingURL=index.js.map