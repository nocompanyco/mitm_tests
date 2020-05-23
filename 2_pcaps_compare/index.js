// use this to compare packet object structures between different libs 
// get one packet with each lib and close 

// TODO: code node-capture (windows)
// TODO: test windows node-capture and cap on windows


var isWin = (process.platform === 'win32')
var isLinux = (process.platform === 'linux')
var isOSX = (process.platform === 'darwin')


if (isWin) {
    var capture = require('node-capture');
}

if (isLinux || isDarwin) {
    var pcap = require('pcap');
    
    var pcap_packet, pcap_decoded;
    pcap_session = pcap.createSession("wlan0");
    pcap_session.on('packet', function (raw_packet) {
        pcap_packet = raw_packet;
        // shows: PacketWithHeader {buf: Buffer(65535), header: Buffer(16), link_type: "LINKTYPE_ETHERNET"}
        pcap_decoded = pcap.decode.packet(pcap_packet);
        pcap_session.close();
        
        console.log("\nPACKET (pcap):");
        console.log(pcap_packet);
        console.log("PACKET DECODED:");
        console.log(pcap_decoded);
    });
}

if (isWin || isLinx || isOSX) {
    var cap = require('cap');
    var cap_session = new cap.Cap();

    var cap_packet, cap_decoded;
    // var filter = 'tcp and dst port 80';
    var buffer = Buffer.alloc(65535);
    var linkType = cap_session.open("wlan0", "", 10 * 1024 * 1024, buffer);
    cap_session.on('packet', function(nbytes, trunc) {
        cap_packet = buffer.slice(0, nbytes);
        // shows: Buffer(60) [255, 255, 255, …]
        var ret = decoders.Ethernet(buffer);
        if (ret.info.type === PROTOCOL.ETHERNET.IPV4)
            cap_decoded = decoders.IPV4(cap_packet, ret.offset);
        cap_session.close();

        console.log("\nPACKET (pcap):");
        console.log(cap_packet);
        console.log("PACKET DECODED:");
        console.log(cap_decoded);
    });
}


    
console.log('Press e key to exit');
// var stdin = process.openStdin();
// stdin.resume();
// stdin.setEncoding('utf8');
// stdin.on('data', function (data) {
//     if (data === 'e')
//         process.exit.bind(process, 0)
// });
// process.stdin.on('data', process.exit.bind(process, 0));

while (true) { continue; }
console.log('done')
