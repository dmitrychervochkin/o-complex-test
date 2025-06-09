import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface BusketItem {
    id: number;
    title: string;
    count: number;
    price: number;
}

interface BusketState {
    items: BusketItem[];
}

const initialState: BusketState = {
    items: [],
};

const busketSlice = createSlice({
    name: "busket",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<BusketItem>) => {
            const existing = state.items.find(
                (item) => item.id === action.payload.id
            );
            if (existing) {
                existing.count += action.payload.count;
            } else {
                state.items.push(action.payload);
            }
        },
        removeItem: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(
                (item) => item.id !== action.payload
            );
        },
        clearBusket: (state) => {
            state.items = [];
        },
        updateQuantity: (
            state,
            action: PayloadAction<{ id: number; count: number }>
        ) => {
            const item = state.items.find(
                (item) => item.id === action.payload.id
            );
            if (item) {
                item.count = action.payload.count;
            }
        },
    },
});

export const { addItem, removeItem, clearBusket, updateQuantity } =
    busketSlice.actions;

export const selectBusketProducts = (state: { busket: BusketState }) =>
    state.busket.items;

export const busketReducer = busketSlice.reducer;
