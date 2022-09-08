import React, { useEffect } from 'react'
import { Profile } from '../../controllers/profile'
import { useNavigate } from "react-router-dom";

export default function PageArtistMain() {
    const profileController = new Profile();
    const navigate = useNavigate();

    const getProfile = async () => {
        const response = await profileController.get();
    }

    const anotherFuction = () => {
        console.log("anotherFuction()");
    }

    useEffect(() => {
        getProfile();
        anotherFuction();
        return () => { }
    }, [])

    return (
        <div>PageArtistMain</div>
    )
}
