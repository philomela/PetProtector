import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => localStorage.getItem('userinfo') ? JSON.parse(localStorage.getItem('userinfo')) : {});
    const handleSetAuth = (authProps) => {
        localStorage.setItem('userInfo', JSON.stringify(authProps));
        setAuth(authProps);
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth: handleSetAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;