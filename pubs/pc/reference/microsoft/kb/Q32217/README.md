---
layout: page
title: "Q32217: Using B_OnExit Across a CHAIN Hangs System; Compiled BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q32217/
---

## Q32217: Using B_OnExit Across a CHAIN Hangs System; Compiled BASIC

	Article: Q32217
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00b buglist7.00 B_QuickBas
	Last Modified: 17-JAN-1990
	
	Chaining to and from programs that use B_OnExit causes the system to
	hang.
	
	Microsoft has confirmed this to be a problem in Microsoft QuickBASIC
	Versions 4.00 and 4.00b (buglist4.00, buglist4.00b), in Microsoft
	BASIC Compiler Version 6.00 and 6.00b for MS-DOS and MS OS/2, and in
	Microsoft BASIC Professional Development System (PDS) Version 7.00 for
	MS-DOS and MS OS/2. We are researching this problem and will post new
	information here as it becomes available.
	
	Please note that the B_OnExit routine is documented on Pages 319-321
	of the "Microsoft QuickBASIC 4.0: Learning and Using" manual for
	Microsoft QuickBASIC Versions 4.00 and 4.00b (this is the same manual
	for Microsoft BASIC Compiler Versions 6.00 and 6.00b), and in the
	"Microsoft BASIC 7.0: Programmer's Guide" on Pages 474-475.
	
	The following steps reproduce the problem using source code provided
	farther below:
	
	1. Use the following software to reproduce the problem:
	
	   a. Microsoft QuickBASIC Versions 4.00, 4.00b, Microsoft BASIC
	      Compiler Version 6.00 or 6.00b, or Microsoft BASIC PDS Version
	      7.00.
	
	   b. Microsoft C Compiler Version 5.10
	
	2. Type the following command lines:
	
	      BC BUGTEST.BAS;
	      BC BUGNEXT.BAS;
	      CL /c /AM BUGC.C
	      LINK /NOE BUGTEST+BUGC;
	      LINK /NOE BUGNEXT+BUGC;
	
	3. Run BUGTEST.EXE from the DOS prompt.
	
	4. At the "CHAIN Y/N?" prompt, type Y.
	
	The system locks up when BUGNEXT exits.
	
	Please note the following:
	
	1. You must link BUGC.OBJ with BUGNEXT.OBJ even though it is not
	   called.
	
	2. Both programs apparently run correctly until you exit BUGNEXT.
	
	Code Example
	------------
	
	'BUGTEST.BAS
	
	        DECLARE SUB IntProc CDECL
	        DEFINT A-Z
	        PRINT "[***** ENTRY TO MAIN  *****]"
	        CALL InProc
	        INPUT "CHAIN Y/N";T$
	        IF T$="Y" OR T$="y" THEN
	           CHAIN "BUGNEXT.EXE"
	        END IF
	        SYSTEM
	        END
	
	'BUGNEXT.BAS
	
	        DEFINT A-Z
	        PRINT "[***** CHAIN *****]"
	        SYSTEM
	        END
	
	/* BUGC.C */
	
	#include <malloc.h>
	extern pascal far B_OnExit();  /* Declare the routine */
	
	void IntProc()
	{
	  void TermProc();             /* Declare TermProc routine */
	  printf ("\nIn the C IntProc routine\n");
	  B_OnExit(TermProc);          /* Log termination routine with BASIC */
	}
	
	void TermProc()                         /* The TermProc function is */
	{                                       /* called before any restarting */
	  printf ("\nIn C TermProc routine\n"); /* or termination of the program. */
	}
