# Authenticate users with OpenID Connect authentication service (f.e. Keycloak) in browser, Electron, or Capacitor app
[![License](https://img.shields.io/:license-MIT-green.svg)](https://github.com/Misha999777/tcomad-oidc/blob/master/LICENSE)

## Main features:
1. TypeScript support
2. ESModule support
3. Working with React, Angular and other popular front-end libraries
4. Working in browser, Electron and Capacitor applications
5. Logging user in using redirect to the auth service
7. Getting user info claims
8. Supplying access token for requests to the back-end
9. Automatic refreshing of the access token with refresh token when it expires
10. Logging user out from the application and from the auth service

## How to use
### 1. Install library using npm

<pre>npm install auth-oidc --save</pre>

### 2. Import AuthService

<pre>import {AuthService} from "auth-oidc";</pre>

### 3. Initialize AuthService

<pre>new AuthService(config);</pre>

Config object fields:
1. **authority**: URL to the authentication service (f.e. http://[host]/realms/[realm-name])
2. **clientId**: ID of the application registered within authentication service
3. (OPTIONAL) **errorHandler**: callback function that will be called in case of auth errors
    * Defaults to (error) => console.log(error)
4. (OPTIONAL) **autoLogin**: Determines whether authentication should start automatically when page loaded
    * Defaults to false
5. (OPTIONAL) **electronRedirectUrl**: URL which must be used to return user to Electron app
    * Will only be used if Electron context detected
    * Defaults to "http://localhost/"
6. (OPTIONAL) **capacitorRedirectUrl**: URL which must be used to return user to Capacitor app
    * Will only be used if Capacitor context detected
    * Defaults to http://localhost/"


### 4. Start login
Login will be started automatically if it was configured to do so, if no, you can start
it by
<pre>authService.login()</pre>

### 5. Check login status
You can check login status with
<pre>authService.isLoggedIn()</pre>

### 6. Get user info claims
To get user info claim you can use
<pre>authService.getUserInfo("name")</pre>

### 7. Get access token to make requests
You can get user access token with
<pre>authService.getToken()</pre>

### 8. Force refresh
You can force lib to refresh tokens and user info with:
<pre>authService.tryToRefresh()</pre>

### 9. Logout user
You can log out user from your application and authentication service with
<pre>authService.logout()</pre>

## Copyright

Released under the MIT License.
See the [LICENSE](https://github.com/Misha999777/tcomad-oidc/blob/master/LICENSE) file.
