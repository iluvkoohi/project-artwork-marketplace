import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import { loadingState } from './state/recoilState';
import { useRecoilValue } from 'recoil';

import PageLogin from './pages/account/login';
import PageRegistration from './pages/account/registration';
import LoadingOverlay from 'react-loading-overlay-ts';
import { SyncLoader } from 'react-spinners';
import PageArtistMain from './pages/artist/artist_main';
import PagePlayground from './pages/artist/playground';


const PrivateRoute = ({ component: Compontent, authenticated }) => {
  return authenticated ? <Compontent /> : <Navigate to="/" />;
}

function App() {
  const loading = useRecoilValue(loadingState);
  const loadingRef = React.createRef(null);

  return (
    <LoadingOverlay
      active={loading}
      ref={loadingRef}
      spinner={<SyncLoader color='pink' size={10} />}>
      <div style={{ height: "100vh" }}>
        <Routes>
          <Route path="/" element={<PageLogin />} />
          <Route path="/registration" element={<PageRegistration />} />

          <Route path="/artist/main" element={<PrivateRoute authenticated={false} component={PageArtistMain} />} />
          <Route path="/playground" element={<PagePlayground />} />
        </Routes>
      </div>
    </LoadingOverlay>

  )
}

export default App