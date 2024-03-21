import React, { useEffect, createContext, useReducer } from "react";
import Cookies from "js-cookie";

type UserAuthDetails = {
  token: string;
  name: string;
  email: string;
  role: number;
};

type AuthProviderProps = {
  children?: React.ReactNode;
};

type AuthContextType = {
  userAuthDetails: UserAuthDetails;
  login: (userDetails: UserAuthDetails) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

const initialState: UserAuthDetails = {
  token: "",
  name: "",
  email: "",
  role: 0,
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
      return { token: "", name: "", email: "", role: 0 };
    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userAuthDetails, dispatch] = useReducer(authReducer, initialState);

  const setAuthCookies = (userDetails: UserAuthDetails) => {
    Cookies.set("userAuthDetails", JSON.stringify(userDetails), { expires: 7 });
  };

  const clearAuthCookies = () => {
    Cookies.remove("userAuthDetails");
  };

  const isLoggedIn = (): boolean => {
    return !!userAuthDetails.token;
  };

  const login = (userDetails: UserAuthDetails) => {
    dispatch({ type: "LOGIN", payload: userDetails });
    setAuthCookies(userDetails);
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    clearAuthCookies();
  };

  // Effect to initialize state from cookies
  useEffect(() => {
    const cookieData = Cookies.get("userAuthDetails");
    if (cookieData) {
      const userDetails = JSON.parse(cookieData);
      dispatch({ type: "LOGIN", payload: userDetails });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ userAuthDetails, login, logout, isLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
