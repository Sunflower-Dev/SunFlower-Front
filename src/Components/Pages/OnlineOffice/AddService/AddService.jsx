import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom'
import { axiosInstance } from '../../../../axios-global';
import PrimaryButton from '../../../UI/Bottons/PrimaryButton';
import SecondaryButton from '../../../UI/Bottons/SecondaryButton';
import Input from '../../../UI/Inputs/Input';
import Popup from '../../../UI/Popup/Popup';
import classes from './AddService.module.css'

const AddService = (props) => {
    const [IsClosing, SetIsClosing] = useState(false)
    const [IsSumbitting, setIsSumbitting] = useState(false)

    const { id } = useParams();
    const [EditData, setEditData] = useState(props.Service ? props.Service : {})
    const [FormData, setFormData] = useState(props.Service ? props.Service : {})

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

    const MobileStyle = (window.innerWidth < 550 && props.type === 'EDIT') ?
        { position: "absolute", top: 0, height: "100%", width: "100%", background: "#FAFAFC", zIndex: 8 }
        : {}


    const onsubmitHandler = async (event) => {
        event.preventDefault();

        try {

            var URL = "/online-office/AddService"
            var EditURL = 'online-office/EditService/' + id

            setIsSumbitting(true)
            if (props.type === 'NEW') {
                const call = await axiosInstance.post(URL, FormData)
                var responseadd = call.data
                if (responseadd) {
                    setIsSumbitting(false)
                    history.goBack()
                }
            } else {
                const { Client, ...Data } = FormData

                const call = await axiosInstance.put(EditURL, { ...Data, ClientID: id })
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
        <form onSubmit={onsubmitHandler} style={MobileStyle}>

            <Popup width="680px" IsClosing={IsClosing} Mobile="EMPTY">
                <div className={classes.header}>
                    <span className={`font-600 text-black ${window.innerWidth > 550 ? "size-14" : "size-7"}`}> {props.type === "NEW" ? "Add service" : "Edit Service"}</span>
                    <img src={`/svg/${window.innerWidth > 550 ? "close" : "arrow-left"}.svg`} width="30px" alt="close" onClick={closeClickHandler} />
                </div>
                <div className={classes.body}>
                    <Input
                        type="text"
                        placeholder="Write your text"
                        label="Service name"
                        className={classes.inputrow}
                        onChange={handleChange}
                        name="Title"
                        value={EditData.Title}

                    />
                    <fieldset className={`${classes.FullFormTextArea} ${classes.inputrow}`}>
                        <label htmlFor='Description' className={`text-darkgray font-500 ${window.innerWidth > 550 ? "size-6" : "size-4"} mb-6`}>Short description of the service</label>
                        <textarea placeholder='Write your text' name='Description' onChange={handleChange} value={EditData.Description}>
                        </textarea>
                    </fieldset>

                </div>

                <div className={classes.Action}>
                    <PrimaryButton
                        type="submit"
                        IsLoading={IsSumbitting}
                        className={`font-500 size-6`}
                        style={{ padding: "14px 28px" }}>
                        {props.type === 'NEW' ? "Add" : "Edit"}
                    </PrimaryButton>

                    {window.innerWidth > 550 &&
                        <SecondaryButton onClick={closeClickHandler} type="button"
                            style={{ padding: "14px 28px", height: "52px" }}>
                            <span className={`font-500 text-darkgray size-6`}>cancel</span>
                        </SecondaryButton>
                    }
                </div>

            </Popup>

        </form >
    )
}

export default AddService