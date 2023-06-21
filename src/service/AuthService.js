import { populateDefaults } from "../utils/ConfigUtil.js";
import { OIDCService } from "./OIDCService.js";
import { isCapacitorNative, isElectron } from "../utils/EnvUtils.js";

export class AuthService {

  constructor (userConfig) {
    const config = populateDefaults(userConfig)

    const oidcService = new OIDCService(config.authority, config.clientId)

    this.oidcService = oidcService
    this.autoLogin = config.autoLogin
    this.errorHandler = config.errorHandler

    if (isCapacitorNative()) {
      this.redirectUrl = config.capacitorRedirectUrl
    } else if (isElectron()) {
      this.redirectUrl = config.electronRedirectUrl
    }

    this._init()
  }

  login() {
    this.oidcService.signInRedirect(this.redirectUrl ?? window.location.href)
      .catch(() => this.errorHandler('Auth failed: cant perform login redirect'))
  }

  logout() {
    this.oidcService.signOutRedirect(this.redirectUrl ?? window.location.href)
      .catch(() => this.errorHandler('Auth failed: cant perform logout redirect'))
  }

  isLoggedIn() {
    return !!this.oidcService.getSession()?.userInfo
  }

  getUserInfo(claim) {
    if (!this.isLoggedIn()) {
      throw new Error('No active auth or auth is in progress')
    }

    const session = this.oidcService.getSession()
    return session.userInfo[claim]
  }

  getToken() {
    if (!this.isLoggedIn()) {
      throw new Error('No active auth or auth is in progress')
    }

    return this.oidcService.getSession().access_token
  }

  async tryToRefresh() {
    if (!this.isLoggedIn()) {
      throw new Error('No active auth or auth is in progress')
    }

    return this.oidcService.signInSilent()
  }

  _init() {
    if (!this.oidcService.isLoggingIn() && !this.isLoggedIn() && this.autoLogin) {
      this.login()
      return
    }

    if (!window.location.href.includes('code') && this.oidcService.isLoggingIn()) {
      this.oidcService.cancelLogin()

      const url = new URL(window.location.href)

      url.searchParams.delete('error')
      url.searchParams.delete('error_description')
      window.history.replaceState({}, '', url.toString())

      this.login()
      return
    }

    if (this.oidcService.isLoggingIn()) {
      const url = new URL(window.location.href)

      const code = url.searchParams.get('code')

      url.searchParams.delete('code')
      url.searchParams.delete('session_state')

      this.oidcService.signInRedirectCallback(code)
        .then(() => {
          this.oidcService.cancelLogin()
          window.location.href = url.toString()
        })
        .catch(() => {
          this.oidcService.cancelLogin()
          window.history.replaceState({}, '', url.toString())
          this.errorHandler('Auth failed: cant obtain token')
        })
    }
  }
}