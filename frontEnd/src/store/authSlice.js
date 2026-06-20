import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    status: false,
    user: null,
    userDisplayName: null,
    userName: null,
    userEmail: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.user = action.payload._id;
            state.userDisplayName = action.payload.displayName;
            state.userName = action.payload.userName;
            state.userEmail = action.payload.email;
        },
        logout: (state) => {
            state.status = false;
            state.user = null;
            state.userDisplayName = null;
            state.userName = null;
            state.userEmail = null;
        }
    }
});
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;