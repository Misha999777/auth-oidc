# Authenticate users with OpenID authentication service (f.e. Keycloak) in browser, Electron, or Capacitor app

## Main features:
1. TypeScript support
2. ESModule support
3. Logs user in using redirect to the auth service
4. Works in browser, Electron and Capacitor
5. Checking user role
6. Supplying access token for requests to the back-end
7. Automatic refreshing of the access token with refresh token when it expires
8. Logging out user from the application and from the auth service

## How to use
### 1. Install library using npm

<pre>npm install tcomad-oidc --save</pre>

### 2. Import AuthService

<pre>import {AuthService} from "tcomad-oidc";</pre>

### 3. Initialize AuthService

<pre>new AuthService(Config.AUTHORITY, Config.CLIENT_ID);</pre>

Constructor arguments:
1. Authority: URL to the authentication service (http://[host]/auth/realms/[realm-name])
2. Client ID: ID of the application registered within authentication service
3. (OPTIONAL) Determines whether authentication should start automatically when page loaded
    * Defaults to true
4. (OPTIONAL) URL which must be used to return user to Electron app
    * Will only be used if Electron context detected
    * Defaults to "http://localhost/"
5. (OPTIONAL) URL which must be used to return user to Capacitor app
    * Will only be used if Capacitor context detected
    * Defaults to http://localhost/"


### 4. Start login
Login will be started automatically if it was configured to do so, if no, you can start
it by
<pre>authService.login()</pre>

**WARNING: Do not place login() into componentDidMount(), ngOnInit(), etc... as it may break authentication process.
Use autoLogin option if you want users to be redirected to the auth server as soon as they open your application**

### 5. Check login status
You can check login status with
<pre>authService.isLoggedIn()</pre>

### 6. Get user's roles
To get user's roles you can use
<pre>authService.getRoles()</pre>

### 7. Get access token to make requests
You can get user access token with (token will be automatically refreshed if ti is expired)
<pre>authService.getToken()</pre>

### 8. Force to refresh the token
You can force lib to refresh the token silently with:
<pre>authService.tryToRefresh()</pre>

### 9. Logout user
You can log out user from your application and authentication service with
<pre>authService.logout()</pre>