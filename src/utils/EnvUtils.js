export function isElectron () {
  return typeof navigator === 'object' &&
        typeof navigator.userAgent === 'string' &&
        navigator.userAgent.indexOf('Electron') >= 0
}

export function isCapacitorNative() {
  const capacitor = window.Capacitor

  return !!(capacitor && capacitor.isNativePlatform)
}
