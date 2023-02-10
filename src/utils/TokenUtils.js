export function extractRoles(session) {
    let decodedPayload = decodePayload(session['access_token'])
    let realmAccess = JSON.parse(decodedPayload)['realm_access'];

    return !!realmAccess ? realmAccess['roles'] : [];
}

export function extractUsername(session) {
    let decodedPayload = decodePayload(session['id_token']);

    return JSON.parse(decodedPayload)['preferred_username'];
}

function decodePayload(token) {
    let tokenPayload = token.split(".")[1];

    return atob(toBase64(tokenPayload));
}

function toBase64(base64url) {
    base64url = base64url.toString();
    
    return padString(base64url)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
}

function padString(input) {
    let segmentLength = 4;
    let stringLength = input.length;
    let diff = stringLength % segmentLength;

    if (!diff) {
        return input;
    }

    let padLength = segmentLength - diff;

    while (padLength--) {
        input += "=";
    }

    return input;
}
