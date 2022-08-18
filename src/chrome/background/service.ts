
import Connecter from '../../utils/connecter'
import Storage from '../../utils/storage'
import { getCgiBinSearchBiz, getCgiBinAppmsg, SearchbizParams, AppmsgParams } from "../api"
import { getUrlArgs } from "../../utils/utils"
import axios from 'axios';


export default class Service {
    private connecter: Connecter;
    private storage: Storage;

    constructor() {
        this.connecter = new Connecter();
        this.storage = new Storage();

        this.storage.onShouldSyncDataToStorage(() => {
            // this.syncAccountListToStorage();
        })

        // this.onGetCurrentLoginedAccount();
        this.onSearchAccounts();
        this.onSearchArticles();
        this.onGetArticleHTML();

        chrome.webRequest.onBeforeSendHeaders.addListener(
            (requestHeadersDetails) => {
                const url = requestHeadersDetails.url;
                const token = getUrlArgs(url).token;
                if (token) {
                    this.storage.set(`__token__`, token)
                }
            },
            { urls: ["*://mp.weixin.qq.com/cgi-bin/*"] },
            ["blocking"]
        );
    }

    onGetCurrentLoginedAccount() {

    }

    onSearchAccounts() {
        this.connecter.onRequest('searchAccounts', async (params) => {
            return this.searchAccounts(params)
        })
    }

    onSearchArticles() {
        this.connecter.onRequest('searchArticles', async (params) => {
            return this.searchArticles(params)
        })
    }

    onGetArticleHTML() {
        this.connecter.onRequest('getArticleHTML', async (params) => {
            return this.getArticleHTML(params)
        })
    }

    async getToken(): Promise<string> {
        const key = `__token__`
        let data = await this.storage.get(key);
        if (!data) {
            await axios.get('https://mp.weixin.qq.com/');
            data = await this.storage.get(key);
        }

        console.log(data)

        return data;

    }

    async searchAccounts(params: SearchbizParams) {
        const token = await this.getToken();
        params.token = token
        const data = await getCgiBinSearchBiz(params)
        if (data.base_resp && data.base_resp.ret === 200003) {
            this.storage.remove(`__token__`)
        }
        return data;
    }

    async searchArticles(params: AppmsgParams) {
        const token = await this.getToken();
        params.token = token
        const data = await getCgiBinAppmsg(params)
        if (data.base_resp && data.base_resp.ret === 200003) {
            this.storage.remove(`__token__`)
        }
        return data;
    }

    async getArticleHTML({link}: { link: string }) {
        const response = await axios.get(link);
        if (response && response.status >= 200 && response.status < 400 && response.data) {
            const div = document.createElement('div');
            div.innerHTML = response.data;
            const article = div.querySelector('#js_article');
            console.log(response.data)
            if (article) {
                // const imgList = article.querySelectorAll('img');
                // imgList.forEach((img) => {
                //     img.setAttribute('src', img.getAttribute('data-src')||'');
                // })
                const content = article.outerHTML
                if (content) {
                    return {
                        html: content,
                        link
                    }
                }
            }
        }

        return { html: '', link }

    }
}