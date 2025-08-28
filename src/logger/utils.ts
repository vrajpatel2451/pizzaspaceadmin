import { v4 as uuidv4 } from "uuid";

export const generateRequestId = (): string => uuidv4();

export const sanitizeData = <T>(data: T): T => {
  if (!data || typeof data !== "object") return data;

  const sensitiveKeys = [
    "password",
    "token",
    "secret",
    "key",
    "authorization",
    "auth",
    "access_token",
    "refresh_token",
    "api_key",
    "bearer",
    "cookie",
  ];

  const sanitize = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }

    if (obj && typeof obj === "object") {
      const sanitized = { ...obj };
      Object.keys(sanitized).forEach((key) => {
        const lowerKey = key.toLowerCase();
        if (sensitiveKeys.some((sensitive) => lowerKey.includes(sensitive))) {
          sanitized[key] = "[REDACTED]";
        } else if (typeof sanitized[key] === "object") {
          sanitized[key] = sanitize(sanitized[key]);
        }
      });
      return sanitized;
    }

    return obj;
  };

  return sanitize(data);
};

export const truncateData = (data: any, maxLength: number = 1000): any => {
  if (!data) return data;

  const str = typeof data === "string" ? data : JSON.stringify(data);
  if (str.length <= maxLength) return data;

  return {
    _truncated: true,
    _originalLength: str.length,
    _data: str.substring(0, maxLength) + "...[TRUNCATED]",
  };
};
