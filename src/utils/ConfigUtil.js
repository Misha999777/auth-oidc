export function populateDefaults (config) {
  return {
    ...config,
    autoLogin: config.autoLogin ?? false,
    errorHandler: config.errorHandler ?? defaultErrorHandler,
    electronRedirectUrl: config.electronRedirectUrl ?? 'http://localhost/',
    capacitorRedirectUrl: config.capacitorRedirectUrl ?? 'http://localhost/'
  }
}

export function defaultErrorHandler(error) {
  console.log(error)
}
