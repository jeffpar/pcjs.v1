---
layout: page
title: Other OS/2 Disks
permalink: /disks/pc/os2/misc/
---

Other OS/2 Disks
---

### OS/2 1.0 Debugger Boot Disk

The [OS/2 1.0 Debugger Boot Disk](/disks/pc/os2/misc/1.0/debugger/) contains a version of OS/2 1.0 built on
October 12, 1988, which includes the built-in kernel debugger used by Microsoft and IBM for internal development.
For more details, see the "OS/2 1.0" [blog post](/blog/2014/12/04/).

Note that [IBM OS/2 1.0](/disks/pc/os2/ibm/1.0/) was finalized in October 1987, nearly a year before the timestamps
of these files, suggesting that this was a private build of IBM OS/2 1.0.  When this disk boots, it displays:

	IBM Operating System/2 Version 1.00
	(C) Copyright IBM Corp. 1981, 1987. All rights reserved.
	(C) Copyright Microsoft Corp. 1981, 1987.
	
	88286

The 5-digit number indicates the day the files were built.  The first 2 digits are the year (88) and the 3 remaining
digits are the day of the year (286 or October 12).

Aside from the fact that this version of IBMDOS.COM is much larger than the 1987 version (thanks to the inclusion of
the kernel debugger), most of the file sizes are identical.  But not all.  For example, the 1987 version of CLOCK01.SYS
is 2762 bytes, whereas this version is 2812 bytes.  So apparently a few changes were slipped into the 1.0 sources used
to build these binaries.

A directory listing of the disk is provided below.

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

### OS/2 FOOTBALL Boot Disk (v7.68.17)

The [OS/2 FOOTBALL Boot Disk (v7.68.17)](/disks/pc/os2/misc/football/debugger/) contains a prototype version of OS/2
from early 1987 that added preliminary support for the Intel 80386 processor, including limited support for 32-bit code
and the ability to run multiple DOS applications in V86-mode.  It was forked from pre-OS/2 1.0 sources, and the only
machine it supported was the Compaq DeskPro 386-16.

A directory listing of the disk is provided below.

	 Volume in drive A has no label
	 Directory of  A:\
	
	IBMBIO   COM    50689   2-27-87   3:49p
	IBMDOS   COM   216962   2-27-87   3:48p
	OSO001   MSG    40730   2-27-87  12:24p
	ANSICALL EXE     3165   2-27-87  11:34a
	BKSCALLS EXE     3611   2-27-87  11:51a
	BMSCALLS EXE     2064   2-27-87  11:55a
	BVSCALLS EXE    11710   2-27-87  12:02p
	DOSCALL1 EXE     7071   2-27-87  12:03p
	KBDCALLS EXE     4138   2-27-87  12:04p
	MONCALLS EXE     5655   2-27-87  12:09p
	MOUCALLS EXE     5177   2-27-87  12:16p
	QUECALLS EXE    11508   2-27-87  12:28p
	SESMGR   EXE    25744   2-27-87  12:41p
	SHELL    EXE     4096   2-27-87  12:43p
	VIOCALLS EXE     9833   2-27-87  12:47p
	CMD      EXE    47056  11-17-86   1:52p
	VT52     SYS     3205  10-27-86   3:57p
	IBMDOS   SYM    50692   2-27-87   3:48p
	COUNTRY  SYS     6175  11-03-86   8:32p
	MSG      EXE     5824  11-03-86   8:36p
	NLS      EXE     3124  11-03-86   8:37p
	SWAPPER  EXE     4150   2-25-87   8:04p
	EXEHDR   EXE    23242  10-17-86   2:24p
	COMMAND  COM    23724  10-27-86   3:57p
	CONFIG   SYS       90   2-27-87   4:14p
	POINTDD  SYS     4240  11-03-86   7:28p
	VDISK    SYS     4662  11-03-86   7:28p
	PGSWP32  EXE     7570   2-02-87  12:20p
	LIN      EXE     8084   2-12-87   3:00p
	MAIN     EXE    32482  11-14-86  12:44p
	CPGREP   EXE    25286  10-21-86   9:08p
		   31 File(s)    549888 bytes free
