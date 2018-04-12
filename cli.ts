#!/usr/bin/env node

import * as program from 'commander';
import { Locator } from './lib/utils/locator';
import { sh } from './lib/utils/shell';

import { Geth } from './backend/ethereum/geth';

program.version('0.1.0');

program
  .command('list')
  .description('List available networks')
  .action(() => {
    const list = async () => {
      const { stdout, stderr } = await sh('geth account list');
      stdout && console.log(stdout);
      stderr && console.log(stderr);
    };
    list();
  });

program
  .command('init')
  .description('Set up a new network')
  .action(() => {
    const script = Geth.initScript(
      './fixtures/ethereum', './fixtures/ethereum/genesis.json');
    const init = async () => {
      const { stdout, stderr } = await sh(script);
      stdout && console.log(stdout);
      stderr && console.log(stderr);
    };
    init();
    console.log('Boson init command');
  });

program
  .command('reset')
  .description('Reset the current blockchain to start over')
  .action(() => {
    Geth.cleanup('./fixtures/ethereum/geth');
    console.log('Cleaned up');
  });

// This is just a temporary convenient entrypoint to test the locator out
program
  .command('search <name>')
  .description('Search for the executable')
  .action((name) => {
    console.log(Locator.search(name));
  });

program
  .command('search-under <name> [dirs...]')
  .description('Search for the executable')
  .action((name, dirs) => {
    console.log(Locator.searchUnder(name, dirs));
  });


program.parse(process.argv);
