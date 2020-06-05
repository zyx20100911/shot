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

export function addRoles(add) {
    return request({
        url: 'roles',
        method: 'post',
        data: add
    })
}

export function delRoles(url) {
    return request({
        url,
        method: 'delete'
    })
}

export function getRolesById(url) {
    return request({
        url
    })
}

export function changeRoles(url, roleName, roleDesc) {
    return request({
        url,
        method: 'put',
        data: {
            roleName,
            roleDesc
        }
    })
}
