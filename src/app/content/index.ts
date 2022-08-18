import { injecter, connecter } from './context'

window.addEventListener('message', (event)=>{
    if(event.data.type === 'request') {
        const {id, data, request} = event.data;
        connecter.request(request, data, (res)=>{
            window.postMessage({
                type: 'onRequest',
                request,
                data: res,
                id
            })
        })
    }
})








