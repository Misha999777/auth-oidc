import {Capacitor} from "@capacitor/core";
import {BrowserFlow} from "./flows/BrowserFlow.js";
import {CapacitorFlow} from "./flows/CapacitorFlow.js";
import {isElectron} from "./utils/EnvUtils.js";
import {ElectronFlow} from "./flows/ElectronFlow.js";
import {createManger} from "./utils/ManagerUtils.js";

// noinspection JSUnusedGlobalSymbols
export class AuthService {

    constructor(authority,
                clientId,
                autoLogin = false,
                electronRedirectUrl = null,
                capacitorAppBundle = null) {

        const manager = createManger(authority, clientId);
        const session = "oidc.user:" + authority + ":" + clientId;

        if (Capacitor.isNativePlatform()) {
            this.flow = new CapacitorFlow(manager, session, capacitorAppBundle);
        } else if (isElectron()) {
            this.flow = new ElectronFlow(manager, session, electronRedirectUrl);
        } else {
            this.flow = new BrowserFlow(manager, session);
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
