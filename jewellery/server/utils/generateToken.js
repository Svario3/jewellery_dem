import jwt from 'jsonwebtoken';

const generateToken = (userId, role = 'customer') => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'aurelia_super_secret_jwt_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

export default generateToken;
