declare module 'tcomad-oidc' {

    // noinspection JSUnusedGlobalSymbols
    export class AuthService {

        constructor(authority: string, clientId: string, autoLogin: boolean);

        isLoggedIn(): boolean;
        login(): void;
        hasRole(role: string): boolean;
        getToken(): Promise<string>;
        logout(): void;
    }
}