const { app, BrowserWindow } = require('electron')
const fs = require('fs')
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

  // Here run pcap code. mostly copy pasta from 2_pcaps_compare test
  var isWin = (process.platform === 'win32')
  var isLinux = (process.platform === 'linux')
  var isOSX = (process.platform === 'darwin')
  if (isWin) var device = "wlan0"
  if (isLinux) var device = "wlan0"
  if (isOSX) var device = "en1"

  if (isWin) {
      var capture = require('node-capture');
  }

  if (isLinux || isOSX) {
      console.log('loading pcap')

      var pcap = require('pcap');
      
      var pcap_packet, pcap_decoded;
      pcap_session = pcap.createSession(device, "tcp or udp or icmp");
      pcap_session.on('packet', function (raw_packet) {
          pcap_packet = raw_packet;
          // shows: PacketWithHeader {buf: Buffer(65535), header: Buffer(16), link_type: "LINKTYPE_ETHERNET"}
          pcap_decoded = pcap.decode.packet(pcap_packet);
          pcap_session.close();
          
          console.log("\nPACKET (pcap):");
          console.log(pcap_packet);
          console.log("PACKET DECODED (pcap):");
          console.log(pcap_decoded);
          fs.appendFile("pcap.txt",pcap_decoded,console.log);

      });
  }

  // if (false) {
  if (isWin || isLinux || isOSX) {
      console.log('loading cap')
      var cap = require('cap');
      var decoders = require('cap').decoders;
      var PROTOCOL = decoders.PROTOCOL;
      var cap_session = new cap.Cap();

      var cap_packet, cap_decoded;
      // var filter = 'tcp and dst port 80';
      var buffer = Buffer.alloc(65535);
      var linkType = cap_session.open(device, "tcp or udp or icmp", 10 * 1024 * 1024, buffer);
      cap_session.on('packet', function(nbytes, trunc) {
          cap_packet = buffer.slice(0, nbytes);
          // shows: Buffer(60) [255, 255, 255, …]
          var ret = decoders.Ethernet(buffer);
          if (ret.info.type === PROTOCOL.ETHERNET.IPV4)
              cap_decoded = decoders.IPV4(cap_packet, ret.offset);
          cap_session.close();

          console.log("\nPACKET (cap):");
          console.log(cap_packet);
          console.log("PACKET DECODED (cap):");
          fs.appendFile("cap.txt",pcap_decoded,console.log);
      });
  }

}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.