export class OIDCService {

    AUTHORIZATION_ENDPOINT = "/protocol/openid-connect/auth";
    TOKEN_ENDPOINT =  "/protocol/openid-connect/token";
    END_SESSION_ENDPOINT = "/protocol/openid-connect/logout";

    CLIENT_ID_PARAMETER = "client_id";
    REDIRECT_URI_PARAMETER = "redirect_uri";
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

        let parameters = this.constructParam(this.REDIRECT_URI_PARAMETER, encodeURIComponent(redirectUri));

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
    }

    async signInSilent() {
        let refreshToken = JSON.parse(localStorage.getItem(this.AUTH)).refresh_token;

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