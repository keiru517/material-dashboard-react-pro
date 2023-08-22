/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useContext, useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import AuthService from "services/auth-service";
import { AuthContext } from "context";

// Authentication layout components
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";

// Image
import bgImage from "assets/images/illustrations/illustration-reset.jpg";

import GoogleLogin from '../google-login';

function Login() {
  const authContext = useContext(AuthContext);
  const [rememberMe, setRememberMe] = useState(false);
  const [inputs, setInputs] = useState({
    email: "admin@jsonapi.com",
    password: "secret",
  });
  const [errors, setErrors] = useState({
    emailError: false,
    passwordError: false,
    credentialsErros: false,
    textError: "",
  });

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const changeHandler = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const mailFormat =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (inputs.email.trim().length === 0 || !inputs.email.trim().match(mailFormat)) {
      setErrors({ ...errors, emailError: true });
      return;
    }

    if (inputs.password.trim().length < 6) {
      setErrors({ ...errors, passwordError: true });
      return;
    }

    const newUser = { email: inputs.email, password: inputs.password };

    const myData = {
      data: {
        type: "token",
        attributes: { ...newUser },
      },
    };

    try {
      const response = await AuthService.login(myData);
      authContext.login("fake_token", "fake_token");
      // authContext.login(response.access_token, response.refresh_token);
    } catch (res) {
      if (res.hasOwnProperty("message")) {
        setErrors({ ...errors, credentialsErros: true, textError: res.message });
      } else {
        setErrors({ ...errors, credentialsErros: true, textError: res.errors[0].detail });
      }
    }

    return () => {
      setInputs({
        email: "",
        password: "",
      });

      setErrors({
        emailError: false,
        passwordError: false,
        credentialsErros: false,
        textError: "",
      });
    };
  };

  return (
    <IllustrationLayout
      title="Sign In"
      description="Enter your email and password to sign in"
      illustration={bgImage}
    >
      <MDBox component="form" role="form" method="POST" onSubmit={submitHandler}>
        <MDBox display="flex" justifyContent="center" alignItems="center" flexDirection="column">
          <MDTypography color="dark" fontWeight="light" variant="body2" mb={1}>
            You can sign in with 3 user types:
          </MDTypography>
          <MDBox display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <MDBox
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              mb={2}
            >
              <MDTypography variant="body2" textAlign="center">
                <MDTypography component="span" variant="body2" sx={{ fontWeight: "medium" }}>
                  admin@jsonapi.com
                </MDTypography>
                &nbsp;with password&nbsp;
                <MDTypography component="span" variant="body2" sx={{ fontWeight: "medium" }}>
                  secret
                </MDTypography>
              </MDTypography>
              <MDTypography variant="body2" textAlign="center">
                <MDTypography component="span" variant="body2" sx={{ fontWeight: "medium" }}>
                  creator@jsonapi.com
                </MDTypography>
                &nbsp;with password&nbsp;
                <MDTypography component="span" variant="body2" sx={{ fontWeight: "medium" }}>
                  secret
                </MDTypography>
              </MDTypography>
              <MDTypography variant="body2" textAlign="center">
                <MDTypography component="span" variant="body2" sx={{ fontWeight: "medium" }}>
                  member@jsonapi.com
                </MDTypography>
                &nbsp;with password&nbsp;
                <MDTypography component="span" variant="body2" sx={{ fontWeight: "medium" }}>
                  secret
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            type="email"
            label="Email"
            fullWidth
            name="email"
            value={inputs.email}
            onChange={changeHandler}
            error={errors.emailError}
          />
        </MDBox>
        <MDBox mb={2}>
          <MDInput
            type="password"
            label="Password"
            fullWidth
            name="password"
            value={inputs.password}
            onChange={changeHandler}
            error={errors.passwordError}
          />
        </MDBox>
        <MDBox display="flex" alignItems="center" ml={-1}>
          <Switch checked={rememberMe} onChange={handleSetRememberMe} />
          <MDTypography
            variant="button"
            fontWeight="regular"
            color="text"
            onClick={handleSetRememberMe}
            sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
          >
            &nbsp;&nbsp;Remember me
          </MDTypography>
        </MDBox>
        {errors.credentialsErros && (
          <MDTypography variant="caption" color="error" fontWeight="light">
            {errors.textError}
          </MDTypography>
        )}
        <MDBox mt={4} mb={1}>
          <MDButton variant="gradient" color="info" size="large" fullWidth type="submit">
            sign in
          </MDButton>
          <GoogleLogin />
        </MDBox>
        <MDBox mt={3} mb={1} textAlign="center">
          <MDTypography variant="button" color="text">
            Forgot your password? Reset it{" "}
            <MDTypography
              component={Link}
              to="/auth/forgot-password"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              here
            </MDTypography>
          </MDTypography>
        </MDBox>
        <MDBox mt={3} textAlign="center">
          <MDTypography variant="button" color="text">
            Don&apos;t have an account?{" "}
            <MDTypography
              component={Link}
              to="/auth/register"
              variant="button"
              color="info"
              fontWeight="medium"
              textGradient
            >
              Sign up
            </MDTypography>
          </MDTypography>
        </MDBox>
      </MDBox>
    </IllustrationLayout>
  );
}

export default Login;
