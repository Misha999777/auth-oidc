import {BrowserFlow} from "./flows/BrowserFlow.js";
import {isCapacitorNative, isElectron} from "./utils/EnvUtils.js";
import {NativeFlow} from "./flows/NativeFlow.js";
import {OIDCService} from "./service/OIDCService.js";

// noinspection JSUnusedGlobalSymbols
export class AuthService {

    constructor(authority,
                clientId,
                autoLogin = false,
                electronRedirectUrl = "http://localhost/",
                capacitorRedirectUrl = "http://localhost/") {

        const oidcService = new OIDCService(authority, clientId);

        if (isCapacitorNative(window)) {
            this.flow = new NativeFlow(oidcService, autoLogin, capacitorRedirectUrl);
        } else if (isElectron()) {
            this.flow = new NativeFlow(oidcService, autoLogin, electronRedirectUrl);
        } else {
            this.flow = new BrowserFlow(oidcService, autoLogin);
        }
    }

    login() {
        this.flow.login();
    }

    isLoggedIn() {
        return this.flow.isLoggedIn();
    }

    getRoles() {
        return this.flow.getRoles();
    }

    async getToken() {
        return await this.flow.getToken();
    }

    async tryToRefresh() {
        return await this.flow.tryToRefresh();
    }

    logout() {
        this.flow.logout();
    }
}
