# Automated Tests

This project uses **Vitest** for unit testing the core Audit Engine logic. 

## Audit Engine Tests
These tests ensure the logic for identifying savings is defensible, accurate, and reflects the current pricing data.

| Filename | Description | Coverage |
| :--- | :--- | :--- |
| `src/lib/audit/engine.test.ts` | Core Audit Logic | Downgrades, consolidation, API optimizations, optimal spend detection |

## How to Run Tests

### Prerequisites
Ensure all dependencies are installed:
```bash
npm install
```

### Execution Command
Run the test suite once:
```bash
npm run test
```

*Note: You can also use `npx vitest` to run tests in watch mode during development.*

## Test Scenarios Covered
1. **Plan Downgrade**: Verifies that teams on "Business" tiers with few users are prompted to move to "Pro" tiers.
2. **Individual vs. Team**: Ensures single users on "Team" plans are identified for "Plus/Individual" downgrades.
3. **Redundancy**: Flags when a company is paying for multiple coding assistants (e.g., Cursor + Copilot).
4. **API Efficiency**: Suggests prompt caching strategies for high-spend API users (> $500/mo).
5. **False Positives**: Confirms that already optimal spend stacks trigger no unnecessary "savings."
