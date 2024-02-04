import React, { createContext, useState } from "react";

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
};

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userAuthDetails, setUserAuthDetails] = useState<UserAuthDetails>({
    id: "",
    username: "",
    email: "",
    refreshToken: "",
  });

  // Create reducer for CRUD actions

  return (
    <AuthContext.Provider value={{ userAuthDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
