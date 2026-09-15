import { render, screen } from '@testing-library/react';
import App from './App';

test('renders decision validator heading', () => {
  render(<App />);
  const heading = screen.getByText(/decision validator/i);
  expect(heading).toBeInTheDocument();
});
