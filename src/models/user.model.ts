// User model based on JSONPlaceholder API structure
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface CreateUserPayload {
  name: string;
  username: string;
  email: string;
  address?: Partial<User['address']>;
  phone?: string;
  website?: string;
  company?: Partial<User['company']>;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  id: number;
}
