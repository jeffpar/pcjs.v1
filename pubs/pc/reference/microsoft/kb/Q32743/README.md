---
layout: page
title: "Q32743: _fmalloc and halloc Run-Time Library Update"
permalink: /pubs/pc/reference/microsoft/kb/Q32743/
---

	Article: Q32743
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | appnote softlib buglist5.10 c51lib.arc
	Last Modified: 14-JUN-1990
	
	The following is an application note describing the _fmalloc and
	halloc allocation limit of 4 megabytes.
	
	Note: This information applies to the standard run-time libraries such
	as SLIBCE.LIB, MLIBC7.LIB, etc. This information is not applicable to
	the LLIBCMT.LIB, LLIBCDLL.LIB, or CRTLIB. The 4 megabyte limit remains
	embedded in these libraries.
	The _fmalloc (which is equivalent to malloc in large and compact
	models) run-time library functions that were released with Version
	5.10 of the Microsoft C Optimizing Compiler impose an arbitrary limit
	of 4 megabyte as the amount of memory you can allocate in OS/2. In
	addition, the halloc run-time library routine impose a single
	allocation limit of 4 megabyte on memory requests.
	
	The files described below can be used to replace existing modules
	in your libraries in order to overcome these limits. The new limit for
	_fmalloc is 16 megabytes, while the new limit on single allocations
	with halloc is a function of the operating system, i.e., you can
	allocate as much memory as OS/2 allows.
	
	To update your libraries, copy all of the files listed below from
	the Software Library into the same directory as your libraries. Make
	sure that the library manager LIB.EXE also is in the current directory
	or in your PATH. You then can run the file LIBFIX.CMD to update your
	libraries. If you are running in DOS or in the DOS Compatibility Box
	in OS/2, you can run the LIBFIX.BAT batch file.
	
	Note that LIBFIX.CMD and LIBFIX.BAT assume that your protect-mode
	combined libraries use the default naming convention, i.e., the
	protect-mode combined library names are of the form where X is the
	memory model (S,M,C,L) and Y is the floating point option (E,A,7), as
	follows:
	
	   XLIBCYP.LIB
	
	For example, LIBFIX will attempt to update the file SLIBCEP.LIB,
	the small-model emulator library for protect mode. If your protect-mode
	combined libraries are not of the form given above, it will be
	necessary for you to update your libraries manually or else modify the
	.BAT or .CMD file so that the proper libraries are updated. A sample
	command line to the library manager is as follows:
	
	   lib -+halloc.s -+crt0.s slibcep.lib ;
	
	This command line will update the small-model protect-mode combined
	library. If your protect-mode library has a different name (e.g.
	slibce.lib), you would use the following command line:
	
	   lib -+halloc.s -+crt0.s slibce.lib ;
	
	It is not necessary to update the real-mode combined libraries because
	the fix to the libraries does not affect programs that use the real-mode
	libraries.
	
	Please note that the library manager will create a backup of each
	library that it updates. Once you are satisfied that the update
	procedure is completed successfully, you can delete the files with the
	.BAK extension.
	
	Below is a description of the files included with this application
	note. These files can be found in the Software Library by searching
	for the filename C51LIB, the Q number of this article or S12001.
	C51LIB was archived using the PKware file-conversion utility.
	
	   halloc.txt   This file
	
	The following are replacement modules to correct the limit on
	halloc:
	
	        halloc.s    halloc.obj for small model libraries
	        halloc.m    halloc.obj for medium model libraries
	        halloc.c    halloc.obj for compact model libraries
	        halloc.l    halloc.obj for large model libraries including
	                               multi-thread and dynamic link libraries
	
	The following are replacement modules to correct the limit on
	_fmalloc:
	
	        crt0.s      crt0.obj for small model libraries
	        crt0.m      crt0.obj for medium model libraries
	        crt0.c      crt0.obj for compact model libraries
	        crt0.l      crt0.obj for large model libraries
	        crt0.mt     crt0.obj for multi-thread support library LLIBMT.LIB
	        crt0.cdl    crt0.obj for multi-thread DLL library CDLLOBJS.LIB
	        csu.dll     crt0.obj for single thread DLL library LLIBCDLL.LIB
	
	If you are using _fmalloc and you require more than 16 megabytes of
	memory, you can edit the file BRKCTL.INC, which is included with the
	startup source code. Change the value MAXSEG_PM in this file and then
	rebuild the appropriate modules as outlined in the README.DOC that is
	included in the startup code directory. This value was originally 64;
	the CRT0.OBJ modules on this disk were assembled with the value of
	MAXSEG_PM set to 256.
	
	If the start-up code is not on your hard disk, you will need to go
	through the C Version 5.10 setup procedure again and choose the option
	to copy the start-up code to your hard disk.
