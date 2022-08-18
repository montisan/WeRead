import {get, post} from "../../utils/http"



export type SearchbizParams = {
    action?: string;
    begin: number;
    count: number;
    query: string;
    token: string;
    lang?: string;
    f?:string;
    ajax?: number;
}
export type  Account = {
    alias: string;
    fakeid: string;
    nickname: string;
    round_head_img: string;
    searvice_type: number;
    signature: string;
}
export type SearchbizResData = {
    base_resp: {
        ret: number;
        err_msg: string;
    },
    list: Account[]
}

export const getCgiBinSearchBiz = (params: SearchbizParams) => {

    params.action = 'search_biz';
    params.lang = 'zh_CN';
    params.f = 'json';
    params.ajax = 1;

    return get<SearchbizResData>(`https://mp.weixin.qq.com/cgi-bin/searchbiz`, params)
}

export type AppmsgParams = {
    action?: string;
    begin: number;
    count: number;
    query: string;
    token: string;
    fakeid: string;
    type: number;
    lang?: string;
    f?:string;
    ajax?: number;
}
export type  Appmsg = {
    aid: string;
    title: string;
    cover: string;
    link: string;
    create_time: number;
    digest: string;
}
export type AppmsgResData = {
    base_resp: {
        ret: number;
        err_msg: string;
    },
    app_msg_cnt: number;
    app_msg_list: Appmsg[]
}

export const getCgiBinAppmsg = (params: AppmsgParams) => {

    params.action = 'list_ex';
    params.lang = 'zh_CN';
    params.f = 'json';
    params.ajax = 1;
    params.type = 9;

    return get<SearchbizResData>(`https://mp.weixin.qq.com/cgi-bin/appmsg`, params)
}