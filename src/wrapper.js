import React, { useEffect } from 'react'
import LoadingOverlay from 'react-loading-overlay-ts';
import { loadingState } from './state/recoilState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { SyncLoader } from 'react-spinners';
import { profileState as atomProfileState } from "./state/recoilState";
import { Profile } from './controllers/profile';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Wrapper({ children }) {
  const profileController = new Profile();

  const [profileState, setProfileState] = useRecoilState(atomProfileState);
  const profileValue = useRecoilValue(atomProfileState);
  const loading = useRecoilValue(loadingState);

  const navigate = useNavigate();
  const location = useLocation();
  const loadingRef = React.createRef(null);

  const getProfile = async () => {
    if (location.pathname === "/" || location.pathname == "/registration") return;
    if (!profileValue) {
      const response = await profileController.get();
      if (response.data) {
        console.log("wrapper.js getProfile()");
        return setProfileState(response.data);
      }
      return navigate("/");
    }
  }

  useEffect(() => {
    getProfile();
  }, [])

  return <LoadingOverlay
    active={loading}
    ref={loadingRef}
    spinner={<SyncLoader color='pink' size={10} />}>
    <div style={{ height: "100vh" }}>
      {children}
    </div>
  </LoadingOverlay >;
}
