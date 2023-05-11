import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../axios-global';
import PrimaryButton from '../../../UI/Bottons/PrimaryButton';
import SecondaryButton from '../../../UI/Bottons/SecondaryButton';
import LoadingSpinner from '../../../UI/LoadingSpinner';
import classes from './ExamPassed.module.css';

const ExamPassed = () => {
	const { id } = useParams();
	const [Data, SetData] = useState(null);

	const history = useHistory();

	useEffect(() => {
		(async () => {
			try {
				const call = await axiosInstance.get('/courses/GetExamResult/' + id);
				var response = call.data;
				SetData(response);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [id]);

	return !Data ? (
		<LoadingSpinner />
	) : (
		<>
			<div className={classes.Header}>
				{window.innerWidth > 550 ? (
					<SecondaryButton style={{ height: '52px', padding: '14px 28px' }} className='font-500 size-6 text-darkgray'>
						<img src='/svg/arrow-long-left.svg' alt='' className='mr-8' />
						Back to home
					</SecondaryButton>
				) : (
					<>
						<img src='/svg/arrow-left.svg' alt='' />
						<div className='text-center text-black size-7 font-600'>{Data.IsPassed ? 'Passed' : ' Error'}</div>
					</>
				)}
			</div>
			{Data.IsPassed ? (
				<div className={`${classes.Main}`}>
					<div className={`${classes.Container}`}>
						<div className={`${classes.Body}`}>
							<div className={`text-green font-700 ${window.innerWidth > 550 ? 'size-40' : 'size-30'}`}>{Data.Score}</div>
							<div className={`text-darkgray font-500 text-center ${window.innerWidth > 550 ? 'size-10' : 'size-7'}`}>
								You passed the exam successfully
							</div>

							<div className={classes.Line}></div>

							<div className={`${classes.Row}`}>
								<div className={`text-lightgray text-left font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'}`}>
									Number of questions
								</div>
								<div
									className={`text-lightgray text-right ${
										window.innerWidth > 550 ? 'size-6 font-400' : 'size-3 font-600'
									}`}
								>
									{Data.Score}
								</div>
							</div>
							<div className={`${classes.Row} mt-15 mb-30`}>
								<div className={`text-lightgray text-left font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'}`}>
									questions answered correctly
								</div>
								<div
									className={`text-lightgray text-right ${
										window.innerWidth > 550 ? 'size-6 font-400' : 'size-3 font-600'
									}`}
								>
									{Data.Score}
								</div>
							</div>

							<PrimaryButton
								className={`font-500 ${window.innerWidth > 550 ? 'size-6' : 'size-4'}`}
								style={{ padding: '19px 36px', width: window.innerWidth < 550 && '100%' }}
								onClick={() => {
									history.push('/Certificate/' + id);
								}}
							>
								<img
									src='/svg/download-mini-white.svg'
									alt=''
									width={window.innerWidth > 550 ? 26 : 22}
									className={'mr-8'}
								/>
								Download the certificate
							</PrimaryButton>
						</div>
					</div>
				</div>
			) : (
				<div className={`${classes.Main}`}>please pass the test First!</div>
			)}
			{window.innerWidth < 550 && (
				<div className={classes.FloatButton}>
					<SecondaryButton className='font-500 size-4' style={{ height: '52px', width: '100%' }}>
						<img src='/svg/arrow-long-left.svg' alt='' className='mr-8' width={22} />
						<div className='text-darkgray'>Back to home</div>
					</SecondaryButton>
				</div>
			)}
		</>
	);
};

export default ExamPassed;
