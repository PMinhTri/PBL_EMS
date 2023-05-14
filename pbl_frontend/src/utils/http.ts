import axios, { AxiosResponse } from "axios";
import { REACT_APP_API_URL } from "../config";

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { statusCode, message } = error.response.data;

    if (statusCode === 401 && message === "Unauthorized") {
      localStorage.clear();
      window.location.replace("/auth/login");
    }
  }
);

export const $get = async (endpoint: string, option?: any) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      ...option,
    },
  };

  try {
    const response: AxiosResponse<any> = await axios.get(
      `${REACT_APP_API_URL}/${endpoint}`,
      config
    );

    return response.data;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const $post = async (endpoint: string, data: any, option?: any) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    ...option,
  };

  try {
    const response: AxiosResponse<any> = await axios.post(
      `${REACT_APP_API_URL}${endpoint}`,
      data,
      config
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const $put = async (endpoint: string, data: any, option?: any) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  try {
    const response: AxiosResponse<any> = await axios.put(
      `${REACT_APP_API_URL}${endpoint}`,
      data,
      config
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const $patch = async (endpoint: string, data: any, option?: any) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    ...option,
  };

  try {
    const response: AxiosResponse<any> = await axios.put(
      `${REACT_APP_API_URL}${endpoint}`,
      data,
      config
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const $delete = async (endpoint: string, option?: any) => {
  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    ...option,
  };

  try {
    const response: AxiosResponse<any> = await axios.delete(
      `${REACT_APP_API_URL}${endpoint}`,
      config
    );

    return response.data;
  } catch (err) {
    console.log(err);
  }
};
