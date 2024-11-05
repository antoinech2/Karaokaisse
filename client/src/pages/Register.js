import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import register from '../api/Register';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.endsWith('@imt-atlantique.net')) {
      setError('L\'adresse email doit se terminer par "@imt-atlantique.net".');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setError('');

    try {
      const res = await register(name, email, password);

      if (res.message === 'User registered successfully') {
        navigate('/login');
      } else {
        setError('Erreur lors de l\'inscription.');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Inscription
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Nom"
            type="text"
            fullWidth
            margin="normal"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Adresse email"
            type="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error && !email.endsWith('@imt-atlantique.net')}
            helperText={!!error && !email.endsWith('@imt-atlantique.net') ? error : ''}
          />
          <TextField
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Confirmer le mot de passe"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!error && password !== confirmPassword}
            helperText={!!error && password !== confirmPassword ? error : ''}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 2 }}
          >
            S'inscrire
          </Button>
          {error && !password && (
            <Typography color="error" variant="body2" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </form>
      </Box>
    </Container>
  );
}
