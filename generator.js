import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import ora from 'ora';
import { execSync } from 'child_process';
import inquirer from 'inquirer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function getReactVersions() {
  const output = execSync('npm view react versions --json').toString();
  const versions = JSON.parse(output);
  return versions.filter(
    (v) => !v.includes('alpha') && !v.includes('beta') && !v.includes('rc')
  );
}

async function getNextVersions() {
  const output = execSync('npm view next versions --json').toString();
  const versions = JSON.parse(output);
  return versions.filter(
    (v) => !v.includes('alpha') && !v.includes('beta') && !v.includes('rc')
  );
}

export async function generateStructure(framework, options) {
  try {
    // Get available versions
    const versions =
      framework === 'react'
        ? await getReactVersions()
        : await getNextVersions();

    const latestVersion = versions[versions.length - 1];
    const commonVersions = versions.slice(-5).reverse(); // Get last 5 versions

    // Prompt for project details
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        default: 'my-app',
        validate: (input) => {
          if (/^[a-z0-9-_]+$/i.test(input)) return true;
          return 'Project name may only include letters, numbers, underscores and hashes';
        },
      },
      {
        type: 'list',
        name: 'version',
        message: `Select ${framework} version:`,
        choices: [
          { name: `Latest (${latestVersion})`, value: latestVersion },
          ...commonVersions.map((v) => ({ name: v, value: v })),
          { name: 'Custom version', value: 'custom' },
        ],
      },
      {
        type: 'input',
        name: 'customVersion',
        message: 'Enter version number:',
        when: (answers) => answers.version === 'custom',
        validate: (input) => {
          if (/^\d+\.\d+\.\d+$/.test(input)) return true;
          return 'Please enter a valid version number (e.g., 18.2.0)';
        },
      },
    ]);

    const selectedVersion = answers.customVersion || answers.version;
    const projectName = answers.projectName;

    const spinner = ora('Creating new project...').start();

    try {
      // Create new project using create-vite or create-next-app
      if (framework === 'react') {
        execSync(
          `npm create vite@latest ${projectName} -- --template ${
            options.typescript ? 'react-ts' : 'react'
          }`,
          { stdio: 'inherit' }
        );

        // Update React version in package.json
        const packageJsonPath = path.join(projectName, 'package.json');
        const packageJson = JSON.parse(
          await fs.readFile(packageJsonPath, 'utf8')
        );
        packageJson.dependencies.react = `^${selectedVersion}`;
        packageJson.dependencies['react-dom'] = `^${selectedVersion}`;
        await fs.writeFile(
          packageJsonPath,
          JSON.stringify(packageJson, null, 2)
        );
      } else {
        execSync(
          `npx create-next-app@${selectedVersion} ${projectName} --ts=${options.typescript} --tailwind --eslint --app --src-dir`,
          { stdio: 'inherit' }
        );
      }

      // Change to project directory
      process.chdir(projectName);

      const baseStructure = [
        'src/components',
        'src/hooks',
        'src/utils',
        'src/utils/lib',
        'src/styles',
        'src/assets',
        'src/constants',
        'src/services',
        'src/context',
      ];

      const nextStructure = [
        ...baseStructure,
        'src/app',
        'src/app/api',
        'src/middleware',
        'public',
      ];

      const structure = framework === 'next' ? nextStructure : baseStructure;

      // Create directories
      for (const dir of structure) {
        await fs.mkdir(dir, { recursive: true });
      }

      // Generate configuration files
      if (options.typescript) {
        const tsConfig = {
          compilerOptions: {
            target: 'es5',
            lib: ['dom', 'dom.iterable', 'esnext'],
            allowJs: true,
            skipLibCheck: true,
            strict: true,
            forceConsistentCasingInFileNames: true,
            noEmit: true,
            esModuleInterop: true,
            module: 'esnext',
            moduleResolution: 'node',
            resolveJsonModule: true,
            isolatedModules: true,
            jsx: 'preserve',
            incremental: true,
            baseUrl: '.',
            paths: {
              '@/*': ['./src/*'],
            },
          },
          include: ['src'],
          exclude: ['node_modules'],
        };

        await fs.writeFile('tsconfig.json', JSON.stringify(tsConfig, null, 2));
      }

      if (options.eslint) {
        const eslintConfig = {
          extends: [
            'eslint:recommended',
            framework === 'next' ? 'next/core-web-vitals' : 'react-app',
            options.typescript && 'plugin:@typescript-eslint/recommended',
            'prettier',
          ].filter(Boolean),
          rules: {
            'no-unused-vars': 'warn',
            'no-console': 'warn',
          },
        };

        await fs.writeFile(
          '.eslintrc.json',
          JSON.stringify(eslintConfig, null, 2)
        );
      }

      if (options.prettier) {
        const prettierConfig = {
          semi: true,
          trailingComma: 'es5',
          singleQuote: true,
          printWidth: 80,
          tabWidth: 2,
          useTabs: false,
        };

        await fs.writeFile(
          '.prettierrc',
          JSON.stringify(prettierConfig, null, 2)
        );
        // Add prettier dependencies
        execSync('npm install -D prettier eslint-config-prettier', {
          stdio: 'inherit',
        });
      }

      // Generate boilerplate files
      await generateBoilerplate(framework, options.typescript);

      // Install additional dependencies
      execSync('npm install @types/node @types/react @types/react-dom', {
        stdio: 'inherit',
      });

      spinner.succeed('Project created successfully!');

      // Print next steps
      console.log(
        '\n🎉 Project is ready! Follow these steps to get started:\n'
      );
      console.log(`  cd ${projectName}`);
      console.log('  npm install');
      console.log('  npm run dev\n');
    } catch (error) {
      spinner.fail('Failed to generate project');
      throw error;
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

async function generateBoilerplate(framework, isTypescript) {
  const ext = isTypescript ? 'tsx' : 'jsx';

  // Sample component
  const componentContent = `${isTypescript ? "import React from 'react';" : ''}

${isTypescript ? 'interface ButtonProps {' : ''}
${isTypescript ? '  label: string;' : ''}
${isTypescript ? '  onClick?: () => void;' : ''}
${isTypescript ? '}' : ''}

export const Button${
    isTypescript ? ': React.FC<ButtonProps>' : ''
  } = ({ label, onClick }) => {
  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      onClick={onClick}
    >
      {label}
    </button>
  );
};`;

  // Sample hook
  const hookContent = `${
    isTypescript ? "import { useState, useEffect } from 'react';" : ''
  }

export const useLocalStorage${
    isTypescript ? '<T>' : ''
  } = (key: string, initialValue${isTypescript ? ': T' : ''}) => {
  const [storedValue, setStoredValue] = useState${
    isTypescript ? '<T>' : ''
  }(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};`;

  await fs.writeFile(`src/components/Button.${ext}`, componentContent);
  await fs.writeFile(`src/hooks/useLocalStorage.${ext}`, hookContent);

  if (framework === 'next') {
    const pageContent = `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome to your Next.js application</h1>
    </main>
  );
}`;

    await fs.writeFile(`src/app/page.${ext}`, pageContent);
  }
}
