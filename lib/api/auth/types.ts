export type UserFormat = 'email' | 'phone';

export interface AuthResponse {
  success: boolean;
  error?: 'invalid_credentials' | 'too_many_attempts' | 'server_error';
  message?: string;
  cookies?: {
    csrfToken: string;
    sessionId: string;
  };
}

export interface AuthCredentials {
  user: string;
  pass: string;
  type?: UserFormat;
}
