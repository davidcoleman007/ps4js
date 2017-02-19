# ps4js

This module allows you to list and kill process on OSX and Windows.

We use `ps` and `tasklist` to list processes and `kill` and `taskkill` to kill a process.

We also include the ability to send either a force kill (`sigkill` (9) or `sigterm` (15)) 
to a process, depending on your needs.

## Install

```bash
$ npm install ps4js
```

## Usage

### List processes

```javascript
var ps = require('ps4js');

ps.list(function(err, results) {
  if (err)
    throw new Error( err );

  console.log(results); // [{pid: 2352, command: 'command'}, {...}]
});
```

### Kill process by PID

```javascript
var ps = require('ps4js');

ps.kill(12345, function(err, stdout) {
  if (err)
    throw new Error(err);

  console.log(stdout); // stdout for kill or taskkill command if any
});
```

## Tests

```bash
npm test
```

## Note

If the full command line is required on windows [wmic.exe](http://ss64.com/nt/wmic.html) would be the way to go but it's not available on Windows XP Home Edition.

## Licence

(MIT)