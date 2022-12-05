import {extractRoles} from "../utils/TokenUtils.js";

export class BaseFlow {

    constructor(oidcService, autoLogin) {
        this.oidcService = oidcService;
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
        return !!this.oidcService.getSession();
    }

    hasRole(role) {
        if (this.isLoggedIn()) {
            let session = this.oidcService.getSession();
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
            let session = this.oidcService.getSession();
            let userRoles = extractRoles(session);

            return !!userRoles;
        } else {
            return false;
        }
    }

    async getToken() {
        if (this.isLoggedIn()) {
            if (this.oidcService.getSession().expires_at < Date.now() - 10000) {
                await this.tryToRefresh();
            }

            let session = this.oidcService.getSession();
            if (session) {
                return session.access_token;
            }
        }
        return null;
    }

    async tryToRefresh() {
        try {
            await this.oidcService.signinSilent();
        } catch (e) {
            if (e.message !== "Network Error") {
                this.oidcService.forgetSession();

                window.location.reload()
            }
        }
    }

    async handleWindowLoaded() {
        if (!this.oidcService.isLoggingIn() && !this.isLoggedIn() && this.autoLogin) {
            this.login();
            return;
        }

        if (!window.location.href.includes("state") && this.oidcService.isLoggingIn()) {
            
            window.location.href = window.location.href.split("?")[0];
        }

        if (this.oidcService.isLoggingIn()) {
            await this.oidcService.signinRedirectCallback();

            this.oidcService.cancelLogin();

            let url = new URL(window.location.href);
            url.searchParams.delete('code');
            url.searchParams.delete('session_state');
            window.location.href = url.toString();
        }
    }
}