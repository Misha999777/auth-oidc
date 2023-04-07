export class OIDCService {

    AUTHORIZATION_ENDPOINT = "/protocol/openid-connect/auth";
    TOKEN_ENDPOINT =  "/protocol/openid-connect/token";
    USER_INFO_ENDPOINT =  "/protocol/openid-connect/userinfo";
    END_SESSION_ENDPOINT = "/protocol/openid-connect/logout";

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

        this.authority = authority;
        this.clientId = clientId;
    }

    signInRedirect(redirectUri) {
        let loginUri = [this.authority, this.AUTHORIZATION_ENDPOINT].join("");

        let parameters = [
            this.constructParam(this.CLIENT_ID_PARAMETER, this.clientId), 
            this.constructParam(this.REDIRECT_URI_PARAMETER, encodeURIComponent(redirectUri)), 
            this.constructParam(this.RESPONSE_TYPE_PARAMETER, this.CODE),
            this.constructParam(this.SCOPE_URI_PARAMETER, this.OPEN_ID)
        ].join("&");

        let href = [loginUri, "?", parameters].join("");

        localStorage.setItem(this.ACTIVE_REDIRECT_URI, redirectUri);

        window.location.href = href;
    }

    signOutRedirect(redirectUri) {
        let logoutUri = [this.authority, this.END_SESSION_ENDPOINT].join("");
        let id_token = this.getSession().id_token;

        let parameters = [
            this.constructParam(this.POST_LOGOUT_REDIRECT_URI_PARAMETER, encodeURIComponent(redirectUri)),
            this.constructParam(this.ID_TOKEN_HINT_URI_PARAMETER, id_token)
        ].join("&");

        let href = [logoutUri, "?", parameters].join("");

        localStorage.removeItem(this.AUTH);

        window.location.href = href;
    }

    async signInRedirectCallback() {
        let url = new URL(window.location.href);
        let code = url.searchParams.get(this.CODE);

        let response = await fetch([this.authority, this.TOKEN_ENDPOINT].join(""),
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
        let refreshToken = this.getSession().refresh_token;

        let response = await fetch([this.authority, this.TOKEN_ENDPOINT].join(''),
        {
            method: "POST",
            body: new URLSearchParams({
                "refresh_token": refreshToken,
                "grant_type": "refresh_token",
                "client_id": this.clientId
            })
        });

        if (!response.ok) {
            throw new Error("Cant refresh token");
        }

        let json = await response.json();
        json.expires_at = Date.now() + json["expires_in"] * 1000;
        
        localStorage.setItem(this.AUTH, JSON.stringify(json))

        await this.getUserInfo();
    }

    async getUserInfo() {
        let auth = this.getSession();

        let response = await fetch([this.authority, this.USER_INFO_ENDPOINT].join(''),
            {
                method: "GET",
                headers: [["Authorization", "Bearer " + auth.access_token]]
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