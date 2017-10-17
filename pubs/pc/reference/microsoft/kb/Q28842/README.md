---
layout: page
title: "Q28842: EXE Size Using BCOM4x.LIB (Stand Alone) Versus BRUN4x.LIB"
permalink: /pubs/pc/reference/microsoft/kb/Q28842/
---

## Q28842: EXE Size Using BCOM4x.LIB (Stand Alone) Versus BRUN4x.LIB

	Article: Q28842
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 30-JUN-1989
	
	A compiled BASIC executable (.EXE) file compiled with the BRUN (i.e.,
	BRUN4x.EXE) option is much smaller on disk than an .EXE compiled with
	the BCOM option (i.e., compiled BC /O, or with the Stand-Alone option
	when using the Make EXE File... option from the QB.EXE editor's Run
	menu). This information applies to Microsoft QuickBASIC Versions 4.00,
	4.00b, and 4.50 and to Microsoft BASIC Compiler Versions 6.00 and
	6.00b.
	
	This occurs because a stand-alone .EXE file contains all the
	QuickBASIC language run-time support routines required by that
	program, whereas a non-stand-alone .EXE calls the run-time support
	from BRUN4x.EXE, a large separate file loaded into memory at run time.
	
	The decision to compile with BRUN or BCOM (stand-alone) involves the
	following trade-offs between disk space and speed:
	
	1. If you keep more than two or three compiled .EXE programs on a
	   disk, you can save disk space by compiling with the BRUN option.
	   (Please see the one-line example below.)
	
	2. If you want your program to run as quickly as possible, you should
	   compile with the stand-alone (BCOM) option, which uses BCOM4x.LIB
	   at compile time.
	
	If you must pass variables in COMMON between CHAINed programs, then
	you always must compile with the BRUN4x.EXE option.
	
	Note that this article only discusses the impact upon disk space
	usage, and not the impact on run-time memory usage. The .EXE load size
	in memory is usually larger than the .EXE file size on disk. The best
	way to determine run-time memory usage is by invoking the FRE(-1) and
	FRE("") functions at run time.
	
	In QuickBASIC you may create executable files with either the BRUN
	option or the BCOM option. Page 152 of the "Microsoft QuickBASIC 4.0:
	Learning and Using" manual gives a good comparison of run-time module
	programs (those compiled with BRUN) versus stand-alone programs (those
	compiled with BCOM).
	
	BRUN Option
	-----------
	
	The BRUN4x.EXE module, also loosely referred to as the "BRUN" module,
	has the following actual names, depending upon the version number:
	
	   BRUN40.EXE for QuickBASIC Version 4.00
	   BRUN41.EXE for QuickBASIC Version 4.00b
	   BRUN45.EXE for QuickBASIC Version 4.50
	
	(The names are different for Microsoft BASIC Compiler 6.00 and 6.00b.)
	
	Programs compiled with the BRUN option need to load and access the
	run-time module BRUN4x.EXE at run time. BRUN4x.EXE contains code
	needed to implement the BASIC language.
	
	There are two methods to compile with the BRUN option: with the "EXE
	Requiring BRUN4x.EXE" option from QB.EXE's Make EXE File... item in
	the Run menu, or with BC.EXE with no /O switch.
	
	When compiled with BRUN, the EXE file size is smaller than when it is
	compiled with the BCOM option. To run that program, you must have the
	file BRUN4x.EXE present. Therefore, when a developer distributes his
	or her programs, both the .EXE application and BRUN4x.EXE must be
	placed on the distribution disk. In the case of the BCOM (stand-alone)
	version, only the application program's EXE file need be distributed.
	
	BCOM Option
	-----------
	
	There are two methods to compile with the "BCOM" option: with the
	"Stand-Alone EXE File" option from the QB.EXE's Make EXE File...
	item in the Run menu, or with BC.EXE with the /O switch.
	
	Modules compiled with the BCOM option do not require access to the
	run-time module BRUN4x.EXE because the support routines (contained in
	BCOM4x.LIB) are included at LINK time in the program's executable
	(.EXE) file.
	
	Any individual program compiled with the stand-alone (BCOM) option
	will have a larger EXE file size than when compiled with BRUN. All the
	run-time support needed by that program actually is a part of the
	executable file; it truly is a stand-alone program.
	
	One-Line Example of BCOM versus BRUN Disk Usage
	-----------------------------------------------
	
	In the specific case of a one-line program containing PRINT "Hello",
	the EXE size is 23,121 bytes when compiled with the BCOM (BC /O)
	option in QuickBASIC Version 4.00. (Other versions may differ.)
	
	When compiled with BRUN, the EXE size is 2979 bytes, but you must also
	consider the size of BRUN40.EXE (76,816 bytes). The combined size of
	the two files for the BRUN version is 79,795 bytes, which is
	considerably larger than that of the BCOM version. Three of these
	one-line programs compiled with BCOM would take less space on disk
	than the same program compiled with BRUN plus the BRUN40.EXE module.
	The relative file sizes will differ for larger programs.
	
	Disk Space Usage When CHAINing
	------------------------------
	
	Developing a system of about three or four or more .EXE programs that
	CHAIN to each other can consume more disk space compiled with BCOM
	than compiled with BRUN. This is because each program compiled with
	BCOM has a copy of the run-time module attached, and the duplicate
	information uses up disk space.
	
	In contrast, all programs compiled with BRUN share only one copy of
	the run-time module (in BRUN4x.EXE). Therefore, the combined size on
	disk for four or more EXE files together usually is smaller when
	compiled with BRUN. Note that for one, two, or three small programs,
	the system may be smaller on disk when compiled with BCOM. All you
	need to do is compile with BCOM and BRUN and compare sizes.
	
	The only time you must compile with BRUN rather than BCOM is in the
	case of preserving COMMON variables across a CHAIN. CHAINed programs
	can share COMMON variables only if the two programs are compiled with
	BRUN. The COMMON portion of the run-time module remains resident in
	memory across the CHAIN.
	
	The BCOM run-time module is replaced in memory when CHAINing between
	BCOM programs, and no COMMON can be passed. The CHAIN and RUN
	statements behave identically in programs compiled with BCOM.
