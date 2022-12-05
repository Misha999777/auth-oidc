import {BaseFlow} from "./BaseFlow.js";

export class NativeFlow extends BaseFlow {

    constructor(oidcService, autoLogin, redirectUrl) {
        super(oidcService, autoLogin)

        this.redirectUrl = redirectUrl;
    }

    login() {
        this.oidcService.signinRedirect(this.redirectUrl);
    }

    logout() {
        this.oidcService.signoutRedirect(this.redirectUrl);
    }
}