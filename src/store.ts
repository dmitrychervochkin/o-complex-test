import { configureStore } from "@reduxjs/toolkit";
import { busketReducer } from "./reducers/busketReducer";

const store = configureStore({
    reducer: {
        busket: busketReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
