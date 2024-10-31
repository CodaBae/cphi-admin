import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from "../firebase-config"
import { toast } from 'react-toastify';
import { collection, getDocs, query, where } from 'firebase/firestore';


export const loginAdmin = createAsyncThunk(
    'login/loginAdmin',
    async ({ emailOrPhone, password }, { rejectWithValue }) => {
        try {
            const q = query(
                collection(db, 'admins'),
                where('email', '==', emailOrPhone),
                where('password', '==', password)
            );

            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const adminData = querySnapshot.docs[0].data(); // Retrieve all data from the matched document
                toast.success("Login Successful");
                return adminData;
            } else {
                toast.error("Invalid email or password");
                return rejectWithValue("Invalid email or password");
            }
        } catch (error) {
            toast.error("An error occurred while logging in");
            return rejectWithValue(error.message);
        }
    }
);

const adminLoginSlice = createSlice({
    name: 'login',
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        logout(state) {
          state.user = null;
          state.loading = false;
          state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(loginAdmin.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(loginAdmin.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
          })
          .addCase(loginAdmin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
          });
      },
});

export const { logout } = adminLoginSlice.actions;
export default adminLoginSlice.reducer;
