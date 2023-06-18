import { BrowserService } from './src/service/BrowserService.js'
import { OIDCService } from './src/service/OIDCService.js'
import { isCapacitorNative, isElectron } from './src/utils/EnvUtils.js'
import { populateDefaults } from './src/utils/ConfigUtil.js'

export class AuthService extends BrowserService {

  constructor (userConfig) {
    const config = populateDefaults(userConfig)

    const oidcService = new OIDCService(config.authority, config.clientId)

    if (isCapacitorNative(window)) {
      super(oidcService, config.autoLogin, config.errorHandler, config.capacitorRedirectUrl)
    } else if (isElectron()) {
      super(oidcService, config.autoLogin, config.errorHandler, config.electronRedirectUrl)
    } else {
      super(oidcService, config.autoLogin, config.errorHandler)
    }
  }
}
