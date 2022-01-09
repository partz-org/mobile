import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch } from "react";
import { UpdateUserAction } from "../context";
import { getUserById } from "../service";
import { queryClient } from "../utils";
import type { User } from "../types/user";

export const updateStoredUser = async (
  dispatch: Dispatch<UpdateUserAction>,
  newUser: User
) => {
  // This is needed to fetch the user with counts
  const user = await queryClient.fetchQuery<User>("user", () =>
    getUserById(newUser.id)
  );
  await AsyncStorage.setItem("user", JSON.stringify(user));

  const { token } = newUser;
  token && (await AsyncStorage.setItem("token", token));

  dispatch({
    payload: { token, user },
    type: "UPDATE_STATE",
  });
};
