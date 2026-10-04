# Authenticate users with OpenID Connect authentication service

## How to use

### Quick Start Example

```javascript
import { AuthService } from 'auth-oidc';

const config = {
  authority: 'http://example.com/realms/my-realm',
  clientId: 'my-app-id',
  autoLogin: false
};

const authService = new AuthService(config);

if (!authService.isLoggedIn()) {
  authService.login();
} else {
  const token = authService.getToken();
  console.log('User Token:', token);
}
```
### 1. Install library using npm

```bash
npm install auth-oidc --save
```

### 2. Import AuthService

```javascript
import { AuthService } from 'auth-oidc';
```

### 3. Initialize AuthService

```javascript
const authService = new AuthService(config);
```

**Config object fields:**

| Property       | Type     | Required | Default                         | Description                                                                    |
| :------------- | :------- | :------- | :------------------------------ | :----------------------------------------------------------------------------- |
| `authority`    | string   | Yes      | -                               | URL to the authentication service (e.g., `http://[host]/realms/[realm-name]`)  |
| `clientId`     | string   | Yes      | -                               | ID of the application registered within authentication service                 |
| `autoLogin`    | boolean  | No       | `false`                         | Whether authentication should start automatically on page load                 |
| `callbackUrl`  | string   | No       | `window.location.href`          | A URL the user will be returned to after completing login/logout               |
| `errorHandler` | function | No       | `(error) => console.log(error)` | Callback function that will be called in case of auth errors                   |


### 4. Start login
Login will be started automatically if it was configured to do so, if no, you can start
it by:
```javascript
authService.login();
```
You can also override a URL the user will be returned to after login:
```javascript
authService.login('http://localhost:3000/page');
```

### 5. Check login status
You can check login status with:
```javascript
const isLoggedIn = authService.isLoggedIn();
```

### 6. Get user info claims
To get user info claim you can use:
```javascript
const name = authService.getUserInfo('name');
```

### 7. Get access token to make requests
You can get user access token with:
```javascript
const token = authService.getToken();
```

### 8. Force refresh
You can force lib to refresh tokens and user info with:
```javascript
authService.tryToRefresh();
```

### 9. Logout user
You can log out user from your application and authentication service with:
```javascript
authService.logout();
```
You can also override a URL the user will be returned to after logout:
```javascript
authService.logout('http://localhost:3000/page');
```

## Copyright

Released under the MIT License.
See the [LICENSE](https://github.com/Misha999777/auth-oidc/blob/master/LICENSE) file.
