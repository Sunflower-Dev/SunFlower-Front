import classes from './RequestDeleteDocument.module.css';

import Popup from '../Popup';
import SecondaryButton from '../../Bottons/SecondaryButton';
import PrimaryButton from '../../Bottons/PrimaryButton';
import { useHistory, useParams } from 'react-router';
import { useRef, useState } from 'react';
import MobilePopup from '../MobilePopup/MobilePopup';
import RadioGroup from '../../Inputs/RadioGroup';

import Input from '../../Inputs/Input';

import { axiosInstance } from '../../../../axios-global';

const RequestDeleteDocument = props => {
	const history = useHistory();

	const [IsClosing, setIsClosing] = useState(false);
	// eslint-disable-next-line
	const [IsSumbitting, setIsSumbitting] = useState(false);
	const [selected, setselected] = useState('');

	const { DocumentId } = useParams();

	const ReasonRef = useRef(null);

	const closePopupHandler = () => {
		setIsClosing(true);
		setTimeout(() => {
			history.goBack();
		}, 300);
	};

	const checkboxChanges = (name, value) => {
		setselected(value);
	};
	const OnSubmitClickHandler = async () => {
		try {
			const call = await axiosInstance.put(props.urlPost + DocumentId, {
				Reason: selected === 'Other' ? ReasonRef.current.value : selected,
			});
			var response = call.data;
			if (response) {
				history.goBack();
			}
		} catch (error) {
			console.log(error);
		}
	};

	return window.innerWidth > 550 ? (
		<Popup IsClosing={IsClosing} width='680px'>
			<div className={classes.header}>
				<span className={`font-600 text-black size-14`}>Delete document</span>
				<img src={`/svg/close.svg`} width='30px' alt='close' onClick={closePopupHandler} />
				<span className={`font-400 text-lightgray size-6`}>Why do you want to delete the document?</span>
			</div>
			<div className={classes.body}>
				<div className={`font-500 text-darkgray size-8`}>Reasons for deletion</div>
				<RadioGroup
					data={[
						{ id: 'This document was uploaded incorrectly', name: 'Reason', required: true },
						{ id: 'This is a duplicate document', name: 'Reason', required: true },
						{ id: 'This document is incompletely uploaded', name: 'Reason', required: true },
						{ id: 'Other', name: 'Reason', required: true },
					]}
					name='Reason'
					onChange={checkboxChanges}
					LabelClassName='size-6'
					selected={selected}
				/>
				{selected === 'Other' && <Input placeholder='Write your reason' ref={ReasonRef} />}
			</div>

			<div className={classes.Action}>
				<PrimaryButton
					type='submit'
					IsLoading={IsSumbitting}
					className={`font-500 size-6`}
					style={{ padding: '14px 28px' }}
					onClick={OnSubmitClickHandler}
				>
					submit
				</PrimaryButton>

				<SecondaryButton onClick={closePopupHandler} style={{ padding: '14px 28px', height: '52px' }}>
					<span className={`font-500 text-darkgray size-6`}>cancel</span>
				</SecondaryButton>
			</div>
		</Popup>
	) : (
		<MobilePopup IsClosing={IsClosing}>
			<div className={classes.header}>
				<span className={`font-600 text-black size-14`}>Delete document</span>
				<img src={`/svg/close.svg`} width='30px' alt='close' onClick={closePopupHandler} />
				<span className={`font-400 text-lightgray size-6`}>Why do you want to delete the document?</span>
			</div>
			<div className={classes.body}>
				<div className={`font-500 text-darkgray size-8`}>Reasons for deletion</div>
				<RadioGroup
					data={[
						{ id: 'This document was uploaded incorrectly', name: 'Reason', required: true },
						{ id: 'This is a duplicate document', name: 'Reason', required: true },
						{ id: 'This document is incompletely uploaded', name: 'Reason', required: true },
						{ id: 'Other', name: 'Reason', required: true },
					]}
					name='Reason'
					onChange={checkboxChanges}
					LabelClassName='size-6'
					selected={selected}
				/>
				{selected === 'Other' && <Input placeholder='Write your reason' ref={ReasonRef} />}
			</div>

			<div className={classes.Action}>
				<PrimaryButton
					type='submit'
					IsLoading={IsSumbitting}
					className={`font-500 size-6`}
					style={{ padding: '14px 28px' }}
					onClick={OnSubmitClickHandler}
				>
					submit
				</PrimaryButton>

				<SecondaryButton onClick={closePopupHandler} style={{ padding: '14px 28px', height: '52px' }}>
					<span className={`font-500 text-darkgray size-6`}>cancel</span>
				</SecondaryButton>
			</div>
		</MobilePopup>
	);
};

export default RequestDeleteDocument;
