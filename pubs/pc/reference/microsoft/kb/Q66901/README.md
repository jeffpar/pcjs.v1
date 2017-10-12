---
layout: page
title: "Q66901: QuickC Version 2.50 Packing List (5.25-Inch Disk Set)"
permalink: /pubs/pc/reference/microsoft/kb/Q66901/
---

	Article: Q66901
	Product: Microsoft C
	Version(s): 2.50
	Operating System: MS-DOS
	Flags: ENDUSER | packing.lst
	Last Modified: 18-NOV-1990
	
	The following is the packing list located on disk 1 of the Microsoft
	QuickC Compiler, version 2.50, 5.25-inch disk set:
	
	Disk 1: Setup
	-------------
	
	   Files                        Description
	   -----                        -----------
	
	   setup.exe                    Setup program -- installs compiler
	   readme.doc                   Release notes for QuickC
	   fixshift.com                 Fixes BIOS problem for some compatible
	                                keyboards
	   msherc.com                   TSR to support Hercules card graphics
	   qcc.ovl                      QuickC overlay for the integrated
	                                environment
	   dospatch\patch320.doc        Patch files for PC-DOS 3.2 and MS-DOS
	                                3.20
	   dospatch\setrhs.exe          " -- read the .DOC files for details
	   dospatch\rmrhs.exe           "
	   dospatch\stkpat.bat          "
	   dospatch\stkpat.scr          "
	   dospatch\patch87.doc         "
	   dospatch\patch87.exe         "
	   samples\samples.doc          Sample C programs
	   samples\grdemo.mak           " -- read SAMPLES.DOC for details
	   samples\grdemo.c             "
	   samples\mouse.c              "
	   samples\mouse.h              "
	   samples\menu.c               "
	   samples\menu.h               "
	   samples\turtle.c             "
	   samples\turtle.h             "
	   samples\chrtdemo.mak         "
	   samples\chrtdemo.c           "
	   samples\chrtopt.c            "
	   samples\chrtdemo.h           "
	   samples\chrtsupt.c           "
	   samples\life.mak             "
	   samples\life.c               "
	   samples\tools.c              "
	   samples\tools.h              "
	
	Disk 2: Microsoft QuickC Advisor
	--------------------------------
	
	   Files                        Description
	   -----                        -----------
	
	   qc.hlp                       Part 1 of Help on C and library functions
	
	Disk 3: Learning the Microsoft QuickC Environment
	-------------------------------------------------
	
	   Files                        Description
	   -----                        -----------
	
	   qc.hl2                       Part 2 of Help on C and library functions
	   learn.com                    Online tutorial and introduction to
	                                QuickC
	   lc.pgm                       Tutorial support files
	   qccbt.ctx                    "
	   qccbt.scn                    "
	   qccbt.sob                    "
	   qcenv.hlp                    Help on the QuickC environment
	   qa.hlp                       Stub help file for QuickAssembler
	
	Disk 4: Integrated Development Environment
	------------------------------------------
	
	   Files                        Description
	   -----                        -----------
	
	   qc.exe                       QuickC integrated programming environment
	   qc.ini                       Default .INI file for QuickC(R)
	   graphics.hlp                 Help on graphics functions
	
	Disk 5: Utilities
	-----------------
	
	   Files                        Description
	   -----                        -----------
	
	   lib.exe                      Library maintenance utility
	   qlink.exe                    Quick Linker
	   nmake.exe                    Program maintenance utility
	   nmk.com
	   ilink.exe                    Incremental linker
	   ilinkstb.ovl                 ILINK overlay
	   mouse.com                    Mouse driver
	   crlf.exe                     Removes CTRL characters and inserts CR/LF
	   mkkey.exe                    Creates customized keyboard command files
	   brief.key                    Keyboard files
	   emacs.key                    "
	   me.key                       "
	   qc.key                       "
	   epsilon.key                  "
	   qcc.dat                      Data file used by QC environment
	   qcl.msg                      Help on QCL
	
	Disk 6: Compiler
	----------------
	
	   Files                        Description
	   -----                        -----------
	
	   c1.err                       Error messages for QCL and QC
	   qcl.err                      "
	   qcl.exe                      Command-line compiler
	   _qcl.exe                     Driver for command-line compiler
	   errors.hlp                   Help on error messages
	   include\assert.h             Include files -- read each file for
	                                details
	   include\bios.h               "
	   include\conio.h              "
	   include\ctype.h              "
	   include\direct.h             "
	   include\dos.h                "
	   include\errno.h              "
	   include\fcntl.h              "
	   include\float.h              "
	   include\graph.h              "
	   include\io.h                 "
	   include\limits.h             "
	   include\locale.h             "
	   include\malloc.h             "
	   include\math.h               "
	   include\memory.h             "
	   include\pgchart.h            "
	   include\process.h            "
	   include\search.h             "
	   include\setjmp.h             "
	   include\share.h              "
	   include\signal.h             "
	   include\stdarg.h             "
	   include\stddef.h             "
	   include\stdio.h              "
	   include\stdlib.h             "
	   include\string.h             "
	   include\time.h               "
	   include\varargs.h            "
	   include\sys\locking.h        "
	   include\sys\stat.h           "
	   include\sys\timeb.h          "
	   include\sys\types.h          "
	   include\sys\utime.h          "
	
	Disk 7: Libraries 1
	-------------------
	   Files                        Description
	   -----                        -----------
	
	   slibcr.lib                   Library for small model
	   mlibcr.lib                   Library for medium model
	   clibcr.lib                   Library for compact model
	   slibfp.lib                   Floating point math library (small model)
	   mlibfp.lib                   Floating point math library (medium
	                                model)
	   mgraphfp.lib                 Graphics FP library (medium/large model)
	   sgraphfp.lib                 Graphics FP library (small/compact model)
	   c51stubs.lib                 Stub for Windows 2.03 libraries
	
	Disk 8: Libraries 2/Fonts
	-------------------------
	
	   Files                        Description
	   -----                        -----------
	
	   llibcr.lib                   Library for large model
	   clibfp.lib                   Floating point library (compact model)
	   llibfp.lib                   Floating point library (large model)
	   libh.lib                     General helper library
	   87.lib                       Floating point library for math
	                                coprocessor
	   em.lib                       Floating point library for emulator
	   graphics.lib                 Graphics library
	   pgchart.lib                  Presentation Graphics library
	   crtcom.lib                   Library file for generating .COM files
	   binmode.obj                  Changes default I/O from text to binary
	   fileinfo.obj                 Allows child programs to inherit files
	   setargv.obj                  Expands wildcard in command line
	                                arguments
	   rmfixup.obj                  Removes interrupts, forces coprocessor
	                                math
	   varstck.obj                  Allows heap and stack to compete for
	                                space
	   txtonly.obj                  Allows graphics calls to be stubbed out
	   font\courb.fon               Font files
	   font\helvb.fon               "
	   font\modern.fon              "
	   font\roman.fon               "
	   font\script.fon              "
	   font\tmsrb.fon               "
