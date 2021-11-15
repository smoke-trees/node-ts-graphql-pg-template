export interface UserInterface {
  id?: string;
  email: string;
  username: string;
  password: string;
  // email/otp confirmation of user
  confirmed: boolean;
  // admin disabled profile
  isDisabled: boolean;
}
