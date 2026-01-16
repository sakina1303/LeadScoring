// Unit tests for scoring engine logic
const applyScore = (prevScore, points, cap) => Math.min(prevScore + points, cap);

describe('Scoring Engine', () => {
  it('applies score cap', () => {
    expect(applyScore(990, 20, 1000)).toBe(1000);
  });
  it('applies rule points', () => {
    expect(applyScore(100, 50, 1000)).toBe(150);
  });
});
