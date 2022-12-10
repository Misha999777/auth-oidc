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

        getRoles(): Array<string>;

        getUsername(): string;

        getToken(): Promise<string>;

        tryToRefresh(): Promise<void>;

        logout(): void;
    }
}