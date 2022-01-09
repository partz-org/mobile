import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { getCountById } from "../../service/counts";
import { HomeStackParamList } from "./types";
import type { Count } from "../../types/count";

export const useUpdateTitle = (
  title: string,
  param: string,
  navigation: StackNavigationProp<HomeStackParamList>
) => {
  useEffect(() => {
    // navigation.setOptions({ headerTitle: `Edit ${currentCount?.title}` });
    navigation.setParams({ [param]: title });
  }, [navigation, param, title]);
};

export const useQueryCountById = (countId: string) =>
  useQuery<Count>(countId, () => getCountById(countId));
