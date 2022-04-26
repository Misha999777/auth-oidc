export function extractRoles(session) {
    let accessToken = JSON.parse(session).access_token;
    let tokenPayload = accessToken.split(".")[1];

    let decodedPayload = atob(tokenPayload);

    return JSON.parse(decodedPayload).realm_access.roles;
}