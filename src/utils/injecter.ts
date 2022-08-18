

class Injecter {


    isChromeExtensionEnv() {
        return typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined' && chrome.runtime.id;
    }

    getURL(path:string) {
        return this.isChromeExtensionEnv() ? 'chrome-extension://' + chrome.runtime.id + path : path;
    }

    locationTest(rex:RegExp) {
        return !this.isChromeExtensionEnv() || rex.test(window.location.href);
    }

    injectStyleSheet(href:string) {
        if(!href) return;
        const head = document.head || document.getElementsByTagName( "head" )[ 0 ];
        const link = document.createElement( "link" );
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', href); //'chrome-extension://' + chrome.runtime.id +'/static/css/content.css'
        head.appendChild( link );
        return link;
    }

    injectJavascript(javascript:string) {
        const script = document.createElement("script");
        script.innerHTML = javascript;
        document.documentElement.appendChild(script);
    }

    injectNode(id:string, seletor?:string|Element, first?: boolean) {
        const div = document.querySelector('#'+id) || document.createElement('div');
        div.setAttribute('id', id);
        const root = (typeof seletor === 'string' ? document.querySelector(seletor) : seletor) || document.body;
        first ? root.insertBefore(div, root.firstChild) : root.appendChild(div);
        return div;
    }

}

export default Injecter;