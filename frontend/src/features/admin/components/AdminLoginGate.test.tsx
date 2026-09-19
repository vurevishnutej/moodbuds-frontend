import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminLoginGate } from './AdminLoginGate';
import { ApiError } from '../../../services/api/apiClient';

vi.mock('../services/adminAuthService', () => ({
  adminAuthService: { login: vi.fn() },
}));

import { adminAuthService } from '../services/adminAuthService';

describe('AdminLoginGate', () => {
  it('shows a validation message and does not call the API when fields are empty', async () => {
    const user = userEvent.setup();
    render(<AdminLoginGate onSignedIn={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/enter your username and password/i)).toBeInTheDocument();
    expect(adminAuthService.login).not.toHaveBeenCalled();
  });

  it('shows an invalid-credentials message on a 401', async () => {
    vi.mocked(adminAuthService.login).mockRejectedValue(new ApiError(401, 'Invalid username or password'));
    const user = userEvent.setup();
    render(<AdminLoginGate onSignedIn={vi.fn()} />);

    await user.type(screen.getByLabelText(/username/i), 'owner');
    await user.type(screen.getByLabelText(/password/i), 'wrong-password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid username or password/i)).toBeInTheDocument();
  });

  it('calls onSignedIn after a successful login', async () => {
    vi.mocked(adminAuthService.login).mockResolvedValue({
      id: 1,
      username: 'owner',
      fullName: 'Owner',
      role: 'SUPER_ADMIN',
      permissions: [],
    });
    const onSignedIn = vi.fn();
    const user = userEvent.setup();
    render(<AdminLoginGate onSignedIn={onSignedIn} />);

    await user.type(screen.getByLabelText(/username/i), 'owner');
    await user.type(screen.getByLabelText(/password/i), 'correct-password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(onSignedIn).toHaveBeenCalledTimes(1));
    expect(adminAuthService.login).toHaveBeenCalledWith('owner', 'correct-password');
  });
});
