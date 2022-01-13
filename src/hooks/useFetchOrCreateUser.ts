/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../context";
import { handleError, createTempUser } from "../service";
import * as Notifications from "expo-notifications";
import { User } from "../types/user";

export const useFetchOrCreateUser = () => {
  const { user, dispatch } = useUser();

  useEffect(() => {
    if (!user.id) {
      const getOrCreateUser = async () => {
        const result = await AsyncStorage.getItem("user");

        const storedUser: User = JSON.parse(result || "{}");

        if (storedUser?.id) {
          dispatch({
            payload: { user: storedUser },
            type: "UPDATE_STATE",
          });
        } else {
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
          }
        }
      };
      getOrCreateUser();
    }
  }, []);

  return user;
};
