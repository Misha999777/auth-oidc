import {LOGGING_IN, LOGGING_OUT, LOGIN_STATE} from "../enums/States.js";
import {BaseFlow} from "./BaseFlow.js";

export class BrowserFlow extends BaseFlow {

    constructor(userManager, sessionName, autoLogin) {
        super(userManager, sessionName)

        this.userManager = userManager;
        this.sessionName = sessionName;
        this.autoLogin = autoLogin;

        window.addEventListener('DOMContentLoaded', () => this.handleWindowLoaded());
    }

    login() {
        const signInOptions = {redirect_uri: window.location.href};

        localStorage.setItem(LOGIN_STATE, LOGGING_IN);
        this.userManager.signinRedirect(signInOptions).catch((error) => console.log("Auth Error: " + error));
    }

    logout() {
        const signOutOptions = {post_logout_redirect_uri: window.location.href};

        localStorage.setItem(LOGIN_STATE, LOGGING_OUT);
        this.userManager.signoutRedirect(signOutOptions).catch((error) => console.log("Auth Error: " + error));
    }

    handleWindowLoaded() {
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
                let url = new URL(location.href);
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
                    let url = window.location.href;
                    window.location.href = url.split("?")[0];
                });
            }).catch((error) => console.log("Auth Error: " + error));
        }
    }
}