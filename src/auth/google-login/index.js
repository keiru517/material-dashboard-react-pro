import { useContext } from 'react';

import { GoogleLogin } from 'react-google-login';
// refresh token
import { refreshTokenSetup } from '../utils/refreshToken';
import { AuthContext } from 'context';
import React from 'react';

const clientId =
'564029370783-uml2he9fv7jq7ofjoq7lfc1uu66298nn.apps.googleusercontent.com'
  // '527122128300-uhqsfmmroea78ml6l4omnemeeudo6q6i.apps.googleusercontent.com';
  // "707788443358-u05p46nssla3l8tmn58tpo9r5sommgks.apps.googleusercontent.com";

function Login() {
  const authContext = useContext(AuthContext);

  const onSuccess = (res) => {
    console.log("token Object", res.tokenObj.access_token)
    console.log('Login Success: currentUser:', res.profileObj);
    // alert(
    //   `Logged in successfully welcome ${res.profileObj.name} 😍. \n See console for full profile object.`
    // );
    // refreshTokenSetup(res);

    authContext.login(res.tokenObj.access_token);
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(
      `Failed to login.`
    );
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
      />
    </div>
  );
}

export default Login;
