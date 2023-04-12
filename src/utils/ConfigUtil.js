export function populateDefaults (config) {
  return {
    ...config,
    autoLogin: config.autoLogin ?? false,
    errorHandler: config.errorHandler ?? (error => console.log(error)),
    electronRedirectUrl: config.electronRedirectUrl ?? 'http://localhost/',
    capacitorRedirectUrl: config.capacitorRedirectUrl ?? 'http://localhost/'
  }
}
