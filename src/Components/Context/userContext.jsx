import React, { createContext, useEffect, useState } from 'react'

export let userContext = createContext();

export default function UserContextProvider({ children }) {
    const [userToken, setUserToken] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (localStorage.getItem('userToken')) {
            setUserToken(localStorage.getItem('userToken'));
        }
        if (localStorage.getItem('userId')) {
            setUserId(localStorage.getItem('userId'));
        }
    }, [])

    return (
        <userContext.Provider value={{
            userToken,
            setUserToken,
            userId,
            setUserId
        }}>
            {children}
        </userContext.Provider>
    );
}