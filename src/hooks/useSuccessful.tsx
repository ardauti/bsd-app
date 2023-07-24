import {useCallback, useContext} from "react";
import {useSnackbar} from "notistack";
import AuthContext from "../context/AuthProvider";
import {useNavigate} from "react-router-dom";

const useSuccessful = () => {
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()

    return useCallback((succses: any) => {
        succses = successHandler(succses)
        switch (succses.status) {
            case 200:
                enqueueSnackbar('Created!', {variant: 'success'});
                break;
            case 201:
                enqueueSnackbar('Invalid username or password!', {variant: 'success'});
                break;
            default:
                enqueueSnackbar('Something went wrong', {variant: 'success'})
                break;
            case 202:
                enqueueSnackbar('!', {variant: 'success'});
                // navigate('/', {replace: true})
                break;
        }
    }, [])






}
export default useSuccessful()

const successHandler = (success: any) => {
    if (success.response) {
        console.log(success.response)

        return {
            message: success.response.data.message,
            status: success.response.status || 200
        }
    } else {
        return {
            message: 'Created',
            status: success.response?.status || 200
        }
    }
}
