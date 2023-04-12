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
            const url = new URL(window.location.href);

            const code = url.searchParams.get("code");

            url.searchParams.delete('code');
            url.searchParams.delete('session_state');

            this.oidcService.signInRedirectCallback(code)
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
        this.oidcService.signInRedirect(this.redirectUrl ?? window.location.href)
            .catch(() => this.errorHandler("Auth failed: can't perform login redirect"));
    }

    logout() {
        this.oidcService.signOutRedirect(this.redirectUrl ?? window.location.href)
            .catch(() => this.errorHandler("Auth failed: can't perform logout redirect"));
    }

    isLoggedIn() {
        return !!this.oidcService.getSession()?.userInfo;
    }

    getUserInfo(claim) {
        if (!this.isLoggedIn()) {
            throw "No active auth or auth is in progress";
        }

        let session = this.oidcService.getSession();
        return session.userInfo[claim];
    }

    getToken() {
        if (!this.isLoggedIn()) {
            throw "No active auth or auth is in progress";
        }

        return this.oidcService.getSession()['access_token'];
    }

    async tryToRefresh() {
        if (!this.isLoggedIn()) {
            throw "No active auth or auth is in progress";
        }

        return this.oidcService.signInSilent();
    }
}