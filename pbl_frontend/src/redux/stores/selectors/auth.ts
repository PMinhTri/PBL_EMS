// import { createSelector } from "@reduxjs/toolkit";
import { AuthState } from "../slices/auth";

export const tokenState = (state: AuthState) => state.token;
