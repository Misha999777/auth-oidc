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

        getUserInfo(claim: string): string;

        getToken(): string;

        tryToRefresh(): Promise<void>;

        logout(): void;
    }
}