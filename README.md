# Small JS library to authenticate with OpenID authentication service (f.e. Keycloak)

## Main features:
1. Login using redirect to auth service
2. Save user info
3. Check user role
4. Supply access token for requests to the back-end
5. Automatically refresh access token with refresh token when it expires
6. Logout user from the application and from the auth service

## How to use (React App Example)
### 1. Install library using npm

<pre>npm install tcomad-oidc --save</pre>
### 2. Import AuthService

<pre>import {AuthService} from "tcomad-oidc";</pre>

### 3. Initialize AuthService

<pre>new AuthService(Config.AUTHORITY, Config.CLIENT_ID, Config.REDIRECT_URI, true);</pre>

Constructor arguments:
1. Authority: URL to the authentication service (http://[server-address]/auth/realms/[realm-name])
2. Client Id: Id of the application registered within authentication service
3. Redirect URI: address of your application home page (user will be returned to this page from authentication server)
4. AutoLogin: if true - login will automatically start when user opens your application
otherwise you must call authService.login() to start login process manually

### 4. Start login
Login will be started automatically if it was configured to do so, if no, you can start
it by
<pre>authService.login()</pre>

**WARNING: Do not place login() into componentDidMount() as it will break authentication process.
Use autoLogin option if you want users to be redirected to the auth server as soon as they open your application**

### 5. Check login status
You can check login status to redirect user th their home if they are already logged in

<pre>
componentDidMount() {
    if (authService.isLoggedIn) {
        this.props.history.push("/bots");
    }
};
</pre>

### 6. Check if current user has required role
To check use role you can use
<pre>authService.hasRole("ROLE_NAME")</pre>

### 7. Get access token to make requests
You can get user access token with (token will be automatically refreshed if ti is expired)
<pre>await authService.getToken()</pre>

### 8. Logout user
You can logout user from your application and authentication service with
<pre>authService.logout()</pre>