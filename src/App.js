import React, { useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate, Outlet } from "react-router-dom";
import { loadingState } from './state/recoilState';
import { useRecoilState, useRecoilValue } from 'recoil';

import PageLogin from './pages/account/login';
import PageRegistration from './pages/account/registration';
import LoadingOverlay from 'react-loading-overlay-ts';
import { SyncLoader } from 'react-spinners';
import PageArtistMain from './pages/artist/artist_main';
import PagePlayground from './pages/artist/playground';
import { Validate } from './controllers/validate';
import PageEditProfile from './pages/artist/artist_edit_profile';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const loading = useRecoilValue(loadingState);
  const [_loading, setLoading] = useRecoilState(loadingState);
  const [validating, setValidating] = useState(true);
  const loadingRef = React.createRef(null);
  const validateController = new Validate();

  const validateRequest = async () => {
    if (location.pathname === "/" || location.pathname === "/registration") return;
    console.log("Authenticating Request");

    const response = await validateController.request();
    if (response !== 200) {
      navigate("/", { replace: false });
      setValidating(false);
      console.log("Authentication Failed");
    }
    if (response == 200) {
      console.log("Authentication Success");
    }
    setValidating(false);
    console.log("Authentication Completed");
  }


  useEffect(() => {
    let isApiSubscribed = true;
    if (isApiSubscribed) {
      validateRequest();
    }
    return () => {
      isApiSubscribed = false;
    };
  }, [location.pathname]);


  return validating == true ? null : <LoadingOverlay
    active={loading}
    ref={loadingRef}
    spinner={<SyncLoader color='pink' size={10} />}>
    <div style={{ height: "100vh" }}>
      <Routes>
        <Route path="/" element={<PageLogin />} />
        <Route path="/registration" element={<PageRegistration />} />
        <Route path="/artist/main" element={<PageArtistMain />} />
        <Route path="/artist/profile/edit" element={<PageEditProfile />} />

        <Route path="/playground" element={<PagePlayground />} />
      </Routes>
    </div>
  </LoadingOverlay >;



}
export default App;