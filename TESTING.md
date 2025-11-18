# Testing Guide

Quick reference for testing the application.

## Quick Start

```bash
# 1. Check environment
npm run test:pre-check

# 2. Start dev server (if not running)
npm run dev

# 3. Run integration tests (in separate terminal)
npm run test:integration
```

## Test Scripts

| Command | Description |
|---------|-------------|
| `npm run test:pre-check` | Validate environment is ready for testing |
| `npm run test:integration` | Run automated integration tests |
| `npm run test` | Run unit tests |
| `npm run test:mappers` | Run data mapper tests |

## Documentation

- **[Quick Test Guide](docs/QUICK_TEST_GUIDE.md)** - Fast reference for running tests
- **[Integration Testing Guide](docs/INTEGRATION_TESTING.md)** - Comprehensive testing procedures
- **[Test Report Template](docs/TEST_REPORT_TEMPLATE.md)** - Document test results
- **[Testing Summary](docs/TESTING_SUMMARY.md)** - Implementation overview

## Test Coverage

### Automated Tests (20 tests)

✓ Authentication (signup, login, logout, session)  
✓ Application CRUD (create, read, update, delete)  
✓ Search and filtering  
✓ Profile management (experience, education, skills)  
✓ File upload validation  
✓ AI extraction  
✓ Export (CSV, JSON)  

### Manual Testing Required

- UI rendering and styling
- Responsive design (mobile, tablet, desktop)
- Dark mode functionality
- Browser compatibility
- Accessibility
- Performance metrics

## Troubleshooting

### Environment Not Ready

```bash
# Check what's missing
npm run test:pre-check

# Common fixes:
# - Add missing variables to .env.local
# - Start dev server: npm run dev
# - Verify Supabase credentials
```

### Tests Failing

```bash
# Check TypeScript errors
npm run type-check

# Check server is running
curl http://localhost:3000

# Check Supabase connection
# Visit: https://app.supabase.com
```

## CI/CD Integration

```yaml
# GitHub Actions example
- name: Integration Tests
  run: |
    npm run dev &
    sleep 10
    npm run test:integration
```

## Need Help?

- Check [docs/QUICK_TEST_GUIDE.md](docs/QUICK_TEST_GUIDE.md) for troubleshooting
- Review [docs/INTEGRATION_TESTING.md](docs/INTEGRATION_TESTING.md) for detailed procedures
- See [docs/ENVIRONMENT_SETUP.md](docs/ENVIRONMENT_SETUP.md) for configuration help
