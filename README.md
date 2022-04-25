# Authenticate users with OpenID authentication service (fe. Keycloak) in browser, Electron, or Capacitor app

## Main features:
1. Login using redirect to auth service
2. Authenticating inside an Electron app
3. Authenticating inside a Capacitor app
4. TypeScript support
5. Saving user info
6. Checking user role
7. Supplying access token for requests to the back-end
8. Automatic refreshing of the access token with refresh token when it expires
9. Logging out user from the application and from the auth service

## How to use
### 1. Install library using npm

<pre>npm install tcomad-oidc --save</pre>

**WARNING: You will have to install thr next Capacitor plugins
to use this library inside a Capacitor app:**

<pre>
npm install @capacitor/app --save
npm install @capacitor/browser --save
npm install @capacitor/core --save
</pre>

### 2. Import AuthService

<pre>import {AuthService} from "tcomad-oidc";</pre>

### 3. Initialize AuthService

<pre>new AuthService(Config.AUTHORITY, Config.CLIENT_ID);</pre>

Constructor arguments:
1. Authority: URL to the authentication service (http://[server-address]/auth/realms/[realm-name])
2. Client ID: ID of the application registered within authentication service
3. (OPTIONAL) Determines whether authentication should start automatically when page loaded
    * Defaults to true
4. (OPTIONAL) URL which must be used to return to Electron app
    * Will only be used if Electron context detected
    * Defaults to "electron"
5. (OPTIONAL) URL which must be used to return to Capacitor app
    * Will only be used if Capacitor context detected
    * Defaults to "capacitor://callback"


### 4. Start login
Login will be started automatically if it was configured to do so, if no, you can start
it by
<pre>authService.login()</pre>

**WARNING: Do not place login() into componentDidMount(), ngOnInit(), etc... as it will break authentication process.
Use autoLogin option if you want users to be redirected to the auth server as soon as they open your application**

### 5. Check login status
You can check login status to redirect user th their home if they are already logged in

<pre>
componentDidMount() {
    if (authService.isLoggedIn()) {
        this.props.history.push("/bots");
    }
};
</pre>

### 6. Check if current user has required role
To check use role you can use
<pre>authService.hasRole("ROLE_NAME")</pre>

### 7. Get access token to make requests
You can get user access token with (token will be automatically refreshed if ti is expired)
<pre>authService.getToken()</pre>

### 8. Force to refresh the token
You can force lib to refresh the token silently with:
<pre>authService.tryToRefresh()</pre>

### 9. Logout user
You can log out user from your application and authentication service with
<pre>authService.logout()</pre>