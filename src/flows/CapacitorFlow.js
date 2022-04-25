import {App} from "@capacitor/app";
import {Browser} from "@capacitor/browser";
import {LOGGING_IN, LOGGING_OUT, LOGIN_STATE} from "../enums/States.js";
import {BaseFlow} from "./BaseFlow.js";

export class CapacitorFlow extends BaseFlow {

    constructor(userManager, sessionName, autoLogin, capacitorAppBundle) {
        super(userManager, sessionName)

        this.userManager = userManager;
        this.sessionName = sessionName;
        this.autoLogin = autoLogin;
        this.capacitorAppBundle = capacitorAppBundle;

        App.addListener('appUrlOpen',
            (event) => this.handleAppOpen(event.url));

        window.addEventListener('DOMContentLoaded',
            () => this.handleWindowLoaded());
    }

    login() {
        const redirectUri = this.capacitorAppBundle.concat("://callback");
        const signInOptions = {redirect_uri: redirectUri};

        localStorage.setItem(LOGIN_STATE, LOGGING_IN)
        this.userManager.createSigninRequest(signInOptions)
            .then(request => {
                Browser.open({url: request.url})
                    .catch(() => console.log("Can't open capacitor browser"))
            })
    }

    logout() {
        const redirectUri = this.capacitorAppBundle.concat("://callback");
        const signOutOptions = {post_logout_redirect_uri: redirectUri};

        this.userManager.createSignoutRequest(signOutOptions)
            .then(request => {
                Browser.open({url: request.url})
                    .then(() => localStorage.setItem(LOGIN_STATE, LOGGING_OUT))
            })
    }

    handleAppOpen(url) {
        if (!url.includes("state") && localStorage.getItem(LOGIN_STATE) === LOGGING_IN) {
            localStorage.removeItem(LOGIN_STATE);
            window.location.href = url.split("?")[0];
        }

        if (localStorage.getItem(LOGIN_STATE) === LOGGING_IN) {
            this.userManager.signinRedirectCallback(url).then(function () {
                localStorage.removeItem(LOGIN_STATE);
                let url = new URL(location.href);
                url.searchParams.delete('state');
                url.searchParams.delete('session_state');
                url.searchParams.delete('code');
                window.location.href = url.toString();
            }).catch((error) => console.log("Auth Error: " + error));
        }

        if (localStorage.getItem(LOGIN_STATE) === LOGGING_OUT) {
            this.userManager.signoutRedirectCallback(url).then(() => {
                this.userManager.removeUser().then(function () {
                    localStorage.removeItem(LOGIN_STATE);
                    let url = window.location.href;
                    window.location.href = url.split("?")[0];
                });
            }).catch((error) => console.log("Auth Error: " + error));
        }
    }

    handleWindowLoaded() {
        if (!localStorage.getItem(LOGIN_STATE) && !this.isLoggedIn() && this.autoLogin) {
            this.login();
        }
    }
}