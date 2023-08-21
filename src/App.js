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

import { useState, useEffect, useMemo, useContext } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import { setupAxiosInterceptors } from "services/interceptor";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React examples
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 PRO React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 PRO React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 PRO React routes
import routes from "routes";
import crudRoutes from "crud.routes";

// Material Dashboard 2 PRO React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator, AuthContext } from "context";

import { getPermissions } from "config/Permissions";

// Images
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import ProtectedRoute from "examples/ProtectedRoute";
import Login from "auth/login";
import Register from "auth/register";
import ForgotPassword from "auth/forgot-password";
import ResetPassword from "auth/reset-password";
import AuthService from "services/auth-service";
import { MetaTags } from "react-meta-tags";

export default function App({ ability }) {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  const authContext = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState({ name: "", image: "" });

  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    setIsDemo(process.env.REACT_APP_IS_DEMO === "true");
  }, []);

  // if the token expired or other errors it logs out and goes to the login page
  const navigate = useNavigate();
  setupAxiosInterceptors(() => {
    authContext.logout();
    navigate("/auth/login");
  });

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    if (!authContext.isAuthenticated) return;
    (async () => {
      const id = await authContext.getCurrentUser();
      const response = await AuthService.getProfile();
      setUserDetails({
        name: response.data.attributes.name,
        image: response.data.attributes.profile_image,
      });
      const rules = await getPermissions(id);
      ability.update(rules);
    })();
  }, [authContext.isAuthenticated]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.key === "user-name") {
        route.name = userDetails.name;
        route.icon = <MDAvatar src={userDetails.image} alt="Brooklyn Alice" size="sm" />;
      }
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={
              <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
                {route.component}
              </ProtectedRoute>
            }
            key={route.key}
          />
        );
      }

      return null;
    });

  const getCrudRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getCrudRoutes(route.collapse);
      }
      if (route.route) {
        return (
          <Route
            exact
            path={route.route}
            element={
              <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
                {route.component}
              </ProtectedRoute>
            }
            key={route.key}
          />
        );
      }

      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <>
      {isDemo && (
        <MetaTags>
          <meta
            name="keywords"
            content="creative tim, updivision, material, node.js json:api, html dashboard, node.js, react, api admin, pro react node.js, html css dashboard node.js, material dashboard node.js, node.js api, pro react material dashboard, material admin, pro react dashboard, pro react admin, web dashboard, bootstrap 5 dashboard node.js, bootstrap 5, css3 dashboard, bootstrap 5 admin node.js, material dashboard bootstrap 5 node.js, frontend, api dashboard, responsive bootstrap 5 dashboard, api, material dashboard, material node.js bootstrap 5 dashboard, json:api"
          />
          <meta
            name="description"
            content="Full stack app with hundreds of reusable UI components powered by MUI component library, React and Node.js API"
          />
          <meta
            itemProp="name"
            content="Material Dashboard 2 React Node.js by Creative Tim & UPDIVISION"
          />
          <meta
            itemProp="description"
            content="Full stack app with hundreds of reusable UI components powered by MUI component library, React and Node.js API"
          />
          <meta
            itemProp="image"
            content="https://s3.amazonaws.com/creativetim_bucket/products/689/original/react-material-dashboard-pro-nodejs.jpg?1664790326"
          />
          <meta name="twitter:card" content="product" />
          <meta name="twitter:site" content="@creativetim" />
          <meta
            name="twitter:title"
            content="Material Dashboard 2 React Node.js by Creative Tim & UPDIVISION"
          />
          <meta
            name="twitter:description"
            content="Full stack app with hundreds of reusable UI components powered by MUI component library, React and Node.js API"
          />
          <meta name="twitter:creator" content="@creativetim" />
          <meta
            name="twitter:image"
            content="https://s3.amazonaws.com/creativetim_bucket/products/689/original/react-material-dashboard-pro-nodejs.jpg?1664790326"
          />
          <meta property="fb:app_id" content="655968634437471" />
          <meta
            property="og:title"
            content="Material Dashboard 2 React Node.js by Creative Tim & UPDIVISION"
          />
          <meta property="og:type" content="article" />
          <meta
            property="og:url"
            content="https://www.creative-tim.com/live/react-material-dashboard-node.js-pro/"
          />
          <meta
            property="og:image"
            content="https://s3.amazonaws.com/creativetim_bucket/products/689/original/react-material-dashboard-pro-nodejs.jpg?1664790326"
          />
          <meta
            property="og:description"
            content="Full stack app with hundreds of reusable UI components powered by MUI component library, React and Node.js API"
          />
          <meta property="og:site_name" content="Creative Tim" />
        </MetaTags>
      )}
      {direction === "rtl" ? (
        <CacheProvider value={rtlCache}>
          <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
            <CssBaseline />
            {layout === "dashboard" && (
              <>
                <Sidenav
                  color={sidenavColor}
                  brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                  brandName="Material Dashboard PRO"
                  routes={routes}
                  onMouseEnter={handleOnMouseEnter}
                  onMouseLeave={handleOnMouseLeave}
                />
                <Configurator />
                {configsButton}
              </>
            )}
            {layout === "vr" && <Configurator />}
            <Routes>
              <Route path="/auth/login" element={<Login />} />
              {getRoutes(routes)}
              <Route path="*" element={<Navigate to="/dashboards/analytics" />} />
            </Routes>
          </ThemeProvider>
        </CacheProvider>
      ) : (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
          <CssBaseline />
          {layout === "dashboard" && (
            <>
              <Sidenav
                color={sidenavColor}
                brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                brandName="Material Dashboard PRO"
                routes={routes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
              <Configurator />
              {configsButton}
            </>
          )}
          {layout === "vr" && <Configurator />}
          <Routes>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            {getRoutes(routes)}
            {getCrudRoutes(crudRoutes)}
            <Route path="*" element={<Navigate to="/dashboards/analytics" />} />
          </Routes>
        </ThemeProvider>
      )}
    </>
  );
}
