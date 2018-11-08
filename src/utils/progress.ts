// 格式化的进度输出 用来显示当前爬取的进度

const TOTAL_PAGE = 50; // 定义需要爬取的网页数量，对应页面下部的跳转链接

export function formatProgress(current: number): string {
    let percent = (current / TOTAL_PAGE) * 100;
    let done = ~~(current / TOTAL_PAGE * 40);
    let left = 40 - done;
    let test = '';
    let str = `当前进度：[${test.padStart(done, '=')}${''.padStart(left, '-')}]  ${percent}%`;
    return str;
}
