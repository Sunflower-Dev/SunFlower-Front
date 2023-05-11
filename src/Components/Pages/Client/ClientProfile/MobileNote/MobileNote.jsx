import moment from 'moment';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../../axios-global';
import classes from './MobileNote.module.css';
import LoadingSpinner from '../../../../UI/LoadingSpinner';

const MobileNote = props => {
	const [data, SetData] = useState(null);

	const { NoteID } = useParams();

	const history = useHistory();

	useEffect(() => {
		(async () => {
			try {
				var url = props.Page === 'online-office' ? '/online-office/GetNoteById/' : '/Notes/';
				const call = await axiosInstance.get(url + NoteID);
				var response = call.data;
				SetData(response);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [NoteID, props]);

	const BackHandler = () => {
		history.goBack();
	};

	return !data ? (
		<LoadingSpinner />
	) : (
		<>
			<div className={classes.Header} style={{ alignItems: 'center' }}>
				<img src='/svg/arrow-left.svg' alt='back' onClick={BackHandler} />
				<div className={`font-400 size-1 text-lightgray ${classes.HeaderCenter}`}>
					<img src={`${process.env.REACT_APP_SRC_URL}${data.Admin.Avatar}`} alt='' className={classes.Avatar} />
					&nbsp;| &nbsp; &nbsp;
					{moment(data.CreatedAt).format('DD MMM |  hh:mm A')}
				</div>

				<img
					src='/svg/edit-black.svg'
					alt='back'
					onClick={() => history.replace(history.location.pathname.replace('NoteItem', 'EditNote'))}
					width={24}
				/>
			</div>

			<h2 className={`font-700 size-7 text-black mt-20 mb-15 pl-16 pr-16`}>{data.Title}</h2>

			<p className={`font-400 size-4 text-lightgray pl-16 pr-16`}>{data.Description}</p>
		</>
	);
};
export default MobileNote;
