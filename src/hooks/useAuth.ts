import { useCallback, useEffect, useMemo } from "react";
import { useToggle } from "./useToggle";
import { authActions, useAppDispatch, useAppSelector } from "@/store";
import { authApiService } from "@/infrastructure/AuthApiService";
import type { StaffResponse } from "@/types/user.types";
import { toast } from "@/components/compound/Sonner";

export const useAuth = (updateProfile = false) => {
  const authState = useAppSelector((state) => state.auth);
  const { errorMessage, isLoggedIn, status, user } = authState;
  const isAppLoading = useMemo(() => status === "initial", [status]);
  const isError = useMemo(() => status === "error", [status]);
  const {
    isOpen: loginInProgress,
    open: startLogin,
    close: finishLogin,
  } = useToggle();
  const {
    isOpen: isFetching,
    open: startFetching,
    close: finishFetching,
  } = useToggle();
  const {
    isOpen: logoutInProgress,
    open: startLogout,
    close: stopLogout,
  } = useToggle();
  const dispatch = useAppDispatch();
  const logoutSubmit = useCallback(
    async (all: boolean, cb?: () => void) => {
      startLogout();
      const apiCall = all
        ? authApiService.logoutFromAllDevices()
        : authApiService.logout();
      const loginResponse = await apiCall;
      const { success, errorMessage } = loginResponse;
      if (success) {
        dispatch(authActions.setLogout());
        if (cb) {
          cb();
        }
      } else {
        toast.error(errorMessage);
      }
      stopLogout();
    },
    [dispatch, startLogout, stopLogout],
  );
  const signInSubmit = useCallback(
    async (identifier: string, password: string, cb?: () => void) => {
      startLogin();
      const loginResponse = await authApiService.login({
        email: identifier,
        password,
      });
      const { data, success, errorMessage } = loginResponse;
      if (success) {
        dispatch(authActions.setSuccessUser(data));
        if (cb) {
          cb();
        }
      } else {
        toast.error(errorMessage);
      }
      finishLogin();
    },
    [dispatch, finishLogin, startLogin],
  );
  const registerSubmit = useCallback(
    async (
      identifier: string,
      password: string,
      name: string,
      apiKey: string,
      cb?: () => void,
    ) => {
      startLogin();
      const registerResponse = await authApiService.register(
        {
          email: identifier,
          name,
          password,
          role: "admin",
          apiKey,
        },
        true,
      );
      const { data, success, errorMessage } = registerResponse;
      if (success) {
        dispatch(authActions.setSuccessUser(data));
        if (cb) {
          cb();
        }
      } else {
        console.log("Error here: ", success, data, errorMessage + "--->msg");

        toast.error(errorMessage);
      }
      finishLogin();
    },
    [dispatch, finishLogin, startLogin],
  );
  const fetchProfile = useCallback(async () => {
    startFetching();
    const loginResponse = await authApiService.profile();
    const { data, success, errorMessage } = loginResponse;
    if (success) {
      dispatch(authActions.setSuccessUser(data));
    } else {
      dispatch(
        authActions.setErrorUser({
          message: errorMessage,
        }),
      );
    }
    finishFetching();
  }, [dispatch, finishFetching, startFetching]);

  useEffect(() => {
    if (updateProfile) {
      fetchProfile();
    }
  }, [fetchProfile, updateProfile]);

  const changeUser = useCallback(
    (user: StaffResponse) => {
      dispatch(authActions.setUser(user));
    },
    [dispatch],
  );

  return {
    fetchProfile,
    signInSubmit,
    logoutSubmit,
    changeUser,
    registerSubmit,
    user,
    isAppLoading,
    loginInProgress,
    logoutInProgress,
    isError,
    isFetching,
    isLoggedIn,
    errorMessage,
  };
};
