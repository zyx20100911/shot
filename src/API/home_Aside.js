import {request} from "./request";

export function getHomeAsideList() {
    return request({
        url: 'menus',
        method: 'get'
    })
}