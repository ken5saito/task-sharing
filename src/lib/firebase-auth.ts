import { database } from "./firebase";
import { ref, get, set } from "firebase/database";
import bcrypt from "bcryptjs";
import { CONST_TEXT } from "@/utils/const-text";

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: number;
}

/**
 * ユーザーをメールアドレスで検索
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const usersRef = ref(database, "users");
  const snapshot = await get(usersRef);

  if (!snapshot.exists()) {
    return null;
  }

  const users = snapshot.val();
  for (const userId in users) {
    if (users[userId].email === email) {
      return { id: userId, ...users[userId] };
    }
  }

  return null;
}

/**
 * ユーザーを ID で検索
 */
export async function getUserById(id: string): Promise<User | null> {
  const userRef = ref(database, `users/${id}`);
  const snapshot = await get(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  return { id, ...snapshot.val() };
}

/**
 * パスワードハッシュ化
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * パスワード検証
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * ユーザー登録
 */
export async function createUser(
  email: string,
  name: string,
  password: string,
): Promise<User> {
  // メールアドレスが既に使用されているか確認
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error(CONST_TEXT.EMAIL_ALREADY_REGISTERED);
  }

  const passwordHash = await hashPassword(password);
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = Date.now();

  const newUser: User = {
    id: userId,
    email,
    name,
    passwordHash,
    createdAt: now,
  };

  const userRef = ref(database, `users/${userId}`);
  await set(userRef, {
    email,
    name,
    passwordHash,
    createdAt: now,
  });

  return newUser;
}
