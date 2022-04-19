declare module 'tcomad-oidc' {
    export class AuthService {

        constructor(authority: string, clientId: string, redirectUri: string, autoLogin: boolean);

        isLoggedIn(): boolean;
        hasRole(role: string): boolean;
        getToken(): Promise<string>;
        login(): void;

        logout(): void;
    }
}