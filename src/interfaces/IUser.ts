export interface UserLogin {
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
  createdAt: Date;
  isActive: boolean;
  profileType: number;
}
