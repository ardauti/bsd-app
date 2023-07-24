const environment = import.meta.env;

const config = {
    api_url: environment.VITE_BASE_URL,
    cookie_domain: environment.VITE_COOKIE_DOMAIN
}

export default config;
