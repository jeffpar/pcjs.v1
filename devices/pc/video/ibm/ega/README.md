---
layout: page
title: IBM EGA ROM
permalink: /devices/pc/video/ibm/ega/
---

IBM EGA ROM
---

To (re)build the JSON-encoded IBM EGA ROM with symbols, run the following command:

	filedump --file=archive/ibm-ega.rom --format=bytes --decimal
	
The symbol information in the MAP file will be automatically converted and appended to the dump of the ROM file. 

The PCjs server's Dump API can be used as well:

	http://www.pcjs.org/api/v1/dump?file=http://archive.pcjs.org/devices/pc/video/ibm/ega/ibm-ega.rom&format=bytes&decimal=true
