import * as fs from 'fs';
import { ActivityInfo } from './getActivityInfos';

const baseUrl = Object.freeze('http://wiki.joyme.com/blhx');

const pages = {
    main: '首页',
    picture: '碧蓝影画',
    illustrated: '舰娘图鉴'
}

function getUrl(page: string): string {
    return baseUrl + '/' + encodeURI(page);
}

async function getMissionId(name: string): Promise<number> {
    let SpActivityStr = await fs.promises.readFile('./blhxConfJson/SpAcitivities.json', 'utf8');
    let ExActivityStr = await fs.promises.readFile('./blhxConfJson/ExAcitivities.json', 'utf8');
    let SpActivity: ActivityInfo[] = JSON.parse(SpActivityStr);
    let ExActivity: ActivityInfo[] = JSON.parse(ExActivityStr);
    return SpActivity.find(act=> act.name === name).id || ExActivity.find(act=> act.name === name).id || -1;
}

export { pages, getUrl, getMissionId };
