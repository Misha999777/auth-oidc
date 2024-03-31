export class StorageService {

  AUTH = 'active_auth'
  ACTIVE_REDIRECT_URI = 'active_auth_redirect_uri'

  setAuth(auth) {
    localStorage.setItem(this.AUTH, JSON.stringify(auth))
  }

  setUserInfo(userInfo) {
    const session = JSON.parse(localStorage.getItem(this.AUTH))
    session.user_info = userInfo
    localStorage.setItem(this.AUTH, JSON.stringify(session))
  }

  getAuth() {
    return JSON.parse(localStorage.getItem(this.AUTH))
  }

  getUserInfo() {
    const session = JSON.parse(localStorage.getItem(this.AUTH))
    return session.user_info
  }

  getUserClaim(claim) {
    const session = JSON.parse(localStorage.getItem(this.AUTH))
    return session.user_info[claim]
  }

  getExpiration() {
    const session = JSON.parse(localStorage.getItem(this.AUTH))
    return session.expires_at
  }

  getIdToken() {
    const session = JSON.parse(localStorage.getItem(this.AUTH))
    return session.id_token
  }

  getAccessToken() {
    const session = JSON.parse(localStorage.getItem(this.AUTH))
    return session.access_token
  }

  getRefreshToken() {
    const session = JSON.parse(localStorage.getItem(this.AUTH))
    return session.refresh_token
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
