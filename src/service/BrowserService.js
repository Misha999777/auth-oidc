import {extractRoles, extractUsername} from "../utils/TokenUtils.js";

// noinspection JSUnusedGlobalSymbols
export class BrowserService {

    constructor(oidcService, autoLogin, errorHandler, redirectUrl) {
        this.oidcService = oidcService;
        this.autoLogin = autoLogin;
        this.errorHandler = errorHandler;
        this.redirectUrl = redirectUrl;

        if (!this.oidcService.isLoggingIn() && !this.isLoggedIn() && this.autoLogin) {
            this.login();
            return;
        }

        if (!window.location.href.includes("code") && this.oidcService.isLoggingIn()) {
            this.oidcService.cancelLogin();

            let url = new URL(window.location.href);

            url.searchParams.delete('error');
            url.searchParams.delete('error_description');
            window.history.replaceState({}, "", url.toString());

            this.errorHandler("Auth failed: no matching state found");
            return;
        }

        if (this.oidcService.isLoggingIn()) {
            let url = new URL(window.location.href);
            url.searchParams.delete('code');
            url.searchParams.delete('session_state');

            this.oidcService.signInRedirectCallback()
                .then(() => {
                    this.oidcService.cancelLogin();
                    window.location.href = url.toString();
                })
                .catch(() => {
                    this.oidcService.cancelLogin();
                    window.history.replaceState({}, "", url.toString());
                    this.errorHandler("Auth failed: can't obtain token")
                });
        }
    }

    login() {
        this.oidcService.signInRedirect(this.redirectUrl ?? window.location.href);
    }

    logout() {
        this.oidcService.signOutRedirect(this.redirectUrl ?? window.location.href);
    }

    isLoggedIn() {
        return !!this.oidcService.getSession();
    }

    getRoles() {
        if (!this.isLoggedIn()) {
            throw "No active auth or auth is in progress";
        }

        let session = this.oidcService.getSession();
        return extractRoles(session);
    }

    getUsername() {
        if (!this.isLoggedIn()) {
            throw "No active auth or auth is in progress";
        }

        let session = this.oidcService.getSession();
        return extractUsername(session);
    }

    async getToken() {
        if (!this.isLoggedIn()) {
            throw "No active auth or auth is in progress";
        }

        if (this.oidcService.getSession().expires_at < Date.now() + 10000) {
            await this.tryToRefresh();
        }

        let session = this.oidcService.getSession();
        if (session) {
            return session['access_token'];
        }
    }

    async tryToRefresh() {
        if (!this.isLoggedIn()) {
            throw "No active auth or auth is in progress";
        }

        try {
            await this.oidcService.signInSilent();
        } catch (e) {
            if (e.message !== "Failed to fetch") {
                this.oidcService.forgetSession();

                window.location.reload()
            }
        }
    }
}