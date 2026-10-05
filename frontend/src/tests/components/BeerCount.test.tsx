import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BeerCount from '@/components/BeerCount';

describe('BeerCount Component', () => {
  it('renders with default count of 0 and max of 12', () => {
    render(<BeerCount />);
    
    const container = screen.getByLabelText('Beers consumed: 0 of 12');
    expect(container).toBeInTheDocument();
  });

  it('renders correct number of beer bottles', () => {
    render(<BeerCount count={5} max={12} />);
    
    const container = screen.getByLabelText('Beers consumed: 5 of 12');
    const beerImages = container.querySelectorAll('img');
    
    // Should render 12 total beer bottles
    expect(beerImages).toHaveLength(12);
  });

  it('displays custom aria-label when provided', () => {
    render(<BeerCount count={3} max={5} ariaLabel="Custom beer count" />);
    
    const container = screen.getByLabelText('Custom beer count');
    expect(container).toBeInTheDocument();
  });

  it('handles count greater than max by capping to max', () => {
    render(<BeerCount count={15} max={12} />);
    
    const container = screen.getByLabelText('Beers consumed: 12 of 12');
    expect(container).toBeInTheDocument();
  });

  it('handles negative count by setting to 0', () => {
    render(<BeerCount count={-5} max={12} />);
    
    const container = screen.getByLabelText('Beers consumed: 0 of 12');
    expect(container).toBeInTheDocument();
  });

  it('renders correct number of bottles when count equals max', () => {
    render(<BeerCount count={7} max={7} />);
    
    const container = screen.getByLabelText('Beers consumed: 7 of 7');
    const beerImages = container.querySelectorAll('img');
    
    // Should render 7 bottles
    expect(beerImages).toHaveLength(7);
  });

  it('applies custom className when provided', () => {
    render(<BeerCount count={3} className="custom-class" />);
    
    const container = screen.getByLabelText('Beers consumed: 3 of 12');
    expect(container).toHaveClass('custom-class');
  });
});