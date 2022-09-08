import React, { useEffect } from 'react'
import { Profile } from '../../controllers/profile'

export default function PageArtistMain() {
    const profileController = new Profile();

    const getProfile = async () => {
        const response = await profileController.get();
        console.log(response.data)
    }
    useEffect(() => {
        getProfile();
        return () => { }
    }, [])

    return (
        <div>PageArtistMain</div>
    )
}
