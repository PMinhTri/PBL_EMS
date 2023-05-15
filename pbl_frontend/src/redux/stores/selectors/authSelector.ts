import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const authSelector = createSelector(
  (state: RootState) => state.auth,
  (auth) => auth
);

export const userInfoSelector = createSelector(
  (state: RootState) => state.auth.userInfo,
  (userInfo) => userInfo
);
