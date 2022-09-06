import React from 'react'
import { Routes, Route } from "react-router-dom";
import { loadingState } from './state/recoilState';
import { useRecoilValue } from 'recoil';

import PageLogin from './pages/account/login';
import PageRegistration from './pages/account/registration';
import LoadingOverlay from 'react-loading-overlay-ts';
import { SyncLoader } from 'react-spinners';

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
        </Routes>
      </div>
    </LoadingOverlay>

  )
}

export default App