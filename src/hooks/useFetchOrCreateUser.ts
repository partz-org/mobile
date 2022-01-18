/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../context";
import { handleError, createTempUser, getUserById } from "../service";
import * as Notifications from "expo-notifications";
import { User } from "../types/user";

export const useFetchOrCreateUser = () => {
  const { user, dispatch } = useUser();

  useEffect(() => {
    if (!user.id) {
      const getOrCreateUser = async () => {
        const result = await AsyncStorage.getItem("user");

        if (!result) {
          try {
            const { data: expoToken } =
              await Notifications.getExpoPushTokenAsync();

            const newUser = await createTempUser({ expoToken });
            await AsyncStorage.setItem("user", JSON.stringify(newUser));
            dispatch({
              payload: {
                user: newUser,
              },
              type: "UPDATE_STATE",
            });
          } catch (error: any) {
            handleError(error);
          } finally {
            return;
          }
        }

        const { id: storedUserId }: User = JSON.parse(result);

        const storedUserFromDB = await getUserById(storedUserId);

        if (typeof storedUserFromDB === "object") {
          dispatch({
            payload: { user: storedUserFromDB },
            type: "UPDATE_STATE",
          });
        }
      };
      getOrCreateUser();
    }
  }, []);

  return user;
};
