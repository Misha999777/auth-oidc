declare module 'auth-oidc' {

    export class AuthService {
        constructor(config: Config);

        login(): void;
        isLoggedIn(): boolean;
        getUserInfo(claim: string): any;
        getToken(): string;
        tryToRefresh(): Promise<void>;
        logout(): void;
    }

    export interface Config {
        authority: string;
        clientId: string;
        autoLogin?: boolean;
        errorHandler?: (error: string) => void;
        electronRedirectUrl?: string;
        capacitorRedirectUrl?: string;
    }
}