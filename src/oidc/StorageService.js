export class StorageService {

    AUTH = 'active_auth'
    ACTIVE_REDIRECT_URI = 'active_auth_redirect_uri'

    constructor() {}

    setAuth(auth) {
        localStorage.setItem(this.AUTH, JSON.stringify(auth));
    }

    setUserInfo(userInfo) {
        const session = localStorage.getItem(this.AUTH);
        session.userInfo = JSON.stringify(userInfo);
        localStorage.setItem(this.AUTH, session);
    }

    getAuth() {
        return localStorage.getItem(this.AUTH);
    }

    getUserInfo() {
        return localStorage.getItem(this.AUTH).userInfo;
    }

    getUserClaim(claim) {
        const session = localStorage.getItem(this.AUTH);
        return session.userInfo[claim]
    }

    getExpiration() {
        return localStorage.getItem(this.AUTH).expires_at;
    }

    getIdToken() {
        return localStorage.getItem(this.AUTH).id_token;
    }

    getAccessToken() {
        return localStorage.getItem(this.AUTH).access_token;
    }

    getRefreshToken() {
        return localStorage.getItem(this.AUTH).refresh_token;
    }

    removeAuth() {
        localStorage.removeItem(this.AUTH)
    }

    setRedirectUri(redirectUri) {
        localStorage.setItem(this.ACTIVE_REDIRECT_URI, redirectUri)
    }

    getRedirectUri() {
        return localStorage.getItem(this.ACTIVE_REDIRECT_URI)
    }

    removeRedirectUri() {
        localStorage.removeItem(this.ACTIVE_REDIRECT_URI)
    }
}