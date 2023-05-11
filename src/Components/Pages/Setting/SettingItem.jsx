import classes from './Setting.module.css';
import PrimaryButton from '../../UI/Bottons/PrimaryButton';
import Input from '../../UI/Inputs/Input';

import { useState, useRef } from 'react';
import { axiosInstance } from '../../../axios-global';
import { useDispatch, useSelector } from 'react-redux';

import { useHistory } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthActions, ThemeActions } from '../../../store';
import Select from '../../UI/Select/Select';

const ChangePasswordSetting = () => {
	const [IsLoading, SetIsLoading] = useState(false);
	const [RepeatError, SetRepeatError] = useState(null);
	const [PasswordError, SetPasswordError] = useState(null);

	const CurrentPasswordRef = useRef(null);
	const NewPasswordRef = useRef(null);
	const RepeatPasswordRef = useRef(null);

	const dispach = useDispatch();

	const history = useHistory();

	const ChangePasswordClickHandler = async () => {
		const CurrentPassword = CurrentPasswordRef.current.value;
		const NewPassword = NewPasswordRef.current.value;
		const RepeatPassword = RepeatPasswordRef.current.value;

		if (NewPassword === RepeatPassword) {
			SetIsLoading(true);
			try {
				const call = await axiosInstance.post('/Admins/ChangePassword', { CurrentPassword, NewPassword });
				var response = call.data;
				SetIsLoading(false);

				const { Name, Permissions, Avatar, token, _id } = response;
				dispach(
					AuthActions.Login({
						Token: token,
						_id,
						Admin: JSON.stringify({
							Name,
							Avatar,
							Permissions,
						}),
					}),
				);
				history.goBack();
			} catch (error) {
				SetIsLoading(false);
				SetPasswordError(error.response.data.message);
			}
		} else {
			SetRepeatError('Repeat Password must match new password!');
		}
	};
	const onChangeHandler = () => {
		if (RepeatError) {
			SetRepeatError(null);
		}
		if (PasswordError) {
			SetPasswordError(null);
		}
	};

	return (
		<div className={classes.BodyContainer}>
			<div className={`text-black ${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-10'}`}>password</div>
			<div className={`text-lightgray font-400 ${window.innerWidth > 550 ? 'size-5 mt-15' : 'size-3 mt-10'} `}>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
				Egestas purus viverra
			</div>

			<div className={`${window.innerWidth > 550 ? 'mt-30' : 'mt-34'} ${classes.Card}`}>
				<div className={`text-black ${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-7'}`}>Change password</div>
				<Input
					type='password'
					label='Current password'
					placeholder='Enter your current password'
					className={`${window.innerWidth > 550 ? 'mt-25' : 'mt-20'}`}
					style={{ maxWidth: '400px' }}
					ref={CurrentPasswordRef}
					ErrorText={PasswordError}
					onChange={onChangeHandler}
				/>

				<div className={classes.dashed} />

				<Input
					type='password'
					label='New password'
					placeholder='Enter new password'
					className={`mt-25`}
					style={{ maxWidth: '400px' }}
					ref={NewPasswordRef}
					onChange={onChangeHandler}
				/>
				<Input
					type='password'
					label='Repeat the new password'
					placeholder='Repeat new password'
					className={`mt-25`}
					style={{ maxWidth: '400px' }}
					ref={RepeatPasswordRef}
					ErrorText={RepeatError}
					onChange={onChangeHandler}
				/>

				<PrimaryButton
					className={`font-500 ${window.innerWidth > 550 ? 'mt-40 size-6' : 'mt-25 size-4'}`}
					style={{ padding: '0 28px', width: window.innerWidth <= 550 && '100%' }}
					IsLoading={IsLoading}
					onClick={ChangePasswordClickHandler}
				>
					Apply
				</PrimaryButton>
			</div>
		</div>
	);
};

const UpdatePermissions = () => {
	const [IsLoading, SetIsLoading] = useState(false);
	const dispatch = useDispatch();

	const UpdateClickHandler = async () => {
		SetIsLoading(true);
		try {
			const call = await axiosInstance.get('/admins/GetPermission');
			var response = call.data;
			if (response) {
				dispatch(
					AuthActions.UpdatePermissions({
						Admin: JSON.stringify({
							Name: response.Admin.Name,
							Avatar: response.Admin.Avatar,
							Permissions: response.Admin.Permissions,
						}),
					}),
				);
				SetIsLoading(false);

				toast.success('Permissions Updated!', {
					position: 'bottom-center',
					autoClose: 2000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className={classes.BodyContainer}>
			<div className={`text-black ${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-10'}`}>Update Permissions</div>

			<div className={`text-lightgray font-400 ${window.innerWidth > 550 ? 'size-5 mt-15' : 'size-3 mt-10'}`}>
				If you are aware that your access permissions have been changed from SuperAdmin, you need to update your internal permission
				with just a simple button
			</div>

			<div className={`${window.innerWidth > 550 ? 'mt-30' : 'mt-34'} ${classes.Card}`}>
				<div className={`text-black ${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-7'}`}>
					Update Access Permissions
				</div>

				<div className={`${classes.notificationbody} mt-25`}>
					<div className={`text-lightgray font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'}`}>
						for Update Permission just click below button
					</div>
				</div>
				<PrimaryButton
					className={`font-500 ${window.innerWidth > 550 ? 'size-6' : ' size-4'}`}
					onClick={UpdateClickHandler}
					IsLoading={IsLoading}
					style={{ padding: '0 28px', width: window.innerWidth <= 550 && '100%' }}
				>
					Update Permissions
				</PrimaryButton>
			</div>

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
		</div>
	);
};

const MoreSetting = () => {
	const FontSize = useSelector(state => state.Theme.FontSize);
	const [Selected, SetSelected] = useState(FontSize);
	const dispatch = useDispatch();

	const changeOptionHandler = event => {
		SetSelected(event.target.value);
	};

	const SaveFontSizeHandler = () => {
		dispatch(ThemeActions.SetFontSize({ FontSize: Selected }));
	};
	return (
		<div className={classes.BodyContainer}>
			<div className={`text-black ${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-10'}`}>More settings</div>
			<div className={`text-lightgray font-400 ${window.innerWidth > 550 ? 'size-5 mt-15' : 'size-3 mt-10'}`}>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
			</div>

			<div className={`${window.innerWidth > 550 ? 'mt-30' : 'mt-34'} ${classes.Card}`}>
				<div className={`text-black ${window.innerWidth > 550 ? 'font-600 size-14' : 'font-700 size-7'}`}>Change the font size</div>
				<div className={`${classes.notificationbody} mt-25`}>
					<div className={`text-lightgray font-400 ${window.innerWidth > 550 ? 'size-6' : 'size-3'}`}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
					</div>
					<Select name='fontSize' onChange={changeOptionHandler}>
						<option value={16} selected={FontSize === 16 ? true : false}>
							16px
						</option>
						<option value={17} selected={FontSize === 17 ? true : false}>
							17px
						</option>
						<option value={18} selected={FontSize === 18 ? true : false}>
							18px
						</option>
					</Select>
				</div>

				<div className={classes.Line} />

				<div
					className={`text-black size-10 font-600`}
					style={{ fontSize: window.innerWidth > 550 ? parseInt(Selected) + 4 + 'px' : parseInt(Selected) + 1 + 'px' }}
				>
					Sample text: Font size {Selected} pixels
				</div>
				<div
					className={`text-lightgray font-400 ${window.innerWidth > 550 ? ' mt-15' : 'mt-10'}`}
					style={{ fontSize: window.innerWidth > 550 ? Selected + 'px' : Selected - 3 + 'px' }}
				>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
					aliqua. Egestas purus viverra
				</div>

				<PrimaryButton
					className={`font-500 ${window.innerWidth > 550 ? 'mt-40 size-6' : 'mt-25 size-4'}`}
					style={{ padding: '0 28px', width: window.innerWidth <= 550 && '100%' }}
					onClick={SaveFontSizeHandler}
				>
					Apply
				</PrimaryButton>
			</div>
		</div>
	);
};

export { ChangePasswordSetting, UpdatePermissions, MoreSetting };
