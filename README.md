# create-project-structure

A CLI tool to generate complete React and Next.js applications with an optimized project structure.

## Installation

```bash
npm install -g create-project-structure
```

## Usage

Create a new project:

```bash
create-structure react my-app  # For React projects
# or
create-structure next my-app   # For Next.js projects
```

If you don't specify a project name, it defaults to "my-app".

## Features

- Creates a complete React/Next.js project using Vite or Create Next App
- Framework-specific folder structures
- TypeScript support
- ESLint configuration
- Prettier setup
- Basic component and hook boiler plates

## Generated Structure

### React Projects

```
my-app/
  ├── src/
  │   ├── components/
  │   ├── hooks/
  │   ├── utils/
  │   ├── styles/
  │   ├── assets/
  │   ├── constants/
  │   ├── services/
  │   └── context/
  ├── public/
  ├── package.json
  ├── tsconfig.json (if TypeScript)
  ├── .eslintrc.json (if ESLint)
  └── .prettierrc (if Prettier)
```

### Next.js Projects

```
my-app/
  ├── src/
  │   ├── app/
  │   │   └── api/
  │   ├── components/
  │   ├── hooks/
  │   ├── utils/
  │   ├── styles/
  │   ├── assets/
  │   ├── constants/
  │   ├── services/
  │   ├── context/
  │   └── middleware/
  ├── public/
  ├── package.json
  ├── tsconfig.json (if TypeScript)
  ├── .eslintrc.json (if ESLint)
  └── .prettierrc (if Prettier)
```

## Configuration Options

During setup, you can choose to include:

- TypeScript configuration
- ESLint setup
- Prettier formatting

## License

MEET
