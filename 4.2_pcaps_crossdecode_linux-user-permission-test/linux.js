// is this to check if the raw packet from one lib can be decoded
// by decoders from another lib.
//
// RESULTS:
//  `pcap` raw packets decoded by `cap`
//  `cap` raw packets decided by `pcap` when given tcp/udp/icmp filter

// will use live packets from wlan0 for cap
// using pcap_file for `pcap` lib
var pcap_file = "./http_2packets.pcap";



// Status: works:
// tested on Linux
// pcap offline session will not work on Windows due to inability to compile node_pcap on windows
var do_pcap = function () {
  return new Promise(function (resolve) {
    console.log('\n\nLOAD pcap\n\n');
    var pcap = require('pcap');

    var cap_decoders = require('cap').decoders;
    var PROTOCOL = cap_decoders.PROTOCOL;

    try {
      var pcap_session = pcap.createSession("wlan0");
    }
    catch (e) {
      console.error(e);
      console.log("\nConsider running as root or give yourself permission to monitor network interface:");
      console.log(`\nsudo setcap cap_net_raw,cap_net_admin=eip ${process.argv[0]}\n`);
      return resolve(true)
    }
    // var pcap_session = pcap.createOfflineSession(pcap_file)
    pcap_session.on('packet', function (pcap_packet) {
        pcap_decoded = pcap.decode.packet(pcap_packet);
        var cap_decoded = cap_decoders.Ethernet(pcap_packet.buf);
        if (cap_decoded.info.type === PROTOCOL.ETHERNET.IPV4)
            cap_decoded = cap_decoders.IPV4(pcap_packet.buf, cap_decoded.offset);
        pcap_session.close();
        
        console.log("\n\nPACKET (pcap):");
        console.log(pcap_packet);
        console.log("PACKET DECODED (cap):");
        console.log(cap_decoded);
    });
    pcap_session.on('complete', function () {
        console.log('\n\COMPLETED pcap\n\n');
        return resolve(true);
    });
  });
}


// Status: working?
//
// This `cap` raw packet/buffer to decoded `pcap` packet
// attempt places cap buffer into pcap compatible PacketWithHeader {buf:buffer header:empty link_type:empty}
// header appears to be a pcap specific header (not network related) with time and length
//
// STATUS:
// need to provide filter for it to work
// tested on linux

// var do_captopcap = function () {
//   return new Promise(function (resolve) {
//     console.log('\n\nLOAD cap\n\n');
//     var cap = require('cap');
//     var cap_session = new cap.Cap();
//     var cap_decoders = require('cap').decoders;
//     var PROTOCOL = cap_decoders.PROTOCOL;
//     // var pcap = require('pcap');
//     var pcap_decode = require('pcap/decode').decode; // works on winodws, and linux
//     var filter = "tcp or udp or icmp";

//     var buffer = Buffer.alloc(65535);
//     var linkType = cap_session.open("wlan0", filter, 10 * 1024 * 1024, buffer);
//     console.log('linkType',linkType)
//     cap_session.on('packet', function(nbytes, trunc) {
//         var cap_packet = buffer.slice(0, nbytes);
//         // Fake the libpcap header (time, len) as `cap` does not return it like `pcap` does
//         // and `pcap` expects it. If we wanted to do this for real we would need to build the
//         // export of the header ourselve
//         var hrtime = process.hrtime() // this is not real time. just some arbitrary timer in node that also provides nanoseconds 
//         var sec = hrtime[0]
//         var usec = parseInt(hrtime[0]*1e6+(hrtime[1]/1000))
//         var header = Buffer.allocUnsafe(16);
//         header.writeUInt32BE(sec, 0); // tv_sec
//         header.writeUInt32BE(0, 4); // tv_usec - face for now. get error whtn using `usec` val
//         header.writeUInt32BE(65535, 8); // caplen
//         header.writeUInt32BE(nbytes, 12); // len
              
//         var PacketWithHeader = { buf: buffer, 
//                                  header: header, 
//                                  link_type: 'LINKTYPE_'+linkType }
//         // shows: Buffer(60) [255, 255, 255, …]
//         // var cap_decoded = cap_decoders.Ethernet(buffer);
//         // if (cap_decoded.info.type === PROTOCOL.ETHERNET.IPV4)
//         //     cap_decoded = cap_decoders.IPV4(cap_packet, cap_decoded.offset);
//         pcap_decoded = pcap_decode.packet(PacketWithHeader);

//         cap_session.close();

//         console.log("\nPACKET (cap):");
//         console.log(cap_packet);
//         console.log("PACKET DECODED (pcap):");
//         console.log(pcap_decoded);
//         return resolve(true);
//     });
//   });
// }
/*
/home/user/work/counterpart/mitm_tests-git/4_pcaps_crossdecode/node_modules/pcap/decode/pcap_packet.js:16
this.tv_sec = raw_header.readUInt32LE(0, true);
*/


do_pcap()
// .then(do_captopcap())
// do_captopcap()
console.log('done')
