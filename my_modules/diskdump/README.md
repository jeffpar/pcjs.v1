DiskDump
===
Module (and command-line utility) for converting disk images to/from various formats (eg, JSON,
commented JSON, and IMG files). 

Building images from folders/files
---
I finally ported the code in [convdisk.php](/bin/convdisk.php) that creates disk images
from the contents of local files/folders, which you can now access via the *diskdump* API.

For example:

	http://www.pcjs.org/api/v1/dump?path=/apps/pc/1981/visicalc/bin/vc.com;../README.md&format=json
	
would be equivalent to the older PHP script operation:

	http://jsmachines.net/bin/convdisk.php?file=/apps/pc/1981/visicalc/bin/vc.com&format=json&download=true
 
These commands produce a "disk.json", a copy of which is stored at [/apps/pc/1981/visicalc](/apps/pc/1981/visicalc/).