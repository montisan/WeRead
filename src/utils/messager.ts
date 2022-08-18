import Injecter from './injecter'

type Handler = (data:any, sender:any)=>any;

export default class Messager {
    private eventHandlers: {[name: string]:Handler[]}
    private injecter: Injecter;
    constructor(options?: any) {
        this.injecter = new Injecter();
        if(this.injecter.isChromeExtensionEnv()) {
            chrome.runtime.onMessage.addListener((params, sender, sendResponse) => {
                const event = params.event, data = params.data;
                const handlers = this.eventHandlers[event] || [];
                handlers.forEach((handler)=>{
                    const res = handler(data, sender);
                    res && sendResponse(res);
                })
                return true;
            });
        }
        this.eventHandlers = {};
    }

    on(event: string, handler: Handler) {
        const handlers = this.eventHandlers[event] || (this.eventHandlers[event] = []);
        if(handlers.indexOf(handler) === -1) {
            handlers.push(handler);
        }
    }

    off(event: string, handler: Handler) {
        const handlers = this.eventHandlers[event];
        if(handlers) {
            const index = handlers.indexOf(handler);
            if(index !== -1) {
                handlers.splice(index, 1);
            }
        }
    }

    offAll(event: string) {
        this.eventHandlers[event] = [];
    }

    fire(event: string, data?: any, to?:any):Promise<any> {
        if(!this.injecter.isChromeExtensionEnv()) return Promise.resolve({});

        return new Promise((resolve) => {
            if(to && to.tab) {
                chrome.tabs.sendMessage( to.tab.id, {
                    event: event,
                    data: data,
                }, (response) => {
                    resolve(response);
                });
            } else {
                chrome.runtime.sendMessage(
                    {
                        event: event,
                        data: data,
                    },
                    (response) => {
                        resolve(response);
                    }
                );
                if(chrome.tabs) {
                    chrome.tabs.query({}, (tabs)=>{
                        tabs.forEach((tab:any)=>{
                            chrome.tabs.sendMessage( tab.id, {
                                event: event,
                                data: data,
                            }, (response) => {
                                resolve(response);
                            });
                        })
                    })
                }
            }
        });
    }
}