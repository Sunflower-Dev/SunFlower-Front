import { useState } from 'react';
import PrimaryButton from '../../../../UI/Bottons/PrimaryButton';
import Input from '../../../../UI/Inputs/Input';
import classes from './AddClientReport.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SecondaryButton from '../../../../UI/Bottons/SecondaryButton';
import CheckBox from '../../../../UI/Inputs/CheckBox';
import { v4 as uuidv4 } from 'uuid';
import { axiosInstance } from '../../../../../axios-global';
import { useHistory, useParams } from 'react-router-dom';

const AddClientReport = () => {
	const [Step, SetStep] = useState(1);
	const history = useHistory();

	const [formdata, Setformdata] = useState({
		ContactType: 'Phone',
		AffectedPerson: [
			{ id: uuidv4(), Name: '', Contact: '' },
			{ id: uuidv4(), Name: '', Contact: '' },
			{ id: uuidv4(), Name: '', Contact: '' },
		],
		NotifiedPerson: [
			{ id: uuidv4(), Name: '', Role: '', Contact: '', NotifiedTime: '' },
			{ id: uuidv4(), Name: '', Role: '', Contact: '', NotifiedTime: '' },
			{ id: uuidv4(), Name: '', Role: '', Contact: '', NotifiedTime: '' },
		],
	});

	const [File, SetFile] = useState(null);
	const [SelectedFileName, SetSelectedFileName] = useState('Upload your signature');
	const [IsLoading, SetIsLoading] = useState(false);

	const [ContactType, SetContactType] = useState('Phone');

	const { id } = useParams();

	const SetContactTypeClickHandler = Type => {
		SetContactType(Type);
		Setformdata(data => {
			return { ...data, ContactType: Type, Contact: '' };
		});
	};

	const Step1NextClickHandler = () => {
		if (formdata.Name && formdata.Position && formdata.Contact) {
			if (formdata.Name.length > 0 && formdata.Position.length > 0 && formdata.Contact.length > 0) {
				SetStep(2);
			} else {
				toast.error('please fill All the Blanks!', {
					position: 'bottom-center',
					autoClose: 2000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
			}
		} else {
			toast.error('please fill All the Blanks!', {
				position: 'bottom-center',
				autoClose: 2000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
			});
		}
	};

	const Step2NextClickHandler = () => {
		SetStep(3);
	};

	const Step2PrevClickHandler = () => {
		SetStep(1);
	};

	const Step3PrevClickHandler = () => {
		SetStep(2);
	};

	const onChangeHandler = event => {
		const name = event.target.name;
		const value = event.target.value;

		Setformdata(data => {
			return { ...data, [name]: value };
		});
	};

	const affectedCheckboxHandler = (name, IsChecked) => {
		let Affected = formdata.Affected;
		name = name.split(/-/g)[0];

		if (IsChecked) {
			if (Affected) {
				Affected.push(name);
			} else {
				Affected = [name];
			}
			Setformdata(data => {
				return { ...data, Affected: Affected };
			});
		} else {
			Affected = Affected.filter(item => item !== name);
			Setformdata(data => {
				return { ...data, Affected: Affected };
			});
		}
	};

	const IncidentTypeCheckboxHandler = (name, IsChecked) => {
		let IncidentType = formdata.IncidentType;
		name = name.split(/-/g)[0];
		if (IsChecked) {
			if (IncidentType) {
				IncidentType.push(name);
			} else {
				IncidentType = [name];
			}
			Setformdata(data => {
				return { ...data, IncidentType: IncidentType };
			});
		} else {
			IncidentType = IncidentType.filter(item => item !== name);
			Setformdata(data => {
				return { ...data, IncidentType: IncidentType };
			});
		}
	};

	const EmergencyServiceCheckboxHandler = (name, IsChecked) => {
		let EmergencyService = formdata.EmergencyService;
		name = name.split(/-/g)[0];
		if (IsChecked) {
			if (EmergencyService) {
				EmergencyService.push(name);
			} else {
				EmergencyService = [name];
			}
			Setformdata(data => {
				return { ...data, EmergencyService: EmergencyService };
			});
		} else {
			EmergencyService = EmergencyService.filter(item => item !== name);
			Setformdata(data => {
				return { ...data, EmergencyService: EmergencyService };
			});
		}
	};

	const NDISReportCheckboxHandler = (name, IsChecked) => {
		let NDISReport = formdata.NDISReport;
		name = name.split(/-/g)[0];
		if (IsChecked) {
			if (NDISReport) {
				NDISReport.push(name);
			} else {
				NDISReport = [name];
			}
			Setformdata(data => {
				return { ...data, NDISReport: NDISReport };
			});
		} else {
			NDISReport = NDISReport.filter(item => item !== name);
			Setformdata(data => {
				return { ...data, NDISReport: NDISReport };
			});
		}
	};

	const AffectedPersonOnChange = (event, id) => {
		const name = event.target.name;
		const value = event.target.value;

		let AffectedPerson = formdata.AffectedPerson;
		let myAffectedPerson = AffectedPerson.find(item => item.id === id);

		if (name === 'Name') {
			myAffectedPerson.Name = value;
		} else {
			myAffectedPerson.Contact = value;
		}

		Setformdata(data => {
			return { ...data, AffectedPerson: AffectedPerson };
		});
	};

	const AddAffectedPerson = () => {
		let AffectedPerson = formdata.AffectedPerson;
		AffectedPerson.push({ id: uuidv4(), Name: '', Contact: '' });
		Setformdata(data => {
			return { ...data, AffectedPerson: AffectedPerson };
		});
	};

	const NotifiedPersonOnChange = (event, id) => {
		const name = event.target.name;
		const value = event.target.value;

		let NotifiedPerson = formdata.NotifiedPerson;
		let myNotifiedPerson = NotifiedPerson.find(item => item.id === id);

		if (name === 'Name') {
			myNotifiedPerson.Name = value;
		} else if (name === 'Contact') {
			myNotifiedPerson.Contact = value;
		} else if (name === 'Role') {
			myNotifiedPerson.Role = value;
		} else {
			myNotifiedPerson.NotifiedTime = value;
		}

		Setformdata(data => {
			return { ...data, NotifiedPerson: NotifiedPerson };
		});
	};

	const AddNotifiedPerson = () => {
		let NotifiedPerson = formdata.NotifiedPerson;
		NotifiedPerson.push({ id: uuidv4(), Name: '', Role: '', Contact: '', NotifiedTime: '' });
		Setformdata(data => {
			return { ...data, NotifiedPerson: NotifiedPerson };
		});
	};

	const FileChangeHandler = event => {
		SetFile(event.target.files[0]);
		SetSelectedFileName(event.target.files[0].name);
	};

	const submitFormClickHandler = async () => {
		SetIsLoading(true);
		try {
			const formData = convertJsonToFormData(formdata);
			formData.append('File', File);

			const call = await axiosInstance({
				method: 'POST',
				url: '/clients/AddReport/' + id,
				data: formData,
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			SetIsLoading(false);
			history.goBack();
		} catch (error) {
			console.log(error);
			SetIsLoading(false);
		}
	};

	const convertJsonToFormData = data => {
		const formData = new FormData();
		const entries = Object.entries(data);

		for (let i = 0; i < entries.length; i++) {
			// don't try to be smart by replacing it with entries.each, it has drawbacks
			const arKey = entries[i][0];
			let arVal = entries[i][1];
			if (typeof arVal === 'boolean') {
				arVal = arVal === true ? 1 : 0;
			}
			if (Array.isArray(arVal)) {
				if (arVal[0] instanceof Object) {
					for (let j = 0; j < arVal.length; j++) {
						if (arVal[j] instanceof Object) {
							// if first element is not file, we know its not files array
							for (const prop in arVal[j]) {
								if (prop === 'id') {
									continue;
								}
								// if (Object.prototype.hasOwnProperty.call(arVal[j], prop)) {
								// do stuff
								// if (!isNaN(Date.parse(arVal[j][prop]))) {
								//     // (new Date(fromDate)).toUTCString()
								//     formData.append(
								//         `${arKey}[${j}][${prop}]`,
								//         new Date(arVal[j][prop])
								//     )
								// } else {
								formData.append(`${arKey}[${j}][${prop}]`, arVal[j][prop]);
								// }
								// }
							}
						}
					}
					continue; // we don't need to append current element now, as its elements already appended
				} else {
					for (let j = 0; j < arVal.length; j++) {
						formData.append(`${arKey}[${j}]`, arVal[j]);
					}
					continue; // we don't need to append current element now, as its elements already appended
				}
			}

			if (arVal === null) {
				continue;
			}
			formData.append(arKey, arVal);
		}
		return formData;
	};

	return (
		<>
			<section className={`${classes.StepContainer}`}>
				<div></div>
				<div className={`${classes.StepItem} ${classes.active} `}>
					<img src='/svg/Report/Detail.svg' alt='Detail' />
					<div className={`${classes.StepTitle}`}>Your details</div>
				</div>
				<div className={`${classes.Line} ${Step === 1 ? classes.HalfLine : classes.FullLine}`}></div>

				<div className={`${classes.StepItem} ${Step >= 2 && classes.active}`}>
					<img src={`/svg/Report/${Step === 1 ? 'Incident' : 'Incident-filled'}.svg`} alt='Incident' />
					<div className={`${classes.StepTitle} `}>Incident</div>
				</div>

				<div className={`${classes.Line} ${Step === 2 ? classes.HalfLine : Step === 3 && classes.FullLine}`}></div>

				<div className={`${classes.StepItem} ${Step === 3 && classes.active} `}>
					<img src={`/svg/Report/${Step < 3 ? 'Action' : 'Action-filled'}.svg`} alt='Action' />
					<div className={`${classes.StepTitle}`}>Actions Taken</div>
				</div>

				<div></div>
			</section>

			<ToastContainer
				position='bottom-center'
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='colored'
			/>

			{/* Detail Section */}
			<section className={`${classes.Card} ${Step === 1 && classes.active}`}>
				<div className={`font-600 size-14 text-black`}>Your Details</div>
				<div className={`${classes.TwoColumn} mt-30`}>
					<Input
						type='text'
						label='Your name'
						placeholder='Enter your full name'
						name='Name'
						onChange={onChangeHandler}
						value={formdata.Name}
					/>
					<Input
						type='text'
						label='Position/Title'
						placeholder='Enter your text'
						name='Position'
						onChange={onChangeHandler}
						value={formdata.Position}
					/>
				</div>
				<div className={`font-500 size-6 text-darkgray mt-35`}>
					What is the best way to contact you regarding this incident report?
				</div>

				<div className='d-flex mt-20 mb-10' style={{ gap: '35px' }}>
					<div
						className={`${classes.ContactButton} ${ContactType === 'Phone' && classes.active}`}
						onClick={() => SetContactTypeClickHandler('Phone')}
					>
						<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' viewBox='0 0 20 20'>
							<path
								stroke='#9899A2'
								strokeMiterlimit='10'
								strokeWidth='1.5'
								d='M18.308 15.275c0 .3-.067.609-.209.909-.141.3-.325.583-.566.85-.409.45-.859.775-1.367.983-.5.208-1.042.317-1.625.317-.85 0-1.758-.2-2.717-.609a14.634 14.634 0 01-2.866-1.65 23.962 23.962 0 01-2.734-2.333A23.682 23.682 0 013.9 11.017c-.683-.95-1.233-1.9-1.633-2.842-.4-.95-.6-1.858-.6-2.725 0-.566.1-1.108.3-1.608.2-.508.517-.975.958-1.392.534-.525 1.117-.783 1.734-.783.233 0 .466.05.675.15.216.1.408.25.558.467l1.933 2.725c.15.208.259.4.334.583.075.175.116.35.116.508 0 .2-.058.4-.175.592a2.834 2.834 0 01-.466.592l-.634.658a.446.446 0 00-.133.333c0 .067.008.125.025.192.025.067.05.117.067.167.15.275.408.633.775 1.066.375.434.775.875 1.208 1.317.45.442.883.85 1.325 1.225.433.367.792.617 1.075.767.042.016.092.041.15.066a.575.575 0 00.208.034c.142 0 .25-.05.342-.142l.633-.625a2.56 2.56 0 01.6-.467 1.11 1.11 0 01.592-.175c.158 0 .325.034.508.109.184.075.375.183.584.325l2.758 1.958c.217.15.367.325.458.533.084.209.134.417.134.65z'
							></path>
							<path
								stroke='#9899A2'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='1.5'
								d='M15.417 7.5c0-.5-.392-1.266-.975-1.891-.534-.575-1.242-1.025-1.942-1.025M18.333 7.5A5.829 5.829 0 0012.5 1.667'
							></path>
						</svg>
						Phone
					</div>
					<div
						className={`${classes.ContactButton} ${ContactType === 'Email' && classes.active}`}
						onClick={() => SetContactTypeClickHandler('Email')}
					>
						<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' viewBox='0 0 20 20'>
							<path
								stroke='#9899A2'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeMiterlimit='10'
								strokeWidth='1.5'
								d='M14.166 17.084H5.833c-2.5 0-4.167-1.25-4.167-4.167V7.084c0-2.917 1.667-4.167 4.167-4.167h8.333c2.5 0 4.167 1.25 4.167 4.167v5.833c0 2.917-1.667 4.167-4.167 4.167z'
							></path>
							<path
								stroke='#9899A2'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeMiterlimit='10'
								strokeWidth='1.5'
								d='M14.167 7.5L11.56 9.583c-.858.684-2.267.684-3.125 0L5.834 7.5'
							></path>
						</svg>
						Email
					</div>
				</div>
				<div className={`${classes.TwoColumn}`}>
					<Input
						type='text'
						placeholder={`Enter your ${ContactType === 'Phone' ? 'Number' : 'Email'}`}
						name='Contact'
						onChange={onChangeHandler}
						value={formdata.Contact}
					/>
				</div>

				<div className={`d-flex mt-50`} style={{ justifyContent: 'flex-end' }}>
					<PrimaryButton type='button' className='size-6 font-500' onClick={Step1NextClickHandler}>
						next section
						<img src='/svg/arrow-long-right-white.svg' alt='' className='ml-8' />
					</PrimaryButton>
				</div>
			</section>

			{/* Incident Section */}
			<section className={`${classes.Card} ${Step === 2 && classes.active}`}>
				<div className={`font-600 size-14 text-black`}>Incident</div>

				<div className={`${classes.TwoColumn} mt-30`}>
					<Input
						type='datetime-local'
						label='Time and date incident occurred: '
						placeholder='Enter date'
						name='IncidentDate'
						onChange={onChangeHandler}
						value={formdata.IncidentDate}
					/>
					<Input
						type='text'
						label='Duration of incident'
						placeholder='For example: 1 hour'
						name='IncidentDuration'
						onChange={onChangeHandler}
						value={formdata.IncidentDuration}
					/>
				</div>

				<div className={`font-500 size-6 text-darkgray mt-35`}>Who was affected? (Tick all that apply)</div>

				<div className={`${classes.CheckboxContainer} mt-18`}>
					<CheckBox name='Affected' ID='Staff member-A' onChange={affectedCheckboxHandler}>
						Staff member
					</CheckBox>

					<CheckBox name='Affected' ID='Participant-A' onChange={affectedCheckboxHandler}>
						Participant
					</CheckBox>

					<CheckBox name='Affected' ID='Community member-A' onChange={affectedCheckboxHandler}>
						Community member
					</CheckBox>
				</div>

				<div className={`font-500 size-6 text-darkgray mt-35`}>Type of incident:</div>

				<div className={`${classes.CheckboxContainer} mt-18`}>
					<CheckBox name='IncidentType' ID='Medical/Health emergency-B' onChange={IncidentTypeCheckboxHandler}>
						Medical/Health emergency
					</CheckBox>

					<CheckBox name='IncidentType' ID='Drugs/alcohol-B' onChange={IncidentTypeCheckboxHandler}>
						Drugs/alcohol
					</CheckBox>

					<CheckBox name='IncidentType' ID='Staff member-B' onChange={IncidentTypeCheckboxHandler}>
						Staff member
					</CheckBox>

					<CheckBox name='IncidentType' ID='Fall-B' onChange={IncidentTypeCheckboxHandler}>
						Fall
					</CheckBox>

					<CheckBox name='IncidentType' ID='Criminal offence-B' onChange={IncidentTypeCheckboxHandler}>
						Criminal offence
					</CheckBox>

					<CheckBox name='IncidentType' ID='Injury-B' onChange={IncidentTypeCheckboxHandler}>
						Injury
					</CheckBox>

					<CheckBox name='IncidentType' ID='Physical assault-B' onChange={IncidentTypeCheckboxHandler}>
						Physical assault
					</CheckBox>

					<CheckBox name='IncidentType' ID='Verbal threat-B' onChange={IncidentTypeCheckboxHandler}>
						Verbal threat
					</CheckBox>

					<CheckBox name='IncidentType' ID='Self harm-B' onChange={IncidentTypeCheckboxHandler}>
						Self harm
					</CheckBox>

					<CheckBox name='IncidentType' ID='Missing person-B' onChange={IncidentTypeCheckboxHandler}>
						Missing person
					</CheckBox>

					<CheckBox name='IncidentType' ID='Weapons-B' onChange={IncidentTypeCheckboxHandler} style={{ gridColumn: '2/4' }}>
						Weapons (describe type of weapon and method of use, or carried)
					</CheckBox>
				</div>

				<Input
					type='text'
					className={`mt-14`}
					placeholder='Write any Type Description'
					name='IncidentTypeDescription'
					onChange={onChangeHandler}
					value={formdata.IncidentTypeDescription}
				/>

				<div className={`font-500 size-6 text-darkgray mt-35`}>
					Please provide names and contact details of people affected, including up to 3 witnesses
				</div>

				<div className={`${classes.AffectedPersonContainer} mt-22 mb-10`}>
					<div></div>

					<div className={`font-500 size-6 text-lightgray ml-15`}>Name</div>
					<div></div>

					<div className={`font-500 size-6 text-lightgray`}>contact detail</div>
				</div>

				{formdata.AffectedPerson.map((item, index) => (
					<div className={`${classes.AffectedPersonContainer} mb-18`} key={item.id}>
						<div className={`size-6 font-400 text-lightgray`}>Affected Person {index + 1}</div>
						<Input
							type='text'
							placeholder='Enter your text'
							name='Name'
							className='ml-15'
							onChange={event => AffectedPersonOnChange(event, item.id)}
							// value={formdata.IncidentDuration}
						/>
						<div className={`${classes.MiniLine}`}></div>
						<Input
							type='text'
							placeholder='Enter your text'
							name='Contact'
							onChange={event => AffectedPersonOnChange(event, item.id)}
							// value={formdata.IncidentDuration}
						/>
					</div>
				))}
				<SecondaryButton type='button' className='size-4 font-500' style={{ height: '46px' }} onClick={AddAffectedPerson}>
					<img src='/svg/plus-gray.svg' alt='' className='mr-8' />
					Add person
				</SecondaryButton>

				<div className={`font-500 size-6 text-darkgray mt-35`}>Clear, concise and factual account of the incident</div>
				<ul className={`${classes.reportUl}`}>
					<li>Including time, date, place incident occurred </li>
					<li>Please specify any action taken by emergency services, including any officers’ names </li>
				</ul>

				<textarea
					name='IncidentDescription'
					placeholder='Enter your text'
					className={`${classes.textarea}`}
					rows='10'
					onChange={onChangeHandler}
				></textarea>

				<div className={`d-flex mt-50`} style={{ justifyContent: 'space-between' }}>
					<SecondaryButton type='button' className='size-6 font-500' style={{ height: '52px' }} onClick={Step2PrevClickHandler}>
						<img src='/svg/arrow-long-left.svg' alt='' className='mr-8' />
						Previous section
					</SecondaryButton>
					<PrimaryButton type='button' className='size-6 font-500' onClick={Step2NextClickHandler}>
						next section
						<img src='/svg/arrow-long-right-white.svg' alt='' className='ml-8' />
					</PrimaryButton>
				</div>
			</section>

			{/* Action Section */}
			<div>
				<section className={`${classes.Card} ${Step === 3 && classes.active}`}>
					<div className={`font-600 size-14 text-black`}>Actions Taken</div>

					<div className={`font-500 size-6 text-darkgray mt-35`}>Were emergency services in attendance? Tick all that apply</div>

					<div className={`${classes.CheckboxContainer} mt-18`} style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
						<CheckBox name='EmergencyService' ID='Police-E' onChange={EmergencyServiceCheckboxHandler}>
							Yes – Police
						</CheckBox>

						<CheckBox name='EmergencyService' ID='Ambulance-E' onChange={EmergencyServiceCheckboxHandler}>
							Yes – Ambulance
						</CheckBox>

						<CheckBox name='EmergencyService' ID='Fire-E' onChange={EmergencyServiceCheckboxHandler}>
							Yes – Fire
						</CheckBox>

						<CheckBox name='EmergencyService' ID='No-E' onChange={EmergencyServiceCheckboxHandler}>
							No – not needed
						</CheckBox>
					</div>

					<div className={`font-500 size-6 text-darkgray mt-35`}>
						Who was notified and when? I.e. Nominated person, NOK, legal guardian.
					</div>

					<div className={`${classes.NotifiedPersonContainer} mt-22 mb-10`}>
						<div></div>

						<div className={`font-500 size-6 text-lightgray ml-15`}>Name</div>
						<div></div>

						<div className={`font-500 size-6 text-lightgray`}>Role</div>
						<div></div>

						<div className={`font-500 size-6 text-lightgray`}>Contact details</div>
						<div></div>

						<div className={`font-500 size-6 text-lightgray`}>Time/date notified</div>
					</div>

					{formdata.NotifiedPerson.map((item, index) => (
						<div className={`${classes.NotifiedPersonContainer} mb-18`} key={item.id}>
							<div className={`size-6 font-400 text-lightgray`}>Person {index + 1}</div>
							<Input
								type='text'
								placeholder='Enter your text'
								name='Name'
								className='ml-15'
								onChange={event => NotifiedPersonOnChange(event, item.id)}
							/>

							<div className={`${classes.MiniLine}`}></div>

							<Input
								type='text'
								placeholder='Enter your text'
								name='Role'
								onChange={event => NotifiedPersonOnChange(event, item.id)}
							/>

							<div className={`${classes.MiniLine}`}></div>

							<Input
								type='text'
								placeholder='Enter your text'
								name='Contact'
								onChange={event => NotifiedPersonOnChange(event, item.id)}
							/>

							<div className={`${classes.MiniLine}`}></div>

							<Input
								type='datetime-local'
								placeholder='Enter your text'
								name='NotifiedTime'
								onChange={event => NotifiedPersonOnChange(event, item.id)}
							/>
						</div>
					))}

					<SecondaryButton type='button' className='size-4 font-500' style={{ height: '46px' }} onClick={AddNotifiedPerson}>
						<img src='/svg/plus-gray.svg' alt='' className='mr-8' />
						Add person
					</SecondaryButton>

					<div className={`font-500 size-6 text-darkgray mt-35 mb-20`}>If no one was notified – why / why not?</div>

					<textarea
						name='NotifiedDescription'
						placeholder='Enter your text'
						className={`${classes.textarea}`}
						rows='10'
						onChange={onChangeHandler}
					></textarea>

					<div className={`${classes.TwoColumn} mt-30`}>
						<Input
							type='file'
							label='Your (reporter’s) signature'
							placeholder={SelectedFileName}
							name='Signature'
							id='Signature'
							onChange={FileChangeHandler}
						/>
					</div>
				</section>

				<section className={`${classes.Card} ${Step === 3 && classes.active}`}>
					<div className={`font-600 size-14 text-black`}>Office use only</div>

					<div className={`${classes.TwoColumn} mt-30`}>
						<Input
							type='text'
							label='Sunflower Support Services representative name & title'
							placeholder='Enter your full name'
							name='OfficeName'
							onChange={onChangeHandler}
							value={formdata.OfficeName}
						/>
						<Input
							type='text'
							label='Phone number'
							placeholder='Enter your contact number'
							name='OfficePhone'
							onChange={onChangeHandler}
							value={formdata.OfficePhone}
						/>
						<Input
							type='email'
							label='Email'
							placeholder='Enter your email'
							name='OfficeEmail'
							onChange={onChangeHandler}
							value={formdata.OfficeEmail}
						/>
					</div>

					<div className={`font-500 size-6 text-darkgray mt-35 mb-20`}>Reportable to the NDIS Commission</div>

					<div className={`${classes.CheckboxContainer} mt-18`}>
						<CheckBox name='NDISReport' ID='Yes-N' onChange={NDISReportCheckboxHandler}>
							Yes – date reported
						</CheckBox>

						<CheckBox name='NDISReport' ID='No-N' onChange={NDISReportCheckboxHandler}>
							No, not applicable
						</CheckBox>
					</div>

					<div className={`${classes.TwoColumn} mt-10`}>
						<Input
							type='text'
							placeholder='Write your reason...'
							name='NDISReason'
							onChange={onChangeHandler}
							value={formdata.NDISReason}
						/>
					</div>

					<div className={`d-flex mt-50`} style={{ justifyContent: 'space-between' }}>
						<SecondaryButton
							type='button'
							className='size-6 font-500'
							style={{ height: '52px' }}
							onClick={Step3PrevClickHandler}
						>
							<img src='/svg/arrow-long-left.svg' alt='' className='mr-8' />
							Previous section
						</SecondaryButton>
						<PrimaryButton type='button' className='size-6 font-500' onClick={submitFormClickHandler} IsLoading={IsLoading}>
							The form was completed
							{!IsLoading && <img src='/svg/arrow-long-right-white.svg' alt='' className='ml-8' />}
						</PrimaryButton>
					</div>
				</section>
			</div>
		</>
	);
};
export default AddClientReport;
