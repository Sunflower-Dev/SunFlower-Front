import { useState } from "react";
import { useHistory } from "react-router";
import { axiosInstance } from "../../../../axios-global";
import PrimaryButton from "../../../UI/Bottons/PrimaryButton";
import SecondaryButton from "../../../UI/Bottons/SecondaryButton";
import Input from "../../../UI/Inputs/Input";

import Popup from "../../../UI/Popup/Popup";
import Select from "../../../UI/Select/Select";
import classes from "./NewNotif.module.css";

const NewNotif = () => {
    const history = useHistory();
    const [IsClosing, SetIsClosing] = useState(false);
    const [FormData, setFormData] = useState({});
    const [IsSumbitting, setIsSumbitting] = useState(false);

    const closeClickHandler = () => {
        SetIsClosing(true);

        setTimeout(() => {
            history.goBack();
        }, 300);
    };

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormData({ ...FormData, [name]: value });
    };

    const onsubmitHandler = async (event) => {
        event.preventDefault();

        try {
            setIsSumbitting(true);

            const call = await axiosInstance.post("/notifications", FormData);
            var responseadd = call.data;
            if (responseadd) {
                setIsSumbitting(false);
                history.goBack();
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form onSubmit={onsubmitHandler}>
            <Popup width="680px" IsClosing={IsClosing}>
                <div className={classes.header}>
                    <span className={`font-600 text-black${window.innerWidth > 550 ? "size-14" : "size-7"} `}>
                        Send Notification
                    </span>
                    <img src={`/svg/${window.innerWidth > 550 ? "close" : "arrow-left"}.svg`}
                        width="30px" alt="close" onClick={closeClickHandler} />
                </div>
                <div className={classes.body}>
                    <Input
                        type="text"
                        placeholder="Write your text"
                        label="Title"
                        className={classes.inputrow}
                        onChange={handleChange}
                        name="Title"
                    />

                    <Select
                        name="Type"
                        label="Notification type"
                        className={classes.inputrow}
                        onChange={handleChange}
                    >
                        <option>Select the notification type</option>
                        <option value="GIFT">Gift</option>
                        <option value="ADD_CLIENT">Add Client</option>
                        <option value="ADD_STAFF">Add Staff</option>
                        <option value="MESSAGE">Message</option>
                    </Select>

                    <fieldset className={`${classes.FullFormTextArea} ${classes.inputrow}`}>
                        <label className={`mb-6 text-darkgray font-500 ${window.innerWidth > 550 ? "size-6" : "size-4"} `}>
                            Notification Body
                        </label>
                        <textarea
                            placeholder="Enter your text"
                            name="Body"
                            onChange={handleChange}
                        ></textarea>
                    </fieldset>
                </div>

                <div className={classes.Action}>
                    <PrimaryButton
                        type="submit"
                        IsLoading={IsSumbitting}
                        className={`font-500 size-6`}
                        style={{ padding: "14px 28px" }}
                    >
                        send Notification
                    </PrimaryButton>

                    {window.innerWidth > 550 && (
                        <SecondaryButton
                            style={{ padding: "14px 28px", height: "52px" }}
                            onClick={closeClickHandler}
                            type="button"
                        >
                            <span className={`font-500 text-darkgray size-6`}>cancel</span>
                        </SecondaryButton>
                    )}
                </div>
            </Popup>
        </form>
    );
};

export default NewNotif;
