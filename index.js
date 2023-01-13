import {BrowserService} from "./src/service/BrowserService.js";
import {OIDCService} from "./src/service/OIDCService.js";
import {isCapacitorNative, isElectron} from "./src/utils/EnvUtils.js";

// noinspection JSUnusedGlobalSymbols
export class AuthService extends BrowserService {

    constructor(authority,
                clientId,
                autoLogin = false,
                errorHandler = (error) => console.log(error),
                electronRedirectUrl = "http://localhost/",
                capacitorRedirectUrl = "http://localhost/") {

        const oidcService = new OIDCService(authority, clientId);

        if (isCapacitorNative(window)) {
            super(oidcService, autoLogin, errorHandler, capacitorRedirectUrl);
        } else if (isElectron()) {
            super(oidcService, autoLogin, errorHandler, electronRedirectUrl);
        } else {
            super(oidcService, autoLogin, errorHandler);
        }
    }
}