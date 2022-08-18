


const downloadDataURL = (url: string | Blob, saveName: string) => {
    if (typeof url === 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url);
    }

    const aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || '';
    aLink.target = "_blank";
    let event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}

const getAndEncode = (url: string) => {
    const TIMEOUT = 30000;

    return new Promise((resolve) => {
        const request = new XMLHttpRequest();

        const fail = (message: string) => {
            console.error(message);
            resolve('');
        }

        const done = () => {
            if (request.readyState !== 4) return;

            if (request.status !== 200) {
                fail('cannot fetch resource: ' + url + ', status: ' + request.status);

                return;
            }

            const encoder = new FileReader();
            encoder.onloadend = function () {
                const content = typeof encoder.result === 'string' && encoder.result.split(/,/)[1];
                resolve(content);
            };
            encoder.readAsDataURL(request.response);
        }

        const timeout = () => {
            fail('timeout of ' + TIMEOUT + 'ms occured while fetching resource: ' + url);
        }

        request.onreadystatechange = done;
        request.ontimeout = timeout;
        request.responseType = 'blob';
        request.timeout = TIMEOUT;
        request.open('GET', url, true);
        request.send();
    });
}

const dataAsUrl = (content: string, type: string) => {
    return 'data:' + type + ';base64,' + content;
}

const mimes = (): any => {
    /*
     * Only WOFF and EOT mime types for fonts are 'real'
     * see http://www.iana.org/assignments/media-types/media-types.xhtml
     */
    var WOFF = 'application/font-woff';
    var JPEG = 'image/jpeg';

    return {
        'woff': WOFF,
        'woff2': WOFF,
        'ttf': 'application/font-truetype',
        'eot': 'application/vnd.ms-fontobject',
        'png': 'image/png',
        'jpg': JPEG,
        'jpeg': JPEG,
        'gif': 'image/gif',
        'tiff': 'image/tiff',
        'svg': 'image/svg+xml'
    };
}

const parseExtension = (url: string) => {
    const match = /\.([^\.\/]*?)$/g.exec(url);
    return match ? match[1] : '';
}

const mimeType = (url: string) => {
    const extension = parseExtension(url).toLowerCase();
    return mimes()[extension] || '';
}

export const openDownloadDialog = (url: string, saveName: string) => {
    if (url.indexOf('data:') === 0) {
        downloadDataURL(url, saveName);
    } else {
        getAndEncode(url).then((content: any) => {
            if (content) {
                const dataURL = dataAsUrl(content, mimeType(url));
                downloadDataURL(dataURL, saveName);
            } else {
                downloadDataURL(url, saveName);
            }
        })
    }
}


export function throttle(fn: Function, delay: number) {
    let last = 0,
        timer: any = null;

    return function (...args: any[]) {
        const context: any = this;
        // const args = arguments;
        const now = +new Date();

        clearTimeout(timer);
        if (now - last < delay) {
            timer = setTimeout(() => {
                last = now;
                fn.apply(context, args);
            }, delay);
        } else {
            last = now;
            fn.apply(context, args);
        }
    };
}


export function clearEmpty(html: string) {
    if (!html) {
        return html;
    }

    return html.replace(
        new RegExp(
            "[\\r\\t\\n ]*</?(\\w+)\\s*(?:[^>]*)>[\\r\\t\\n ]*",
            "g"
        ),
        function (a: string, b: string) {
            //br暂时单独处理
            if (b && b.toLowerCase() === 'br') {
                return a.replace(/(^[\n\r\s]+)|([\n\r\s]+$)/g, "");
            }
            return a
                .replace(
                    new RegExp(
                        "^[\\r\\t\\n ]+"
                    ),
                    ""
                )
                .replace(
                    new RegExp(
                        "[\\r\\t\\n ]+$"
                    ),
                    ""
                );
        }
    );
}

export function getUrlArgs(url:string):any {
    void 0 === url && (url = window.location.href);
    let paramStrs = url.split("#")[0].split("?")[1];
    if (!paramStrs) return {};
    let args:any = {}
    for (let i = 0, params = paramStrs.split("&"); i < params.length; i++) {
        let option = params[i],
            index = option.indexOf("=");
        if (!(index < 0)) {
            let name = option.substr(0, index),
                value = option.substr(index + 1);
            if (!args[name]) {
                let d:any;
                try {
                    d = decodeURIComponent(value);
                } catch (e) {
                    d = value;
                }
                args[name] = d;
            }
        }
    }
    return args;
}

export function formatDate(date: Date|number) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
   
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
   
    return [year, month, day].join('-');
  }