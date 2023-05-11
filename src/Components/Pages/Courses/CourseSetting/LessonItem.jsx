import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { axiosInstance } from '../../../../axios-global';
import PrimaryButton from '../../../UI/Bottons/PrimaryButton';
import SecondaryButton from '../../../UI/Bottons/SecondaryButton';
import LoadingSpinner from '../../../UI/LoadingSpinner';
import classes from './CourseSetting.module.css';

const LessonItem = props => {
	const [IsActionVisible, setActionVisibility] = useState(false);
	const [IsActionClosing, setIsActionClosing] = useState(false);
	const [IsDeleteVisible, SetIsDeleteVisible] = useState(false);
	const [IsDeleting, SetIsDeleting] = useState(false);

	let popupref = useRef(null);
	let Actionref = useRef(null);

	const history = useHistory();

	const Permissions = JSON.parse(useSelector(state => state.Auth.Admin)).Permissions;

	const DeleteLessonHandler = () => {
		SetIsDeleteVisible(true);
	};

	const EditLessonHandler = () => {
		history.push('/Courses/Setting/EditLesson/' + props.lesson._id);
	};

	const showActionHandler = () => {
		setIsActionClosing(false);
		setActionVisibility(true);
	};

	const handleClickOutside = event => {
		if (IsActionVisible) {
			setIsActionClosing(true);
			setTimeout(() => {
				setActionVisibility(false);
			}, 300);
		}
	};
	useEffect(() => {
		document.addEventListener('click', handleClickOutside, true);
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
		};
	});

	const OnDeleteClickHandler = async () => {
		SetIsDeleting(true);
		try {
			const call = await axiosInstance.delete('/courses/DeleteLesson/' + props.lesson._id);
			var response = call.data;
			SetIsDeleting(false);
			history.go(0);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className={`${classes.LessonItem} ${IsDeleteVisible && classes.Deleting}`}>
			{props.IsLessonReOrdering ? (
				<LoadingSpinner style={{ width: '22px', height: '22px', margin: '0' }} strokeWidth='4' />
			) : (
				<img src='/svg/menu.svg' alt='' className={`handle`} />
			)}
			<div
				className={`font-400 size-5 text-lightgray`}
				style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
			>
				{props.lesson.Title}
			</div>
			{!IsDeleteVisible ? (
				<img src='/svg/kebab-menu.svg' alt='actions' style={{ cursor: 'pointer' }} ref={Actionref} onClick={showActionHandler} />
			) : (
				<>
					<PrimaryButton style={{ height: '41px' }} type='button' onClick={OnDeleteClickHandler} IsLoading={IsDeleting}>
						Delete?
					</PrimaryButton>
					<SecondaryButton type='button' onClick={() => SetIsDeleteVisible(false)}>
						cancel
					</SecondaryButton>
				</>
			)}
			{/* {window.innerWidth > 550 && */}
			<div
				className={`${classes.actionContainer} ${IsActionClosing ? classes.fadeout : classes.fadein}`}
				ref={popupref}
				style={{ display: IsActionVisible ? 'flex' : 'none' }}
			>
				{Permissions.Delete.includes('course') && (
					<div className={`${classes.ActionItem} size-5 font-400 text-lightgray`} onClick={DeleteLessonHandler}>
						<img src='/svg/trash.svg' alt='delete' /> <span>Delete tutorial</span>
					</div>
				)}
				{Permissions.Edit.includes('course') && (
					<div className={`${classes.ActionItem} size-5 font-400 text-lightgray`} onClick={EditLessonHandler}>
						<img src='/svg/edit.svg' alt='edit' /> <span>Edit tutorial</span>
					</div>
				)}
			</div>
			{/* } */}
		</div>
	);
};
export default LessonItem;
