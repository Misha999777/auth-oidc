import {extractRoles} from "../utils/TokenUtils.js";
import {LOGGING_IN, LOGGING_OUT, LOGIN_STATE} from "../enums/States.js";

export class BaseFlow {

    constructor(userManager, sessionName, autoLogin) {
        this.userManager = userManager;
        this.sessionName = sessionName;
        this.autoLogin = autoLogin;

        window.addEventListener('DOMContentLoaded', () => this.handleWindowLoaded());
    }

    login() {
        throw new Error('You have to implement login method!');
    }

    logout() {
        throw new Error('You have to implement logout method!');
    }

    isLoggedIn() {
        return !!localStorage.getItem(this.sessionName);
    }

    hasRole(role) {
        if (this.isLoggedIn()) {
            let session = localStorage.getItem(this.sessionName);
            let userRoles = extractRoles(session);
            if (!userRoles) {
                return false;
            }

            return userRoles.includes(role);
        } else {
            return false;
        }
    }

    hasAnyRole() {
        if (this.isLoggedIn()) {
            let session = localStorage.getItem(this.sessionName);
            let userRoles = extractRoles(session);

            return !!userRoles;
        } else {
            return false;
        }
    }

    async getToken() {
        if (localStorage.getItem(this.sessionName)) {
            if (JSON.parse(localStorage.getItem(this.sessionName)).expires_at < Date.now() / 1000) {
                await this.tryToRefresh();
            }

            let session = JSON.parse(localStorage.getItem(this.sessionName));
            if (session) {
                return session.access_token;
            }
        }
        return null;
    }

    async tryToRefresh() {
        try {
            await this.userManager.signinSilent();
        } catch (e) {
            if (e.message !== "Network Error") {
                localStorage.removeItem(this.sessionName);
                window.location.reload()
            }
        }
    }

    async handleWindowLoaded() {
        if (!localStorage.getItem(LOGIN_STATE) && !this.isLoggedIn() && this.autoLogin) {
            this.login();
            return;
        }

        if (!window.location.href.includes("state") && localStorage.getItem(LOGIN_STATE) === LOGGING_IN) {
            localStorage.removeItem(LOGIN_STATE);
            window.location.href = window.location.href.split("?")[0];
        }

        if (localStorage.getItem(LOGIN_STATE) === LOGGING_IN) {
            this.userManager.signinRedirectCallback().then(function () {
                localStorage.removeItem(LOGIN_STATE);
                let url = new URL(window.location.href);
                url.searchParams.delete('state');
                url.searchParams.delete('session_state');
                url.searchParams.delete('code');
                window.location.href = url.toString();
            }).catch((error) => console.log("Auth Error: " + error));
        }

        if (localStorage.getItem(LOGIN_STATE) === LOGGING_OUT) {
            this.userManager.signoutRedirectCallback().then(() => {
                this.userManager.removeUser().then(function () {
                    localStorage.removeItem(LOGIN_STATE);
                    window.location.href = window.location.href.split("?")[0];
                });
            }).catch((error) => console.log("Auth Error: " + error));
        }
    }
}