import {useCallback, useContext} from "react";
import {useSnackbar} from "notistack";
import AuthContext from "../context/AuthProvider";
import {useNavigate} from "react-router-dom";
import CookieService from "../services/CookieService";

const useError = () => {
    const {logout} = useContext(AuthContext);
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()

    return useCallback((error, logOut = null,) => {
        error = errorHandler(error)
        console.log('error', error)
// cases of what type of status error we could have
        switch (error.status) {
            case 401:
                enqueueSnackbar('Unauthorized!', {variant: 'error'});
                if (logOut) {
                    console.log('logout2', logOut)
                    logOut();
                } else {
                    console.log('logout1', logout)
                    logout();
                }
                break;
            case 400:
                enqueueSnackbar('Invalid username or password!', {variant: 'error'});
                break;
            case 404:
                enqueueSnackbar('Not Found!', {variant: 'error'});
                break;
            case 422:
                enqueueSnackbar('Requested action could not be performed!', {variant: 'error'});
                break;
            default:
                enqueueSnackbar('Something went wrong', {variant: 'error'})
                break;

        }
    }, [])






}

export default useError

//function which handle errors
const errorHandler = (error) => {
    console.log(error)
    if (error.response) {
        console.log(error.response)

        return {
            message: error.response.data.message,
            status: error.response.status || 500
        }
    } else {
        return {
            message: 'something went wrong',
            status: error.response?.status || 500
        }
    }
}

