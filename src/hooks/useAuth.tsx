import {useCallback, useEffect, useRef, useState} from "react";
import {GetUserInfo} from "../routes/routes";
import CookieService from "../services/CookieService";
import axios from "../api/axios";
import useError from "./useError";
import {useLocation, useNavigate} from "react-router-dom";
import {User} from "../services/User";
let timeout: any = null;

const useAuth = () => {
    //states in useAuth hook
    const [expireTime, setExpireTime] = useState<number>(parseInt(CookieService.get('expireTimeCookie')))
    const [token, setToken] = useState<string | null>(CookieService.get('access_token'));
    const [refreshToken, setRefreshToken] = useState<string | null>(CookieService.get('refresh_token'));
    const [rememberMe, setRememberMe] = useState<boolean>(!!CookieService.get('rememberMe'));
    const [userinfo, setUserInfo] = useState<any>({});
    const setError = useError()
    const initialize = useRef<boolean>(false)
    const navigate = useNavigate()
    const location = useLocation();

    useEffect(() => {
        let dateNow = new Date()
        let dateNowMillis = dateNow.getTime()
        if (token) {
            if (!User.data) {
                if (dateNowMillis > expireTime) {
                    updateAccessToken()
                } else {
                    userInfo()
                }
            } else {
                timeout = setTimeout(async () => {
                    if (refreshToken){
                        await updateAccessToken()
                    }
                }, expireTime - dateNowMillis)
            }
        } else if (!token && initialize.current) {
            logout()
        }
        else  {
            initialize.current = true
        }
    },[token, User.data])

    // this will check if are login to fill the states with data

    const login = useCallback(async (token: string | null, refresh_token: string, expireToken: number, selected: boolean) => {
        if (token !== null && token !== '') {
            let dateNow = new Date()
            let dateNowMillis = dateNow.getTime()
            let expireTokenMillis = expireToken * 1000
            let expireTimeCookie = parseInt(((dateNowMillis + expireTokenMillis)).toString()) - 60000
            if (selected) {
                CookieService.set('rememberMe', selected, {expires:  new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))})
                CookieService.set('expireTimeCookie', expireTimeCookie,{expires:  new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))})
                CookieService.set('access_token', token, {expires:  new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))})
                CookieService.set('refresh_token', refresh_token, {expires:  new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))})
            } else {
                CookieService.set('access_token', token,{expires:  new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))})
            }

            await userInfo();
            setToken(token);
            setRefreshToken(refresh_token);
            setRememberMe(selected);
            setExpireTime(expireTimeCookie);
        }

    }, [token, refreshToken, rememberMe])

// // authenticate function makes login request
//     const authenticate = useCallback(async (params: ILoginParams, selected: boolean) => {
//         try {
//             console.log('a hina authenticate')
//             const response = await loginFunction(params);
//             await login(response.data.access_token, response.data.refresh_token, response.data.expires_in, selected)
//         } catch (err) {
//         } catch (err) {
//             setError(err)
//         }
//
//     }, [login])


// userInfo function to get user data

    const userInfo = useCallback(async () => {
        try {
            const response = await GetUserInfo();
            setUserInfo(response)
            User.data = response
            const userPermissionsName = [].concat.apply([], response?.roles.map(role => role.permissions.map(permission => permission.name)));
            if(!token) {
                navigate('/', {replace: true})
            } else {
                if (userPermissionsName.find(userPermission => userPermission.startsWith("system.backoffice")) || userPermissionsName.find(userPermission => userPermission.startsWith("system.user")) || userPermissionsName.length === 0) {
                    navigate(location.pathname, {replace: true})
                }
            }
        } catch (err) {
            setError(err, logout);
        }
    }, [])
// logout function will remove and empty every state

    const logout = useCallback(async () => {
        try {
            navigate('/', {replace: true})
            CookieService.remove('access_token')
            CookieService.remove('refresh_token')
            CookieService.remove('rememberMe')
            CookieService.remove('expireTimeCookie')
            setUserInfo(null)
            setRefreshToken(null)
            clearTimeout(timeout)
            setToken(null)
            timeout = null;

        }catch (err) {
            setError(err)
        }
    }, [token, User.data, refreshToken])

// updateAccessToken will make request for refresh Token to keep user loggedIn

    const updateAccessToken = useCallback(async () => {
        try {
            const response = await axios.post('auth/token', {
                client_id: 2,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                client_secret: 'hTt2G5eizAuvWEp4ORMGxbb5I8PDWk7nGsGsTcfP'
            });
            let dateNow = new Date()
            let dateNowMillis = dateNow.getTime()
            let expireTokenMillis = response.data.expires_in * 1000
            let expireTimeCookie = parseInt(((dateNowMillis + expireTokenMillis)).toString()) - 60000
            if (rememberMe) {
                CookieService.set('expireTimeCookie', expireTimeCookie, {expires:  new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))})
                CookieService.set('access_token', response.data.access_token, {expires:  new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))})
                CookieService.set('refresh_token', response.data.refresh_token, {expires:  new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))})
                CookieService.set('rememberMe', true, {expires:  new Date(Date.now() + (7 * 24 * 60 * 60 * 1000))})
            }
            setExpireTime(expireTimeCookie)
            setToken(response.data.access_token)
            setRefreshToken(response.data.refresh_token)
            // setTokens(prevState => {
            //     return {
            //         ...prevState,
            //         token: response.data.access_token,
            //         refresh_token: response.data.refresh_token
            //     }
            // })
        } catch (err) {
            setError(err, logout);
        }
    }, [token, refreshToken, rememberMe, expireTime])

// can function permission function which checks if there ise any permissions of user

    const can = (permission: string): boolean => {
        let rolePermissions = userinfo?.roles?.filter((x: any) => x.permissions.find((y: any) => y.name == permission)) ?? [];
        return rolePermissions.length != 0;
    }

    return {
        token,
        login,
        logout,
        refreshToken,
        can
    }
}
export default useAuth;