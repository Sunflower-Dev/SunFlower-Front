import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../../axios-global';
import PrimaryButton from '../../../../UI/Bottons/PrimaryButton';
import SecondaryButton from '../../../../UI/Bottons/SecondaryButton';
import Input from '../../../../UI/Inputs/Input';
import LoadingSpinner from '../../../../UI/LoadingSpinner';
import Popup from '../../../../UI/Popup/Popup';
import classes from './AddNote.module.css';
const AddNote = props => {
	const [IsClosing, SetIsClosing] = useState(false);
	const [IsSumbitting, setIsSumbitting] = useState(false);

	const { id, NoteID } = useParams();
	const [EditData, setEditData] = useState(null);
	const [FormData, setFormData] = useState({ Client: id });

	const history = useHistory();

	useEffect(() => {
		if (props.type === 'EDIT') {
			var url =
				props.Page === 'OnlineOffice'
					? '/online-office/GetNoteById/'
					: '/Notes/'(async () => {
							try {
								const call = await axiosInstance.get(url + NoteID);
								var response = call.data;
								setEditData({ Title: response.Title, Description: response.Description });
								setFormData({ Title: response.Title, Description: response.Description });
							} catch (error) {
								console.log(error);
							}
					  })();
		} else {
			setEditData({ Title: '', Description: '' });
		}
	}, [props, NoteID]);

	const closeClickHandler = () => {
		SetIsClosing(true);

		setTimeout(() => {
			history.goBack();
		}, 300);
	};
	const handleChange = event => {
		const name = event.target.name;
		const value = event.target.value;
		setFormData(FormData => {
			return { ...FormData, [name]: value };
		});
		setEditData(EditData => {
			return { ...EditData, [name]: value };
		});
	};

	const onsubmitHandler = async event => {
		event.preventDefault();

		try {
			var URL = '';
			var EditURL = '';
			if (props.Page === 'Client') {
				URL = '/Notes';
				EditURL = '/Notes/' + NoteID;
			}
			if (props.Page === 'OnlineOffice') {
				URL = '/online-office/AddNote';
				EditURL = '/online-office/EditNote/' + NoteID;
			}
			setIsSumbitting(true);
			if (props.type === 'NEW') {
				const call = await axiosInstance.post(URL, FormData);
				var responseadd = call.data;
				if (responseadd) {
					setIsSumbitting(false);
					history.goBack();
				}
			} else {
				const { Client, ...Data } = FormData;

				const call =
					props.Page === 'Client'
						? await axiosInstance.put(EditURL, { ...Data, ClientID: id })
						: await axiosInstance.put(EditURL, { ...Data });

				var ResponseEdit = call.data;
				if (ResponseEdit) {
					setIsSumbitting(false);
					history.goBack();
				}
			}
		} catch (error) {
			console.log(error);
		}
	};

	return !EditData ? (
		<LoadingSpinner />
	) : (
		<form onSubmit={onsubmitHandler}>
			<Popup width='680px' IsClosing={IsClosing} Mobile='EMPTY'>
				<div className={classes.header}>
					<span className={`font-600 text-black ${window.innerWidth > 550 ? 'size-14' : 'size-7'}`}>
						{' '}
						{props.type === 'NEW' ? 'AddNote' : 'Edit Note'}
					</span>
					<img
						src={`/svg/${window.innerWidth > 550 ? 'close' : 'arrow-left'}.svg`}
						width='30px'
						alt='close'
						onClick={closeClickHandler}
					/>
				</div>
				<div className={classes.body}>
					<Input
						type='text'
						placeholder='Title Note'
						label='Title Note'
						className={classes.inputrow}
						onChange={handleChange}
						name='Title'
						value={EditData.Title}
					/>
					<fieldset className={`${classes.FullFormTextArea} ${classes.inputrow}`}>
						<label
							htmlFor='Description'
							className={`text-darkgray font-500 ${window.innerWidth > 550 ? 'size-6' : 'size-4'} mb-6`}
						>
							Description
						</label>
						<textarea
							placeholder='Enter your text'
							name='Description'
							onChange={handleChange}
							value={EditData.Description}
						></textarea>
					</fieldset>
				</div>

				<div className={classes.Action}>
					<PrimaryButton type='submit' IsLoading={IsSumbitting} className={`font-500 size-6`} style={{ padding: '14px 28px' }}>
						Note registration
					</PrimaryButton>

					{window.innerWidth > 550 && (
						<SecondaryButton onClick={closeClickHandler} type='button' style={{ padding: '14px 28px', height: '52px' }}>
							<span className={`font-500 text-darkgray size-6`}>cancel</span>
						</SecondaryButton>
					)}
				</div>
			</Popup>
		</form>
	);
};

export default AddNote;
