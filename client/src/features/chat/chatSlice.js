import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

export const sendMessage = createAsyncThunk('chat/sendMessage', async ({ message, sessionId }, { rejectWithValue }) => {
  try {
    const { data } = await axiosClient.post('/chat/message', { message, sessionId });
    return { ...data, userMessage: message };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to send message');
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    sessionId: null,
    messages: [],
    mood: { score: 0, label: 'Neutral' },
    crisis: { flagged: false, helplineMessage: null },
    loading: false,
    error: null,
  },
  reducers: {
    resetChat(state) {
      state.sessionId = null;
      state.messages = [];
      state.mood = { score: 0, label: 'Neutral' };
      state.crisis = { flagged: false, helplineMessage: null };
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.messages.push({ role: 'user', content: action.meta.arg.message });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionId = action.payload.sessionId;
        state.mood = action.payload.mood;
        state.crisis = action.payload.crisis;
        state.messages.push({ role: 'assistant', content: action.payload.assistantReply });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetChat } = chatSlice.actions;
export default chatSlice.reducer;
