import React, { useEffect, createContext, useReducer } from "react";
import Cookies from "js-cookie";

type BotCredentials = {
  _id?: any;
  bot_guild_id?: any;
  bot_command_usage_error_channel?: any;
  bot_command_usage_information_channel?: any;
  bot_commands_channel?: any;
  bot_email?: any;
  bot_id?: any;
  bot_password?: any;
  bot_role_button_channel_id?: any;
  bot_username?: any;
}

type UserAuthDetails = {
  id: any;
  token: string;
  name: string;
  email: string;
  role: number;
  bot: BotCredentials
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
  id: "",
  token: "",
  name: "",
  email: "",
  role: 0,
  bot: {
    _id: null,
    bot_guild_id: null,
    bot_command_usage_error_channel: null,
    bot_command_usage_information_channel: null,
    bot_commands_channel: null,
    bot_email: null,
    bot_id: null,
    bot_password: null,
    bot_role_button_channel_id: null,
    bot_username: null
  },
};

type Action = { type: "LOGIN"; payload: UserAuthDetails } | { type: "LOGOUT" } | { type: "UPDATE_NAME"; payload: string };

// Create reducer for CRUD actions
const authReducer = (
  state: UserAuthDetails,
  action: Action
): UserAuthDetails => {
  switch (action.type) {
    case "LOGIN":
      return { ...action.payload };
    case "LOGOUT":
      return { id: "", token: "", name: "", email: "", role: 0, bot: {} };
    case "UPDATE_NAME":
      return { ...state, name: action.payload }
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
  
  const updateName = (name: string) => {
    dispatch({ type: "UPDATE_NAME", payload: name});
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
      value={{ userAuthDetails, login, logout, isLoggedIn, updateName }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
