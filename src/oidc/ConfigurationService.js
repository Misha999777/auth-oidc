export class ConfigurationService {

  CONFIGURATION_ENDPOINT = '/.well-known/openid-configuration'

  constructor(authority) {
    this.authority = authority
  }

  async getAuthEndpoint() {
    if (!this.config) {
      await this._load()
    }

    return this.config?.authorization_endpoint
  }

  async getTokenEndpoint() {
    if (!this.config) {
      await this._load()
    }

    return this.config?.token_endpoint
  }

  async getUserInfoEndpoint() {
    if (!this.config) {
      await this._load()
    }

    return this.config?.userinfo_endpoint
  }

  async getLogoutEndpoint() {
    if (!this.config) {
      await this._load()
    }

    return this.config?.end_session_endpoint
  }

  _load() {
    const url = [this.authority, this.CONFIGURATION_ENDPOINT].join('')

    return fetch(url, {method: 'GET'})
      .then(response => response.json())
      .then(json => {
        this.config = json
      })
  }
}
