import React, { createContext, useContext, useReducer } from "react";

export type Level = "success" | "danger";
export type Timeout = 1000 | 3000 | 5000;

interface Notif {
  level?: Level;
  message: string;
  timeout?: Timeout;
}

export type SendNotifAction = {
  type: "SEND_NOTIF" | "REMOVE_NOTIF";
  payload?: Notif;
  timeout?: Timeout;
};
type Dispatch = (action: SendNotifAction) => void;
type NotifState = Notif;
type NotifProviderProps = { children: React.ReactNode };

const NotifStateContext = createContext<
  { state: NotifState; dispatch: Dispatch } | undefined
>(undefined);

function notifReducer(state: NotifState, action: SendNotifAction): NotifState {
  switch (action.type) {
    case "SEND_NOTIF": {
      return { ...state, ...action.payload };
    }
    case "REMOVE_NOTIF": {
      return {} as Notif;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
function NotifProvider({ children }: NotifProviderProps) {
  const [state, dispatch] = useReducer(notifReducer, {} as NotifState);
  const value = { dispatch, state };
  return (
    <NotifStateContext.Provider value={value}>
      {children}
    </NotifStateContext.Provider>
  );
}
function useNotif() {
  const context = useContext(NotifStateContext);

  if (context === undefined) {
    throw new Error("useNotif must be used within a NotifProvider");
  }

  const sendNotif = (notif: Notif) =>
    context.dispatch({ payload: notif, type: "SEND_NOTIF" });
  const removeNotif = () => context.dispatch({ type: "REMOVE_NOTIF" });

  return { notif: context.state, removeNotif, sendNotif };
}

export { NotifProvider, useNotif };
