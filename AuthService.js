import {UserManager, WebStorageStateStore} from "oidc-client";

const LOGGING_IN = "logging_in";
const LOGIN_STATE = "login_state";
const LOGGING_OUT = "logging_out";

export class AuthService {

    constructor(authority, clientId, redirectUri, autoLogin) {
        this.manager = new UserManager({
            authority: authority,
            metadata: {
                issuer: authority,
                authorization_endpoint: authority + "/protocol/openid-connect/auth",
                token_endpoint: authority + "/protocol/openid-connect/token",
                userinfo_endpoint: authority + "/protocol/openid-connect/userinfo",
                end_session_endpoint: authority + "/protocol/openid-connect/logout"
            },
            client_id: clientId,
            redirect_uri: redirectUri,
            post_logout_redirect_uri: redirectUri,
            response_type: 'code',
            userStore: new WebStorageStateStore({ store: window.localStorage })
        });
        this.session = "oidc.user:" + authority + ":" + clientId;
        window.addEventListener('DOMContentLoaded', () => this.handleLoad(this.manager, autoLogin));
    }

    handleLoad(manager, autoLogin) {
        if(!localStorage.getItem(LOGIN_STATE) && !localStorage.getItem(this.session) && autoLogin) {
            localStorage.setItem(LOGIN_STATE, LOGGING_IN);
            manager.signinRedirect().catch((error) => console.log("Auth Error: " + error));
            return;
        }

        if (!window.location.href.includes("state") && localStorage.getItem(LOGIN_STATE) === LOGGING_IN) {
            localStorage.removeItem(LOGIN_STATE);
            window.location.reload()
        }

        if (localStorage.getItem(LOGIN_STATE) === LOGGING_IN) {
            manager.signinRedirectCallback().then(function() {
                localStorage.removeItem(LOGIN_STATE);
                let url = window.location.href;
                window.location.href = url.split("?")[0];
            }).catch((error) => console.log("Auth Error: " + error));
        }

        if (localStorage.getItem(LOGIN_STATE) === LOGGING_OUT) {
            manager.signoutRedirectCallback().then(() => {
                manager.removeUser().then(function() {
                    localStorage.removeItem(LOGIN_STATE);
                    let url = window.location.href;
                    window.location.href = url.split("?")[0];
                });
            }).catch((error) => console.log("Auth Error: " + error));
        }
    }

    isLoggedIn() {
        return localStorage.getItem(this.session) != null
    }

    hasRole(role) {
        return JSON.parse(localStorage.getItem(this.session)).profile.realm_access.roles.includes(role);
    }

    async getToken() {
        if (localStorage.getItem(this.session)) {
            if (JSON.parse(localStorage.getItem(this.session)).expires_at < Date.now() / 1000) {
                try {
                    await this.manager.signinSilent();
                } catch (e) {
                    if (e.message === "Network Error") {
                        return null;
                    }
                    localStorage.removeItem(this.session);
                    this.login();
                }
            }
            let session = JSON.parse(localStorage.getItem(this.session));
            if (session) {
                return session.access_token;
            }
        }
        return null;
    }

    login() {
        if(!localStorage.getItem(LOGIN_STATE) && !localStorage.getItem(this.session)) {
            localStorage.setItem(LOGIN_STATE, LOGGING_IN);
            this.manager.signinRedirect().catch((error) => console.log("Auth Error: " + error));
        }
    }

    logout() {
        if(!localStorage.getItem(LOGIN_STATE)) {
            localStorage.setItem(LOGIN_STATE, LOGGING_OUT);
            this.manager.signoutRedirect().catch((error) => console.log("Auth Error: " + error));
        }
    }
}
