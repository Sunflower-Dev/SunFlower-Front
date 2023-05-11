import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../../axios-global';
import PrimaryButton from '../../../../UI/Bottons/PrimaryButton';
import SecondaryButton from '../../../../UI/Bottons/SecondaryButton';
import Input from '../../../../UI/Inputs/Input';
import Popup from '../../../../UI/Popup/Popup';
import classes from './AddFolder.module.css'

const AddFolder = (props) => {

    const [IsClosing, SetIsClosing] = useState(false)
    const [IsSumbitting, setIsSumbitting] = useState(false)

    const { id, FolderID } = useParams();
    const [EditData, setEditData] = useState(props.Folder ? props.Folder : {})
    const [FormData, setFormData] = useState(props.Folder ? props.Folder : {})

    const history = useHistory()

    const closeClickHandler = () => {
        SetIsClosing(true)

        setTimeout(() => {
            history.goBack();
        }, 300);
    }
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData(data => { return { ...data, [name]: value } });
        setEditData(data => { return { ...data, [name]: value } });
    };


    const onsubmitHandler = async (event) => {
        event.preventDefault();

        try {
            var URL = ""
            var EditURL = ""

            URL = "/online-office/AddFolder/" + id
            EditURL = 'online-office/EditFolder/' + id + '/' + FolderID

            setIsSumbitting(true)
            if (props.type === 'NEW') {
                const call = await axiosInstance.post(URL, FormData)
                var responseadd = call.data
                if (responseadd) {
                    setIsSumbitting(false)
                    history.goBack()
                }
            } else {


                const call = await axiosInstance.put(EditURL, FormData)
                var ResponseEdit = call.data
                if (ResponseEdit) {
                    setIsSumbitting(false)
                    history.goBack()
                }
            }

        } catch (error) {
            console.log(error);
        }

    }

    return (
        <form onSubmit={onsubmitHandler}>

            <Popup width="680px" IsClosing={IsClosing}>
                <div className={classes.header}>
                    <span className={`font-600 text-black ${window.innerWidth > 550 ? "size-14" : "size-7"}`}> {props.type === "NEW" ? "Add Folder" : "Edit Folder"}</span>
                    {window.innerWidth > 550 ?
                        <img src={`/svg/${window.innerWidth > 550 ? "close" : "arrow-left"}.svg`} width="30px" alt="close" onClick={closeClickHandler} />
                        :
                        <span className={`font-400 text-lightgray size-3`}> Enter a name to{props.type === "NEW" ? "create a new" : "rename the"} folder</span>
                    }
                </div>
                <div className={classes.body}>
                    <Input
                        type="text"
                        placeholder="Write your text"
                        label={window.innerWidth > 550 ? "Folder name" : ""}
                        className={classes.inputrow}
                        onChange={handleChange}
                        name="Title"
                        value={EditData.Title}

                    />

                </div>

                {window.innerWidth > 550 ?
                    <div className={classes.Action}>
                        <PrimaryButton
                            type="submit"
                            IsLoading={IsSumbitting}
                            className={`font-500 size-6`}
                            style={{ padding: "14px 28px" }}>
                            {props.type === "NEW" ? "Add" : "Edit"}
                        </PrimaryButton>

                        <SecondaryButton onClick={closeClickHandler} type="button"
                            style={{ padding: "14px 28px", height: "52px" }}>
                            <span className={`font-500 text-darkgray size-6`}>cancel</span>
                        </SecondaryButton>
                    </div>

                    :
                    <div className={classes.Action}>

                        <SecondaryButton onClick={closeClickHandler} type="button"
                            style={{ height: "52px" }}>
                            <span className={`font-500 text-darkgray size-4`}>cancel</span>
                        </SecondaryButton>

                        <PrimaryButton
                            type="submit"
                            IsLoading={IsSumbitting}
                            className={`font-500 size-4`}>
                            {props.type === "NEW" ? "Add folder" : "Save folder"}
                        </PrimaryButton>


                    </div>
                }

            </Popup>

        </form >
    )

}
export default AddFolder