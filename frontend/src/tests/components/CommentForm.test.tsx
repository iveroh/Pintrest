import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommentForm } from '@/components/Comment/CommentForm';

describe('CommentForm Component', () => {
  it('renders with placeholder text', () => {
    const mockSubmit = vi.fn();
    render(<CommentForm submitFunctionType={mockSubmit} />);
    
    const input = screen.getByPlaceholderText('Add a comment');
    expect(input).toBeInTheDocument();
  });

  it('renders with previous description as placeholder', () => {
    const mockSubmit = vi.fn();
    render(<CommentForm previousDescription="Edit this comment" submitFunctionType={mockSubmit} />);
    
    const input = screen.getByPlaceholderText('Edit this comment');
    expect(input).toBeInTheDocument();
  });

  it('calls submit function with comment text', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<CommentForm submitFunctionType={mockSubmit} />);
    
    const input = screen.getByPlaceholderText('Add a comment');
    const submitButton = screen.getByRole('button', { name: /post/i });
    
    await user.type(input, 'This is a test comment');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith('This is a test comment');
    });
  });

  it('clears input after submission', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<CommentForm submitFunctionType={mockSubmit} />);
    
    const input = screen.getByPlaceholderText('Add a comment') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /post/i });
    
    await user.type(input, 'Test comment');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('shows validation error for empty comment', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<CommentForm submitFunctionType={mockSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /post/i });
    
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/comment must be at least 1 characters/i)).toBeInTheDocument();
    });
    
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for comment longer than 100 characters', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<CommentForm submitFunctionType={mockSubmit} />);
    
    const input = screen.getByPlaceholderText('Add a comment');
    const submitButton = screen.getByRole('button', { name: /post/i });
    
    const longComment = 'a'.repeat(101);
    await user.type(input, longComment);
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/comment cant be more than 100 characters/i)).toBeInTheDocument();
    });
    
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('accepts comment with exactly 100 characters', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<CommentForm submitFunctionType={mockSubmit} />);
    
    const input = screen.getByPlaceholderText('Add a comment');
    const submitButton = screen.getByRole('button', { name: /post/i });
    
    const maxLengthComment = 'a'.repeat(100);
    await user.type(input, maxLengthComment);
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(maxLengthComment);
    });
  });

  it('prefills input with previous description when editing', () => {
    const mockSubmit = vi.fn();
    render(<CommentForm previousDescription="Original comment" submitFunctionType={mockSubmit} />);
    
    const input = screen.getByDisplayValue('Original comment');
    expect(input).toBeInTheDocument();
  });
});