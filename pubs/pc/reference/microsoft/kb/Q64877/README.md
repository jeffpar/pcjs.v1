---
layout: page
title: "Q64877: &quot;File Not Found ...&quot; If BASIC RUNs a C 6.00 Overlaid Program"
permalink: /pubs/pc/reference/microsoft/kb/Q64877/
---

## Q64877: &quot;File Not Found ...&quot; If BASIC RUNs a C 6.00 Overlaid Program

	Article: Q64877
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom S_C SR# S900807-15
	Last Modified: 5-SEP-1990
	
	When a Microsoft C Professional Development System (PDS) version 6.00
	overlaid program is executed by using the RUN statement from an .EXE
	program compiled in Microsoft QuickBASIC version 4.00, 4.00b, or 4.50,
	or in Microsoft BASIC Compiler version 6.00 or 6.00b, the error
	message "File not found in module ..." will display.
	
	This is due to BASIC not handling the new C 6.00 methods of overlay
	management. This incompatibility has been corrected in Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50, and to Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS.
	
	The following programs demonstrate the problem. The first program is
	A.BAS:
	
	   print "in basic"
	   run "b.exe"
	
	Compile and LINK in QuickBASIC 4.00, 4.00b, and 4.50 or Microsoft
	BASIC Compiler version 6.00 or 6.00b:
	
	   BC /O A ;
	   LINK A.OBJ ;         [ This LINK creates A.EXE. ]
	
	The following two programs are the C code that the BASIC program
	calls. The first is B.C:
	
	   void f(void);
	   void main(void)
	   {
	       printf("here is c 6.00\n");
	       f();
	   }
	
	The following is C.C:
	
	   void f(void)
	   {
	       printf("in overlay\n");
	   }
	
	Compile and LINK using Microsoft C PDS 6.00, as follows:
	
	   CL /c /AL b.c ;
	   CL /c /AL c.c ;
	   LINK b.obj (c.obj) ;
	
	When A.EXE is run, the following message displays:
	
	   File not found in module A        at address 246B:0042
