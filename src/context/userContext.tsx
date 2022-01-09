import React, { createContext, useContext, useReducer } from "react";
import type { User } from "../types/user";

export type UpdateUserAction = {
  type: "UPDATE_STATE";
  payload: { user?: User; token?: string };
};
type Dispatch = (action: UpdateUserAction) => void;
export type UserState = { user: User; token: string };
type UserProviderProps = { children: React.ReactNode };

const UserStateContext = createContext<
  { state: UserState; dispatch: Dispatch } | undefined
>(undefined);

const initialUserState: UserState = {
  token: "",
  user: {} as User,
};

function userReducer(state: UserState, action: UpdateUserAction) {
  const { type, payload } = action;
  switch (type) {
    case "UPDATE_STATE": {
      return {
        ...state,
        ...payload,
        user: { ...state.user, ...payload.user },
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
}

function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, initialUserState);
  const value = { dispatch, state };
  return (
    <UserStateContext.Provider value={value}>
      {children}
    </UserStateContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return {
    dispatch: context.dispatch,
    token: context.state.token,
    user: context.state.user,
  };
}
export { UserProvider, useUser };
