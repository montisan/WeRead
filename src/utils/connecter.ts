import Messager from './messager'

type Handler = (data:any, sender:any)=>any;
type OnRequestHanlder = (data:any, sender:any)=>Promise<any>;

export default class Connecter {
    private messager: Messager;
    constructor() {
        this.messager = new Messager();
    }

    request(event:string, data:any, hanlder: Handler) {

        const msgHandler = (data:any, sender:any) => {
            hanlder(data, sender);
            this.messager.off(`ONREQUEST_${event}`, msgHandler);
        }
        this.messager.on(`ONREQUEST_${event}`, msgHandler)
        this.messager.fire(`REQUEST_${event}`, data);

    }

    onRequest(event:string, hanlder: OnRequestHanlder) {

        this.offOnRequest(event);

        const msgHandler = (data:any, sender:any) => {
            hanlder(data, sender).then((data:any)=>{
                this.messager.fire(`ONREQUEST_${event}`, data, sender);
            }).catch((err)=>{
                this.messager.fire(`ONREQUEST_${event}`, {REQ_ERROR: err}, sender);
            })
        }
        
        this.messager.on(`REQUEST_${event}`, msgHandler)
    }

    offOnRequest(event:string) {
        this.messager.offAll(`REQUEST_${event}`);
    }

    getMessager():Messager {
        return this.messager;
    }
}