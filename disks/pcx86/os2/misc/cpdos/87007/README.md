---
layout: page
title: OS/2 SIZZLE Boot Disk (v7.68.18)
permalink: /disks/pcx86/os2/misc/cpdos/87007/
redirect_from:
  - /disks/pc/os2/misc/cpdos/87007/
machines:
  - id: ibm5170
    type: pcx86
    debugger: true
    config: /devices/pcx86/machine/5170/ega/1152kb/rev3/debugger/machine.xml
    autoMount:
      A:
        path: /disks/pcx86/os2/misc/cpdos/SIZZLE-76818-19870107.json
---

OS/2 SIZZLE Boot Disk (v7.68.18)
---

This disk contained a pre-1.0 version of OS/2 built on January 7, 1987, which was based on an interim
source code fork known as **SIZZLE**, the code-name for a collection of changes intended to improve overall
OS/2 performance.

Work on **SIZZLE** started around November 1986, and an internal specification known as
"The London Performance Spec" drove some of that work, but at this point, not much is known about either the
contents of that specification or any of the **SIZZLE** changes.

When this disk boots, the following version banner is displayed:

	CP-DOS version 1.0
	Copyright 1986 IBM Corp.
	
	SIZZLE Internal revision 7.68.18, 86/12/12

A directory listing of this disk is provided [below](#directory-of-os2-sizzle-boot-disk-v76818).

{% include machine.html id="ibm5170" %}

### Directory of OS/2 SIZZLE Boot Disk (v7.68.18)

	 Volume in drive A has no label
	
	Directory of A:\
	
	IBMBIO   COM     49408 01-07-87  12:18p
	IBMDOS   COM    172881 01-07-87  11:45a
	OSO001   MSG     40730 01-07-87   1:41p
	CMD      EXE     47056 10-22-86   7:41p
	COMMAND  COM     23724 10-22-86   7:41p
	COUNTRY  SYS      6175 10-22-86   7:57p
	MSG      EXE      5824 10-22-86   7:58p
	NLS      EXE      3124 10-23-86   8:38a
	SWAPPER  EXE      4150 10-22-86   8:04p
	ANSICALL EXE      3165 01-07-87  12:19p
	BKSCALLS EXE      3611 01-07-87  12:21p
	BMSCALLS EXE      2064 01-07-87  12:23p
	BVSCALLS EXE     11710 01-07-87  12:30p
	DOSCALL1 EXE      7071 01-07-87  12:33p
	KBDCALLS EXE      4138 01-07-87  12:34p
	MONCALLS EXE      5655 01-07-87  12:35p
	MOUCALLS EXE      5177 01-07-87  12:36p
	QUECALLS EXE     11508 01-07-87   1:03p
	SESMGR   EXE     25744 01-07-87   1:41p
	SHELL    EXE      4096 01-07-87   1:43p
	VIOCALLS EXE      9833 01-07-87   1:10p
	COM      SYS     12342 10-22-86  10:11p
	COM      MSG       144 10-22-86  10:39a
	EXTDSKDD EXE      1885 10-22-86   7:31p
	MOUSE00  SYS     12342 10-22-86   7:31p
	MOUSE01  SYS     12342 10-22-86   7:32p
	MOUSE02  SYS     12342 10-22-86   7:32p
	MOUSE03  SYS     12854 10-22-86   7:31p
	POINTDD  SYS      4240 10-22-86   7:32p
	VDISK    SYS      4662 10-22-86   7:33p
	OSO001H  MSG     82177 01-07-87   1:40p
	IBMBIO   MAP     14290 01-07-87  12:18p
	IBMDOS   MAP     75444 01-07-87  11:45a
	CONFIG   SYS       138 01-05-87   3:42p
	DOS3TOOL     <DIR>     01-07-87   2:21p
	TEMP     BAT        13 01-10-87   4:41p
	       36 file(s)     692059 bytes
	
	Directory of A:\DOS3TOOL
	
	.            <DIR>     01-07-87   2:21p
	..           <DIR>     01-07-87   2:21p
	MSC      EXE     29428 02-10-86  10:12a
	CL       EXE     27655 12-07-86   3:49p
	P1       EXE    130969 12-07-86   3:49p
	P2       EXE    116077 12-07-86   3:49p
	P3       EXE    115357 12-07-86   3:49p
	        7 file(s)     419486 bytes
	
	Total files listed:
	       43 file(s)    1111545 bytes
	                       88576 bytes free

[Return to [OS/2 Prototype Disks](/disks/pcx86/os2/misc/)]
