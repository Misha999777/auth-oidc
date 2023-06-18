import { ConfigurationService } from './ConfigurationService.js'

export class OIDCService {

  CLIENT_ID_PARAMETER = 'client_id'
  REDIRECT_URI_PARAMETER = 'redirect_uri'
  POST_LOGOUT_REDIRECT_URI_PARAMETER = 'post_logout_redirect_uri'
  ID_TOKEN_HINT_URI_PARAMETER = 'id_token_hint'
  RESPONSE_TYPE_PARAMETER = 'response_type'
  SCOPE_URI_PARAMETER = 'scope'

  CODE = 'code'
  OPEN_ID = 'openid'
  AUTH = 'active_auth'
  ACTIVE_REDIRECT_URI = 'active_auth_redirect_uri'

  constructor(authority, clientId) {
    if (!authority || !clientId) {
      throw new Error('Wrong configuration')
    }

    this.clientId = clientId
    this.configurationService = new ConfigurationService(authority)

    this._watchExpiration()
      .then(() => window.location.reload())
    setInterval(this._watchExpiration.bind(this), 5000)
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

    localStorage.setItem(this.ACTIVE_REDIRECT_URI, redirectUri)

    window.location.href = href
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
          redirect_uri: localStorage.getItem(this.ACTIVE_REDIRECT_URI)
        })
      })

    const json = await response.json()

    if (!json.expires_in) {
      throw new Error('Cant obtain token')
    }

    json.expires_at = Date.now() + json.expires_in * 1000

    localStorage.setItem(this.AUTH, JSON.stringify(json))

    await this._getUserInfo()
  }

  async signInSilent() {
    const endpoint = await this.configurationService.getTokenEndpoint()

    if (!endpoint) {
      throw new Error('Cant obtain endpoint')
    }

    const session = this.getSession()

    const response = await fetch(endpoint,
      {
        method: 'POST',
        body: new URLSearchParams({
          refresh_token: session.refresh_token,
          grant_type: 'refresh_token',
          client_id: this.clientId
        })
      })

    if (!response.ok) {
      throw new Error('Cant refresh token')
    }

    const json = await response.json()
    json.expires_at = Date.now() + json.expires_in * 1000
    json.userInfo = session.userInfo

    localStorage.setItem(this.AUTH, JSON.stringify(json))

    await this._getUserInfo()
  }

  async signOutRedirect(redirectUri) {
    const endpoint = await this.configurationService.getLogoutEndpoint()

    if (!endpoint) {
      throw new Error('Cant obtain endpoint')
    }

    const idToken = this.getSession().id_token

    const parameters = [
      this._constructParam(this.POST_LOGOUT_REDIRECT_URI_PARAMETER, encodeURIComponent(redirectUri)),
      this._constructParam(this.ID_TOKEN_HINT_URI_PARAMETER, idToken)
    ].join('&')

    const href = [endpoint, '?', parameters].join('')

    localStorage.removeItem(this.AUTH)

    window.location.href = href
  }

  isLoggingIn() {
    return !!localStorage.getItem(this.ACTIVE_REDIRECT_URI)
  }

  cancelLogin() {
    localStorage.removeItem(this.ACTIVE_REDIRECT_URI)
  }

  getSession() {
    return JSON.parse(localStorage.getItem(this.AUTH))
  }

  async _getUserInfo() {
    const endpoint = await this.configurationService.getUserInfoEndpoint()

    if (!endpoint) {
      throw new Error('Cant obtain endpoint')
    }

    const auth = this.getSession()

    const response = await fetch(endpoint,
      {
        method: 'GET',
        headers: [['Authorization', 'Bearer ' + auth.access_token]]
      })

    if (!response.ok) {
      throw new Error('Cant get user info')
    }

    auth.userInfo = await response.json()

    localStorage.setItem(this.AUTH, JSON.stringify(auth))
  }

  _constructParam(name, value) {
    return name.concat('=')
      .concat(value)
  }

  _watchExpiration() {
    return new Promise((resolve) => {
      if (!this.getSession()?.userInfo || !this._isExpiring()) {
        return
      }

      this.signInSilent()
        .then(() => resolve())
        .catch(e => {
          if (e.message !== 'Failed to fetch') {
            this._forgetSession()
            window.location.reload()
          }
        })
    })
  }

  _isExpiring() {
    return this.getSession().expires_at < Date.now() + 30000
  }

  _forgetSession() {
    localStorage.removeItem(this.AUTH)
  }
}