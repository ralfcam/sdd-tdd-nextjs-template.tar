export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
}

export interface UserStore {
  findByEmail(email: string): UserRecord | undefined;
  findById(id: string): UserRecord | undefined;
  create(email: string, passwordHash: string): UserRecord;
}
