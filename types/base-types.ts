type PasswordStatus = "LATEST" | "PREVIOUS";

type PasswordEntry = {
  value: string; // The actual password
  date: Date; // Date when the password was created/updated
  status: PasswordStatus; // Enum to indicate if it's latest or previous
};

type Password = {
  appName: string;
  userName: string;
  password: PasswordEntry[];
};

export { Password, PasswordEntry, PasswordStatus };
