# Project Structure Creator

A powerful CLI tool to generate well-structured React and Next.js applications with best practices and modern tooling.

## Features

- 🚀 Generate React or Next.js projects with optimal folder structure
- 📦 TypeScript/JavaScript support
- 🛠 ESLint and Prettier configuration
- 📱 Includes Old and Latest versions of React/Next.js
- ⚡️ Fast and interactive setup

## Installation

You can use this package in several ways:

### Using npx (Recommended)

```bash
npx project-structure-creator@latest
```

### Global Installation

```bash
npm install -g project-structure-creator
```

- Now run following command in terminal

```bash
create-project
```

### Local Installation

```bash
npm install project-structure-creator
```

- Then add to your package.json scripts:

```json
{
  "scripts": {
    "create": "create-project"
  }
}
```

- Run using npm

```bash
npm run create
```

## Usage

### Interactive Mode

Simply run:

```bash
npx project-structure-creator@latest
```

Follow the interactive prompts to:

1. Choose framework (React/Next.js)
2. Select TypeScript/JavaScript
3. Configure ESLint
4. Set up Prettier
5. Choose framework version
6. Name your project

### Direct Mode

Specify the framework directly:

```bash
npx project-structure-creator@latest react
# or
npx project-structure-creator@latest next
```

## Project Structure

The generated project includes:

```
src/
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
│   └── lib/       # Third-party library wrappers
├── styles/        # Global styles and themes
├── assets/        # Images, fonts, etc.
├── constants/     # Application constants
├── services/      # API services
└── context/       # React context providers

# Additional for Next.js
├── app/           # App router pages
└── middleware/    # Next.js middleware
```

## Examples

### Creating a React Project

```bash
npx project-structure-creator@latest react
```

### Creating a Next.js Project

```bash
npx project-structure-creator@latest next
```

## Support

If you encounter any issues or have questions:

1. Check the [GitHub Issues](https://github.com/Meet5555/project-structure-creator/issues)
2. Create a new issue if your problem isn't already reported
3. Join our [Discord Community](https://discord.gg/n3J4S4vY) for real-time help

## Contributing

We welcome contributions! Please see [Contributing Guide](CONTRIBUTING.md) for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release history.

## License

MIT © [Meet5555](https://github.com/Meet5555)

## Contact

- GitHub: [@Meet5555](https://github.com/Meet5555)
- Email: bhimanimeet55555@gmail.com
