import React, { useEffect } from 'react'
import { Authentication } from '../../controllers/authenticaiton';

function PagePlayground() {
    const account = new Authentication();

    const logout = async () => {
        await account.logout();
    }

    useEffect(() => {
        logout();
        return () => {

        }
    }, [])

    return (
        <div>PagePlayground</div>
    )
}

export default PagePlayground