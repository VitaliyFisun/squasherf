class BugSquasherHelper {
    validateEmail(email) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    setCookie(cookieName, cookieValue, nDays) {
        let today = new Date();
        let expire = new Date();
        if (nDays == null || nDays == 0) nDays = 1;
        expire.setTime(today.getTime() + 3600000 * 24 * nDays);
        document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + expire.toGMTString() + "; path=/";
    }

    readCookie(cookieName) {
        let re = new RegExp("[; ]" + cookieName + "=([^\\s;]*)");
        let sMatch = (" " + document.cookie).match(re);
        if (cookieName && sMatch) return unescape(sMatch[1]);
        return "";
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            if (typeof FileReader == 'undefined') {
                reject('Your browser doesn\'t support FileReader API');
            }

            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });

    }
}

export default BugSquasherHelper;