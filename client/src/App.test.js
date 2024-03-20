import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  
  const username = screen.getByText('User Name:');
  const password = screen.getByText('Password:');
  const forgotPassword = screen.getByRole('button', { name: 'Forgot Password' });
  const createAccount = screen.getByRole('button', { name: 'Create Account' });
  const login = screen.getByRole('button', { name: 'Login' });

  expect(username).toBeInTheDocument();
  expect(password).toBeInTheDocument();
  expect(forgotPassword).toBeInTheDocument();
  expect(createAccount).toBeInTheDocument();
  expect(login).toBeInTheDocument();
  
  expect(forgotPassword).toHaveClass('hyperlink')
  expect(createAccount).toHaveClass('hyperlink')
});
