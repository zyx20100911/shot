import {request} from "./request";

export function getRights() {
    return request({
        url: 'rights/list'
    })
}

export function getRoles() {
    return request({
        url: 'roles'
    })
}