import { populateDefaults } from '../utils/ConfigUtil.js'
import { OIDCService } from '../oidc/OIDCService.js'
import { StorageService } from '../oidc/StorageService.js'
import { BrowserService } from './BrowserService.js'

export class AuthService {

  constructor(userConfig) {
    this.config = populateDefaults(userConfig)

    this.oidcService = new OIDCService(this.config.authority, this.config.clientId)
    this.storageService = new StorageService()

    let browserService = new BrowserService(this.config.errorHandler, this.config.autoLogin, this.oidcService,
      this.isLoggedIn.bind(this), this.login.bind(this))

    browserService.pageLoaded()
  }

  login(callbackUrl) {
    this.oidcService.signInRedirect(callbackUrl ?? this.config.callbackUrl ?? window.location.href)
      .catch(() => this.config.errorHandler('Auth failed: cant perform login redirect'))
  }

  logout(callbackUrl) {
    this.oidcService.signOutRedirect(callbackUrl ?? this.config.callbackUrl ?? window.location.href)
      .catch(() => this.config.errorHandler('Auth failed: cant perform logout redirect'))
  }

  isLoggedIn() {
    return this.oidcService.isLoggedIn()
  }

  getUserInfo(claim) {
    if (!this.isLoggedIn()) {
      throw new Error('No active auth or auth is in progress')
    }

    return this.storageService.getUserClaim(claim)
  }

  getToken() {
    if (!this.isLoggedIn()) {
      throw new Error('No active auth or auth is in progress')
    }

    return this.storageService.getAccessToken()
  }

  async tryToRefresh() {
    if (!this.isLoggedIn()) {
      throw new Error('No active auth or auth is in progress')
    }

    return this.oidcService.signInSilent()
  }
}
