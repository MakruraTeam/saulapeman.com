export type LoginPayload = {
  username: string;
  password: string;
  rememberMe?: boolean;
};
export type LoginResponse = { token: string };

export type RegisterPayload = {
  username: string;
  password: string;
  repeatPassword: string;
};
export type RegisterResponse = {
  user: { _id?: string; id?: string; username: string };
};

export type LogoutResponse = { message: string };
