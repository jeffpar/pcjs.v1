---
layout: page
title: "Q28774: Building C 5.10 Combined Libraries with the LIB Utility"
permalink: /pubs/pc/reference/microsoft/kb/Q28774/
---

	Article: Q28774
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 15-JAN-1991
	
	Question:
	
	How does one go about building the combined libraries for C 5.10?
	
	Response:
	
	The preferred method for building the combined libraries is to use the
	SETUP program. To use SETUP to build libraries, you can run it with /L
	as a command-line parameter by typing the following
	
	   a:setup /L
	
	at the DOS prompt with the SETUP disk in the drive A.
	
	If you have problems running the Setup program or you want to build
	the libraries manually using the LIB utility, you should build them as
	outlined in the following:
	
	1. Copy the appropriate library files to your hard disk. The memory
	   model and floating-point option that you want to build will
	   determine which library files are necessary. Refer to the file
	   PACKING.LST to determine where each library file is located.
	
	2. Locate the LIB.EXE utility so that it is in your current directory
	   or is located on your path.
	
	3. The details for how each library should be built are outlined
	   below. These instructions assume that you will be using the default
	   names for the real-mode libraries. The instructions also assume
	   that you want graphics support built into your real-mode libraries
	   (the graphics routines are not supported in protect mode). If this
	   is not the case, do not include that library.
	
	The library name should be the command-line parameter to LIB.EXE. The
	question mark (?) is used to represent memory model (S, M, C, L) and
	you should substitute the appropriate letter when invoking the library
	manager. If you see the following prompt
	
	   Library does not exist.  Create?
	
	you should respond with "y" to create the library and then provide the
	appropriate libraries at the next prompt which will be the
	"Operations:" prompt.
	
	The following is an example session:
	
	Assume that you want to build the small model emulator math library
	for real mode. This is how you would proceed from the DOS prompt
	assuming that you have already copied the correct component libraries
	to the following current directory:
	
	>lib slibce
	
	Microsoft (R) Library Manager  Version 3.08
	Copyright (C) Microsoft Corp 1983-1987.  All rights reserved.
	
	Library does not exist.  Create?y
	Operations:slibc.lib+libh.lib+em.lib+libfp.lib+graphics.lib;
	---------------
	
	Here are the combine instructions for all combinations of the
	libraries:
	---------------
	
	?LIBCE.LIB-Real Mode mode emulator (?==S,M,C or L)
	
	Operations:?libc.lib+libh.lib+em.lib+?libfp.lib+graphics.lib;
	---------------
	
	?LIBCA.LIB-Real mode alternate math (?==S,M,C or L)
	
	Operations:?libc.lib+libh.lib+?libfa.lib+graphics.lib;
	---------------
	
	?LIBC7.LIB-Real mode 8087 (?==S,M,C or L)
	
	Operations:?libc.lib+libh.lib+87.lib+?libfp.lib+graphics.lib;
	---------------
	
	?LIBCEP.LIB-Protect mode emulator (?==S,M,C or L)
	
	Operations:?libcp.lib+libh.lib+em.lib+?libfp.lib;
	---------------
	
	?LIBCAP.LIB-Protect mode alternate math (?==S,M,C or L)
	
	Operations:?libcp.lib+libh.lib+?libfa.lib;
	---------------
	
	?LIBC7P.LIB-Protect mode 8087 (?==S,M,C or L)
	
	Operations:?libcp.lib+libh.lib+87.lib+?libfp.lib;
