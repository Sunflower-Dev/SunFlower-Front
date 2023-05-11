import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../../axios-global';
import PrimaryButton from '../../../../UI/Bottons/PrimaryButton';
import SecondaryButton from '../../../../UI/Bottons/SecondaryButton';
import Input from '../../../../UI/Inputs/Input';
import Popup from '../../../../UI/Popup/Popup';
import classes from './AddDocument.module.css';
const AddClientDocument = props => {
	const [IsClosing, SetIsClosing] = useState(false);
	const [IsSumbitting, setIsSumbitting] = useState(false);
	const [SelectedFile, setSelectedFile] = useState('Upload Document');
	const [File, setFile] = useState(null);
	const [FileError, setFileError] = useState(null);
	const [progress, setProgress] = useState('Add Document');

	const { id } = useParams();
	const [Form, setFormData] = useState({ Client: id });

	const history = useHistory();

	const closeClickHandler = () => {
		SetIsClosing(true);

		setTimeout(() => {
			history.goBack();
		}, 300);
	};
	const handleChange = event => {
		const name = event.target.name;
		const value = event.target.value;
		if (name === 'File') {
			if (event.target.files[0].size / 1024 / 1024 < 50) {
				setSelectedFile(value.split(/\\/g)[2]);
				setFile(event.target.files[0]);
				setFileError(null);
			} else {
				setFileError('maximum file Size is 50MB');
				setSelectedFile('Upload Document');
			}
		}
		setFormData({ ...Form, [name]: value });
	};

	const onsubmitHandler = async event => {
		event.preventDefault();

		try {
			setIsSumbitting(true);
			const formData = new FormData();
			formData.append('File', File);
			formData.append('Title', Form.Title);

			var URL = '';
			if (props.Type === 'Client') {
				URL = '/Clients/AddDocument/' + id;
			}
			if (props.Type === 'OnlineOffice') {
				URL = '/online-office/AddDocument';
			}
			if (props.Type === 'Service') {
				URL = '/online-office/Services/AddDocument/' + id + '/' + props.FolderID;
			}

			const call = await axiosInstance({
				method: 'POST',
				url: URL,
				data: formData,
				headers: { 'Content-Type': 'multipart/form-data' },
				onUploadProgress: progressEvent => {
					const progress = (progressEvent.loaded / progressEvent.total) * 100;
					setProgress('Add Document ' + parseFloat(progress).toFixed(1) + '%');
				},
				onDownloadProgress: progressEvent => {
					const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
					setProgress('Add Document ' + parseFloat(progress).toFixed(1) + '%');
				},
			});
			if (call) {
				setIsSumbitting(false);
				history.goBack();
			}
		} catch (error) {
			console.log(error);
		}
	};
	const MobileStype =
		window.innerWidth < 550 ? { position: 'absolute', top: 0, height: '100%', width: '100%', background: '#FAFAFC', zIndex: 8 } : {};

	return (
		<form onSubmit={onsubmitHandler} style={MobileStype}>
			<Popup width='680px' IsClosing={IsClosing} Mobile='EMPTY'>
				<div className={classes.header}>
					<span className={`font-600 text-black ${window.innerWidth > 550 ? 'size-14' : 'size-7'}`}> Add Document</span>
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
						placeholder='Title Document'
						label='Title Document'
						className={classes.inputrow}
						onChange={handleChange}
						name='Title'
					/>

					<Input
						type='file'
						placeholder={SelectedFile}
						label='Upload Document'
						inputStype={{ display: 'none' }}
						className={classes.inputrow}
						onChange={handleChange}
						name='File'
						id='Uploader'
						ErrorText={FileError}
					/>
				</div>

				<div className={classes.Action}>
					<PrimaryButton type='submit' IsLoading={IsSumbitting} className={`font-500 size-6`} style={{ padding: '14px 28px' }}>
						{progress}
					</PrimaryButton>

					{window.innerWidth > 550 && (
						<SecondaryButton onClick={closeClickHandler} style={{ padding: '14px 28px', height: '52px' }}>
							<span className={`font-500 text-darkgray size-6`}>cancel</span>
						</SecondaryButton>
					)}
				</div>
			</Popup>
		</form>
	);
};

export default AddClientDocument;
