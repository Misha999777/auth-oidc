export function extractRoles(session) {
    let accessToken = session.access_token;
    let tokenPayload = accessToken.split(".")[1];

    let decodedPayload = atob(toBase64(tokenPayload));

    return JSON.parse(decodedPayload).realm_access?.roles;
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
