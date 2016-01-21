---
layout: page
title: "OS/2 FOOTBALL Boot Disk (v7.68.17)"
permalink: /disks/pc/os2/misc/football/87058/
machines:
  - id: deskpro386
    type: pc-dbg
    config: /devices/pc/machine/compaq/deskpro386/ega/2048kb/machine.xml
    automount:
      A:
        name: OS/2 FOOTBALL Boot Disk (v7.68.17)
        path: /disks/pc/os2/misc/football/FOOTBALL-76817.json
---

OS/2 FOOTBALL Boot Disk (v7.68.17)
---

This disk contains a prototype version of OS/2 from February 1987, code-named **FOOTBALL** (aka **PIGSKIN**).
It predates the completion of OS/2 1.0 by some eight months.

On boot, the following message is displayed on-screen:

	CP-DOS version 1.0
	Copyright 1986,1987  Microsoft Corp.
	
	PIGSKIN Internal revision 7.68.17, 87/02/26

This prototype was designed to test two important new features of the Intel 80386 processor: paging and V86-mode.

Most of the work on this prototype occurred between December 1, 1986 and February 28, 1987, with the principal goal
of demonstrating multiple DOS applications running in V86-mode to BillG; that demo probably occurred in March 1987.
However, another underlying goal was to demonstrate to IBM that Microsoft was ahead of the curve on 32-bit design
considerations for OS/2.  Up to this point, all OS/2 design and development work had been 16-bit, since the
dominant state-of-the-art Intel CPU at the time was the 80286.

The FOOTBALL prototype was based on pre-1.0 OS/2 sources, and the only hardware it supported was the Compaq DeskPro
386-16.  The source code was later sent to IBM, who in early April 1987 was adapting it to run on the Model 80 PS/2.
 
After OS/2 1.0 was finished in October 1987, FOOTBALL changes were merged into a fresh set of 1.0 sources, which
initially was version 1.3 (also known as **PIGSKIN** and later **CRUISER**) but ultimately became version 2.0.

A directory listing of this disk is provided [below](#directory-of-os2-football-boot-disk-v76817).

Booting FOOTBALL
---

{% include machine.html id="deskpro386" %}

When booting on a [Compaq DeskPro 386-16 with 2Mb of RAM](/devices/pc/machine/compaq/deskpro386/ega/2048kb/),
the following information is output to COM2 by the kernel's built-in debugger:

	bx=001d, cx=f905, dx=0700, cs=1770, ds=1b10
	NoHighMem=0000
	BIOS is new EXE file
	seg loadseg srcseg  seg/sel    reladdr     psize/vsize     delta
	 1:   1090   1090  0100/0100  00002345  00001345/00001346  00000000
	 2:   11d0   11d0  0300/0300  000088d3  000058d3/000058e0  00000000
	 3:   1770   1770  0900/0900  0000c922  00003922/00003922  00000000
	 4:   1b10   1b10  0d00/0d00  0000ec01  00001c01/000025e0  00000000
	devlist=0100:1327, 3xdevlist=0300:0504, buffers=0003, orgfinalseg=083c
	dosloadseg=1800, finalseg=0900, mem=640k/1024k, defdrive=0001
	Driver='SCREEN$ ' link=0100:0e26,attr=8082,strat=4be6,intr=004e,ds/cs=0100/0300
	Driver='KBD$    ' link=0100:0e86,attr=c881,strat=3108,intr=28aa,ds/cs=0100/0300
	Driver='PRN     ' link=0100:0000,attr=8880,strat=4542,intr=0000,ds/cs=0100/0300
	Driver='CLOCK$  ' link=0100:0108,attr=8088,strat=004f,intr=004e,ds/cs=0100/0300
	Driver='# devs=4' link=0100:0ea0,attr=2080,strat=0e9e,intr=004e,ds/cs=0100/0300
	Driver='LPT1    ' link=0100:0eba,attr=8880,strat=4542,intr=0000,ds/cs=0100/0300
	Driver='LPT2    ' link=0100:0ed4,attr=8880,strat=454b,intr=0000,ds/cs=0100/0300
	Driver='LPT3    ' link=ffff:ffff,attr=8880,strat=4554,intr=0000,ds/cs=0100/0300
	about to transfer to 9c00:$ (new ds/ss=9900) ...done
	DOS is new EXE file
	seg loadseg srcseg  seg/sel    reladdr     psize/vsize     delta
	 1:   1820   1820  0900/0900  0000fbc9  00006bc9/00006bc9  00000000
	 2:   1f20   1f20  1000/1000  0001610f  0000610f/00006709  00000000
	 3:   2560   2560  1700/0108  0001b973  00004973/00004973  00000000
	 4:   2a00   2a00  1c00/0110  0001f7fe  000037fe/000037fe  00000000
	 5:   2d80   2d80  2000/0118  00020d1e  00000d1e/00000d38  00000000
	 6:   2e60   2e60  2100/0120  00021054  00000054/00000054  00000000
	 7:   2e80   2e80  2200/0128  000242c8  000022c8/000022c8  00000000
	 8:   3100   3100  2500/0130  000258b4  000008b4/000008b4  00000000
	 9:   31a0   31a0  2600/0138  000288dc  000028dc/0000dc62  00000000
	10:   0000   0000  3400/0140  00000000  00000000/0000900c  00000000
	11:   3480   3e00  3e00/0148  00048109  0000a109/0000a109  00009800
	12:   3ee0   4900  4900/0150  000529f8  000099f8/000099f8  0000a200
	13:   4900   5320  5300/0158  00056ee8  00003ee8/00003ee8  0000a200
	DosInit=2200:010a
	System Debugger 11/20/86 - Processor is: 386
	AX=01000900  BX=00000148  CX=00000150  DX=00000120  SI=00000158  DI=00001436
	IP=00000483  SP=0000200A  BP=00000000  CR2=00000000  CR3=00000  IOPL=3  F=-- --
	CS=0128  SS=0048  DS=0138  ES=1000  FS=0000  GS=0000 -- NV UP DI PL NZ AC PE NC
	0128:0483 C3             RET
	#

After typing "g" into the kernel debugger, the on-screen boot message is displayed.

Under PCjs, the kernel crashes shortly thereafter.  This issue is still under investigation.

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
