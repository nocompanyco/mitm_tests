console.log(` 
    Linux Permissions test 

    Will load electron and then attempt to execute linux.js which loads pcap

    Run:
      npm install --save electron
      npm install --save electron-rebuild
      ./node_modules/.bin/electron-rebuild -f -w .

      /bin/sudo setcap cap_net_raw,cap_net_admin=eip \`pwd\`/node_modules/electron/dist/electron
      echo \`pwd\`/node_modules/electron/dist > /etc/ld.so.conf.d/electron.conf && ldconfig

      ./node_modules/.bin/electron linux_electron.js

    settcap resolves permission error but introduces 'cannot open libffmpeg.so' error which the ld.so.conf change resolves.
      
    filed issue about this years ago: 
      https://github.com/electron/electron/issues/4583
`)

const { app, BrowserWindow } = require('electron')
const fs = require('fs')
let proc;
function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')
  fs.appendFile("test.txt",new Date()+"\n",console.log);
  console.log('starting linux.js')
  const fork = require('child_process').fork;
  try {
    proc = fork(__dirname+'/linux.js');
  }
  catch (e) {
    console.error(e);
    console.log("\nConsider running as root or give yourself permission to monitor network interface:");
    console.log(`\nsudo setcap cap_net_raw,cap_net_admin=eip ${process.argv[0]}\n`);
    console.log(`Also add the following to linux's ld library paths (LD_LIBRARY_PATH not sufficient):`);
    console.log(`echo '${__dirname}/node_modules/electron/dist' > /etc/ld.so.conf.d/monsterinthemiddle.conf`);
    console.log(`ldconfig`);
    return resolve(true)
  }
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (proc !== null) proc.kill('SIGINT');
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})