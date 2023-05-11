import classes from './AddClient.module.css';
import Input from '../../../UI/Inputs/Input';
import SecondaryButton from '../../../UI/Bottons/SecondaryButton';
import PrimaryButton from '../../../UI/Bottons/PrimaryButton';
import { useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../../../axios-global';
import RadioGroup from '../../../UI/Inputs/RadioGroup';
import { v4 as uuidv4 } from 'uuid';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import LoadingSpinner from '../../../UI/LoadingSpinner';
import moment from 'moment';

const AddClient = () => {
	const history = useHistory();

	const [Staffs, SetStaffs] = useState([]);
	const [FormData, SetFormData] = useState({ DiseaseBackground: [], MedicineSensitivity: [], staffs: [] });
	const [EditData, SetEditData] = useState(null);
	const [Search, SetSearch] = useState({ isSearching: false, staffs: [] });
	const [IsLoading, SetIsLoading] = useState(false);
	const [IsPronounsOther, SetIsPronounsOther] = useState(false);

	const location = useLocation();
	const { id } = useParams();

	const diseaseRef = useRef(null);
	const sensitivityRef = useRef(null);
	const CareGiverRef = useRef(null);

	useEffect(() => {
		if (location.pathname.endsWith('Edit')) {
			(async () => {
				try {
					const call = await axiosInstance.get('/clients/GetEdit/' + id);
					var response = call.data;

					response.Client.BirthDate = moment(response.Client.BirthDate).format('YYYY-MM-DD');
					response.Client.staffs = response.Client.Admins.map(item => item._id);

					var dis = [];
					response.Client.DiseaseBackground.forEach(item => {
						dis.push({ disease: item, id: uuidv4() });
					});
					response.Client.DiseaseBackground = dis;

					var MedicineSensitivity = [];
					response.Client.MedicineSensitivity.forEach(item => {
						MedicineSensitivity.push({ sensitivity: item, id: uuidv4() });
					});
					response.Client.MedicineSensitivity = MedicineSensitivity;

					SetEditData(response.Client);
					SetFormData(response.Client);
					SetStaffs(response.Admins);
				} catch (error) {
					console.log(error);
				}
			})();
		} else {
			(async () => {
				try {
					const call = await axiosInstance.get('/admins');
					var response = call.data;
					SetStaffs(response);
					SetEditData({ DiseaseBackground: [], MedicineSensitivity: [], staffs: [] });
				} catch (error) {
					console.log(error);
				}
			})();
		}
		// eslint-disable-next-line
	}, [location.pathname]);

	const handleChange = event => {
		const name = event.target.name;
		const value = event.target.value;
		SetFormData(FormData => {
			return { ...FormData, [name]: value };
		});
		SetEditData(FormData => {
			return { ...FormData, [name]: value };
		});
	};

	const checkboxChanges = (name, value) => {
		SetFormData(FormData => {
			return { ...FormData, [name]: value };
		});
		SetEditData(FormData => {
			return { ...FormData, [name]: value };
		});
		if (value === 'Other') {
			SetIsPronounsOther(true);
		} else {
			SetIsPronounsOther(false);
		}
	};

	const addDiseaseclickHandler = () => {
		SetFormData(edit => {
			return {
				...edit,
				DiseaseBackground: [...edit.DiseaseBackground, { id: uuidv4(), disease: diseaseRef.current.value }],
			};
		});
		SetEditData(edit => {
			return {
				...edit,
				DiseaseBackground: [...edit.DiseaseBackground, { id: uuidv4(), disease: diseaseRef.current.value }],
			};
		});
		// diseaseRef.current.value = ""
	};

	const removeDiseaseClickHandler = id => {
		var newDiseaseBackground = FormData.DiseaseBackground.filter(item => item.id !== id);
		SetFormData(FormData => {
			return { ...FormData, DiseaseBackground: newDiseaseBackground };
		});
		SetEditData(FormData => {
			return { ...FormData, DiseaseBackground: newDiseaseBackground };
		});
	};

	const addsensitivityclickHandler = () => {
		SetFormData(FormData => {
			return {
				...FormData,
				MedicineSensitivity: [...FormData.MedicineSensitivity, { id: uuidv4(), sensitivity: sensitivityRef.current.value }],
			};
		});
		SetEditData(FormData => {
			return {
				...FormData,
				MedicineSensitivity: [...FormData.MedicineSensitivity, { id: uuidv4(), sensitivity: sensitivityRef.current.value }],
			};
		});
		// sensitivityRef.current.value = ""
	};

	const removesensitivityClickHandler = id => {
		var newMedicineSensitivity = FormData.MedicineSensitivity.filter(item => item.id !== id);
		SetFormData(FormData => {
			return { ...FormData, MedicineSensitivity: newMedicineSensitivity };
		});
		SetEditData(FormData => {
			return { ...FormData, MedicineSensitivity: newMedicineSensitivity };
		});
	};

	const careGiverOnChangeHandler = () => {
		if (CareGiverRef.current.value === '') {
			SetSearch({ isSearching: false, staffs: [] });
		} else {
			var searched = Staffs.filter(item => item.Name.toLowerCase().includes(CareGiverRef.current.value));
			if (searched.length > 0) {
				SetSearch({ isSearching: true, staffs: searched });
			} else {
				SetSearch({ isSearching: false, staffs: [] });
			}
		}
	};

	const addCareGiverHandler = id => {
		var SelectedStaff = Staffs.find(x => {
			return x._id === id;
		});
		if (
			!FormData.staffs.find(x => {
				return x === id;
			})
		) {
			SetFormData(data => {
				return { ...data, staffs: [...data.staffs, SelectedStaff._id] };
			});
			SetEditData(data => {
				return { ...data, staffs: [...data.staffs, SelectedStaff._id] };
			});
			CareGiverRef.current.value = '';
			SetSearch({ isSearching: false, staffs: [] });
		}
	};

	const removeStaffConnection = id => {
		var newStaffs = FormData.staffs.filter(x => x !== id);
		SetFormData(data => {
			return { ...data, staffs: newStaffs };
		});
		SetEditData(data => {
			return { ...data, staffs: newStaffs };
		});
	};

	const onsubmitHandler = async event => {
		event.preventDefault();
		var DiseaseBackground = [],
			MedicineSensitivity = [];
		FormData.DiseaseBackground.forEach(item => {
			DiseaseBackground.push(item.disease);
		});
		FormData.MedicineSensitivity.forEach(item => {
			MedicineSensitivity.push(item.sensitivity);
		});
		SetIsLoading(true);

		var data = { ...FormData, DiseaseBackground, MedicineSensitivity };
		if (location.pathname.endsWith('Edit')) {
			try {
				const call = await axiosInstance.put('/clients/Edit/' + id, data);
				let responseadd = call.data;
				if (responseadd) {
					SetIsLoading(false);
					history.goBack();
				}
			} catch (error) {
				console.log(error);
			}
		} else {
			try {
				const call = await axiosInstance.post('/clients', data);
				let responseadd = call.data;
				if (responseadd) {
					SetIsLoading(false);
					history.replace('/Client');
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	return !EditData ? (
		<LoadingSpinner />
	) : (
		<form onSubmit={onsubmitHandler}>
			{window.innerWidth > 550 && (
				<h2 className='text-black font-600 size-14 m-0 mb-25'>
					{location.pathname.endsWith('Edit') ? 'Edit Client' : 'Add a Client'}
				</h2>
			)}

			<div className={`${classes.formContainer}`}>
				<h3 className={`text-black ${window.innerWidth > 550 ? 'font-500 size-10' : 'font-600 size-7'} m-0`}>Information</h3>
				<Input
					type='text'
					placeholder='Enter your full name'
					label='Client name'
					onChange={handleChange}
					name='Name'
					value={EditData.Name}
				/>
				<Input
					type='text'
					placeholder='Enter your Prefered name'
					label='Preferred name'
					onChange={handleChange}
					name='PreferredName'
					value={EditData.PreferredName}
				/>
				<Input type='text' placeholder='Enter your text' label='Gender' onChange={handleChange} name='Sex' value={EditData.Sex} />

				<Input
					type='date'
					placeholder='Enter your text'
					label='Date of birth'
					onChange={handleChange}
					name='BirthDate'
					value={EditData.BirthDate}
				/>

				<Input
					type='text'
					placeholder='Enter your text'
					label='Nationality'
					onChange={handleChange}
					name='Nationality'
					value={EditData.Nationality}
				/>

				<Input
					type='text'
					placeholder='Enter your text'
					label='preferred language'
					onChange={handleChange}
					name='Language'
					value={EditData.Language}
				/>

				<div className={`${classes.radioGroup}`}>
					<div className={`text-darkgray font-500 size-6 mb-10`}>Pronouns</div>
					<RadioGroup
						data={[
							{ id: 'She/Her/Hers', name: 'Pronouns' },
							{ id: 'He/Him/His', name: 'Pronouns' },
							{ id: 'They/them/theirs', name: 'Pronouns' },
							{ id: 'Other', name: 'Pronouns' },
						]}
						name='Pronouns'
						selected={EditData.Pronouns}
						onChange={checkboxChanges}
					/>
					{IsPronounsOther && (
						<Input
							type='text'
							placeholder='Enter your text'
							label='Pronouns'
							onChange={handleChange}
							name='Pronouns'
							className='mt-10'
							style={{ gridColumn: window.innerWidth > 550 ? '1/5' : '1/3' }}
							value={EditData.Pronouns}
						/>
					)}
				</div>

				<Input type='text' placeholder='Enter your text' label='NDIS' onChange={handleChange} name='NDIS' value={EditData.NDIS} />
				<Input
					type='text'
					placeholder='Enter your text'
					label='Alerts'
					onChange={handleChange}
					name='Alerts'
					value={EditData.Alerts}
				/>

				<div className={`${classes.radioGroup}`}>
					<div className={`text-darkgray font-500 size-6 mb-10`}>Status</div>
					<RadioGroup
						data={[
							{ id: 'Active Client', name: 'Status', required: true },
							{ id: 'Past Client', name: 'Status', required: true },
							{ id: 'Status None', name: 'Status', required: true },
						]}
						name='Status'
						selected={EditData.Status}
						onChange={checkboxChanges}
					/>
				</div>
			</div>

			<div className={`${classes.formContainer} ${window.innerWidth > 550 ? 'mt-25' : 'mt-14'}`}>
				<h3 className={`text-black ${window.innerWidth > 550 ? 'font-500 size-10' : 'font-600 size-7'} m-0`}>Contacts</h3>
				<Input
					type='text'
					placeholder='Enter your text'
					label='Phone number'
					onChange={handleChange}
					name='PhoneNumber'
					value={EditData.PhoneNumber}
				/>
				<Input
					type='text'
					placeholder='Enter your text'
					label='Emergency contact'
					onChange={handleChange}
					name='EmergencyContact'
					value={EditData.EmergencyContact}
				/>

				<Input
					type='email'
					placeholder='Enter your text'
					label='email'
					onChange={handleChange}
					name='Email'
					value={EditData.Email}
				/>
				<Input
					type='text'
					placeholder='Enter your text'
					label='Address'
					onChange={handleChange}
					name='Address'
					value={EditData.Address}
				/>

				<div className={`${classes.radioGroup}`}>
					<div className={`text-darkgray font-500 size-6 mb-10`}>Do need help in communicating with us?</div>
					<RadioGroup
						data={[
							{ id: 'No', name: 'Communication', required: true },
							{ id: 'Yes - interpreter', name: 'Communication', required: true },
							{ id: 'Yes- others', name: 'Communication', required: true },
						]}
						name='Communication'
						selected={EditData.Communication}
						onChange={checkboxChanges}
					/>
				</div>
			</div>

			<div className={`${classes.formContainer} ${window.innerWidth > 550 ? 'mt-25' : 'mt-14'}`}>
				<h3 className={`text-black ${window.innerWidth > 550 ? 'font-500 size-10' : 'font-600 size-7'} m-0`}>
					Description of goals
				</h3>

				<fieldset className={`${classes.FullFormTextArea}`}>
					<label htmlFor='Goals' className={`text-darkgray font-500 ${window.innerWidth > 550 ? 'size-6' : 'size-4'} mb-6`}>
						Description of goals
					</label>
					<textarea placeholder='Enter your text' name='Goals' onChange={handleChange} value={EditData.Goals}></textarea>
				</fieldset>
			</div>

			<div className={`${classes.formContainer} ${window.innerWidth > 550 ? 'mt-25' : 'mt-14'}`}>
				<h3 className={`text-black ${window.innerWidth > 550 ? 'font-500 size-10' : 'font-600 size-7'} m-0`}>
					General information
				</h3>

				<fieldset className={`${classes.FullFormTextArea}`}>
					<label htmlFor='About' className={`text-darkgray font-500 ${window.innerWidth > 550 ? 'size-6' : 'size-4'} mb-6`}>
						About the client
					</label>
					<textarea placeholder='Enter your text' name='About' onChange={handleChange} value={EditData.About}></textarea>

					<Input
						type='text'
						placeholder='Enter your text'
						label='Personality/disposition'
						onChange={handleChange}
						name='Personality'
						className='mt-20'
						value={EditData.Personality}
					/>
					<Input
						type='text'
						placeholder='Enter your text'
						label='Interests/Likes/Hobbies'
						onChange={handleChange}
						name='Interests'
						className='mt-20'
						value={EditData.Interests}
					/>
					<Input
						type='text'
						placeholder='Enter your text'
						label='Conversation topics'
						onChange={handleChange}
						name='Conversation'
						className='mt-20'
						value={EditData.Conversation}
					/>
					<Input
						type='text'
						placeholder='Enter your text'
						label='Triggers/Dislikes'
						onChange={handleChange}
						name='Triggers'
						className='mt-20'
						value={EditData.Triggers}
					/>
					<Input
						type='text'
						placeholder='Enter your text'
						label='EARLY WARNING SIGNS'
						onChange={handleChange}
						name='Warnings'
						className='mt-20'
						value={EditData.Warnings}
					/>
					<Input
						type='text'
						placeholder='Enter your text'
						label='Risk assessments'
						onChange={handleChange}
						name='Risks'
						className='mt-20'
						value={EditData.Risks}
					/>

					<div className={`${classes.radioGroup}`}>
						<div className={`text-darkgray font-500 size-6 mb-10 mt-20`}>Are you of Aboriginal of Torres Strait islander?</div>
						<RadioGroup
							data={[
								{ id: 'Aboriginal', name: 'Aboriginal', required: true },
								{ id: 'Torres Strait islander', name: 'Aboriginal', required: true },
								{ id: 'Both', name: 'Aboriginal', required: true },
								{ id: 'None', name: 'Aboriginal', required: true },
							]}
							name='Aboriginal'
							selected={EditData.Aboriginal}
							onChange={checkboxChanges}
						/>
					</div>
				</fieldset>

				<div className={`${classes.ClientSensivityContainer}`}>
					<div>
						<Input type='text' placeholder='Enter your text' label='formal diagnosis' ref={diseaseRef} />
						{window.innerWidth > 550 ? (
							<SecondaryButton
								style={{ height: '51px', width: '51px', margin: 'auto auto 6px' }}
								onClick={addDiseaseclickHandler}
								type='button'
							>
								<img src='/svg/plus-gray.svg' width={30} alt='add' />
							</SecondaryButton>
						) : (
							<SecondaryButton
								type='button'
								style={{ height: '44px', width: '100%' }}
								className={`size-2 text-darkgray`}
								onClick={addDiseaseclickHandler}
							>
								<img src='/svg/plus-gray.svg' width={20} alt='add' className='mr-8' /> Add
							</SecondaryButton>
						)}
					</div>
					{FormData.DiseaseBackground.map(item => (
						<div className={`${classes.MedicineItem}`} key={item.id}>
							<div className={`font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-lightgray`}>{item.disease}</div>
							<img src='/svg/minus.svg' alt='remove' onClick={() => removeDiseaseClickHandler(item.id)} />
						</div>
					))}
				</div>

				<div className={`${classes.ClientSensivityContainer}`}>
					<div>
						<Input
							type='text'
							placeholder='Enter your text'
							label='client sensitivity to the Medications'
							ref={sensitivityRef}
						/>
						{window.innerWidth > 550 ? (
							<SecondaryButton
								style={{ height: '51px', width: '51px', margin: 'auto auto 6px' }}
								onClick={addsensitivityclickHandler}
								type='button'
							>
								<img src='/svg/plus-gray.svg' width={30} alt='add' />
							</SecondaryButton>
						) : (
							<SecondaryButton
								type='button'
								style={{ height: '44px', width: '100%' }}
								className={`size-2 text-darkgray`}
								onClick={addsensitivityclickHandler}
							>
								<img src='/svg/plus-gray.svg' width={20} alt='add' className='mr-8' /> Add
							</SecondaryButton>
						)}
					</div>
					<div className={`${classes.ClientSensivityRow}`}>
						{FormData.MedicineSensitivity.map(item => (
							<div className={`${classes.MedicineItem}`} key={item.id}>
								<div className={`font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-lightgray`}>
									{item.sensitivity}
								</div>
								<img src='/svg/minus.svg' alt='remove' onClick={() => removesensitivityClickHandler(item.id)} />
							</div>
						))}
					</div>
				</div>
			</div>

			<div className={`${classes.formContainer} ${window.innerWidth > 550 ? 'mt-25 mb-30' : 'mt-14 mb-100'} `}>
				<h3 className={`text-black ${window.innerWidth > 550 ? 'font-500 size-10' : 'font-600 size-7'} m-0`}>Support Team</h3>
				<div className={`${classes.ClientSensivityContainer}`}>
					<div>
						<Input
							type='text'
							placeholder='Enter your text'
							label='Support team'
							autoComplete='off'
							style={{ gridColumn: '1/3' }}
							ref={CareGiverRef}
							onChange={careGiverOnChangeHandler}
						/>
					</div>
					{Staffs.length > 0 &&
						FormData.staffs.map(item => (
							<div className={`${classes.CareGiverItem}`} key={item}>
								<img src={process.env.REACT_APP_SRC_URL + Staffs.find(x => x._id === item).Avatar} alt='avatar' />
								<div className={`font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-lightgray`}>
									{Staffs.find(x => x._id === item).Name}
								</div>
								<img src='/svg/minus.svg' alt='remove' onClick={() => removeStaffConnection(item)} />
							</div>
						))}
					{Search.isSearching && (
						<div className={classes.SearchContainer}>
							{Search.staffs.map(item => (
								<div className={classes.SearchItem} key={item._id} onClick={() => addCareGiverHandler(item._id)}>
									<img src={process.env.REACT_APP_SRC_URL + item.Avatar} alt='avatar' />
									<div className={`font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'} text-lightgray`}>
										{item.Name}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{window.innerWidth > 550 ? (
				<PrimaryButton className={`mb-40 size-6`} style={{ padding: '14px 28px' }} IsLoading={IsLoading}>
					{location.pathname.includes('Edit') ? 'Save Client' : 'Save and add clients'}
				</PrimaryButton>
			) : (
				<PrimaryButton
					className={`mb-40 size-3`}
					IsLoading={IsLoading}
					style={{
						position: 'absolute',
						bottom: '0',
						left: '16px',
						width: 'calc(100% - 32px)',
					}}
				>
					{location.pathname.includes('Edit') ? 'Save Client' : 'Save and add clients'}
				</PrimaryButton>
			)}
		</form>
	);
};

export default AddClient;
