import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../stores/slices/auth";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../saga/rootSaga";

const rootReducer = combineReducers({
  auth: authReducer,
});

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;

export default store;
