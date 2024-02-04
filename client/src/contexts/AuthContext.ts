import React, { createContext } from "react";

type AuthContextType = {};

export const AuthContext = createContext<AuthContextType | null>(null);
