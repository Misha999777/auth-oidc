import {BaseFlow} from "./BaseFlow.js";

export class BrowserFlow extends BaseFlow {

    constructor(oidcService, autoLogin) {
        super(oidcService, autoLogin)
    }

    login() {
        this.oidcService.signinRedirect(window.location.href);
    }

    logout() {
        this.oidcService.signoutRedirect(window.location.href);
    }
}