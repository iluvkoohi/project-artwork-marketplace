import React, { useEffect } from 'react'
import { Authentication } from '../../controllers/authenticaiton';
import { useNavigate } from "react-router-dom";
import NavbarArtist from './artist_components/navbar';
import { useRecoilState } from 'recoil';
import { loadingState } from '../../state/recoilState';
import { Profile } from '../../controllers/profile';

export default function PageArtistMain() {
    const navigate = useNavigate();
    const [loading, setLoading] = useRecoilState(loadingState);

    const accountController = new Authentication();
    const profileController = new Profile();

    const logout = async () => {
        setLoading(true);
        await accountController.logout();
        navigate("/", { replace: true });
        setLoading(false);
    }

    const getOwnProfile = async () => {
        const response = await profileController.get();
        if (response.data === undefined) {
            return navigate("/artist/profile/edit", { replace: true });
        }
    }

    useEffect(() => {
        getOwnProfile();

        return () => {

        }
    }, [])

    return <>
        <NavbarArtist
            title={"Artwork Marketplace"}
            logout={() => logout()} />
    </>
}
