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

        getUserInfo(claim: string): any;

        getToken(): string;

        tryToRefresh(): Promise<void>;

        logout(): void;
    }
}