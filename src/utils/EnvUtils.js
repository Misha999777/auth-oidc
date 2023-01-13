export function isElectron() {
    return typeof navigator === 'object'
        && typeof navigator.userAgent === 'string'
        && navigator.userAgent.indexOf('Electron') >= 0;
}

export function isCapacitorNative(window) {
    const capacitor = window['Capacitor'];

    return !!(capacitor && capacitor['isNativePlatform']);
}