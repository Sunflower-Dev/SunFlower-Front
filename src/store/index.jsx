import { createSlice, configureStore } from '@reduxjs/toolkit';

const initAuth = {
	Token: localStorage.getItem('token'),
	_id: localStorage.getItem('_id'),
	Admin: localStorage.getItem('admin'),
};

const AuthenticationSlice = createSlice({
	name: 'Authentication',
	initialState: initAuth,
	reducers: {
		Login(state, action) {
			localStorage.setItem('admin', action.payload.Admin);
			localStorage.setItem('_id', action.payload._id);

			state.Token = action.payload.Token;
			state._id = action.payload._id;
			state.Admin = action.payload.Admin;
		},
		Logout(state) {
			state.Token = '';
			state.Admin = '';
			state._id = '';
			localStorage.removeItem('token');
			localStorage.removeItem('admin');
			localStorage.removeItem('_id');
		},
		UpdatePermissions(state, action) {
			state.Admin = action.payload.Admin;
			localStorage.setItem('admin', action.payload.Admin);
		},
		UpdateAvatar(state, action) {
			let Admin = JSON.parse(state.Admin);
			Admin.Avatar = action.payload.Avatar;

			localStorage.setItem('admin', JSON.stringify(Admin));
			state.Admin = JSON.stringify(Admin);
		},
	},
});

const ThemeInit = {
	FontSize: localStorage.getItem('FontSize') ? +localStorage.getItem('FontSize') : 16,
};
const ThemeSlice = createSlice({
	name: 'Theme',
	initialState: ThemeInit,
	reducers: {
		SetFontSize(state, action) {
			localStorage.setItem('FontSize', action.payload.FontSize);
			state.FontSize = action.payload.FontSize;
		},
	},
});

const initOnline = { List: [], HaveUnseenMessage: false, HaveUnseenNotif: false };

const onlineSlice = createSlice({
	name: 'Online',
	initialState: initOnline,
	reducers: {
		Update(state, action) {
			state.List = action.payload.data;
		},
		UpdateUnseenMessage(state, action) {
			state.HaveUnseenMessage = action.payload.HaveUnseenMessage;
		},
		UpdateUnseenNotif(state, action) {
			state.HaveUnseenNotif = action.payload.HaveUnseenNotif;
		},
	},
});

const stote = configureStore({
	reducer: {
		Auth: AuthenticationSlice.reducer,
		Theme: ThemeSlice.reducer,
		Online: onlineSlice.reducer,
	},
});

export const AuthActions = AuthenticationSlice.actions;
export const ThemeActions = ThemeSlice.actions;
export const OnlineActions = onlineSlice.actions;
export default stote;
