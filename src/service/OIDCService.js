import {ConfigurationService} from "./ConfigurationService.js";

export class OIDCService {

    CLIENT_ID_PARAMETER = "client_id";
    REDIRECT_URI_PARAMETER = "redirect_uri";
    POST_LOGOUT_REDIRECT_URI_PARAMETER = "post_logout_redirect_uri";
    ID_TOKEN_HINT_URI_PARAMETER = "id_token_hint";
    RESPONSE_TYPE_PARAMETER = "response_type";
    SCOPE_URI_PARAMETER = "scope";

    CODE = "code";
    OPEN_ID = "openid";
    AUTH = "active_auth";
    ACTIVE_REDIRECT_URI = "active_auth_redirect_uri";

    constructor(authority, clientId) {
        if (!authority || !clientId) {
            throw new Error("Wrong configuration");
        }

        this.clientId = clientId;
        this.configurationService = new ConfigurationService(authority);

        setInterval(this.watchExpiration, 5000);
    }

    watchExpiration() {
        if (!!this.getSession()?.userInfo) {
            return;
        }

        if (this.getSession().expires_at < Date.now() + 30000) {
            this.signInSilent().catch(e => {
                if (e.message !== "Failed to fetch") {
                    this.forgetSession();
                    window.location.reload()
                }
            });
        }
    }

    async signInRedirect(redirectUri) {
        const endpoint = await this.configurationService.getAuthEndpoint();

        if (!endpoint) {
            throw new Error("Can't obtain endpoint");
        }

        let parameters = [
            this.constructParam(this.CLIENT_ID_PARAMETER, this.clientId), 
            this.constructParam(this.REDIRECT_URI_PARAMETER, encodeURIComponent(redirectUri)), 
            this.constructParam(this.RESPONSE_TYPE_PARAMETER, this.CODE),
            this.constructParam(this.SCOPE_URI_PARAMETER, this.OPEN_ID)
        ].join("&");

        let href = [endpoint, "?", parameters].join("");

        localStorage.setItem(this.ACTIVE_REDIRECT_URI, redirectUri);

        window.location.href = href;
    }

    async signOutRedirect(redirectUri) {
        const endpoint = await this.configurationService.getLogoutEndpoint();

        if (!endpoint) {
            throw new Error("Can't obtain endpoint");
        }

        let id_token = this.getSession()["id_token"];

        let parameters = [
            this.constructParam(this.POST_LOGOUT_REDIRECT_URI_PARAMETER, encodeURIComponent(redirectUri)),
            this.constructParam(this.ID_TOKEN_HINT_URI_PARAMETER, id_token)
        ].join("&");

        let href = [endpoint, "?", parameters].join("");

        localStorage.removeItem(this.AUTH);

        window.location.href = href;
    }

    async signInRedirectCallback() {
        const endpoint = await this.configurationService.getTokenEndpoint();

        if (!endpoint) {
            throw new Error("Can't obtain endpoint");
        }

        let url = new URL(window.location.href);
        let code = url.searchParams.get(this.CODE);

        let response = await fetch(endpoint,
        {
            method: "POST",
            body: new URLSearchParams({
                "code": code,
                "grant_type": "authorization_code",
                "client_id": this.clientId,
                "redirect_uri": localStorage.getItem(this.ACTIVE_REDIRECT_URI)
            })
        });

        let json = await response.json();

        if (!json['expires_in']) {
            throw "Can't obtain token";
        }

        json.expires_at = Date.now() + json['expires_in'] * 1000;

        localStorage.setItem(this.AUTH, JSON.stringify(json))

        await this.getUserInfo();
    }

    async signInSilent() {
        const endpoint = await this.configurationService.getTokenEndpoint();

        if (!endpoint) {
            throw new Error("Can't obtain endpoint");
        }

        let session = this.getSession();

        let response = await fetch(endpoint,
        {
            method: "POST",
            body: new URLSearchParams({
                "refresh_token": session.refresh_token,
                "grant_type": "refresh_token",
                "client_id": this.clientId
            })
        });

        if (!response.ok) {
            throw new Error("Cant refresh token");
        }

        let json = await response.json();
        json.expires_at = Date.now() + json["expires_in"] * 1000;
        json.userInfo = session.userInfo;
        
        localStorage.setItem(this.AUTH, JSON.stringify(json))

        await this.getUserInfo();
    }

    async getUserInfo() {
        const endpoint = await this.configurationService.getUserInfoEndpoint();

        if (!endpoint) {
            throw new Error("Can't obtain endpoint");
        }

        let auth = this.getSession();

        let response = await fetch(endpoint,
            {
                method: "GET",
                headers: [["Authorization", "Bearer " + auth["access_token"]]]
            });

        if (!response.ok) {
            throw new Error("Cant get user info");
        }

        auth.userInfo = await response.json();

        localStorage.setItem(this.AUTH, JSON.stringify(auth))
    }

    isLoggingIn() {
        return !!localStorage.getItem(this.ACTIVE_REDIRECT_URI);
    }

    cancelLogin() {
        localStorage.removeItem(this.ACTIVE_REDIRECT_URI);
    }

    getSession() {
        return JSON.parse(localStorage.getItem(this.AUTH));
    }

    forgetSession() {
        localStorage.removeItem(this.AUTH);
    }

    constructParam(name, value) {
        return name.concat("=")
                   .concat(value);
    }
}