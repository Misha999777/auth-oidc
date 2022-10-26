import {BrowserFlow} from "./flows/BrowserFlow.js";
import {isCapacitorNative, isElectron} from "./utils/EnvUtils.js";
import {NativeFlow} from "./flows/NativeFlow.js";
import {createManger} from "./utils/ManagerUtils.js";

// noinspection JSUnusedGlobalSymbols
export class AuthService {

    constructor(authority,
                clientId,
                autoLogin = false,
                electronRedirectUrl = "http://localhost/",
                capacitorRedirectUrl = "http://localhost/") {

        const manager = createManger(authority, clientId);
        const session = "oidc.user:" + authority + ":" + clientId;

        if (isCapacitorNative(window)) {
            this.flow = new NativeFlow(manager, session, autoLogin, capacitorRedirectUrl);
        } else if (isElectron()) {
            this.flow = new NativeFlow(manager, session, autoLogin, electronRedirectUrl);
        } else {
            this.flow = new BrowserFlow(manager, session, autoLogin);
        }
    }

    login() {
        this.flow.login();
    }

    isLoggedIn() {
        return this.flow.isLoggedIn();
    }

    hasRole(role) {
        return this.flow.hasRole(role);
    }

    hasAnyRole() {
        return this.flow.hasAnyRole();
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
