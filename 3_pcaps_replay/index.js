// testing loading a save file using node_pcap (posix)
// create the pcap in wireshark or with tcpdump

// TODO: 
// TODO: code node-capture (windows)
// TODO: test windows node-capture and cap on windows

var test_file = "./http_2packets.pcap";

var isWin = (process.platform === 'win32')
var isLinux = (process.platform === 'linux')
var isOSX = (process.platform === 'darwin')


console.log('iterate through lib types in sequence (not async)')
// for this using promises


/*
  pcap (posix)
  https://github.com/node-pcap/node_pcap
*/
var do_pcap = function () {
    return new Promise(function (resolve) {
    console.log('\n\nLOAD pcap\n\n');
    if (isLinux || isOSX) {
        var pcap = require('pcap');
        var pcap_session = pcap.createOfflineSession(test_file);

        pcap_session.on('packet', function (pcap_packet) {
            var pcap_decoded = pcap.decode.packet(pcap_packet);
            console.log("\nPACKET (pcap):");
            console.log(pcap_packet);
            console.log("PACKET DECODED:");
            console.log(pcap_decoded);
        });
        pcap_session.on('complete', function () {
            console.log('\n\COMPLETED pcap\n\n');
            return resolve(true);
        });
    }
    // return resolve();
});
}


/*
  cap (posix + win32)
  https://github.com/mscdex/cap
*/
var do_cap = function () {

    return new Promise(function (resolve) {
    console.log('\n\nLOAD cap\n\n');

    console.log('cap CANT LOAD FILE. SKIPPING\nsee pcap_lookupnet https://github.com/mscdex/cap/blob/master/src/binding.cc#L314'); return resolve(true)
    
    if (isLinux || isOSX || isWin) {
        var c = require('cap');
        var cap_session = new c.Cap();
        var buffer = Buffer.alloc(65535);
        var linkType = cap_session.open(test_file, "", 10 * 1024 * 1024, buffer);
        cap_session.on('packet', function(nbytes, trunc) {
            cap_packet = buffer.slice(0, nbytes);
            var ret = decoders.Ethernet(buffer);
            if (ret.info.type === PROTOCOL.ETHERNET.IPV4)
                cap_decoded = decoders.IPV4(cap_packet, ret.offset);

            console.log("\nPACKET (pcap):");
            console.log(cap_packet);
            console.log("PACKET DECODED:");
            console.log(cap_decoded);
        });
    }
    console.log('\n\nLOAD cap\n\n');
});
}


/*
  node-capture (win32)
*/
var do_nodecapture = function () {
    console.log('\n\nLOAD node-capture\n\n');
    if (isWin) {
    }
};

do_pcap()
  .then(do_cap)
  .then(do_nodecapture);