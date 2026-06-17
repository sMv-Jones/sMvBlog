import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    status: false,
    user: null,
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
            state.userName = action.payload.name;
            state.userEmail = action.payload.email;
        },
        logout: (state) => {
            state.status = false;
            state.user = null;
            state.userName = null;
            state.userEmail = null;
        }
    }
});
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;