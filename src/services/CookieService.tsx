
class CookieService {
// function to get data from Cookie
    get(key: string) {
        let name = `${key}=`;
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');

        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];

            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }

        return null;
    }

// function to set data from Cookie
    set(key: string, value: any, options: any = {}) {
        options = {
            path: '/',
            ...options
        };

        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }

        let updatedCookie = encodeURIComponent(key) + '=' + encodeURIComponent(value);

        for (let optionKey in options) {
            updatedCookie += '; ' + optionKey;
            let optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += '=' + optionValue;
            }
        }

        // Check if the cookie with the specified key already exists
        let existingCookie = this.get(key);
        if (existingCookie !== null) {
            // Delete the existing cookie
            document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }

        document.cookie = updatedCookie;
    }

// function to remove data from Cookie
    remove(key: string) {
        this.set(key, '', { expires: new Date(0) });
    }
}

export default new CookieService()
