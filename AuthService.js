import {UserManager, WebStorageStateStore} from "oidc-client";

const LOGGING_IN = "logging_in";
const LOGIN_STATE = "login_state";
const LOGGING_OUT = "logging_out";

// noinspection JSUnusedGlobalSymbols
export class AuthService {

    constructor(authority, clientId, autoLogin) {
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
            response_type: 'code',
            userStore: new WebStorageStateStore({ store: window.localStorage })
        });
        this.session = "oidc.user:" + authority + ":" + clientId;
        window.addEventListener('DOMContentLoaded', () => this.handleLoad(this.manager, autoLogin));
    }

    isLoggedIn() {
        let session = localStorage.getItem(this.session);
        if (session) {
            return JSON.parse(session).expires_at > Date.now() / 1000
        }
        return false;
    }

    login() {
        if(!localStorage.getItem(LOGIN_STATE) && !localStorage.getItem(this.session)) {
            localStorage.setItem(LOGIN_STATE, LOGGING_IN);
            this.manager.signinRedirect().catch((error) => console.log("Auth Error: " + error));
        }
    }

    hasRole(role) {
        if (this.isLoggedIn()) {
            let session = localStorage.getItem(this.session);
            return JSON.parse(session).profile.realm_access.roles.includes(role);
        } else {
            return false;
        }
    }

    async getToken() {
        if (localStorage.getItem(this.session)) {
            await this.tryToRefresh();

            let session = JSON.parse(localStorage.getItem(this.session));
            if (session) {
                return session.access_token;
            }
        }
        return null;
    }

    logout() {
        if(!localStorage.getItem(LOGIN_STATE)) {
            localStorage.setItem(LOGIN_STATE, LOGGING_OUT);
            this.manager.signoutRedirect({post_logout_redirect_uri: window.location.href})
                .catch((error) => console.log("Auth Error: " + error));
        }
    }

    async tryToRefresh() {
        if (JSON.parse(localStorage.getItem(this.session)).expires_at < Date.now() / 1000) {
            try {
                await this.manager.signinSilent();
            } catch (e) {
                localStorage.removeItem(this.session);
                this.login();
            }
        }
    }

    handleLoad(manager, autoLogin) {
        if(!localStorage.getItem(LOGIN_STATE) && !this.isLoggedIn() && autoLogin) {
            localStorage.setItem(LOGIN_STATE, LOGGING_IN);
            manager.signinRedirect({redirect_uri: window.location.href})
                .catch((error) => console.log("Auth Error: " + error));
            return;
        }

        if (!window.location.href.includes("state") && localStorage.getItem(LOGIN_STATE) === LOGGING_IN) {
            localStorage.removeItem(LOGIN_STATE);
            window.location.reload()
        }

        if (localStorage.getItem(LOGIN_STATE) === LOGGING_IN) {
            manager.signinRedirectCallback().then(function() {
                localStorage.removeItem(LOGIN_STATE);
                let url = new URL(location.href);
                url.searchParams.delete('state');
                url.searchParams.delete('session_state');
                url.searchParams.delete('code');
                window.location.href = url.toString();
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
}
