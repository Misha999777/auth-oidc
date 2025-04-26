export function populateDefaults(config) {
  return {
    ...config,
    autoLogin: config.autoLogin ?? false,
    errorHandler: config.errorHandler ?? defaultErrorHandler,
  }
}

export function defaultErrorHandler(error) {
  console.log(error)
}
