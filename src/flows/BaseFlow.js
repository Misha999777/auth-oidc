import {extractRoles} from "../utils/TokenUtils.js";

export class BaseFlow {

    constructor(userManager, sessionName) {
        this.userManager = userManager;
        this.sessionName = sessionName;
    }

    isLoggedIn() {
        return !!localStorage.getItem(this.sessionName);
    }

    hasRole(role) {
        if (this.isLoggedIn()) {
            let session = localStorage.getItem(this.sessionName);
            let userRoles = extractRoles(session);
            return userRoles.includes(role);
        } else {
            return false;
        }
    }

    async getToken() {
        if (localStorage.getItem(this.sessionName)) {
            if (JSON.parse(localStorage.getItem(this.sessionName)).expires_at < Date.now() / 1000) {
                await this.tryToRefresh();
            }

            let session = JSON.parse(localStorage.getItem(this.sessionName));
            if (session) {
                return session.access_token;
            }
        }
        return null;
    }

    async tryToRefresh() {
        try {
            await this.userManager.signinSilent();
        } catch (e) {
            if (e.message !== "Network Error") {
                localStorage.removeItem(this.sessionName);
                window.location.reload()
            }
        }
    }

}