---
layout: page
title: "Q30271: LINK QB &amp; C &quot;Unresolved Externals&quot;; How to Use LINK /NOE, /NOD"
permalink: /pubs/pc/reference/microsoft/kb/Q30271/
---

## Q30271: LINK QB &amp; C &quot;Unresolved Externals&quot;; How to Use LINK /NOE, /NOD

	Article: Q30271
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C S_QuickC
	Last Modified: 13-MAR-1990
	
	The following article explains how to compile and link the example of
	linking QuickBASIC to Microsoft C shown on Page 391 of the "Microsoft
	QuickBASIC 4.0: BASIC Language Reference" manual for Versions 4.00 and
	4.00b, and Page 391 of the "Microsoft BASIC Compiler 6.0: BASIC
	Language Reference" manual for Microsoft BASIC Compiler Versions 6.00
	and 6.00b for MS-DOS and MS OS/2.
	
	This article also explains how to use the LINK /NOE and /NOD options
	to eliminate error messages when linking to C.
	
	When linking BASIC to C (or to other Microsoft languages), please note
	the following information about using the LINK /NOE and /NOD options:
	
	1. Notes for using LINK /NOE Option are as follows:
	
	   The LINK /NOE option is required for interlanguage calling to
	   eliminate the following error message:
	
	      xx.LIB : error L2044: __xxxxx : symbol multiply defined, use /NOE
	
	   The Microsoft language libraries, such as LLIBCE.LIB from C and
	   BRUN40.LIB from QuickBASIC, contain some of the same routines;
	   thus, they require LINK /NOE.
	
	   If you still get a "symbol multiply defined" message after using
	   the LINK /NOE option, then the multiply defined symbols in your
	   source code need to be renamed, recompiled, and relinked.
	
	   The /NOE option is documented only in the README.DOC file on a disk
	   in QuickBASIC 4.00 and 4.00b and in BASIC compiler 6.00 and 6.00b.
	   In QuickBASIC Version 4.50, /NOE is documented on Page 365 of the
	   "Microsoft QuickBASIC 4.5: Programming in BASIC" manual.
	
	2. Notes for using LINK /NOD Option are as follows:
	
	   Note that an .OBJ file compiled with QuickBASIC 4.00, 4.00b, or
	   4.50, or C 5.00 or 5.10 contains information telling the linker
	   what .LIB file to look for at link time.
	
	   If you use the LINK /NOD option, you are telling the linker not to
	   search any specified library in the .OBJ file to resolve external
	   references. Thus, if you use the /NOD option, you must explicitly
	   specify the name of the .LIB language libraries for both C and
	   QuickBASIC in the LINK command (even if the .LIB library has a path
	   set to it with SET LIB=path). If you do not, LINK.EXE will give the
	   following error:
	
	      LINK : error L2029: Unresolved Externals
	
	Code Example
	------------
	
	The following steps describe how to compile and link the code example
	shown at the bottom of this article (taken from Page 391 of the
	BASIC language reference manuals):
	
	1. Compile cf.bas and cfunc.c (shown farther below) as follows:
	
	      BC CF.BAS;
	      CL /C /AL CFUNC.C
	
	   You may also use the C medium-memory model: CL /C /AM CFUNC.C. This
	   example uses CL.EXE from Microsoft C Versions 5.00 and 5.10.
	
	2. Type SET at the DOS command line to make sure that you issued a
	   statement similar to "SET LIB=C:\QB.400;C:\C.500" to tell LINK.EXE
	   where to look for .LIB files at link time.
	
	3. Link the BASIC and C routines, specifying the BASIC routine first
	   and using LINK.EXE Version 3.61 or later:
	
	      LINK CF.OBJ+CFUNC.OBJ/NOE;
	
	CF.BAS
	------
	
	   REM  BASIC routine cf.bas:
	   DEFINT A-Z
	   DECLARE SUB cfunc CDECL (BYVAL x AS INTEGER)
	   beforecall = SETMEM(-2048)
	   cfunc (1024)
	   aftercall = SETMEM(3500)
	   IF aftercall <= beforecall THEN PRINT "memory not reallocated."
	   END
	
	CFUNC.C
	-------
	
	   /*  C routine cfunc.c:    */
	   void far cfunc(bytes)
	   int bytes;
	   {
	    char *malloc();
	    char *workspace;
	    workspace=malloc((unsigned) bytes);
	    free(workspace);
	   }
