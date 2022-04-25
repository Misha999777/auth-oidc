export function isElectron() {
    return typeof navigator === 'object'
        && typeof navigator.userAgent === 'string'
        && navigator.userAgent.indexOf('Electron') >= 0;
}