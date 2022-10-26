declare module 'tcomad-oidc' {

    // noinspection JSUnusedGlobalSymbols
    export class AuthService {

        constructor(authority: string,
                    clientId: string,
                    autoLogin?: boolean,
                    electronRedirectUrl?: string,
                    capacitorAppBundle?: string);

        login(): void;

        isLoggedIn(): boolean;

        hasRole(role: string): boolean;

        hasAnyRole(): boolean;

        getToken(): Promise<string>;

        tryToRefresh(): Promise<void>;

        tryToRefresh(): Promise<void>;

        logout(): void;
    }
}