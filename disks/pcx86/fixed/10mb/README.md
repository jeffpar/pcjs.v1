---
layout: page
title: 10Mb Hard Drive (Fixed Disk) Images
permalink: /disks/pcx86/fixed/10mb/
redirect_from:
  - /disks/pc/fixed/10mb/
---

10Mb Hard Drive (Fixed Disk) Images
---

This folder contains the following 10Mb disk images:
 
* PC-DOS 2.00 with Windows 1.01 for CGA ([PCDOS200-WIN101-CGA](pcdos200-win101-cga.xml))
* PC-DOS 2.00 with Windows 1.01 for EGA ([PCDOS200-WIN101-EGA](pcdos200-win101-ega.xml))

These disk images are used by various [Model 5160](/devices/pcx86/machine/5160/) machine configurations.

To use one of these disks with another machine configuration, include:

```xml
<hdc id="hdcXT" drives='[{name:"10Mb Hard Drive",path:"/disks/pcx86/fixed/10mb/PCDOS200-WIN101-CGA.json",type:3}]'/>
```

in the *machine.xml* file.  Alternatively, you can include it by reference:

```xml
<hdc ref="/disks/pcx86/fixed/10mb/pcdos200-win101-cga.xml"/>
```

Of course, if your machine configuration file is on a different server, the *ref* path will likely be different.
