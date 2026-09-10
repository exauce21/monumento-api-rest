function required(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === "") {
    console.error(`Configuration invalide : la variable ${name} est obligatoire.`);
    process.exit(1);
  }
  return value;
}

function optionalNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    console.error(`Configuration invalide : ${name} doit être un entier positif (reçu "${raw}").`);
    process.exit(1);
  }
  return value;
}

export const env = {
  PORT: optionalNumber("PORT", 3000),
  DB_HOST: process.env.DB_HOST ?? "localhost",
  DB_PORT: optionalNumber("DB_PORT", 3306),
  DB_NAME: required("DB_NAME"),
  DB_USER: required("DB_USER"),
  DB_PASSWORD: required("DB_PASSWORD"),
  NODE_ENV: process.env.NODE_ENV ?? "development",
  JWT_SECRET: required("JWT_SECRET"),
  ACCESS_TOKEN_TTL: optionalNumber("ACCESS_TOKEN_TTL", 1800),
  REFRESH_TOKEN_TTL: optionalNumber("REFRESH_TOKEN_TTL", 604800)
};