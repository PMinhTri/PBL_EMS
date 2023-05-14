import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../stores/slices/auth";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../saga/rootSaga";

const reducers = {
  auth: authReducer,
};

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: reducers,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
