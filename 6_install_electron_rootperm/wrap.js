// this will try to open the packet capture briefly just to check
// permissions. If permissions available the app loaded as user.
// If there is an error the app will be loaded through sudo 
// as root. App will check if runing as root and release perms.
//
// Issues: this works but the method with the log file at end
// is not reliable, not catching stdout. Still, it works though
// Would need to see  how this works with an electron app

var isWin = (process.platform === 'win32')
var isLinux = (process.platform === 'linux')
var isOSX = (process.platform === 'darwin')
if (isWin) var device = "wlan0"
if (isLinux) var device = "wlan0"
if (isOSX) var device = "en1"

var getRoot = 0;

if (isWin || isLinux || isOSX) {
    console.log('try cap')
    var cap = require('cap');
    var cap_session = new cap.Cap();
    var buffer = Buffer.alloc(1024);
    try {
        var linkType = cap_session.open(device, "", 10 * 1024 * 1024, buffer);
        cap_session.close();
    }
    catch (e) {
        console.error(e);
        if (e.message.toLowerCase().indexOf("permission denied")>=0) {
            console.error('Could not create pcap session. Will try as root')
            getRoot = 1
        }
    }
}

var cp = require('child_process');

if (getRoot) {
    console.log("run and request root permissions")
    var sudo = require('sudo-prompt');
    var options = { name: 'mitm' }
    // sudo.exec('node index.js', options, function (error, stdout, stderr) {
    //     if (error) throw error;
    //     if (stdout) console.log('stdout: '+stdout);
    //     if (stderr) console.error('stderr: '+stderr);
    // });
    sudo.exec('node ./index.js > log');
}
else {
    console.log("run with user permissions")
    // cp.exec('node ./index.js', function (error, stdout, stderr) {
    //     if (error) throw error;
    //     if (stdout) console.log('stdout: '+stdout);
    //     if (stderr) console.error('stderr: '+stderr);
    // });
    cp.exec('./node_modules/.bin/electron ./index.js 2>&1 log')
}

var logproc = cp.spawn('tail',['-f','log'])
logproc.stdout.on('data', console.log)
logproc.stderr.on('data', console.error)
logproc.on('close', console.log)
