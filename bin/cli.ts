#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import { generateStructure } from '../generator.js';
import chalk from 'chalk';

const ALLOWED_FRAMEWORKS = ['react', 'next'] as const;
type Framework = (typeof ALLOWED_FRAMEWORKS)[number];

program
  .name('create-project')
  .description('Generate project structure for React or Next.js applications')
  .argument('[framework]', 'Framework to generate structure for (react/next)')
  .action(async (framework?: string) => {
    try {
      if (
        !framework ||
        !ALLOWED_FRAMEWORKS.includes(framework.toLowerCase() as Framework)
      ) {
        const frameworkAnswer = await inquirer.prompt<{ framework: Framework }>(
          [
            {
              type: 'list',
              name: 'framework',
              message: 'Which framework would you like to use?',
              choices: ALLOWED_FRAMEWORKS.map((f) => ({
                name: f.charAt(0).toUpperCase() + f.slice(1),
                value: f,
              })),
            },
          ]
        );
        framework = frameworkAnswer.framework;
      }

      const answers = await inquirer.prompt<{
        typescript: boolean;
        eslint: boolean;
        prettier: boolean;
      }>([
        {
          type: 'confirm',
          name: 'typescript',
          message: 'Would you like to use TypeScript?',
          default: true,
        },
        {
          type: 'confirm',
          name: 'eslint',
          message: 'Would you like to include ESLint configuration?',
          default: true,
        },
        {
          type: 'confirm',
          name: 'prettier',
          message: 'Would you like to include Prettier configuration?',
          default: true,
        },
      ]);

      await generateStructure(framework.toLowerCase() as Framework, answers);
    } catch (error) {
      console.error(
        chalk.red('\n❌ Error generating project structure:'),
        error instanceof Error ? error.message : error
      );
      process.exit(1);
    }
  });

program.parse();
