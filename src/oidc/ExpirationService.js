export class ExpirationService {

  constructor(actions) {
    this.actions = actions
  }

  watchExpiration() {
    this._checkExpiration()
    setInterval(this._checkExpiration.bind(this), 5000)
  }

  _checkExpiration() {
    if (!this.actions.checkExpiration()) {
      delete this.actions.reload
      return
    }

    this.actions.refresh()
      .then(() => this.actions.reload && this.actions.reload())
      .catch(e => {
        if (e.message !== 'Failed to fetch') {
          this.actions.forgetSession()
        }
      })
  }
}