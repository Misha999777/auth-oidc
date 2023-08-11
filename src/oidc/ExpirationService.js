export class ExpirationService {

  constructor(actions) {
    this.actions = actions
  }

  watchExpiration() {
    this._checkExpiration()
    setInterval(this._checkExpiration.bind(this), 5000)
  }

  _checkExpiration() {
    if (!this.actions.checkExpirationFunc()) {
      delete this.actions.onRefresh
      return
    }

    this.actions.refreshFunc()
      .then(() => this.actions.onRefresh && this.actions.onRefresh())
      .catch(e => {
        if (e.message !== 'Failed to fetch') {
          this.actions.onFail()
        }
      })
  }
}