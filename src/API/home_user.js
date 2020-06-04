import {request} from "./request";

export function getHomeUsers(queryInfo) {
    return request({
        url: 'users',
        method:'get',
        params: queryInfo

    })
}

export function ChangeUserState(url) {
    return request({
        url,
        method:'put'
    })
}

export function addUser(addUser) {
        return request({
            url: 'users',
            method:'post',
            data:{
                username:addUser.username,
                password:addUser.password,
                email:addUser.email,
                mobile:addUser.mobile
            }
        })
}

export function getUserById(url) {
        return request({
            url
        })
}


export function changeUser(url,email,mobile) {
    return request({
        url,
        data:{
            email,
            mobile
        },
        method:'put'
    })
}

export function delUserById(url) {
    return request({
        url,
        method:'delete'
    })
}
