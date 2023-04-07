# Authenticate users with OpenID Connect authentication service (f.e. Keycloak) in browser, Electron, or Capacitor app
[![License](https://img.shields.io/:license-MIT-green.svg)](https://github.com/Misha999777/tcomad-oidc/blob/master/LICENSE)

## Main features:
1. TypeScript support
2. ESModule support
3. Logging user in using redirect to the auth service
4. Working in browser, Electron and Capacitor applications
5. Checking user role
6. Getting user info claims
7. Supplying access token for requests to the back-end
8. Automatic refreshing of the access token with refresh token when it expires
9. Logging out user from the application and from the auth service

## How to use
### 1. Install library using npm

<pre>npm install tcomad-oidc --save</pre>

### 2. Import AuthService

<pre>import {AuthService} from "tcomad-oidc";</pre>

### 3. Initialize AuthService

<pre>new AuthService(Config.AUTHORITY, Config.CLIENT_ID);</pre>

Constructor arguments:
1. authority: URL to the authentication service (http://[host]/auth/realms/[realm-name])
2. clientId: ID of the application registered within authentication service
3. (OPTIONAL) errorHandler: callback function that will be called in case of auth errors
    * (error) => console.log(error)
4. (OPTIONAL) autoLogin: Determines whether authentication should start automatically when page loaded
   * Defaults to false
5. (OPTIONAL) URL which must be used to return user to Electron app
    * Will only be used if Electron context detected
    * Defaults to "http://localhost/"
6. (OPTIONAL) URL which must be used to return user to Capacitor app
    * Will only be used if Capacitor context detected
    * Defaults to http://localhost/"


### 4. Start login
Login will be started automatically if it was configured to do so, if no, you can start
it by
<pre>authService.login()</pre>

### 5. Check login status
You can check login status with
<pre>authService.isLoggedIn()</pre>

### 6. Get user's roles
To get user's roles you can use
<pre>authService.getRoles()</pre>

### 7. Get user info claims
To get user info claim you can use
<pre>authService.getUserInfo("name")</pre>

### 8. Get access token to make requests
You can get user access token with (a refresh attempt will be made if token is expiring)
<pre>authService.getToken()</pre>

### 9. Force to refresh the token
You can force lib to refresh the token silently with:
<pre>authService.tryToRefresh()</pre>

### 10. Logout user
You can log out user from your application and authentication service with
<pre>authService.logout()</pre>

## Copyright

Released under the MIT License.
See the [LICENSE](https://github.com/Misha999777/tcomad-oidc/blob/master/LICENSE) file.