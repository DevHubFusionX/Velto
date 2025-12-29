import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import StatCard from './StatCard';

describe('StatCard', () => {
    it('renders label and value correctly', () => {
        render(<StatCard label="Test Label" value="₦5,000" />);
        expect(screen.getByText('Test Label')).toBeDefined();
        expect(screen.getByText('₦5,000')).toBeDefined();
    });

    it('renders subtext when provided', () => {
        render(<StatCard label="Label" value="Value" subtext="Growth +10%" />);
        expect(screen.getByText('Growth +10%')).toBeDefined();
    });

    it('renders lockedAmount when provided', () => {
        render(<StatCard label="Label" value="Value" lockedAmount="₦100" />);
        expect(screen.getByText(/₦100 Locked for withdrawal/)).toBeDefined();
    });

    it('calls onAction when action button is clicked', () => {
        const onAction = vi.fn();
        render(
            <StatCard
                label="Label"
                value="Value"
                onAction={onAction}
                actionLabel="Click Me"
            />
        );

        const button = screen.getByText('Click Me');
        fireEvent.click(button);
        expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('applies primary variant styles', () => {
        const { container } = render(<StatCard label="L" value="V" variant="primary" />);
        const card = container.firstChild;
        expect(card.className).toContain('from-[#a3e635]/15');
    });
});
