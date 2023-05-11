import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../axios-global';
import LoadingSpinner from '../../../UI/LoadingSpinner';
import classes from './TakeExam.module.css';

import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';
import SecondaryButton from '../../../UI/Bottons/SecondaryButton';
import PrimaryButton from '../../../UI/Bottons/PrimaryButton';

const TakeExam = () => {
	const { id } = useParams();

	const history = useHistory();

	const [Data, SetData] = useState(null);
	const [IsLoading, SetIsLoading] = useState(false);

	const [ProgressNumber, SetProgress] = useState(0);
	const [ProgressStatus, SetProgressStatus] = useState('default');
	const [ProgressSteps, SetProgressSteps] = useState(' ');

	useEffect(() => {
		(async () => {
			try {
				const call = await axiosInstance.get('/courses/GetExam/' + id);
				var response = call.data;
				SetData(response.Exam);
				SetProgressSteps(0);
				SetProgress(0);
				SetProgressStatus('default');
			} catch (error) {
				console.log(error);
			}
		})();
	}, [id]);

	const SelectAnswerHandler = (QuestionId, Selected) => {
		let Questions = Data.Questions;
		let Question = Questions.find(item => item._id === QuestionId);
		Question.Selected = Selected;
		Question.error = undefined;
		let SelectedCount = 0;
		Questions.forEach(element => {
			if (element.Selected) {
				SelectedCount++;
			}
		});

		SetProgressSteps(SelectedCount);
		SetProgress((100 * SelectedCount) / Questions.length);
		if (SelectedCount === Questions.length) {
			SetProgressStatus('success');
		}
		SetData(data => {
			return { ...data, Questions };
		});
	};

	const SubmitClickHandler = async () => {
		let Questions = Data.Questions;
		let HaveError = false;
		Questions.forEach(element => {
			if (element.CorrectAnswer === element.Selected) {
				element.error = false;
			} else {
				element.error = true;
				HaveError = true;
			}
		});
		SetData(data => {
			return { ...data, Questions };
		});

		if (!HaveError) {
			SetIsLoading(true);
			try {
				const call = await axiosInstance.put('/courses/FinishExam/' + id);
				var response = call.data;
				SetIsLoading(false);
				history.replace('/ExamPassed/' + id);
			} catch (error) {
				console.log(error);
			}
		}
	};

	return !Data ? (
		<LoadingSpinner />
	) : (
		<div style={{ width: '100%' }}>
			<div className={`${classes.Header}`}>
				{window.innerWidth > 550 ? (
					<div className={`${classes.Close}`} onClick={() => history.goBack()}>
						<img src='/svg/cross.svg' alt='' />
					</div>
				) : (
					<img src='/svg/cross.svg' alt='' width={30} />
				)}
				<Progress
					theme={{
						error: {
							symbol: ProgressSteps + '/' + Data.Questions.length,
							trailColor: '#E1E2E6',
							color: 'red',
						},
						default: {
							symbol: ProgressSteps + '/' + Data.Questions.length,
							trailColor: '#E1E2E6',
							color: '#FFD020',
						},
						active: {
							symbol: ProgressSteps + '/' + Data.Questions.length,
							trailColor: '#E1E2E6',
							color: '#FFD020',
						},
						success: {
							symbol: '',
							trailColor: '#E1E2E6',
							color: '#48EA81',
						},
					}}
					percent={ProgressNumber}
					status={ProgressStatus}
				/>

				{window.innerWidth > 550 && (
					<>
						{ProgressSteps !== Data.Questions.length ? (
							<SecondaryButton className='font-500 size-6' style={{ height: '52px' }}>
								<div className='text-lightgray'>
									submit &nbsp;&nbsp; <span className='text-darkgray'>{ProgressSteps}</span>/{Data.Questions.length}
								</div>
							</SecondaryButton>
						) : (
							<PrimaryButton className='font-500 size-6' onClick={SubmitClickHandler} IsLoading={IsLoading}>
								submit
							</PrimaryButton>
						)}
					</>
				)}
			</div>

			<div className={`${classes.Body}`}>
				<h1 className={`text-black font-700 ${window.innerWidth > 550 ? 'size-18' : 'size-10'}`}>{Data.Title}</h1>

				{Data.Questions.map((item, index) => (
					<div key={item._id}>
						<div className={`font-600 text-darkgray ${window.innerWidth > 550 ? 'size-14' : 'size-6'}`}>
							{index + 1} - {item.Question}
						</div>
						<div className={`${classes.QuestionsContainer} ${window.innerWidth > 550 ? 'mt-10 mb-60' : 'mb-30'} `}>
							<div
								className={`${classes.AnswerItem} ${item.Selected === 'A' && classes.active}
                                ${item.error && item.Selected === 'A' && classes.error} ${
									item.error !== undefined && item.CorrectAnswer === 'A' && classes.success
								}
                                 text-lightgray font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'}`}
								onClick={() => SelectAnswerHandler(item._id, 'A')}
							>
								A) {item.A}
							</div>

							{item.error && item.Selected === 'A' && (
								<div className={`text-secondaryred font-400 ${window.innerWidth > 550 ? 'size-5 mt-10' : 'size-1 mt-6'}`}>
									Your answer to this question is incorrect. Please select the correct answer
								</div>
							)}

							<div
								className={`${classes.AnswerItem} ${item.Selected === 'B' && classes.active}
                                ${item.error && item.Selected === 'B' && classes.error} ${
									item.error !== undefined && item.CorrectAnswer === 'B' && classes.success
								}
                                text-lightgray font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'}`}
								onClick={() => SelectAnswerHandler(item._id, 'B')}
							>
								B) {item.B}
							</div>

							{item.error && item.Selected === 'B' && (
								<div className={`text-secondaryred font-400 ${window.innerWidth > 550 ? 'size-5 mt-10' : 'size-1 mt-6'}`}>
									Your answer to this question is incorrect. Please select the correct answer
								</div>
							)}

							<div
								className={`${classes.AnswerItem} ${item.Selected === 'C' && classes.active} 
                                ${item.error && item.Selected === 'C' && classes.error} ${
									item.error !== undefined && item.CorrectAnswer === 'C' && classes.success
								}
                                text-lightgray font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'}`}
								onClick={() => SelectAnswerHandler(item._id, 'C')}
							>
								C) {item.C}
							</div>

							{item.error && item.Selected === 'C' && (
								<div className={`text-secondaryred font-400 ${window.innerWidth > 550 ? 'size-5 mt-10' : 'size-1 mt-6'}`}>
									Your answer to this question is incorrect. Please select the correct answer
								</div>
							)}

							<div
								className={`${classes.AnswerItem} ${item.Selected === 'D' && classes.active} 
                                ${item.error && item.Selected === 'D' && classes.error} ${
									item.error !== undefined && item.CorrectAnswer === 'D' && classes.success
								}
                                text-lightgray font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'}`}
								onClick={() => SelectAnswerHandler(item._id, 'D')}
							>
								D) {item.D}
							</div>

							{item.error && item.Selected === 'D' && (
								<div className={`text-secondaryred font-400 ${window.innerWidth > 550 ? 'size-5 mt-10' : 'size-1 mt-6'}`}>
									Your answer to this question is incorrect. Please select the correct answer
								</div>
							)}
						</div>
					</div>
				))}
			</div>

			{window.innerWidth < 550 && (
				<div className={classes.FloatButton}>
					{ProgressSteps !== Data.Questions.length ? (
						<SecondaryButton className='font-500 size-6' style={{ height: '52px', width: '100%' }}>
							<div className='text-lightgray'>
								submit &nbsp; <span className='text-darkgray'>{ProgressSteps}</span>/{Data.Questions.length}
							</div>
						</SecondaryButton>
					) : (
						<PrimaryButton
							className='font-500 size-6'
							IsLoading={IsLoading}
							style={{ height: '52px', width: '100%' }}
							onClick={SubmitClickHandler}
						>
							submit
						</PrimaryButton>
					)}
				</div>
			)}
		</div>
	);
};

export default TakeExam;
