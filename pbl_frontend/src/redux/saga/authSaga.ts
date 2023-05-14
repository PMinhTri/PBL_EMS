import { call, put, takeLatest } from "redux-saga/effects";
import { AuthResponse } from "../../types/authTypes";
import { loginSuccess, loginFailed, loginRequest } from "../stores/slices/auth";
import { AuthType } from "../../types/authTypes";
import { Login } from "../../api/auth";

function* login(action: ReturnType<typeof loginRequest>) {
  try {
    const response: AuthResponse = yield call(Login, action.payload);
    if (response.statusCode === 200) {
      yield put(loginSuccess(response));
    } else {
      yield put(loginFailed(response));
    }
  } catch (error) {
    yield put(loginFailed(error));
  }
}

function* authSaga() {
  yield takeLatest(AuthType.LOGIN_REQUEST, login);
}

export default authSaga;
