---
layout: page
title: "Q46840: QuickAssembler 2.01 PACKING.LST"
permalink: /pubs/pc/reference/microsoft/kb/Q46840/
---

## Q46840: QuickAssembler 2.01 PACKING.LST

	Article: Q46840
	Version(s): 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | distribution directory disks
	Last Modified: 26-JUL-1989
	
	The following is the packing list file (PACKING.LST) for the
	QuickC/QuickAssembler Version 2.01 5.25-inch disk set:
	
	Disk 1 : QuickAssembler/QuickC Setup
	
	Files                       Description
	-----                       -----------
	
	PACKING.LST                 Packing list (this file)
	SETUP.EXE                   Setup program for QuickC with QuickAssembler
	README.DOC                  Release notes for QuickC with QuickAssembler
	HELPMAKE.EXE                Creates and customizes help files
	MSHERC.COM                  TSR -- supports Hercules card graphics
	FIXSHIFT.COM                Fixes BIOS bug for some Compaq and other keyboard
	
	DOSPATCH\PATCH320.DOC       Patch files for MS-DOS 3.20 and PC-DOS 3.20
	DOSPATCH\SETRHS.EXE         " -- Read the .DOC files for details
	DOSPATCH\RMRHS.EXE          " "
	DOSPATCH\STKPAT.BAT         " "
	DOSPATCH\STKPAT.SCR         " "
	DOSPATCH\PATCH87.DOC        " "
	DOSPATCH\PATCH87.EXE        " "
	
	SAMPLES\SAMPLES.DOC         Sample C programs
	SAMPLES\GRDEMO.C            " -- Read SAMPLES.DOC for details
	SAMPLES\GRDEMO.MAK          " "
	SAMPLES\MENU.C              " "
	SAMPLES\MENU.H              " "
	SAMPLES\TURTLE.C            " "
	SAMPLES\TURTLE.H            " "
	SAMPLES\LIFE.C              " "
	SAMPLES\TOOLS.C             " "
	SAMPLES\TOOLS.H             " "
	SAMPLES\LIFE.MAK            " "
	SAMPLES\CRLF.C              " "
	
	Disk 2 : Learning the QuickC Integrated Environment
	
	Files                       Description
	-----                       -----------
	
	LEARN.COM                   On-line tutorial and introduction to QuickC
	LC.PGM                      Tutorial support files
	QCCBT.CTX                   " "
	QCCBT.SCN                   " "
	QCCBT.SOB                   " "
	LINK.EXE                    Special linker for Windows and OS/2 developers
	
	Disk 3 : Integrated Development Environment 1
	
	Files                       Description
	-----                       -----------
	
	QC.EXE                      QuickCintegrated programming environment
	QC.INI                      Default .INI file for QuickC
	
	Disk 4 : Integrated Development Environment 2
	
	Files                       Description
	-----                       -----------
	
	QCC.OVL                     QuickCoverlay for the integrated environment
	C1.ERR                      Compiler error messages for QC and QCL
	NMAKE.EXE                   Stand-alone program maintenance utility
	
	INCLUDE\ASSERT.H            Include files
	INCLUDE\BIOS.H              "  -- Read the beginning of each file for details
	INCLUDE\CONIO.H             " "
	INCLUDE\CTYPE.H             " "
	INCLUDE\DIRECT.H            " "
	INCLUDE\DOS.H               " "
	INCLUDE\ERRNO.H             " "
	INCLUDE\FCNTL.H             " "
	INCLUDE\FLOAT.H             " "
	INCLUDE\GRAPH.H             " "
	INCLUDE\IO.H                " "
	INCLUDE\LIMITS.H            " "
	INCLUDE\MALLOC.H            " "
	INCLUDE\MATH.H              " "
	INCLUDE\MEMORY.H            " "
	INCLUDE\PGCHART.H           " "
	INCLUDE\PROCESS.H           " "
	INCLUDE\SEARCH.H            " "
	INCLUDE\SETJMP.H            " "
	INCLUDE\SHARE.H             " "
	INCLUDE\SIGNAL.H            " "
	INCLUDE\STDARG.H            " "
	INCLUDE\STDDEF.H            " "
	INCLUDE\STDIO.H             " "
	INCLUDE\STDLIB.H            " "
	INCLUDE\STRING.H            " "
	INCLUDE\TIME.H              " "
	INCLUDE\VARARGS.H           " "
	
	INCLUDE\SYS\LOCKING.H       " "
	INCLUDE\SYS\STAT.H          " "
	INCLUDE\SYS\TIMEB.H         " "
	INCLUDE\SYS\TYPES.H         " "
	INCLUDE\SYS\UTIME.H         " "
	
	Disk 5 : Utilities
	
	Files                       Description
	-----                       -----------
	
	CRLF.EXE                    Removes CTRL characters and inserts CR/LFs
	LINK.EXE                    Linker
	ILINK.EXE                   Incremental linker
	ILINKSTB.OVL                Ilink overlay
	LIB.EXE                     Library maintenance utility
	ERRORS.HLP                  Help on error messages
	QCC.DAT                     Data file used by QC environment
	MOUSE.COM                   Microsoft mouse driver - Version 6.24a
	MKKEY.EXE                   Creates customized keyboard command files
	BRIEF.KEY                   Keyboard files
	EMACS.KEY                   " "
	EPSILON.KEY                 " "
	ME.KEY                      " "
	QC.KEY                      " "
	
	Disk 6 : Microsoft Quick Advisor
	
	Files                       Description
	-----                       -----------
	
	QC.HLP                      Help on C and library functions
	
	Disk 7 : Command-Line Compiler
	
	Files                       Description
	-----                       -----------
	
	QCCOM.EXE                   Command-line compiler
	QCL.EXE                     Driver for command-line compiler
	QCL.HLP                     Help on QCL
	CL.ERR                      Error messages for QCL and QC
	GRAPHICS.HLP                Help on graphics functions
	
	Disk 8 : Libraries 1
	
	Files                       Description
	-----                       -----------
	
	SLIBC.LIB                   Library for small model
	SLIBFP.LIB                  Floating-point math library (small model)
	SVARSTCK.OBJ                Small model competing heap/stack object file
	MLIBC.LIB                   Library for medium model
	MLIBFP.LIB                  Floating-point math library (medium model)
	MVARSTCK.OBJ                Medium model competing heap/stack object file
	
	Disk 9 : Libraries 2
	
	Files                       Description
	-----                       -----------
	
	BINMODE.OBJ                 Changes default file I/O mode from text to binary
	SETARGV.OBJ                 Allows wildcards in command-line arguments
	RMFIXUP.OBJ                 Removes interrupts; forces coprocessor math
	DBUSED.OBJ                  Needed when linking with C 5.10 OS/2 libraries
	EM.LIB                      FP math library for software emulation of 8087
	LIBH.LIB                    General helper library
	GRAPHICS.LIB                Low-level graphics library
	PGCHART.LIB                 Presentation graphics library
	CLIBC.LIB                   Library for compact model
	CLIBFP.LIB                  Floating-point math library (compact model)
	CVARSTCK.OBJ                Compact model competing heap/stack object file
	
	Disk 10 : Libraries 3/fonts
	
	Files                       Description
	-----                       -----------
	
	87.LIB                      Floating-Point math library for 8087 coprocessor
	LLIBC.LIB                   Library for large model
	LLIBFP.LIB                  Floating-point math library (large model)
	LVARSTCK.OBJ                Large model competing heap/stack object file
	
	FONT\COURB.FON              Font files
	FONT\HELVB.FON              " "
	FONT\MODERN.FON             " "
	FONT\ROMAN.FON              " "
	FONT\SCRIPT.FON             " "
	FONT\TMSRB.FON              " "
	
	NOTES.HLP                   User-defined help file
	
	Disk 11 : Quickassembler 1
	
	Files                       Description
	-----                       -----------
	
	QAS.OVL                     QuickAssembler overlay
	
	SAMPLES\QASAMPLE.DOC        Sample C and Assembler programs
	SAMPLES\FILEDEMO.MAK        " -- Read QASAMPLE.DOC for details
	SAMPLES\FILEDEMO.C          " "
	SAMPLES\FILE.ASM            " "
	SAMPLES\MATHDEMO.MAK        " "
	SAMPLES\MATHDEMO.C          " "
	SAMPLES\MATH.ASM            " "
	SAMPLES\MISCDEMO.MAK        " "
	SAMPLES\MISCDEMO.ASM        " "
	SAMPLES\MISC.ASM            " "
	SAMPLES\COMMON.ASM          " "
	SAMPLES\DEMO.H              " "
	SAMPLES\DEMO.INC            " "
	SAMPLES\CHRTDEMO.C          " "
	SAMPLES\CHRTDEMO.H          " "
	SAMPLES\CHRTSUPT.C          " "
	SAMPLES\CHRTOPT.C           " "
	SAMPLES\CHRTDEMO.MAK        " "
	
	Disk 12 : Quickassembler 2
	
	Files                       Description
	-----                       -----------
	
	QA.HLP                      Help on the QuickAssembler - Part 1 of 2
	
	Disk 13 : Quickassembler 3
	
	Files                       Description
	-----                       -----------
	
	QA1.HLP                     Help on the QuickAssembler - Part 2 of 2
	QCENV.HLP                   Help on the QuickC environment
