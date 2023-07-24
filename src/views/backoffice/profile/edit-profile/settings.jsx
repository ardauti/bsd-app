import {
    AccordionGroup,
    AccordionItem,
    Accordion,
    AccordionPanel,
    PreviewComponent,
} from "@/components";
import {changePassword, GetUserInfo} from "../../../../routes/routes";
import React, {useEffect, useState} from "react";
import CustomButton from "../../../../components/customButton/CustomButon";
import {useSnackbar} from "notistack";
import useError from "../../../../hooks/useError";
import {useForm} from "react-hook-form";


const Settings = () => {

    const [old_password, setOld_Password] = useState("");
    const [new_password, setNew_Password] = useState("");
    const [confirm_password, setConfirm_Password] = useState("");
    const [isLoading, setLoading] = useState(false);
    const {enqueueSnackbar} = useSnackbar()
    const setError = useError()



    const {getValues} = useForm({
        // mode: 'onChange',
    });
    const updateInfo = async (e) => {
        e.preventDefault()
        try {
            setLoading(true);
            const params = {
                old_password: old_password,
                new_password: new_password,
                new_password_confirmation: confirm_password
            }
            console.log(getValues('old_password'))
            console.log(old_password, new_password, confirm_password)
            const response = await changePassword(params)
            console.log(response)
            enqueueSnackbar('Your password has been updated', {variant: 'success'});
            setLoading(false)
        } catch (err) {
            setError(err)
            setLoading(false)
        }
    }
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await GetUserInfo();
                console.log(response)
            } catch (err) {
                setError(err)
                setLoading(false)
            }
        };
        fetchUserData()
    }, [])

    return (
        <div className="intro-y box">
            <div className="flex flex-col sm:flex-row items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                <h2 className="font-medium text-base mr-auto">Settings</h2>
            </div>
        <hr/>

        <PreviewComponent className="intro-y box">

            <form className='p-5' onSubmit={updateInfo}>
                <AccordionGroup>
                    <AccordionItem>
                        <Accordion>
                            <h2 className='m-3'>Change Password</h2>
                        </Accordion>
                        <AccordionPanel
                            className="text-slate-600 dark:text-slate-500 leading-relaxed">
                            <div>
                                <input
                                    onInput={(e) => {
                                        setOld_Password(e.target['value'])
                                    }}
                                    value={old_password}
                                    type="password" className="form-control"
                                    placeholder="Old-Password"
                                />

                            </div>
                            <br/>
                            <div>
                                <input
                                    onInput={(e) => {
                                        setNew_Password(e.target['value'])
                                    }}
                                    value={new_password}
                                    type="password" className="form-control "
                                    placeholder="Password"

                                />


                            </div>
                            <br/>
                            <div>
                                <input
                                    onInput={(e) => {
                                        setConfirm_Password(e.target['value'])
                                    }}
                                    value={confirm_password}
                                    type="password" className="form-control "
                                    placeholder="Confirm Password"

                                />
                            </div>
                            <br/>
                            <CustomButton type={'submit'}
                                          isLoading={isLoading}
                                          className={'btn btn-primary w-40'}
                                          children={'Save'}/>
                        </AccordionPanel>
                    </AccordionItem>
                </AccordionGroup>
            </form>
        </PreviewComponent>
        </div>
    );
}


export default Settings;
