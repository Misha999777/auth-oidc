import {LOGGING_IN, LOGGING_OUT, LOGIN_STATE} from "../enums/States.js";
import {BaseFlow} from "./BaseFlow.js";

export class BrowserFlow extends BaseFlow {

    constructor(userManager, sessionName, autoLogin) {
        super(userManager, sessionName, autoLogin)

        this.userManager = userManager;
        this.sessionName = sessionName;
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
}