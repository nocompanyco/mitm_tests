Results

* linux.js: setcap on node bin is sufficient to then allow user to access network interface
* linux_electron.js: setcap on electron but will then fail to find its libs. LD_LIBRARY_PATH is not workaround. Have to add the ./node_modules/electron/dist to ld.so.conf

* mac: we assume CHFmod is sufficient as we have found this already to work

* windows: when npcap or wincap is installed there is an option to only allow admin users to access network card. Once this is turned off it should work without user permission changes. In future though we may need to find a way to allow users to run app with admin permissions