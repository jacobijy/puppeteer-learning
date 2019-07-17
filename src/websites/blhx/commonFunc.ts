
const baseUrl = Object.freeze('http://wiki.joyme.com/blhx');

const pages = {
    main: '首页',
    picture: '碧蓝影画'
}

function getUrl(page: string) {
    return baseUrl + '/' + encodeURI(page);
}

export { pages, getUrl };
