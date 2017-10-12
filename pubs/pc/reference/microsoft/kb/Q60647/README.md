---
layout: page
title: "Q60647: C 6.00 STARTUP.DOC: C Run-time Library Startup Sources"
permalink: /pubs/pc/reference/microsoft/kb/Q60647/
---

	Article: Q60647
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | readme readme.doc start-up runtime
	Last Modified: 15-AUG-1990
	
	The following information is taken from the C Version 6.00 STARTUP.DOC
	file.
	
	C Run-Time Library Startup Sources
	----------------------------------
	
	The directory \startup and its subdirectories contain the files
	necessary for building the startup portion of the C run-time library.
	The \startup directory contains the startup source files, the include
	files, the batch file, and the make file used to build the startup
	object files. The subdirectories of \startup contain OS specific
	sources.
	
	The startup object files can be built by invoking STARTUP.BAT (DOS) or
	STARTUP.CMD (OS/2) from within the \startup directory. This batch file
	assumes the following:
	
	1. NMAKE.EXE, NMK.COM, LINK.EXE, the C compiler, and the assembler
	   must be in the execution path. MASM 5.00 and C 6.00 or later are
	   required to build the startup sources.
	
	2. For OS/2, OS2.LIB must be in the directory specified by the LIB
	   environment variable.
	
	3. Environment variable INCLUDE must be set to the directory that
	   contains your C include files.
	
	Startup will create four memory model specific subdirectories (i.e.,
	S, M, C, and L) and place the appropriate object files there. Under
	each memory model subdirectory, startup creates two additional
	subdirectories, OS2 and DOS, where OS specific objects reside.
	
	The include files STDIO.H and CTYPE.H are required for building the
	startup source file WILD.C but are not included on the \startup
	directory because they exist on the directory containing the standard
	include files. A make variable called CINC controls where the makefile
	looks for these include files. STARTUP sets CINC to the current value
	of the INCLUDE environment variable. This variable should be set to
	the location of the C include files. CINC can also be set in the
	makefile if you wish to run the makefile separately.
	
	The message "<cEnd - nogen>" is generated when some of the assembly
	language source files are assembled. This message is expected and is
	totally benign.
	
	The startup batch file requires as arguments a list of capital letters
	describing the memory models you wish to build. For example, "startup
	S L" will build the small and large model startup objects. Startup
	will then link the objects with a sample C program called NULBODY.C
	(consisting of a null main functions) to produce NULBODY.EXE.
	[Invoking startup.<bat,cmd> with no arguments will give usage
	information.]
	
	If you wish to build startup sources for only one operating system
	(i.e. DOS or OS/2), type "DOS" or "OS2" as the first argument to the
	startup batch file.
	
	Note: Startup sources written in assembly language have been edited
	with tab stops set to 8. Startup sources written in C have been edited
	with tab stops set to 4.
	
	The following files are contained in the \startup directory:
	
	Startup source files (OS independent):
	
	  rchkstk.asm
	  fmsghdr.asm
	  chkstk.asm
	  chksum.asm
	  crt0fp.asm
	  setargv.asm
	  wild.c
	
	Startup source files (OS specific):
	
	  crt0.asm
	  crt0dat.asm
	  crt0msg.asm
	  execmsg.asm  (DOS only)
	  nmsghdr.asm
	  stdalloc.asm
	  stdenvp.asm
	  stdargv.asm
	
	Startup include files:
	
	  cmacros.inc
	  heap.inc
	  msdos.inc
	  msdos.h
	  register.h
	  rterr.inc
	  version.inc
	
	File count files:
	
	  _file.c
	  file2.h
	
	Make and batch files:
	
	   startup.bat:  Builds objs and links null program on DOS
	   startup.cmd:  Builds objs and links null program on OS/2
	   makefile:     Contains rules for building startup sources
	   nulbody.c:    Null c program
	   nulbody.lnk:  Link script for linking null program
	
	Documentation:
	
	  README.DOC: Information about \startup directory structure and
	              contents
