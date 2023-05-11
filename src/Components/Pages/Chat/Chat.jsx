import { Route, useHistory, useParams } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

import classes from './Chat.module.css';

import Conversation from './Conversation/Conversation';
import User from './User/User';
import PrimaryButton from '../../UI/Bottons/PrimaryButton';
import DeletePopup from '../../UI/Popup/Delete/DeletePopup';
import { Fragment } from 'react';
import ChatManager from '../../UI/Popup/MobilePopup/ChatManager/ChatManager';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../../../axios-global';
import LoadingSpinner from '../../UI/LoadingSpinner';
import { OnlineActions } from '../../../store';
import NotAuthBlur from '../../Layout/NotAuthBlur/NotAuthBlur';

import Input from '../../UI/Inputs/Input';
import LeftIconInput from '../../UI/Inputs/LeftIconInput';
import SecondaryButton from '../../UI/Bottons/SecondaryButton';

const Chat = props => {
	const history = useHistory();
	const OnlineList = useSelector(state => state.Online.List);
	const dispatch = useDispatch();

	const [Chats, SetChats] = useState(null);
	const [LastMessage, SetLastMessage] = useState([]);
	const [IsSearching, SetIsSearching] = useState(false);
	const [SearchText, SetSearchText] = useState('');
	const AdminData = JSON.parse(useSelector(state => state.Auth.Admin));
	const Permissions = AdminData.Permissions;

	const SearchRef = useRef(null);

	const OpenChatClickHandler = ChatID => {
		if (LastMessage.find(lm => lm.AdminID === ChatID)) {
			var m = LastMessage.find(lm => lm.AdminID === ChatID);
			m.Count = 0;
			var messages = LastMessage.filter(lm => lm.AdminID !== ChatID);
			messages.push(m);
			SetLastMessage(messages);
		}
		history.push('/Messages/' + ChatID);
	};
	dispatch(OnlineActions.UpdateUnseenMessage({ HaveUnseenMessage: false }));

	const ShowSearchInput = () => {
		SetIsSearching(true);
	};

	const SearchInputChange = event => {
		SetSearchText(event.target.value);
		let Admins = Chats;
		Admins.forEach(element => {
			var Re = new RegExp(event.target.value, 'g');
			if (Re.test(element.Name)) {
				element.Visible = true;
			} else {
				element.Visible = false;
			}
		});
		SetChats(Admins);
	};

	const CloseSearchBox = () => {
		SetIsSearching(false);
		SetSearchText('');
		SearchRef.current.value = '';

		let Admins = Chats;
		Admins.forEach(element => {
			var Re = new RegExp('', 'g');
			if (Re.test(element.Name)) {
				element.Visible = true;
			} else {
				element.Visible = false;
			}
		});
		SetChats(Admins);
	};

	useEffect(() => {
		(async () => {
			try {
				const call = await axiosInstance.get('/chat');
				var response = call.data;
				SetChats(response.Admins);
				SetLastMessage(response.Chats);
			} catch (error) {
				console.log(error);
			}
		})();
	}, []);

	return Chats === null ? (
		<LoadingSpinner />
	) : (
		<div className={classes.Container}>
			<div className={`${classes.UserList}`}>
				<div className={`font-600 ${window.innerWidth > 550 ? 'size-14' : 'size-7'} text-black ${classes.ListHeader}`}>
					{IsSearching ? (
						<Input
							className={'mr-16'}
							style={{ width: '-webkit-fill-available', height: ' 52px', marginTop: '0' }}
							placeholder='search'
							onChange={SearchInputChange}
							ref={SearchRef}
						/>
					) : (
						<>
							{window.innerWidth < 550 && <img src='/svg/arrow-left.svg' alt='back' onClick={() => history.goBack()} />}
							{window.innerWidth > 550 ? 'Private Message' : 'Message'}
						</>
					)}
					{IsSearching ? (
						<svg
							width='30'
							height='30'
							viewBox='0 0 30 30'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
							onClick={CloseSearchBox}
						>
							<path
								d='M9.69678 9.69678L20.3034 20.3034'
								stroke='#282A3E'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
							<path
								d='M9.69662 20.3034L20.3032 9.69678'
								stroke='#282A3E'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					) : (
						<svg
							width='26'
							height='26'
							viewBox='0 0 26 26'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
							onClick={ShowSearchInput}
						>
							<path
								d='M12.4584 22.7493C18.1423 22.7493 22.7501 18.1416 22.7501 12.4577C22.7501 6.77375 18.1423 2.16602 12.4584 2.16602C6.77449 2.16602 2.16675 6.77375 2.16675 12.4577C2.16675 18.1416 6.77449 22.7493 12.4584 22.7493Z'
								stroke='#5E5F6E'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
							<path
								d='M23.8334 23.8327L21.6667 21.666'
								stroke='#5E5F6E'
								strokeWidth='1.5'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					)}
				</div>
				{LastMessage.length > 0 &&
					Chats.map(
						item =>
							item.Visible !== false && (
								<User
									key={item._id}
									isOnline={OnlineList.find(x => x.userID === item._id) ? true : false}
									onclick={() => OpenChatClickHandler(item._id)}
									ChatID={item._id}
									isActive={history.location.pathname.split(/\//)[2] === item._id ? true : false}
									Admin={item}
									SearchText={SearchText}
									Message={
										!LastMessage.find(lm => lm.AdminID === item._id).chat
											? 'No message Yet'
											: LastMessage.find(lm => lm.AdminID === item._id).chat.Message
									}
									Counter={LastMessage.find(lm => lm.AdminID === item._id).Count}
								/>
							),
					)}
			</div>

			{!Permissions.View.includes('message') && (
				<NotAuthBlur>you have not permitted to access chat Center! please contact administator</NotAuthBlur>
			)}

			{window.innerWidth > 550 && (
				<Route path='/Messages/:id'>
					<ChatPage socket={props.socket} />
				</Route>
			)}
		</div>
	);
};

const ChatPage = props => {
	const [MessageBoxHeight, SetHeight] = useState('');
	const [IsActionClosing, setIsActionClosing] = useState(false);
	const [MessageLength, SetMessageLength] = useState(0);
	const [IsActionVisible, setActionVisibility] = useState(false);
	const [isEmojiVisible, setIsEmojiVisible] = useState(false);
	const [Messages, SetMessages] = useState(null);
	const [peerchatInfo, setpeerchatInfo] = useState({});
	const [Upload, SetUpload] = useState(null);
	const [IsSearching, SetIsSearching] = useState(false);
	const [SearchedMessageCount, SetSearchedMessageCount] = useState(0);
	const [SearchedMessageSelected, SetSearchedMessageSelected] = useState(0);
	const [SearchText, SetSearchText] = useState('');

	let Actionref = useRef(null);
	let popupref = useRef(null);
	const TXTRef = useRef(null);
	const EmojiRef = useRef(null);
	const SearchRef = useRef(null);

	const history = useHistory();

	const { id } = useParams();

	const OnlineList = useSelector(state => state.Online.List);
	const _id = useSelector(state => state.Auth._id);

	const Permissions = JSON.parse(useSelector(state => state.Auth.Admin)).Permissions;
	const Avatar = JSON.parse(useSelector(state => state.Auth.Admin)).Avatar;

	const dispatch = useDispatch();

	const handleClickOutside = event => {
		if (isEmojiVisible && EmojiRef.current && !EmojiRef.current.contains(event.target)) {
			setIsEmojiVisible(false);
		}
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

	const TextAreaInputHandler = () => {
		if (MessageLength > TXTRef.current.value.length) {
			SetHeight('54px');
			setTimeout(() => {
				SetHeight(TXTRef.current.scrollHeight + 12 + 'px');
			}, 1);
		} else {
			SetHeight(TXTRef.current.scrollHeight + 12 + 'px');
		}
		SetMessageLength(TXTRef.current.value.length);
	};

	const emojiVisibleHandler = () => {
		if (isEmojiVisible) {
			setIsEmojiVisible(false);
		} else {
			setIsEmojiVisible(true);
		}
	};

	const onEmojiClick = (event, emojiObject) => {
		TXTRef.current.value += emojiObject.emoji;
		TXTRef.current.focus();
		SetHeight(TXTRef.current.scrollHeight + 14 + 'px');
	};

	const showActionHandler = () => {
		if (window.innerWidth > 550) {
			setIsActionClosing(false);
			setActionVisibility(true);
		} else {
			history.push(history.location.pathname + '/Manage');
		}
	};

	const openClearPopup = () => {
		history.push(history.location.pathname + '/Clear');
	};
	// Socket Listener
	useEffect(() => {
		props.socket.on(_id, args => {
			dispatch(OnlineActions.UpdateUnseenMessage({ HaveUnseenMessage: false }));

			if (args.From === id) {
				SetMessages(Messages => [...Messages, args]);
			}
		});
	}, [_id, props.socket, id, dispatch]);

	const SendMessageClickHandler = () => {
		const m = TXTRef.current.value;
		SetMessages(Messages => [
			...Messages,
			{
				From: _id,
				Message: m,
				MessageType: 'TEXT',
				To: _id,
				CreatedAt: new Date(),
				DeletedBy: [],
				Status: 'SENT',
				_v: 0,
				_id: Math.random(),
			},
		]);
		props.socket.emit('message', { From: _id, To: id, message: m, Type: 'TEXT' });
		TXTRef.current.value = '';
	};

	// Get Data
	useEffect(() => {
		(async () => {
			try {
				const call = await axiosInstance.get('/chat/' + id);
				var response = call.data;
				SetMessages(response.Chat);
				setpeerchatInfo(response.Admin);
			} catch (error) {
				console.log(error);
			}
		})();
	}, [id]);

	const SendAttachment = async event => {
		try {
			const formData = new FormData();
			formData.append('File', event.target.files[0]);
			const call = await axiosInstance({
				method: 'POST',
				url: '/chat/Upload',
				data: formData,
				headers: { 'Content-Type': 'multipart/form-data' },
				onUploadProgress: progressEvent => {
					const progress = (progressEvent.loaded / progressEvent.total) * 100;
					SetUpload(parseFloat(progress).toFixed(1));
				},
				onDownloadProgress: progressEvent => {
					const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
					SetUpload(parseFloat(progress).toFixed(1));
				},
			});
			SetUpload(null);
			const m = call.data.URL;
			const Type =
				call.data.Type === 'JPG' ||
				call.data.Type === 'PNG' ||
				call.data.Type === 'JPEG' ||
				call.data.Type === 'TIFF' ||
				call.data.Type === 'SVG'
					? 'IMAGE'
					: 'FILE';
			SetMessages(Messages => [
				...Messages,
				{
					From: _id,
					Message: m,
					MessageType: Type,
					To: _id,
					CreatedAt: new Date(),
					DeletedBy: [],
					Status: 'SENT',
					_v: 0,
					_id: Math.random(),
				},
			]);
			props.socket.emit('message', { From: _id, To: id, message: m, Type: Type });
		} catch (error) {
			console.log(error);
		}
	};

	const ClearChatSubmitHandler = async () => {
		try {
			const call = await axiosInstance.delete('/chat/' + id);
			// eslint-disable-next-line
			var response = call.data;
			history.goBack();
		} catch (error) {
			console.log(error);
		}
	};

	const SearchOnChange = () => {
		SetSearchText(SearchRef.current.value);
		setTimeout(() => {
			SetSearchedMessageCount(document.querySelectorAll('.searchedText-Yellow').length);
			SetSearchedMessageSelected(document.querySelectorAll('.searchedText-Yellow').length - 1);
			if (document.querySelectorAll('.searchedText-Yellow').length - 1 >= 0) {
				document
					.querySelectorAll('.searchedText-Yellow')
					[document.querySelectorAll('.searchedText-Yellow').length - 1].scrollIntoView({ behavior: 'smooth' });
			}
		}, 10);
	};

	const CloseSearchBar = () => {
		SetSearchText('');
		SearchRef.current.value = '';
		SetIsSearching(false);
	};
	const NextSearchScroll = () => {
		if (SearchedMessageCount - 1 > SearchedMessageSelected) {
			document.querySelectorAll('.searchedText-Yellow')[SearchedMessageSelected + 1].scrollIntoView({ behavior: 'smooth' });
			SetSearchedMessageSelected(SearchedMessageSelected + 1);
		}
	};
	const PrevSearchScroll = () => {
		if (SearchedMessageCount > 1 && SearchedMessageSelected > 0) {
			document.querySelectorAll('.searchedText-Yellow')[SearchedMessageSelected - 1].scrollIntoView({ behavior: 'smooth' });
			SetSearchedMessageSelected(SearchedMessageSelected - 1);
		}
	};

	return peerchatInfo && !Messages ? (
		<LoadingSpinner />
	) : (
		<Fragment>
			<div className={`${classes.ChatList}`}>
				{IsSearching ? (
					<div className={`${classes.SearchHeader}`}>
						<SecondaryButton style={{ width: '42px', height: '42px' }} onClick={CloseSearchBar}>
							<img src='/svg/cross.svg' alt='' width={22} />
						</SecondaryButton>
						<LeftIconInput
							style={{ height: '52px', marginTop: '0' }}
							IconStyle={{ top: '14px' }}
							LineStyle={{ top: '16px' }}
							type='search'
							icon='search'
							ref={SearchRef}
							onChange={SearchOnChange}
						/>
						<SecondaryButton type='button' style={{ width: '42px', height: '42px' }} onClick={PrevSearchScroll}>
							<img src='/svg/arrow-left.svg' alt='' width={22} style={{ transform: 'rotate(90deg)' }} />
						</SecondaryButton>
						<SecondaryButton type='button' style={{ width: '42px', height: '42px' }} onClick={NextSearchScroll}>
							<img src='/svg/arrow-left.svg' alt='' width={22} style={{ transform: 'rotate(270deg)' }} />
						</SecondaryButton>
					</div>
				) : (
					<div className={`${classes.ChatHeader}`}>
						{window.innerWidth < 550 && <img src='/svg/arrow-left.svg' alt='back' onClick={() => history.goBack()} />}
						<img
							src={`${process.env.REACT_APP_SRC_URL}${peerchatInfo.Avatar}`}
							alt='logo'
							width={window.innerWidth > 550 ? '70px' : '40px'}
							className={classes.ChatPage_Avatar}
						/>
						<div className={`text-darkgray font-500 ${window.innerWidth > 550 ? 'size-10' : 'size-5'} ${classes.HeaderName}`}>
							{peerchatInfo.Name}
						</div>
						<div
							className={`${OnlineList.find(x => x.userID === id) ? 'text-green' : 'text-darkgray'} font-400 ${
								window.innerWidth > 550 ? 'size-6' : 'size-2'
							} ${classes.HeaderStatus}`}
						>
							{OnlineList.find(x => x.userID === id) ? 'Online' : 'Offline'}
						</div>
						<img
							src='/svg/kebab-menu.svg'
							alt='action'
							className={classes.HeaderAction}
							ref={Actionref}
							onClick={showActionHandler}
						/>

						<div
							className={`${classes.actionContainer} ${IsActionClosing ? classes.fadeout : classes.fadein}`}
							ref={popupref}
							style={{ display: IsActionVisible ? 'flex' : 'none' }}
						>
							<div className={`${classes.ActionItem} size-5 font-400 text-lightgray`} onClick={() => SetIsSearching(true)}>
								<img src='/svg/Search.svg' alt='Search' /> <span>Search</span>
							</div>
							{Permissions.Delete.includes('message') && (
								<div className={`${classes.ActionItem} size-5 font-400 text-lightgray`} onClick={openClearPopup}>
									<img src='/svg/Clear.svg' alt='Clear' /> <span>Clear history</span>
								</div>
							)}
						</div>
					</div>
				)}
				<Conversation
					Messages={Messages}
					socket={props.socket}
					Upload={Upload}
					SearchText={SearchText}
					Avatar={peerchatInfo.Avatar}
					MyAvatar={Avatar}
				/>

				<div className={classes.MessageBox} style={{ height: MessageBoxHeight }}>
					<textarea
						onInput={TextAreaInputHandler}
						ref={TXTRef}
						rows={1}
						placeholder='Add your message...'
						className={`font-400 ${window.innerWidth > 550 ? 'size-5' : 'size-3'} text-darkgray ${classes.textarea}`}
					/>

					<img alt='emoji' src='/svg/emoji.svg' width='26px' onClick={emojiVisibleHandler} />
					<input type='file' id='attachment' style={{ display: 'none' }} onChange={SendAttachment} />
					<label htmlFor='attachment'>
						<img alt='attach' src='/svg/attachment.svg' width='26px' />
					</label>
					<PrimaryButton
						style={{
							marginTop: window.innerWidth > 550 ? 'auto' : MessageBoxHeight !== '54px' ? 'auto' : '0',
							height: window.innerWidth < 550 && '44px',
							width: window.innerWidth < 550 && '44px',
							padding: window.innerWidth < 550 && '0',
						}}
						onClick={SendMessageClickHandler}
					>
						<img alt='send' src='/svg/send-white.svg' width={window.innerWidth > 550 ? '26px' : '20px'} />
					</PrimaryButton>

					{isEmojiVisible && (
						<div ref={EmojiRef} className={classes.Emoji}>
							<EmojiPicker onEmojiClick={onEmojiClick} />
						</div>
					)}
				</div>

				{Permissions.Delete.includes('message') && (
					<Route path='/Messages/:id/Clear'>
						<DeletePopup
							Type='CLEAR'
							Title='Clear history'
							SubTitle='Do you want to delete all your messages?'
							onClick={ClearChatSubmitHandler}
						/>
					</Route>
				)}
			</div>

			<Route path='/Messages/:id/Manage'>
				<ChatManager />
			</Route>
		</Fragment>
	);
};

export { ChatPage };

export default Chat;
