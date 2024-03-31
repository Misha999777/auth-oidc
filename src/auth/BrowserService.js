export class BrowserService {

  constructor(errorHandler, autoLogin, oidcService, isLoggedIn, login) {
    this.errorHandler = errorHandler
    this.autoLogin = autoLogin

    this.oidcService = oidcService

    this.isLoggedIn = isLoggedIn
    this.login = login
  }

  pageLoaded() {
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

      return this.oidcService.signInRedirectCallback(code)
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
