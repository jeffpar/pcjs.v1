---
layout: page
title: Norton Utilities 2.01
permalink: /disks/pcx86/tools/other/norton/2.01/
machines:
  - id: ibm5160
    type: pcx86
    config: /devices/pcx86/machine/5160/cga/512kb/machine.xml
    drives: '[{name:"PC-DOS 2.00 w/Tools (10Mb)",type:3,path:"/disks-demo/pcx86/drives/10mb/PCDOS200-C400.json"},{name:"MS-DOS 1.x/2.x Source (10Mb)",type:3,path:"/disks-demo/pcx86/dos/microsoft/2.00/MSDOS-SRC.json"}]'
    autoMount:
      A:
        name: None
      B:
        name: "Norton Utilities 2.01 (Side A)"
    autoStart: true
    autoType: $date\r$time\rB:\rDIR\r
---

Norton Utilities 2.01
---------------------

Like [Norton Utilities 2.00](../2.00/), version 2.01 was distributed as two single-sided 160K disks on a single "flippy"
diskette, which we have preserved as two separate disk images.  Unfortunately, the original diskette contains two unreadable
sectors (sectors 3 and 7 on track 4 of side B).  Those sectors affect the contents of `HU.COM` at offsets 0x3600 and 0x3e00,
and as a result, attempting to run that program will crash the machine.

Directory listings of [Side A](#directory-of-norton-utilities-201-side-a) and
[Side B](#directory-of-norton-utilities-201-side-b) are provided below.

{% include machine.html id="ibm5160" %}

### Directory of Norton Utilities 2.01 (Side A)

	 Volume in drive A is NU-2.01, #1
	 Directory of A:\

	DISKLOOK BAT       384 11-03-83   2:01p
	BATHIDE  COM      7752 11-03-83   2:01p
	BEEP     COM       154 11-03-83   2:01p
	BLOAD    COM     17859 11-03-83   2:01p
	CLEAR    COM       139 11-03-83   2:01p
	CLS      COM       139 11-03-83   2:01p
	DISKOPT  COM      6615 11-03-83   2:01p
	DL       COM     33344 11-03-83   2:01p
	FH       COM     14612 11-03-83   2:01p
	FILEFIX  COM      7581 11-03-83   2:01p
	FILESORT COM      7207 11-03-83   2:01p
	HL       COM     36212 11-03-83   2:01p
	HM       COM     22138 11-03-83   2:01p
	       13 file(s)     154136 bytes
	                        2560 bytes free

### Directory of Norton Utilities 2.01 (Side B)

	 Volume in drive A is NU-2.01, #2
	 Directory of A:\

	HU       COM     28030 11-03-83   2:01p
	LABEL    COM      8307 11-03-83   2:01p
	LPRINT   COM     24405 11-03-83   2:01p
	REVERSE  COM      1441 11-03-83   2:01p
	SCRATR   COM      3570 11-03-83   2:01p
	SM       COM     19792 11-03-83   2:01p
	SSAR     COM     24542 11-03-83   2:01p
	TIMEMARK COM      3819 11-03-83   2:01p
	UE       COM     26749 11-04-83   2:01p
	        9 file(s)     140655 bytes
	                       17920 bytes free

### Diskette Scans

![Norton Utilities 2.01 (Side A)]({{ site.demo-disks.baseurl }}/pcx86/tools/other/norton/2.01/NU201-SIDEA.jpg)

![Norton Utilities 2.01 (Side B)]({{ site.demo-disks.baseurl }}/pcx86/tools/other/norton/2.01/NU201-SIDEB.jpg)
