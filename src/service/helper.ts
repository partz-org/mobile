import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export const developmentUri =
  Platform.OS === "android" ? "http://10.0.2.2:5000" : "http://localhost:5000";

export const baseUri = Constants.manifest?.extra?.API_URL ?? developmentUri;

export const handleError = (e: Error) => {
  Alert.alert("Something went wrong.", e.toString());
};

export type HTTPMethod = "PUT" | "POST" | "DELETE";

export async function mutateData<T>(
  url: string = "",
  data: any = {},
  method: HTTPMethod
): Promise<T> {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(url, {
    body: JSON.stringify(data),
    credentials: "same-origin",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    method,
    // no-cors, *cors, same-origin
    mode: "cors", // body data type must match "Content-Type" header
  });
  const result = await response.json(); // parses JSON response into native JavaScript objects
  if (!response.ok || result.error) {
    throw new Error(result.message);
  }
  return result;
}

export async function getData<T>(url: string = ""): Promise<T> {
  const response = await fetch(url, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
  });
  const result = await response.json(); // parses JSON response into native JavaScript objects
  if (!response.ok) {
    return result.message;
  }
  return result;
}
