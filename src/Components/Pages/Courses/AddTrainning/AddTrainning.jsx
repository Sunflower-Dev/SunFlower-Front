import Input from '../../../UI/Inputs/Input';
import classes from './AddTrainning.module.css';
import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import PrimaryButton from '../../../UI/Bottons/PrimaryButton';
import { axiosInstance } from '../../../../axios-global';
import LoadingSpinner from '../../../UI/LoadingSpinner';

const AddTrainning = props => {
	const history = useHistory();

	const TitleRef = useRef(null);
	const TimeRef = useRef(null);
	const FileRef = useRef(null);
	const DescriptionRef = useRef(null);

	const [IsLoading, SetIsloading] = useState(false);
	const [Progress, setProgress] = useState(props.type === 'NEW' ? 'Add Training' : 'Edit training');
	const [TextInit, setTextInit] = useState('<p>Enter Your Text</p>');
	const [SelectedFile, SetSelectedFile] = useState('Select Video of the tutorial');
	const [IsPageLoading, SetIsPageLoading] = useState(false);
	const [UseFileUploader, SetUseFileUploader] = useState(false);

	const { id } = useParams();

	useEffect(() => {
		if (props.type === 'EDIT') {
			(async () => {
				try {
					SetIsPageLoading(true);
					const call = await axiosInstance.get('/courses/GetLesson/' + id);
					var response = call.data;

					SetIsPageLoading(false);
					TitleRef.current.value = response.Lesson.Title;
					TimeRef.current.value = response.Lesson.ReadingTime;
					setTextInit(response.Lesson.Description);
					SetSelectedFile(response.Lesson.Video.split(/\//g)[response.Lesson.Video.split(/\//g).length - 1]);
				} catch (error) {
					console.log(error);
				}
			})();
		}
	}, [id, props.type]);

	const FileSelectChangeHandler = event => {
		SetSelectedFile(event.target.files[0].name);
		SetUseFileUploader(true);
	};

	const onformsubmitHandler = async event => {
		event.preventDefault();
		try {
			SetIsloading(true);
			var URL = '',
				METHOD = '',
				HEADERS = {};
			var formData;

			if (props.type === 'EDIT') {
				METHOD = 'PUT';
				if (UseFileUploader) {
					formData = new FormData();
					formData.append('Title', TitleRef.current.value);
					formData.append('Time', TimeRef.current.value);
					formData.append('Description', DescriptionRef.current.getContent());
					formData.append('File', FileRef.current.files[0]);
					HEADERS = { 'Content-Type': 'multipart/form-data' };
					URL = '/courses/EditLessonWithFile/' + id;
				} else {
					formData = {
						Title: TitleRef.current.value,
						Time: TimeRef.current.value,
						Description: DescriptionRef.current.getContent(),
					};
					URL = '/courses/EditLesson/' + id;
				}
			} else {
				METHOD = 'POST';
				if (UseFileUploader) {
					formData = new FormData();
					formData.append('Title', TitleRef.current.value);
					formData.append('Time', TimeRef.current.value);
					formData.append('Description', DescriptionRef.current.getContent());
					formData.append('File', FileRef.current.files[0]);
					HEADERS = { 'Content-Type': 'multipart/form-data' };
					URL = '/courses/AddLessonWithFile/' + id;
				} else {
					formData = {
						Title: TitleRef.current.value,
						Time: TimeRef.current.value,
						Description: DescriptionRef.current.getContent(),
					};
					URL = '/courses/AddLesson/' + id;
				}
			}

			const call = await axiosInstance({
				method: METHOD,
				url: URL,
				data: formData,
				headers: HEADERS,
				onUploadProgress: progressEvent => {
					const progress = (progressEvent.loaded / progressEvent.total) * 100;
					setProgress('Adding ' + parseFloat(progress).toFixed(1) + '%');
				},
				onDownloadProgress: progressEvent => {
					const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
					setProgress('Adding ' + parseFloat(progress).toFixed(1) + '%');
				},
			});
			if (call) {
				SetIsloading(false);
				history.goBack();
			}
		} catch (error) {
			console.log(error);
		}
	};
	return IsPageLoading ? (
		<LoadingSpinner />
	) : (
		<form onSubmit={onformsubmitHandler} encType='multipart/form-data'>
			{window.innerWidth > 550 && (
				<h2 className={`text-black size-14 font-500 m-0 mb-25`}>{props.type === 'NEW' ? 'Add Training' : 'Edit training'}</h2>
			)}
			<section className={`${classes.Card}`}>
				<Input type='text' placeholder='Write the title of the tutorial' label='Training title' name='Title' ref={TitleRef} />
				<Input
					type='number'
					placeholder='Write the amount of minutes Needed'
					label='Training Time'
					className={`mt-34`}
					name='Title'
					ref={TimeRef}
				/>
				<Input
					type='file'
					placeholder={SelectedFile}
					inputStype={{ display: 'none' }}
					label='Training movie'
					className={`mt-34`}
					name='File'
					id='Uploader'
					ref={FileRef}
					onChange={FileSelectChangeHandler}
				/>
			</section>
			<section className={`${classes.Card} mt-25`}>
				<Editor
					apiKey='xi2m8esmsga73r9lx4r9bo6y0dv3md3svtcaw9xrlbexe60j'
					onInit={(evt, editor) => (DescriptionRef.current = editor)}
					initialValue={TextInit}
					init={{
						height: 300,
						menubar: false,
						plugins: [
							'advlist autolink lists link image charmap print preview anchor',
							'searchreplace visualblocks code fullscreen',
							'insertdatetime media table paste code help wordcount',
						],
						toolbar:
							'undo redo | formatselect | fontsizeselect | ' +
							'bold italic forecolor | alignleft aligncenter ' +
							'alignright alignjustify | bullist numlist | link image | charmap ',
						content_style: 'body {font-family: "Poppins", sans-serif; font-size:14px;color: #282A3E; }',
					}}
				/>
			</section>
			<PrimaryButton
				className={`mt-30 mb-40 size-6 ml-16 mr-16 `}
				style={{
					padding: '14px 28px',
					height: 'auto',
					width: window.innerWidth < 550 && 'calc(100% - 32px)',
					boxSizing: 'border-box',
				}}
				type='submit'
				IsLoading={IsLoading}
			>
				{Progress}
			</PrimaryButton>
		</form>
	);
};

export default AddTrainning;
