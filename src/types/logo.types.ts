// Logo Types

export type LogoType = "header" | "favicon" | "footer";
export type LogoTheme = "dark" | "light";

export interface LogoResponse {
  _id: string;
  logoImage: string;
  type: LogoType;
  theme: LogoTheme;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LogoCreateData {
  logoImage: string;
  type: LogoType;
  theme: LogoTheme;
  isPublished?: boolean;
}

export interface LogoUpdateData {
  logoImage?: string;
  type?: LogoType;
  theme?: LogoTheme;
  isPublished?: boolean;
}

export interface LogoDetailsQuery {
  type: LogoType;
  theme: LogoTheme;
}
