# node-acs
[![npm version](https://img.shields.io/npm/v/@archivist/acs.svg)](https://www.npmjs.com/package/@archivist/acs)

Archivist's Caching Server 'HTTP'

> Calls a callback function after key has been pressed (terminal)

## Installation

```sh
npm install -g @archivist/acs
```

## Usage

```bash
acs <cmd> [args]

Commands:
  acs serve [port] [path] [cache-file]  Serve Local Path
  acs cached [port] [cache-file]        Serve local cache-file
  acs pack [path] [cache-file]          pack local path to cache-file
  acs unpack [cache-file] [path]        extract cache-file to local path

Options:
  --version  Show version number                                    [boolean]
  --help     Show help                                              [boolean]
```


## License

MIT
