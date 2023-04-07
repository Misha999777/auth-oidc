declare module 'tcomad-oidc' {

    // noinspection JSUnusedGlobalSymbols
    export class AuthService {

        constructor(authority: string,
                    clientId: string,
                    autoLogin?: boolean,
                    errorHandler?: (error: string) => void,
                    electronRedirectUrl?: string,
                    capacitorAppBundle?: string);

        login(): void;

        isLoggedIn(): boolean;

        getRoles(): Array<string>;

        getClaim(claim: string): string;

        getToken(): Promise<string>;

        tryToRefresh(): Promise<void>;

        logout(): void;
    }
}