export class BaseFlow {

    constructor(userManager, sessionName) {
        this.userManager = userManager;
        this.sessionName = sessionName;
    }

    isLoggedIn() {
        let session = localStorage.getItem(this.sessionName);
        if (session) {
            return JSON.parse(session).expires_at > Date.now() / 1000
        }
        return false;
    }

    hasRole(role) {
        if (this.isLoggedIn()) {
            let session = localStorage.getItem(this.sessionName);
            return JSON.parse(session).profile.realm_access.roles.includes(role);
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
            localStorage.removeItem(this.sessionName);
            window.location.reload()
        }
    }

}