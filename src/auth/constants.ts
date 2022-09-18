/**
 * @todo Get this value from .env
 */
export const jwtConstants = {
  secret: process.env.JWT_SECRET_KEY,
};

/**
 * @todo Get this value from .env
 */
export const bcryptConstants = {
  saltOrRounds: process.env.BCRYPT_SALT || 'theBcryptSalt@0101',
};
