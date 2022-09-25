import {LOGGING_IN, LOGGING_OUT, LOGIN_STATE} from "../enums/States.js";
import {BaseFlow} from "./BaseFlow.js";

export class NativeFlow extends BaseFlow {

    constructor(userManager, sessionName, autoLogin, redirectUrl) {
        super(userManager, sessionName, autoLogin)

        this.redirectUrl = redirectUrl;
    }

    login() {
        const signInOptions = {redirect_uri: this.redirectUrl};

        localStorage.setItem(LOGIN_STATE, LOGGING_IN);
        this.userManager.signinRedirect(signInOptions).catch((error) => console.log("Auth Error: " + error));
    }

    logout() {
        const signOutOptions = {post_logout_redirect_uri: this.redirectUrl};

        localStorage.setItem(LOGIN_STATE, LOGGING_OUT);
        this.userManager.signoutRedirect(signOutOptions).catch((error) => console.log("Auth Error: " + error));
    }
}