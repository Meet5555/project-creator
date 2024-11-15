#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import { generateStructure } from '../generator.js';
import chalk from 'chalk';

program
  .name('create-structure')
  .description('Generate project structure for React or Next.js applications')
  .argument('<framework>', 'Framework to generate structure for (react/next)')
  .action(async (framework) => {
    if (!['react', 'next'].includes(framework.toLowerCase())) {
      console.error(
        chalk.red('Error: Framework must be either "react" or "next"')
      );
      process.exit(1);
    }

    const answers = await inquirer.prompt([
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

    try {
      await generateStructure(framework.toLowerCase(), answers);
    } catch (error) {
      console.error(
        chalk.red('\n❌ Error generating project structure:'),
        error
      );
      process.exit(1);
    }
  });

program.parse();
