# SmartSpend - Personal Expense Tracker


SmartSpend is a personal expense-tracking web application designed to help users manage their finances, organize expenses by category, set monthly spending limits, and understand their spending habits through analytics.

This repository contains the **frontend** of SmartSpend, built with React and TypeScript.

## Features

- **Authentication:** User registration, login, and password recovery.
- **Dashboard:** Overview of spending and expense insights.
- **Expense Management:** Add, view, update, and delete expense records.
- **Category Management:** Organize transactions by category and manage monthly limits.
- **Analytics:** Visualize spending patterns and monthly expense comparisons.
- **User Profile:** View account details and update the username.
- **Preferences:** Configure application theme preferences, including light, dark, and system modes.
- **Password Management:** Change the password while authenticated.
- **Responsive Interface:** Layout designed to adapt to different screen sizes.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Axios
- Recharts
- Lucide React

## Prerequisites

- Node.js and npm
- The [SmartSpend backend](https://github.com/sandra-simon/smartspend-backend) running locally or at a configured API URL

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sandra-simon/smartspend-frontend.git
cd smartspend-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the backend API URL

Copy the example environment file:

```bash
cp .env.example .env
```

Set `VITE_API_BASE_URL` to the base URL of your SmartSpend backend API.

For local development:

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

For deployment, use your deployed backend API URL. Restart the Vite development server after changing environment variables.

### 4. Start the development server

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build the production application |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

## Backend

The frontend communicates with the SmartSpend REST API for authentication, expense management, categories, analytics, and user preferences.

See the [SmartSpend backend repository](https://github.com/sandra-simon/smartspend-backend) for backend setup, database configuration, API documentation, and email configuration.

## Security

- Never commit `.env` files, credentials, tokens, or other secrets.
- Configure API URLs and environment-specific settings locally.
- Use HTTPS when deploying the application.

## License

No license has been specified for this repository yet.
