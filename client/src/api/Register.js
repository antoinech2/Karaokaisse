import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL;

async function register(name, email, password) {
  try {
    const response = await axios.post(`${serverUrl}/api/auth/register`, {
      name,
      email,
      password,
    });
    if (response.status === 201) {
      return { message: 'User registered successfully' };
    } else {
      throw new Error('Failed to register user');
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
}

export default register;
