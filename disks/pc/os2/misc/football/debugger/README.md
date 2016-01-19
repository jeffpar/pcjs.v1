---
layout: page
title: "OS/2 FOOTBALL Boot Disk (v7.68.17)"
permalink: /disks/pc/os2/misc/football/debugger/
machines:
  - id: deskpro386
    type: pc-dbg
    config: /devices/pc/machine/compaq/deskpro386/ega/2048kb/machine.xml
    automount:
      A:
        name: OS/2 FOOTBALL Boot Disk (v7.68.17)
        path: /disks/pc/os2/misc/football/debugger/FOOTBALL-7.68.17.json
---

OS/2 FOOTBALL Boot Disk (v7.68.17)
---

This disk contains a prototype version of OS/2 from early 1987 (code-named FOOTBALL) that was designed to test new
features of the Intel 80386 processor (eg, paging and V86-mode).  Most of the work on this prototype occurred between
December 1, 1986 and February 28, 1987, with the principal goal of demonstrating multiple DOS applications running
in V86-mode to BillG (the demo probably occurred in March 1987), but also with the underlying goal of demonstrating
to IBM that Microsoft was ahead of the curve on 32-bit design considerations for OS/2.

The FOOTBALL prototype was forked from pre-1.0 OS/2 sources, and the only hardware it supported was the Compaq DeskPro
386-16.  The source code was later sent to IBM, and as of April 1987, they were adapting it to run on the Model 80 PS/2.
No versions of FOOTBALL were ever released outside of Microsoft and IBM.
 
Although FOOTBALL contained features not found in OS/2 until version 2.0, there is no direct connection between this
internal Microsoft effort and OS/2 2.0.  Some of the 32-bit support and paging work undoubtedly migrated to version 2.0
eventually, but that would have happened much later, since work on OS/2 2.0 did not begin in earnest until October 1987,
after 1.0 was finished.

A directory listing of this disk is provided [below](#directory-of-os2-football-boot-disk-v76817).

{% include machine.html id="deskpro386" %}

### Directory of OS/2 FOOTBALL Boot Disk (v7.68.17)

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

Return to [Other OS/2 Disks](/disks/pc/os2/misc/).
