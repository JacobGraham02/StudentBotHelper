import React, { createContext, useReducer } from "react";

type UserAuthDetails = {
  // Have to continue building this.
  id: string;
  username: string;
  email: string;
  refreshToken: string;
};

type AuthProviderProps = {
  children?: React.ReactNode;
};

type AuthContextType = {
  userAuthDetails: UserAuthDetails;
  login: (userDetails: UserAuthDetails) => void;
  logout: () => void;
};

const initialState: UserAuthDetails = {
  id: "",
  username: "",
  email: "",
  refreshToken: "",
};

type Action = { type: "LOGIN"; payload: UserAuthDetails } | { type: "LOGOUT" };

// Create reducer for CRUD actions
const authReducer = (
  state: UserAuthDetails,
  action: Action
): UserAuthDetails => {
  switch (action.type) {
    case "LOGIN":
      return { ...action.payload };
    case "LOGOUT":
      return { id: "", username: "", email: "", refreshToken: "" };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userAuthDetails, dispatch] = useReducer(authReducer, initialState);

  const login = (userDetails: UserAuthDetails) => {
    dispatch({ type: "LOGIN", payload: userDetails });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ userAuthDetails, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
