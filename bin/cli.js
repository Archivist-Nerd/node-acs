#!/usr/bin/env node
'use strict';

const pkg = require('../package.json')		//	package.json Contents
	, yargs = require("yargs")							//	Command Line Arguments
	, chalk = require("chalk")							//	Console Colors
  , acs   = require('../src/acs')         //  actual app code
	;
/*
    Catch Exceptions
*/
process.on('uncaughtException',  err => console.error('uncaughtException', err))
process.on('unhandledRejection', err => console.error('unhandledRejection', err))
/*
		Application Description
*/
process.stdout.write(`${ chalk.white.bold(pkg._cmd) } \t ${ chalk.grey('v'+pkg.version) } \t ${ chalk.blue.bold(pkg.description) }\n\n`)
/*
		Command Line Arguments
*/
yargs
	.scriptName( chalk.white.bold( pkg._cmd ) )
//  .usage(`${chalk.white.bold( pkg._cmd )} <cmd> [args]`)
  .usage(`acs <cmd> [args]`)

  .command('serve [port] [path] [cache-file]', 'Serve Local Path', (yargs) => {
    yargs
      .positional('port',       { type: 'number', default: '8080', describe: 'Port to listen on' })
      .positional('host',       { type: 'string', default: '127.0.0.1', describe: 'Host Address' })
      .positional('path',       { type: 'string', default: './',   describe: 'Local Path to serve' })
      .positional('cache-file', { type: 'string', default: '',     describe: 'cache filename' })
  },
   (argv) => acs.serve( argv.port, argv.host, argv.path, argv.cacheFile )
  )

  .command('cached [port] [cache-file]', 'Serve local cache-file', (yargs) => {
    yargs
      .positional('port',       { type: 'number', default: '8080',       describe: 'Port to listen on' })
      .positional('host',       { type: 'string', default: '127.0.0.1', describe: 'Host Address' })
      .positional('cache-file', { type: 'string', default: 'cache.json', describe: 'cache filename' })
  },
   (argv) => acs.cached( argv.port, argv.host, argv.cacheFile )
  )

  .command('pack [path] [cache-file]', 'pack local path to cache-file', (yargs) => {
    yargs
      .positional('path',       { type: 'string', default: './',   describe: 'Local Path to pack' })
      .positional('cache-file', { type: 'string', default: 'cache.json', describe: 'cache filename' })
  },
   (argv) => acs.pack( argv.path, argv.cacheFile )
  )

  .command('unpack [cache-file] [path]', 'extract cache-file to local path', (yargs) => {
    yargs
      .positional('cache-file', { type: 'string', default: 'cache.json', describe: 'cache filename' })
      .positional('path',       { type: 'string', default: './unpacked',   describe: 'Local Path to pack' })
  },
   (argv) => acs.unpack( argv.cacheFile, argv.path )
  )

  .showHelpOnFail(true)
  .demandCommand(1, '')

  .help()
  .argv;