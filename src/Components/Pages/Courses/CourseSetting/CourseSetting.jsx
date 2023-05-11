import Popup from '../../../UI/Popup/Popup';
import { useHistory } from 'react-router';
import { Fragment, useEffect, useRef, useState } from 'react';
import classes from './CourseSetting.module.css';
import Input from '../../../UI/Inputs/Input';
import PrimaryButton from '../../../UI/Bottons/PrimaryButton';
import { axiosInstance } from '../../../../axios-global';
import LoadingSpinner from '../../../UI/LoadingSpinner';
import { ReactSortable } from 'react-sortablejs';
import LessonItem from './LessonItem';
import SecondaryButton from '../../../UI/Bottons/SecondaryButton';

const CourseSetting = () => {
	const [IsClosing, SetIsClosing] = useState(false);
	const [CourseAdding, SetCourseAdding] = useState(false);
	const [Courses, SetCourses] = useState(null);
	const [Lessons, SetLessons] = useState(null);
	const [ActiveCourse, SetActiveCourse] = useState('');
	const [IsCourseReOrdering, SetIsCourseReOrdering] = useState(false);
	const [IsLessonReOrdering, SetIsLessonReOrdering] = useState(false);
	const [CourseEditing, SetCourseEditing] = useState('');
	const [IsCourseEditing, SetIsCourseEditing] = useState(false);
	const history = useHistory();

	const AddCourseRef = useRef(null);
	const EditCourseRef = useRef(null);

	useEffect(() => {
		(async () => {
			try {
				const call = await axiosInstance.get('/courses/GetCourseList');
				var response = call.data;
				SetCourses(response);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	const closeClickHandler = () => {
		SetIsClosing(true);

		setTimeout(() => {
			history.goBack();
		}, 300);
	};
	const AddCourseOpenHandler = () => {
		SetCourseAdding(true);
	};
	const AddTrainingOpenHandler = id => {
		history.push('/Courses/Setting/' + id + '/AddTrainnig');
	};

	const DropDownToggleHandler = id => {
		if (ActiveCourse === id) {
			SetActiveCourse('');
		} else {
			const unSortedLessons = Courses.find(item => item._id === id).Lessons;
			SetLessons(
				unSortedLessons.sort((a, b) => {
					return a.Order - b.Order;
				}),
			);
			SetActiveCourse(id);
		}
	};

	const AddCourseSubmitHandler = async () => {
		try {
			const call = await axiosInstance.post('/courses/AddCourse', { Title: AddCourseRef.current.value });
			var response = call.data;
			SetCourses(response);
			SetCourseAdding(false);
		} catch (error) {
			console.log(error);
		}
	};

	const CourseSortChange = async () => {
		const Data = [];
		var index = 1;
		Courses.forEach(element => {
			Data.push({ id: element._id, Order: index });
			index++;
		});

		SetIsCourseReOrdering(true);
		try {
			const call = await axiosInstance.put('/courses/ChangeCourseOrder', Data);
			var response = call.data;
			SetIsCourseReOrdering(false);
		} catch (error) {
			console.log(error);
		}
	};

	const LessonSortChange = async id => {
		const Data = [];
		var index = 1;
		Lessons.forEach(element => {
			Data.push({ id: element._id, Order: index });
			index++;
		});

		SetIsLessonReOrdering(true);
		try {
			const call = await axiosInstance.put('/courses/ChangeLessonOrder/' + id, Data);
			var response = call.data;
			SetIsLessonReOrdering(false);
		} catch (error) {
			console.log(error);
		}
	};

	const OpenCourseEditclick = (id, Title) => {
		SetCourseEditing({ id, Title });
		setTimeout(() => {
			document.getElementById('EditInput').focus();
			document.getElementById('EditInput').value = Title;
		}, 10);
	};

	const EditCourseSubmit = async id => {
		SetIsCourseEditing(true);
		try {
			await axiosInstance.put('/courses/EditCourse/' + id, { Title: EditCourseRef.current.value });
			SetIsCourseEditing(false);
			SetCourseEditing('');

			const call2 = await axiosInstance.get('/courses/GetCourseList');
			var response = call2.data;
			SetCourses(response);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Popup width='680px' IsClosing={IsClosing} Mobile='EMPTY'>
			{window.innerWidth > 550 && (
				<div className={classes.header}>
					<span className={`font-600 text-black ${window.innerWidth > 550 ? 'size-14' : 'size-7'}`}> Course settings</span>
					<img
						src={`/svg/${window.innerWidth > 550 ? 'close' : 'arrow-left'}.svg`}
						width='30px'
						alt='close'
						onClick={closeClickHandler}
					/>
					<span className={`font-400 text-lightgray size-6`}>
						{window.innerWidth > 550 && 'You can use this section to set courses and trainings'}
					</span>
				</div>
			)}
			{Courses === null ? (
				<LoadingSpinner />
			) : (
				<Fragment>
					{window.innerWidth > 500 ? (
						<h3 className={`font-500 size-10 text-darkgary mb-20 mt-40`}>Courses</h3>
					) : (
						<>
							<h3 className={`font-700 size-10 text-black mb-8 mt-20 ml-16`}>Course settings</h3>
							<p className={`font-400 size-4 text-lightgray mb-25  ml-16 mr-16`}>
								You can use this section to set courses and trainings
							</p>
						</>
					)}
					<ReactSortable
						list={Courses}
						setList={SetCourses}
						handle='.handle'
						animation={150}
						onEnd={CourseSortChange}
						style={{ padding: window.innerWidth < 550 && '0 16px' }}
					>
						{Courses.map(course => (
							<div key={course._id} className={`${classes.CourseContainer}`}>
								<div className={`${classes.CourseItem} ${ActiveCourse === course._id && classes.active}`}>
									{IsCourseReOrdering ? (
										<LoadingSpinner style={{ width: '22px', height: '22px', margin: '0' }} strokeWidth='4' />
									) : (
										<img src='/svg/menu.svg' alt='' className={`handle`} />
									)}

									{CourseEditing.id === course._id ? (
										<Fragment>
											<input type='text' className={`${classes.editInput}`} id='EditInput' ref={EditCourseRef} />
											<PrimaryButton
												style={{ gridColumn: '3/6' }}
												IsLoading={IsCourseEditing}
												onClick={() => EditCourseSubmit(course._id)}
											>
												save
											</PrimaryButton>
										</Fragment>
									) : (
										<Fragment>
											<div className={`font-500 text-lightgray ${window.innerWidth > 550 ? 'size-6' : 'size-3'}`}>
												{course.Title}
											</div>
											<img
												src='/svg/edit-black.svg'
												alt=''
												width={22}
												onClick={() => OpenCourseEditclick(course._id, course.Title)}
											/>
											<img src='/svg/trash-black.svg' alt='' width={22} />
											<div className={`${classes.DropDownCircle}`} onClick={() => DropDownToggleHandler(course._id)}>
												<svg
													width='14'
													height='8'
													viewBox='0 0 14 8'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'
												>
													<path
														d='M12.9401 1.7124L8.05006 6.6024C7.47256 7.1799 6.52756 7.1799 5.95006 6.6024L1.06006 1.7124'
														stroke='#5E5F6E'
														strokeWidth='1.5'
														strokeMiterlimit='10'
														strokeLinecap='round'
														strokeLinejoin='round'
													/>
												</svg>
											</div>
										</Fragment>
									)}
								</div>

								<div className={`${classes.CourseBody} ${ActiveCourse === course._id && classes.active}`}>
									{ActiveCourse === course._id && (
										<ReactSortable
											list={Lessons}
											setList={SetLessons}
											handle='.handle'
											animation={150}
											onEnd={() => LessonSortChange(course._id)}
											style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
										>
											{Lessons.map(lesson => (
												<LessonItem key={lesson._id} lesson={lesson} IsLessonReOrdering={IsLessonReOrdering} />
											))}
										</ReactSortable>
									)}
									{ActiveCourse === course._id && (
										<>
											<div className={`${classes.LessonItem}`} style={{ gridTemplateColumns: '22px 1fr auto' }}>
												<img src='/svg/lock-close.svg' alt='' width={22} />
												<div className={`font-400 size-5 text-lightgray`}>{course.Exam.Title}</div>
												<SecondaryButton
													onClick={() => history.push('/Courses/Setting/' + course._id + '/EditExam')}
												>
													Edit Exam
												</SecondaryButton>
											</div>

											<div
												className={`${classes.NormalButton} ${classes.AddTraining} mt-20`}
												onClick={() => AddTrainingOpenHandler(course._id)}
											>
												<img src='/svg/plus-gray.svg' alt='' />
												<div className={`font-400 size-6 text-darkgray`}>Add Training</div>
											</div>
										</>
									)}
								</div>
							</div>
						))}
					</ReactSortable>

					{CourseAdding && (
						<div className={`${classes.AddCourseContainer} ${window.innerWidth < 550 && 'pl-16 pr-16'}`}>
							<Input placeholder='Course Title' style={{ marginTop: '0' }} ref={AddCourseRef} />
							<PrimaryButton style={{ height: '64px', width: '80px' }} onClick={AddCourseSubmitHandler}>
								Add
							</PrimaryButton>
						</div>
					)}
					{!CourseAdding && (
						<div
							className={`${classes.NormalButton} mt-20 ${window.innerWidth < 550 && 'ml-16'}`}
							onClick={AddCourseOpenHandler}
						>
							<img src='/svg/plus-gray.svg' alt='' />
							<div className={`font-400 size-6 text-darkgray`}>Add Course</div>
						</div>
					)}
				</Fragment>
			)}
		</Popup>
	);
};

export default CourseSetting;
