import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch } from "react";
import { UpdateUserAction } from "../context";
import type { User } from "../types/user";

export const updateStoredUser = async (
  dispatch: Dispatch<UpdateUserAction>,
  newUser: User
) => {
  await AsyncStorage.setItem("user", JSON.stringify(newUser));

  dispatch({
    payload: { user: newUser },
    type: "UPDATE_STATE",
  });
};
