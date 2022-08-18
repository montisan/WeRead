import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { injecter, connecter } from '../../content/context'

const proxy = (function(){

    const callbacks: {[key: string]: Function} = {};

    window.addEventListener('message', (event)=>{
        if(event.data.type === 'onRequest') {
            const {data, id} = event.data
            const callback = callbacks[id];
            if(callback) {
                callback(data);
                delete callbacks[id];
            }
        }
    })


    return {
        request(options:{request: string; data: any; callback: (data:any)=>void}) {

            if(injecter.isChromeExtensionEnv()) {
                connecter.request(options.request, options.data, (res)=>{
                    options.callback(res)
                })
            } else {
                const params = {
                    type: 'request',
                    request: options.request,
                    data: options.data,
                    id: `${+ new Date()}_${options.request}`
                }
    
                callbacks[params.id] = options.callback;
                window.postMessage(params, '*')
            }
        }
    }

})()




export type  AccountType = {
    alias: string;
    fakeid: string;
    nickname: string;
    round_head_img: string;
    searvice_type: number;
    signature: string;
}
export type SearchbizResDataType = {
    base_resp: {
        ret: number;
        err_msg: string;
    },
    list: AccountType[]
}

function checkLoginState(data:SearchbizResDataType) {

    if(data.base_resp.ret === 200003) {
        Modal.confirm({
            title: '登录',
            icon: <ExclamationCircleOutlined />,
            content: '公众号登录状态失效，请重新登陆公众号',
            okText: '登录',
            cancelText: '取消',
            onOk: () => {
                window.open('https://mp.weixin.qq.com/')
            }
          });
    }

}
export const searchAccounts = (data: {query:string;begin:number;count:number}):Promise<SearchbizResDataType> => {
    return new Promise((resolve)=>{

        proxy.request({
            request: 'searchAccounts',
            data,
            callback: (data) => {
                checkLoginState(data)
                resolve(data)
            }
        })
    })
}

export type  AppmsgType = {
    aid: string;
    title: string;
    cover: string;
    link: string;
    create_time: number;
    digest: string;
}
export type AppmsgResDataType = {
    base_resp: {
        ret: number;
        err_msg: string;
    },
    app_msg_cnt: number;
    app_msg_list: AppmsgType[]
}

export const searchArticles = (data: {query:string;begin:number;count:number;fakeid:string;}):Promise<AppmsgResDataType> => {
    return new Promise((resolve)=>{

        proxy.request({
            request: 'searchArticles',
            data,
            callback: (data) => {
                checkLoginState(data)
                resolve(data)
            }
        })
    })
}


export const getArticleHTML = (data: {link: string}):Promise<{link:string;html:string}> => {
    return new Promise((resolve)=>{

        proxy.request({
            request: 'getArticleHTML',
            data,
            callback: (data) => {
                resolve(data)
            }
        })
    })
}


