# nopCommerce E-Commerce Test Automation

Comprehensive test automation framework for nopCommerce demo store using **Playwright** with **TypeScript**.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Reports](#reports)

## ✨ Features

- ✅ **37 comprehensive test cases** covering all required e-commerce flows
- ✅ **Page Object Model (POM)** architecture for maintainability
- ✅ **Cross-browser testing** (Chromium, Firefox, WebKit)
- ✅ **Parallel execution** for faster test runs
- ✅ **Automatic retries** for flaky test handling
- ✅ **Rich HTML reports** with screenshots and videos
- ✅ **TypeScript** for type safety and better IDE support
- ✅ **ESLint & Prettier** for code quality
- ✅ **Data-driven testing** with fixtures

## 🛠 Tech Stack

- **Test Framework**: [Playwright](https://playwright.dev/) v1.40+
- **Language**: TypeScript 5.3+
- **Reporting**: Playwright HTML Reporter
- **Code Quality**: ESLint, Prettier
- **Test Data**: Faker.js

## 📁 Project Structure

```
nopcommerce-automation-demo/
├── config/                     # Configuration files
│   └── environments.ts        # Environment configurations
├── pages/                      # Page Object Models
│   ├── BasePage.ts            # Base page with common elements
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── RegisterPage.ts
│   ├── PasswordRecoveryPage.ts
│   ├── SearchPage.ts
│   └── CategoryPage.ts
├── tests/                      # Test specifications
│   ├── auth.spec.ts           # Authentication tests
│   ├── search.spec.ts         # Search functionality tests
│   └── category.spec.ts       # Category navigation tests
├── utils/                      # Utility functions
│   ├── TestDataGenerator.ts  # Test data generation
│   └── Helpers.ts            # Helper functions
├── fixtures/                   # Test data fixtures
│   └── testData.json
├── playwright.config.ts       # Playwright configuration
├── .env.example              # Environment variables template
├── tsconfig.json              # TypeScript configuration
├── .eslintrc.json            # ESLint configuration
├── .prettierrc               # Prettier configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

## 📦 Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- **Git**

## 🚀 Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/nopcommerce-automation-demo.git
cd nopcommerce-automation-demo
```

2. **Install dependencies**

```bash
npm install
```

3. **Install Playwright browsers** (for local execution)

```bash
npx playwright install
```

4. **Configure environment variables**

```bash
cp .env.example .env
# Edit .env with your configuration
```

## 🧪 Running Tests

### Environment Selection

The framework supports multiple test environments (demo, test, staging, production):

```bash
# Run on Demo environment (default)
npm run test:demo

# Run on Test environment
npm run test:test

# Run on Staging environment
npm run test:staging

# Run on Production environment
npm run test:production
```

### Local Execution

```bash
# Run all tests (default: demo environment)
npm test

# Run tests in headed mode
npm run test:headed

# Run tests in UI mode (interactive)
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run specific browser
npm run test:chrome

# Run specific test file
npx playwright test tests/auth.spec.ts

# Run tests in parallel
npm run test:parallel
```

### Custom Environment Configuration

```bash
# Override base URL
BASE_URL=https://custom-url.com npm test

# Use different environment with custom URL
TEST_ENV=staging BASE_URL=https://custom-staging.com npm test

# Set environment via .env file
cp .env.example .env
# Edit .env: TEST_ENV=staging
npm test
```

## 📈 Reports

### HTML Report

```bash
npm run report
```

Opens interactive HTML report with:

- Test results summary
- Screenshots on failures
- Videos on failures
- Test execution timeline
- Browser logs

## 🧹 Code Quality

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 🐛 Debugging

```bash
# Debug mode
npm run test:debug

# Codegen (record actions)
npm run codegen

# Show trace
npx playwright show-trace trace.zip
```
