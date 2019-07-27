---
layout: page
title: Microsoft QuickBASIC 2.00
permalink: /disks/pcx86/tools/microsoft/basic/quickbasic/2.00/
machines:
  - id: ibm5160-msdos320
    type: pcx86
    config: /devices/pcx86/machine/5160/ega/512kb/machine.xml
    drives: '[{name:"10Mb Hard Disk",type:3,path:"/disks-demo/pcx86/drives/10mb/MSDOS320-C400.json"}]'
    floppyDrives: '[{boot:false},{}]'
    autoMount:
      A:
        name: MS QuickBASIC 2.00 (Disk 1)
      B:
        name: MS QuickBASIC 2.00 (Personal)
---

Microsoft QuickBASIC 2.00
-------------------------

The [MS QuickBASIC 2.00 (Disk 1)](#directory-of-ms-quickbasic-200-disk-1) was acquired by PCjs and appears
to be an original distribution disk; unfortunately, Disk 2 was not included.

The [MS QuickBASIC 2.00 (Personal)](#directory-of-ms-quickbasic-200-personal) disk is from the
[PCjs Personal Disk Collection](/disks/pcx86/personal/) and is not an original distribution disk; however, it
contains an identical `QB.EXE` and presumably a corresponding `BCOM20.LIB`.

{% include machine.html id="ibm5160-msdos320" %}

### Directory of MS QuickBASIC 2.00 (Disk 1)

	 Volume in drive A has no label
	 Directory of A:\

	BUG      BAS       397 02-17-86   3:34p
	CALLSHAP BAS       133 04-25-86  10:00a
	DEMO     BAS       211 06-10-86   9:47a
	EX       BAS       182 04-25-86  10:01a
	PPRINT   BAS     22941 06-17-86   8:53a
	QB       EXE    186256 06-16-86   2:47p
	README   DOC     15580 06-19-86   4:26p
	REMLINE  BAS     12913 06-19-86   7:12a
	SQUARE   BAS       164 04-25-86  10:02a
	TRIANGLE BAS       250 04-25-86  10:03a
	UPDATE   DOC      6545 06-03-86   2:05p
	USERLIB  ASM     17439 05-27-86   8:09a
	       12 file(s)     263011 bytes
	                       91136 bytes free

### Directory of MS QuickBASIC 2.00 (Personal)

	 Volume in drive A is QUICKBAS2JP
	 Directory of  A:\

	QB       EXE   186256   6-16-86   2:47p
	BCOM20   LIB   176128   6-13-86  10:55a
	        2 File(s)         0 bytes free

---

![MS QuickBASIC 2.00 (Disk 1)]({{ site.demo-disks.baseurl }}/pcx86/tools/microsoft/basic/quickbasic/2.00/QUICKBAS200-DISK1.png)
