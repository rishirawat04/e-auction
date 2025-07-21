import jwt from 'jsonwebtoken';

export const sendToken = (user, res, message) => {
  const accessToken = jwt.sign({ id: user._id, fullName: user.fullName }, process.env.JWT_SECRET, { expiresIn: '2d' });
  const refreshToken = jwt.sign({ id: user._id, fullName: user.fullName }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

  res.cookie('token', accessToken, {
    httpOnly: true,
    maxAge: 2 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  const { password, emailVerifyToken, passwordResetToken,loginType, phoneOtp, ...userData } = user._doc;

  res.status(200).json({
    success: true,
    message,
    user: userData
  });
};
