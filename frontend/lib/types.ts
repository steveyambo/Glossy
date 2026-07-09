export type Role = 'Client' | 'Admin';

export interface UserProfile {
  id: number;
  email: string;
  displayName: string;
  role: Role;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  shade: string;
  description: string;
  price: number;
  colorHex: string;
  finish: string;
  inStock: boolean;
  isFavorite: boolean;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: UserProfile;
}
