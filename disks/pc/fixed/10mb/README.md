10Mb Disk Image with Windows 1.01
---
This folder contains a 10Mb hard disk image ([pcdos200-win101.json](pcdos200-win101.json)) with a Windows 1.01 installation.

This disk image is used by various [Model 5160 CGA](/devices/pc/machine/5160/cga/) machine configurations.

To use it with a machine configuration, include:

	<hdc id="hdcXT" drives='[{name:"10Mb Hard Disk",path:"/disks/pc/fixed/10mb/pcdos200-win101.json",type:3}]'/>
	
in your machine.xml file.  Alternatively, you can include it by reference:

	<hdc ref="/disks/pc/fixed/win101.xml"/>

Of course, if your machine configuration file is on a different server, the *ref* path will likely be different.
