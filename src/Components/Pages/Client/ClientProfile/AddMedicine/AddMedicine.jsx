import { useRef, useState } from 'react';
import SecondaryButton from '../../../../UI/Bottons/SecondaryButton';
import Input from '../../../../UI/Inputs/Input';
import Popup from '../../../../UI/Popup/Popup';
import { v4 as uuidv4 } from 'uuid';

import classes from './AddMedicine.module.css';
import PrimaryButton from '../../../../UI/Bottons/PrimaryButton';
import { useHistory, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../../axios-global';
const AddMedicine = () => {
	const [Pills, SetPills] = useState([]);
	const [IsSumbitting, SetIsSumbitting] = useState(false);

	const MedicationRef = useRef(null);
	const NumberRef = useRef(null);
	const TitleRef = useRef(null);

	const history = useHistory();
	const { id } = useParams();

	const AddPillHandler = () => {
		SetPills(oldArray => [...oldArray, { Medication: MedicationRef.current.value, Number: NumberRef.current.value, _id: uuidv4() }]);
	};
	const RemoveItemHandler = id => {
		SetPills(Pill => Pill.filter(item => item._id !== id));
	};
	const closeClickHandler = () => {
		history.goBack();
	};
	const SubmitClickHandler = async () => {
		try {
			let data = { Title: TitleRef.current.value, Pills: [] };
			Pills.forEach(element => {
				data.Pills.push({ Medication: element.Medication, Number: element.Number });
			});

			const call = await axiosInstance.post('/clients/AddMedicine/' + id, data);
			var responseadd = call.data;
			if (responseadd) {
				SetIsSumbitting(false);
				history.goBack();
			}
		} catch (error) {}
	};

	return (
		<Popup width='680px'>
			<div className={classes.header}>
				<span className={`font-600 text-black ${window.innerWidth > 550 ? 'size-14' : 'text-center size-7'}`}>
					Prescribing new Medications
				</span>
				{window.innerWidth > 550 && (
					<img src={`/svg/${window.innerWidth > 550 ? 'close' : 'arrow-left'}.svg`} width='30px' alt='close' />
				)}
			</div>
			<div className={classes.body}>
				<Input type='text' placeholder='Write your text' label='Title' ref={TitleRef} name='Title' />

				<div className={classes.row}>
					<Input
						type='text'
						placeholder='Write your text'
						label='Medication'
						ref={MedicationRef}
						name='Medication'
						className={classes.Medication}
					/>
					<Input type='number' placeholder='Write your text' label='Dosage(Number)' ref={NumberRef} name='Number' />
					<SecondaryButton style={{ width: '51px', height: '51px', marginBottom: '6px' }} onClick={AddPillHandler}>
						<img src='/svg/plus-gray.svg' alt='' />
					</SecondaryButton>
				</div>

				{Pills.map(item => (
					<div className={classes.PillItem} key={item._id}>
						<div className='font-400 text-lightgray size-6'>{item.Medication}</div>
						<div className='font-400 text-lightgray size-6'>{item.Number} pills</div>
						<img src='/svg/minus.svg' alt='' onClick={() => RemoveItemHandler(item._id)} style={{ cursor: 'pointer' }} />
					</div>
				))}
			</div>
			<div className={classes.Action}>
				<PrimaryButton
					onClick={SubmitClickHandler}
					IsLoading={IsSumbitting}
					className={`font-500 size-6`}
					style={{ padding: '14px 28px' }}
				>
					Save
				</PrimaryButton>

				{window.innerWidth > 550 && (
					<SecondaryButton onClick={closeClickHandler} type='button' style={{ padding: '14px 28px', height: '52px' }}>
						<span className={`font-500 text-darkgray size-6`}>cancel</span>
					</SecondaryButton>
				)}
			</div>
		</Popup>
	);
};

export default AddMedicine;
