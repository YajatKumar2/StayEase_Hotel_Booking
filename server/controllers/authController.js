const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  console.log('Login attempt:', username, password);
  console.log('Expected:', process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD);

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token });
};