test if the raw_packet output from cap can be passed into the decoder of node_pcap and vis a vie

on windows node_pcap cannot be compiled. however only need js for decoding part. can copy repo into node_modules. then `var decoder = require('pcap/decoder')`. Trying to just require the pcap lib in full will also try to load the non-existing compiled libraries on windows.


