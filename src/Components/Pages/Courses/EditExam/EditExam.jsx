import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../../axios-global';
import PrimaryButton from '../../../UI/Bottons/PrimaryButton';
import SecondaryButton from '../../../UI/Bottons/SecondaryButton';
import Input from '../../../UI/Inputs/Input';
import LoadingSpinner from '../../../UI/LoadingSpinner';
import classes from './EditExam.module.css';
import { v4 as uuidv4 } from 'uuid';
import EditExamAnswers from './EditExamAnswers/EditExamAnswers';

const EditExam = () => {
	const { id } = useParams();
	const [Data, SetData] = useState(null);
	const [CourseTitle, SetCourseTitle] = useState(null);
	const [IsLoading, SetIsLoading] = useState(null);

	const history = useHistory();

	useEffect(() => {
		(async () => {
			try {
				const call = await axiosInstance.get('/courses/GetExam/' + id);
				var response = call.data;
				SetData({ Questions: response.Exam.Questions, Title: response.Exam.Title, Description: response.Exam.Description });
				SetCourseTitle(response.Title);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [id]);

	const onTitleChange = event => {
		SetData(data => {
			return { ...data, Title: event.target.value };
		});
	};
	const onDescriptionChange = event => {
		SetData(data => {
			return { ...data, Description: event.target.value };
		});
	};

	const AddQuestionClickHandler = () => {
		var Questions = Data.Questions;
		Questions.push({
			Question: '',
			A: '',
			B: '',
			C: '',
			D: '',
			CorrectAnswer: '',
			_id: uuidv4(),
		});

		SetData(data => {
			return { ...data, Questions };
		});
	};

	const EditExamAnswerChangeHandler = (id, data) => {
		var Questions = Data.Questions;
		var Q = Questions.find(item => item._id === id);
		Q.A = data.A;
		Q.B = data.B;
		Q.C = data.C;
		Q.D = data.D;
		Q.CorrectAnswer = data.CorrectAnswer;

		SetData(data => {
			return { ...data, Questions };
		});
	};

	const EditExamQuestionChangeHandler = (id, event) => {
		var Questions = Data.Questions;
		var Q = Questions.find(item => item._id === id);
		Q.Question = event.target.value;

		SetData(data => {
			return { ...data, Questions };
		});
	};

	const onSubmitClickHandler = async event => {
		event.preventDefault();
		SetIsLoading(true);
		try {
			var formdata = Data;
			formdata.Questions = formdata.Questions.map(item => {
				return {
					A: item.A,
					B: item.B,
					C: item.C,
					D: item.D,
					Question: item.Question,
					CorrectAnswer: item.CorrectAnswer,
				};
			});
			const call = await axiosInstance.put('/courses/EditExam/' + id, Data);
			var response = call.data;
			SetIsLoading(false);
			history.goBack();
		} catch (error) {
			console.log(error);
		}
	};

	return !Data ? (
		<LoadingSpinner />
	) : (
		<>
			{window.innerWidth > 550 ? (
				<div className={`text-black size-14 font-500 mb-25 d-flex`}>
					<span className={`font-600`}>Course Questions :&nbsp;</span>
					{CourseTitle}
					<SecondaryButton className={`ml-20 size-6`} type='button' onClick={AddQuestionClickHandler}>
						<img src='/svg/plus-gray.svg' className='mr-8' alt='add' />
						Add Question
					</SecondaryButton>
				</div>
			) : (
				<div className={classes.MobileTopGrid}>
					<div className={`text-lightgray size-6 font-500`}>Course Questions :</div>
					<div className={`text-black size-10 font-700 `}>{CourseTitle}</div>
					<SecondaryButton
						className={`size-5`}
						style={{ gridRow: '1/3', gridColumns: '2', margin: 'auto' }}
						type='button'
						onClick={AddQuestionClickHandler}
					>
						Add Question
					</SecondaryButton>
				</div>
			)}
			<form className={classes.formContainer} onSubmit={onSubmitClickHandler}>
				<div className={`${classes.Card}`}>
					<Input type='text' label='Exam title' name='Title' value={Data.Title} onChange={onTitleChange} />
					<div className='d-flex mt-20' style={{ flexDirection: 'column' }}>
						<label
							htmlFor='Description'
							className={`text-darkgray font-500 ${window.innerWidth > 550 ? 'size-6' : 'size-4'} mb-6`}
						>
							Description of Exam
						</label>
						<textarea
							placeholder='Enter your text'
							name='Description'
							onChange={onDescriptionChange}
							value={Data.Description}
						></textarea>
					</div>
				</div>
				{Data.Questions.map((item, index) => (
					<div className={`${classes.Card}`} key={item._id}>
						<div className={`${window.innerWidth > 550 ? 'font-500 size-10' : 'font-600 size-5'} text-black`}>
							Question {index + 1}
						</div>
						<Input
							type='text'
							label='Question'
							placeholder='new Question'
							className={`${window.innerWidth > 550 ? 'mt-25' : 'mt-20'} ${classes.QuestionInput}`}
							value={item.Question}
							onChange={event => EditExamQuestionChangeHandler(item._id, event)}
						/>
						<EditExamAnswers
							onChange={EditExamAnswerChangeHandler}
							id={item._id}
							A={item.A}
							B={item.B}
							C={item.C}
							D={item.D}
							CorrectAnswer={item.CorrectAnswer}
						/>
					</div>
				))}
				<PrimaryButton IsLoading={IsLoading} style={{ width: window.innerWidth < 550 && '100%' }} className={`mb-20`}>
					Finish Edit
				</PrimaryButton>
			</form>
		</>
	);
};
export default EditExam;
