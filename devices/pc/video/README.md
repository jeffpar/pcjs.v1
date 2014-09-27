Video ROMs
---

To (re)build the JSON-encoded EGA ROM with symbols, run the following command:

	filedump --file=ibm-ega.rom --format=bytes --decimal
	
The symbol information in the MAP file will be automatically converted and appended to the dump of the ROM file. 

The PCjs server's [Dump API](http://www.pcjs.org/api/v1/dump?file=/devices/pc/video/ibm-ega.rom&format=bytes&decimal=true) can be used as well:

	http://www.pcjs.org/api/v1/dump?file=/devices/pc/video/ibm-ega.rom&format=bytes&decimal=true
