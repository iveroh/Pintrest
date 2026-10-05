import { describe, it, expect } from 'vitest';
import { badges } from '@/lib/badges';

describe('Badges', () => {
  it('awards the Pint Baby badge for consuming 1 pint', () => {
    const stats = { follower_count: 0, post_count: 0, like_count: 0, pints_consumed_count: 1 };
    const awardedBadges = badges.filter((badge) => badge.condition(stats));

    expect(awardedBadges).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'pint-baby' })
      ])
    );
  });

  it('does not award the 6-Pack badge for consuming less than 6 pints', () => {
    const stats = { follower_count: 0, post_count: 0, like_count: 0, pints_consumed_count: 5 };
    const awardedBadges = badges.filter((badge) => badge.condition(stats));

    expect(awardedBadges).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: '6-pack' })
      ])
    );
  });
});