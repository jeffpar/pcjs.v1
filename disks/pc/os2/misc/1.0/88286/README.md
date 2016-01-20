---
layout: page
title: OS/2 1.0 Debugger Boot Disk
permalink: /disks/pc/os2/misc/1.0/88286/
machines:
  - id: ibm5170
    type: pc-dbg
    config: /devices/pc/machine/5170/ega/1152kb/rev3/machine.xml
    automount:
      A:
        name: OS/2 1.0 Debugger Boot Disk
        path: /disks/pc/os2/misc/1.0/OS210-88286.json
redirect_from:
  - /disks/pc/os2/misc/1.0/debugger/
---

OS/2 1.0 Debugger Boot Disk
---

This disk contains a version of OS/2 1.0 built on October 12, 1988, which included the built-in kernel debugger
used by Microsoft and IBM for internal development, along with a rudimentary program selector.

Note that [IBM OS/2 1.0](/disks/pc/os2/ibm/1.0/) was finalized in October 1987, nearly a year before the timestamps
of these files, indicating that this was a private build of IBM OS/2 1.0.  When this disk boots, the following message
is displayed on-screen:

	IBM Operating System/2 Version 1.00
	(C) Copyright IBM Corp. 1981, 1987. All rights reserved.
	(C) Copyright Microsoft Corp. 1981, 1987.
	
	88286

The 5-digit number indicates the day the files were built.  The first 2 digits are the year (88) and the 3 remaining
digits are the day of the year (286 or October 12).

A directory listing of this disk is provided [below](#directory-of-os2-10-debugger-boot-disk).

{% include machine.html id="ibm5170" %}

### Directory of OS/2 1.0 Debugger Boot Disk

Aside from the fact that the IBMDOS.COM on this disk is much larger than the 1987 version (thanks to the inclusion of
the kernel debugger), most of the other file sizes are identical.  But not all.  For example, the 1987 version of
CLOCK01.SYS is 2762 bytes, whereas this version is 2812 bytes.  So apparently a few changes were slipped into the 1.0
sources used to build these binaries.

	IBMBIO   COM      4096 10-12-88  12:32p
	IBMDOS   COM    299143 10-12-88  10:53a
	IBMDOS   SYM     62788 10-12-88  10:54a
	OSO001   MSG     64808 10-12-88  10:07a
	CMD      EXE     57648 10-12-88  12:52p
	COMMAND  COM     25564 10-12-88  12:54p
	COUNTRY  SYS     14632 10-12-88   1:14p
	MSG      DLL      6578 10-12-88   1:17p
	NLS      DLL      5162 10-12-88   1:18p
	SWAPPER  EXE      4150 10-12-88   1:43p
	ANSICALL DLL      3637 10-12-88  10:07a
	BKSCALLS DLL      5704 10-12-88  10:09a
	BMSCALLS DLL      2576 10-12-88  10:56a
	BVSCALLS DLL     31744 10-12-88  11:01a
	DOSCALL1 DLL      8709 10-12-88  10:56a
	KBDCALLS DLL      7232 10-12-88  11:03a
	MONCALLS DLL      7351 10-12-88  11:03a
	MOUCALLS DLL      5701 10-12-88  11:04a
	QUECALLS DLL     11238 10-12-88  11:05a
	SESMGR   DLL     24278 10-12-88  11:14a
	SHELL    EXE     11744 10-12-88  11:15a
	VIOCALLS DLL     13981 10-12-88  11:18a
	CLOCK01  SYS      2812 10-12-88  11:18a
	DISK01   SYS     18616 10-12-88  11:22a
	EGA      SYS      2110 10-12-88  11:24a
	KBD01    SYS     16945 10-12-88  11:28a
	PRINT01  SYS      7683 10-12-88  12:09p
	SCREEN01 SYS      1583 10-12-88  12:11p
	COM01    SYS      8758 10-12-88  11:19a
	EXTDSKDD SYS      1877 10-12-88  11:24a
	POINTDD  SYS      5886 10-12-88  12:08p
	VDISK    SYS      4662 10-12-88  12:12p
	HARDERR  EXE     16288 10-12-88  11:14a
	CONFIG   SYS       101 12-04-14   7:45p
	       34 file(s)     765785 bytes
	                      437760 bytes free

Return to [Other OS/2 Disks](/disks/pc/os2/misc/).
