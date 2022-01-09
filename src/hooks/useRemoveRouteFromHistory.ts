/* eslint-disable react-hooks/exhaustive-deps */
import {
  CommonActions,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { useEffect } from "react";
import { HomeStackParamList } from "../flows/Home/types";

export const useRemoveRouteFromHistory = (routeName: string) => {
  const { dispatch } = useNavigation<NavigationProp<HomeStackParamList>>();

  useEffect(() => {
    dispatch(state => {
      const routes = state.routes.filter(r => r.name !== routeName);

      return CommonActions.reset({
        ...state,
        index: routes.length - 1,
        routes,
      });
    });
  }, []);
};
