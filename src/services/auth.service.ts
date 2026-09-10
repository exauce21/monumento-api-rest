import bcrypt from 'bcrypt';
import { User } from '../models/user.model.js';
import { badRequestError, unauthorizedError, notFoundError } from '../errors/http-error.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from './token.service.js';
import jwt from 'jsonwebtoken';
import { Op } from "sequelize";

const SALT_ROUNDS = 12;

export interface Credentials {
  username: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export async function register({ username, password }: Credentials): Promise<User> {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({ username, password: hash });
    return newUser;
}


export async function login({ username, password }: Credentials): Promise<{ user: User; tokens: AuthTokens }> {
  const user = await User.findOne({ where: { username } });
  const isValid = user !== null && (await bcrypt.compare(password, user.password));
  if (!isValid) throw unauthorizedError("Identifiants incorrects.");

  const payload = { userId: user.id, username: user.username, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  const { exp } = jwt.decode(refreshToken) as { exp: number };
  user.refreshToken = refreshToken;
  user.refreshTokenExpiry = new Date(exp * 1000);
  await user.save();

  return { user, tokens: { accessToken, refreshToken } };
}

export async function refresh(refreshToken: string): Promise<string> {
  const payload = verifyRefreshToken(refreshToken);       

  const user = await User.findOne({
    where: {
      id: payload.userId,
      refreshToken,   
      refreshTokenExpiry: { [Op.gt]: new Date() },
    },
  });
  if (!user) throw unauthorizedError("Token de rafraîchissement invalide ou révoqué.");

  return signAccessToken({ userId: user.id, username: user.username, role: user.role });
}

export async function logout(userId: number): Promise<void> {
  const [updated] = await User.update(
    { refreshToken: null, refreshTokenExpiry: null },
    { where: { id: userId } },
  );
  if (updated === 0) throw notFoundError("Utilisateur introuvable.");
}