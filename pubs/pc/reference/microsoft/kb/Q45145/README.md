---
layout: page
title: "Q45145: Installing C 5.10 to Compile Both DOS and OS/2 Programs"
permalink: /pubs/pc/reference/microsoft/kb/Q45145/
---

## Q45145: Installing C 5.10 to Compile Both DOS and OS/2 Programs

	Article: Q45145
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# G890523-18896
	Last Modified: 18-SEP-1989
	
	If you'd like to install your C compiler so that you can create both
	DOS and OS/2 applications, you have three options. The option you
	select affects the compiler options you must set when you compile for
	the two operating systems.
	
	The three options are as follows:
	
	1. Rename none of the libraries.
	
	2. Rename the protected-mode libraries to the default names.
	
	3. Rename the real-mode libraries to the default names. This
	   renaming can also be done while setting up the product.
	
	To install for both OS/2 and DOS, select both operating systems when
	using SETUP to install the product. If you've already installed the
	product for only one operating system, the easiest method is to
	reinstall again from the beginning.
	
	Once the dual installation is done, you have the following two sets of
	libraries (unless you tell SETUP to rename libraries for you when it
	asks):
	
	1. Those whose names are of the form xLIBCyR.LIB (where x is S, M, C,
	   or L for the memory model and y is E, 7, or A for the math option --
	   see the Version 5.10 "Microsoft C Optimizing Compiler for the MS-DOS
	   Operating System User's Guide" for more information) for "R"eal mode.
	
	2. Those whose names are of the form xLIBCyP.LIB for "P"rotected mode.
	
	If you install medium model emulator math only, and don't tell SETUP
	to rename libraries, the libraries will be named "MLIBCEP.LIB" and
	"MLIBCER.LIB". There will be no library named with the default name,
	which is "MLIBCE.LIB".
	
	You can leave the libraries named in this way; however, if you do, you
	must always compile with one of the /Lr (link real mode), /Lc (link
	compatibility mode -- a synonym for real mode), or /Lp (link protected
	mode) compiler options.
	
	None of the /Lp, /Lc, or /Lp options affects the compilation process;
	they only affect what libraries the linker is asked to link in.
	Whether the final executable program is a real-mode executable or a
	protected-mode executable is determined solely by the library with
	which you link.
	
	The /Lp option tells the linker to ignore the default library and to
	use xLIBCyP.LIB instead (x and y depend on the memory model and math
	option selected by the /Ax and /FP switches). The /Lr and /Lc options
	tell the linker to use xLIBCyR.LIB rather than the default. xLIBCy is
	the library generated if none of these options is used. This is shown
	in the following table:
	
	   Compiler Flags                          Library Used
	   --------------                          ------------
	
	      -AS                                     SLIBCE
	      -AL -FPi87                              LLIBC7
	      -AM -FPa -Lp                            MLIBCAP
	      -AH -FPc -Lr                            LLIBCER
	
	If you do most of your programming for one operating system or the
	other, you can rename the appropriate libraries (xLIBCyR or xLIBCyP)
	to xLIBCy and avoid having to use /Lp or /Lr. You still must use /Lp
	or /Lr when compiling for the other mode. For instance, if you rename
	the xLIBCyP libraries to xLIBCy, then when you compile without a /Lc
	or /Lr option, your executable will be a protected-mode executable.
	To generate a DOS executable, you must use /Lr or /Lc. Instead, if you
	rename the xLIBCyR libraries to xLIBCy, the default mode will be DOS
	-- you must use /Lp to produce an OS/2 program.
