declare module 'auth-oidc' {

    export class AuthService {
        constructor(config: Config)

        login(callbackUrl?: string): void
        isLoggedIn(): boolean
        getUserInfo(claim: string): any
        getToken(): string
        tryToRefresh(): Promise<void>
        logout(callbackUrl?: string): void
    }

    export interface Config {
        authority: string
        clientId: string
        callbackUrl?: string
        autoLogin?: boolean
        errorHandler?: (error: string) => void
    }
}
