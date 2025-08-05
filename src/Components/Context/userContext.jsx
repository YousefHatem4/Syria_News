import React, { createContext, useEffect, useState } from 'react'


export let userContext = createContext();

export default function UserContextProvider({ children }) {
    const [userToken, setUserToken] = useState(null);

    useEffect(() => {
        if (localStorage.getItem('userToken')) {
            setUserToken(localStorage.getItem('userToken'));
        }
    }, [])

    return <userContext.Provider value={{ userToken, setUserToken }}>
        {children}
    </userContext.Provider>

}