import {UserManager, WebStorageStateStore} from "oidc-client";

export function createManger(authority, clientId) {
    return new UserManager({
        authority: authority,
        metadata: {
            issuer: authority,
            authorization_endpoint: authority + "/protocol/openid-connect/auth",
            token_endpoint: authority + "/protocol/openid-connect/token",
            userinfo_endpoint: authority + "/protocol/openid-connect/userinfo",
            end_session_endpoint: authority + "/protocol/openid-connect/logout"
        },
        client_id: clientId,
        response_type: 'code',
        userStore: new WebStorageStateStore({store: window.localStorage})
    });
}