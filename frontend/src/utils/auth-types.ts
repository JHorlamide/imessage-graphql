import { Session } from "next-auth";

export interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}

export interface ICreateUsernameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface ICreateUserVariable {
  username: string;
}