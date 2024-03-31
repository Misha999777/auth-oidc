import {ConfigurationService} from './ConfigurationService.js'
import {ExpirationService} from './ExpirationService.js'
import {StorageService} from './StorageService.js'

export class OIDCService {

  CLIENT_ID_PARAMETER = 'client_id'
  REDIRECT_URI_PARAMETER = 'redirect_uri'
  POST_LOGOUT_REDIRECT_URI_PARAMETER = 'post_logout_redirect_uri'
  ID_TOKEN_HINT_URI_PARAMETER = 'id_token_hint'
  RESPONSE_TYPE_PARAMETER = 'response_type'
  SCOPE_URI_PARAMETER = 'scope'

  CODE = 'code'
  OPEN_ID = 'openid'

  WATCHER_ACTIONS = {
    checkExpiration: () => {
      return this.isLoggedIn() && this.storageService.getExpiration() < Date.now() + 30000
    },
    forgetSession: () => {
      this.storageService.removeAuth()
      window.location.reload()
    },
    reload: () => {
      window.location.reload()
    },
    refresh: async () => {
      await this.signInSilent()
    }
  }

  constructor(authority, clientId) {
    if (!authority || !clientId) {
      throw new Error('Wrong configuration')
    }

    this.clientId = clientId

    this.configurationService = new ConfigurationService(authority)
    this.expirationWatcher = new ExpirationService(this.WATCHER_ACTIONS)
    this.storageService = new StorageService()

    this.expirationWatcher.watchExpiration()
  }

  async signInRedirect(redirectUri) {
    const endpoint = await this.configurationService.getAuthEndpoint()

    if (!endpoint) {
      throw new Error('Cant obtain endpoint')
    }

    const parameters = [
      this._constructParam(this.CLIENT_ID_PARAMETER, this.clientId),
      this._constructParam(this.REDIRECT_URI_PARAMETER, encodeURIComponent(redirectUri)),
      this._constructParam(this.RESPONSE_TYPE_PARAMETER, this.CODE),
      this._constructParam(this.SCOPE_URI_PARAMETER, this.OPEN_ID)
    ].join('&')

    const href = [endpoint, '?', parameters].join('')

    this.storageService.setRedirectUri(redirectUri)
    window.location.replace(href)
  }

  async signInRedirectCallback(code) {
    const endpoint = await this.configurationService.getTokenEndpoint()

    if (!endpoint) {
      throw new Error('Cant obtain endpoint')
    }

    const response = await fetch(endpoint,
      {
        method: 'POST',
        body: new URLSearchParams({
          code,
          grant_type: 'authorization_code',
          client_id: this.clientId,
          redirect_uri: this.storageService.getRedirectUri()
        })
      })

    const json = await response.json()

    if (!json.expires_in) {
      throw new Error('Cant obtain token')
    }

    json.expires_at = Date.now() + json.expires_in * 1000

    this.storageService.setAuth(json)

    await this._getUserInfo()
  }

  async signInSilent() {
    const endpoint = await this.configurationService.getTokenEndpoint()

    if (!endpoint) {
      throw new Error('Cant obtain endpoint')
    }

    const response = await fetch(endpoint,
      {
        method: 'POST',
        body: new URLSearchParams({
          refresh_token: this.storageService.getRefreshToken(),
          grant_type: 'refresh_token',
          client_id: this.clientId
        })
      })

    const json = await response.json()

    if (!json.expires_in) {
      throw new Error('Cant refresh token')
    }

    json.expires_at = Date.now() + json.expires_in * 1000
    json.userInfo = this.storageService.getUserInfo()

    this.storageService.setAuth(json)

    await this._getUserInfo()
  }

  async signOutRedirect(redirectUri) {
    const endpoint = await this.configurationService.getLogoutEndpoint()

    if (!endpoint) {
      throw new Error('Cant obtain endpoint')
    }

    const parameters = [
      this._constructParam(this.POST_LOGOUT_REDIRECT_URI_PARAMETER, encodeURIComponent(redirectUri)),
      this._constructParam(this.ID_TOKEN_HINT_URI_PARAMETER, this.storageService.getIdToken())
    ].join('&')

    const href = [endpoint, '?', parameters].join('')

    this.storageService.removeAuth()

    window.location.replace(href)
  }

  isLoggedIn() {
    return !!this.storageService.getAuth() && !!this.storageService.getUserInfo()
  }

  isLoggingIn() {
    return !!this.storageService.getRedirectUri()
  }

  cancelLogin() {
    this.storageService.removeRedirectUri()
  }

  async _getUserInfo() {
    const endpoint = await this.configurationService.getUserInfoEndpoint()

    if (!endpoint) {
      throw new Error('Cant obtain endpoint')
    }

    const response = await fetch(endpoint,
      {
        method: 'GET',
        headers: [['Authorization', 'Bearer ' + this.storageService.getAccessToken()]]
      })

    const json = await response.json()

    if (!json.sub) {
      throw new Error('Cant get user info')
    }

    this.storageService.setUserInfo(json)
  }

  _constructParam(name, value) {
    return name.concat('=')
      .concat(value)
  }
}
