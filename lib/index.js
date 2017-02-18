var ChildProcess = require('child_process');
var csv = require('csv');

function isWindows() {
    if (typeof process === 'undefined' || !process) {
      return false;
    }
    return (
        process.platform === 'win32' ||
        process.env.OSTYPE === 'cygwin' ||
        process.env.OSTYPE === 'msys'
    );
}

/**
 * List processes
 */
module.exports.list = function (callback) {
    console.log(process.platform);
    if (!isWindows()) {
            ChildProcess.exec(
                'ps -Ao pid,command', function (err, stdout, stderr) {
                    if (err || stderr) {
                        return callback(err || stderr.toString());
                    }

                    var results = [];
                    stdout.split('\n').map(function (row) {
                    var matches = row.match(/(\d+) (.*)/);
                    if (!matches) {
                        return;
                    }

                    results.push({
                        pid: parseInt(matches[1], 10),
                        command: matches[2]
                    });
                });

                callback(null, results);
            });
    } else {
        ChildProcess.exec('tasklist /FO csv /NH', function (err, stdout, stderr) {
            if (err || stderr)
                return callback(err || stderr.toString());

            csv.parse(stdout, function (err, data) {
                if (err)
                    return callback(err);

                var results = data.map(function (row) {
                    return {
                        pid: parseInt(row[1], 10),
                        command: row[0]
                    };
                });

                callback(null, results);
            });
        });
    }
}


/**
 * Kill (SIGKILL) process
 */
module.exports.kill = function (pid, next) {
    var killCommand = process.platform !== 'darwin' ? 'taskkill /F /PID ' + pid : 'kill -s 9 ' + pid;
    ChildProcess.exec(killCommand, function (err, stdout, stderr) {
        if (err || stderr) {
            return next( err || stderr.toString() );
        }
        stdout = stdout.toString();
        // wait a while (200ms) for windows before calling callback
        if(isWindows()) {
            setTimeout(
                () => {
                    next(null, stdout);
                }, 50 
            );
            return;
        }
        next(null, stdout);
    });
};

/**
 * terminate (SIGTERM) process
 */
module.exports.sigterm = function (pid, next) {
    var killCommand = process.platform !== 'darwin' ? 'taskkill /PID ' + pid : 'kill -s 15 ' + pid;
    ChildProcess.exec(killCommand, function (err, stdout, stderr) {
        if (err || stderr) {
            return next( err || stderr.toString() );
        }

        stdout = stdout.toString();
        // wait a while (200ms) for windows before calling callback
        if(isWindows()) {
            setTimeout(
                () => {
                    next(null, stdout);
                }, 50 
            );
            return;
        }
        next(null, stdout);
    });
};

/**
 * send arbitrary signal to process (!windows only for now)
 * On windows this sends a simple non-forced kill to a process
 * since windows does not have posix signals, we can only fake
 * it for now.
 */
module.exports.sendSignal = function (pid, signal, next) {
    var killCommand = process.platform !== 'darwin' ? 'taskkill /PID ' + pid : 'kill -s '+signal+' ' + pid;
    ChildProcess.exec(killCommand, function (err, stdout, stderr) {
        if (err || stderr) {
            return next( err || stderr.toString() );
        }

        stdout = stdout.toString();
        // wait a while (200ms) for windows before calling callback
        if(isWindows()) {
            setTimeout(
                () => {
                    next(null, stdout);
                }, 50 
            );
            return;
        }
        next(null, stdout);
    });
};

module.exports.isWindows = isWindows;