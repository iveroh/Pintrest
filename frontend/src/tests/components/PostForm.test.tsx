import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent, act,} from '@testing-library/react';
import PostForm from '@/components/PostForm';
import { AuthProvider } from '@/context/authContext';
import { ApolloProvider } from '@apollo/client/react';
import { InMemoryCache, ApolloClient } from '@apollo/client';
import { MemoryRouter } from 'react-router-dom';
import { Observable } from '@apollo/client/utilities';

const createMockClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: {
      request: () => new Observable(() => {}),
      setOnError: () => {},
    } as any,
  });

const originalResizeObserver = globalThis.ResizeObserver;

beforeAll(() => {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
});

afterAll(() => {
  globalThis.ResizeObserver = originalResizeObserver;
});

describe('PostForm', () => {
  const renderWithProviders = async (ui: React.ReactElement) => {
    const client = createMockClient();
    let result: ReturnType<typeof render>;
    await act(async () => {
      result = render(
        <MemoryRouter>
          <ApolloProvider client={client}>
            <AuthProvider>{ui}</AuthProvider>
          </ApolloProvider>
        </MemoryRouter>
      );
    });
    // @ts-expect-error result is assigned in act above
    return result;
  };

  it('renders the form with default values', async () => {
    await renderWithProviders(<PostForm onClose={vi.fn()} />);

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Select and crop image/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Pints')).toBeInTheDocument();
  });

  it('validates the form and shows errors for invalid inputs', async () => {
    const onClose = vi.fn();
    await renderWithProviders(<PostForm onClose={onClose} />);

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Pints'), { target: { value: '13' } });
    fireEvent.click(screen.getByText('Submit'));

    expect(onClose).not.toHaveBeenCalled();
  });
});
