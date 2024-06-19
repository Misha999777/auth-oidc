declare module 'auth-oidc' {

    export class AuthService {
        constructor(config: Config)

        login(returnToUrl?: string): void
        isLoggedIn(): boolean
        getUserInfo(claim: string): any
        getToken(): string
        tryToRefresh(): Promise<void>
        logout(returnToUrl?: string): void
    }

    export interface Config {
        authority: string
        clientId: string
        autoLogin?: boolean
        errorHandler?: (error: string) => void
    }
}
