import { useState } from "react"
import { useSelector } from "react-redux"
import { useHistory, useParams } from "react-router-dom"
import { axiosInstance } from "../../../../../axios-global"
import MobilePopup from "../MobilePopup"
import classes from "./ClientManager.module.css"

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const ClientManager = (props) => {

    const history = useHistory()
    const { id } = useParams()

    const Permissions = JSON.parse(useSelector((state) => state.Auth.Admin)).Permissions

    const [Progress, setProgress] = useState('')



    const deletepopupClickHandler = () => {
        history.replace('/Client/' + id + "/Delete")


    }
    const EditMemberClickHandler = () => {
        history.replace('/Client/' + id + "/Edit")
    }

    const ChangeAvatarClickHandler = async (event) => {

        try {
            const formData = new FormData();
            formData.append("File", event.target.files[0]);

            const call = await axiosInstance({
                method: "POST",
                url: '/clients/ChangeAvatar/' + id,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const progress = (progressEvent.loaded / progressEvent.total) * 100;
                    setProgress(" | " + parseInt(progress) + '%');

                },
                onDownloadProgress: (progressEvent) => {
                    const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
                    setProgress(" | " + parseInt(progress) + '%');
                },
            })
            if (call) {

                toast.success('Avatar Updated!', {
                    position: "bottom-center",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                props.SetAvatar(call.data.Avatar)
                history.goBack()
            }

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <MobilePopup>

            {Permissions.Edit.includes('client') &&
                <div className="mb-22">
                    <label htmlFor="Client_Avatar" className={`${classes.ActionItem} size-4 font-400 text-darkgray`}>
                        <img src="/svg/profile.svg" alt="cancel" width={24} /> <span>Change Avatar {Progress}</span>
                    </label>
                    <input type="file" id="Client_Avatar" style={{ display: "none" }} accept="image/*" onChange={ChangeAvatarClickHandler} />

                </div>
            }
            {Permissions.Edit.includes('client') &&
                <div className={`${classes.ActionItem} size-4 font-400 text-darkgray`} onClick={EditMemberClickHandler}>
                    <img src="/svg/edit-black.svg" alt="cancel" width={24} /> <span>Edit client</span>
                </div>
            }

            {Permissions.Delete.includes('client') &&
                <div className={`${classes.ActionItem} size-4 font-400 text-darkgray`} onClick={deletepopupClickHandler}>
                    <img src="/svg/trash-black.svg" alt="delete" width={24} /> <span>Delete client</span>
                </div>
            }

        </MobilePopup>
    )
}

export default ClientManager