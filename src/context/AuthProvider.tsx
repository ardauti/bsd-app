import { createContext } from "react";

const AuthContext = createContext<{token: string | null, refreshToken:null | string, login: (token: string, refresh_token: string, expireToken:number, isSelected: boolean) => void, logout: () => void, can: (permissions: string) => boolean}>({
    token: null,
    refreshToken: null,
    login: () => {},
    logout: () => {},
    can: (permissions: string) => false
});

export const AuthProvider = AuthContext.Provider;
export default AuthContext;
