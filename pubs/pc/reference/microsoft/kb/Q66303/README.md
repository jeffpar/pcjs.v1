---
layout: page
title: "Q66303: Errors in Chapter 16 of Advanced Programming Techniques"
permalink: /pubs/pc/reference/microsoft/kb/Q66303/
---

## Q66303: Errors in Chapter 16 of Advanced Programming Techniques

	Article: Q66303
	Version(s): 6.00 6.00a
	Operating System: OS/2
	Flags: ENDUSER | docerr
	Last Modified: 19-JAN-1991
	
	Due to printing problems and proofing oversight, there are several
	documentation errors, shown in detail below, in Chapter 16 of the
	"Microsoft C Advanced Programming Techniques" manual that shipped with
	C version 6.00 and 6.00a. These errors can cause various problems if
	you are attempting to learn how to use C 6.00 to develop OS/2
	applications. Some examples of the problems are as follows:
	
	1. Sample code fails to compile.
	
	2. Sample application fails to function correctly.
	
	3. Running a sample application causes SYS2070 error (Unable to Demand
	   Load application segment xxxxx) from the operating system.
	
	The following are documentation errors occurring in Chapter 16 of the
	"Microsoft C Advanced Programming Techniques" manual, and their
	corrections:
	
	1. Page 404; example at top of page:
	
	      #pragma stack_check(off)
	
	   Should be as follows:
	
	      #pragma check_stack(off)
	
	   Program will not compile as is.
	
	2. Page 404; example at top of page:
	
	      "while (s = TargetBuff)" and "while (d = TargetBuff)"
	
	   Both should be changed to the following:
	
	      "while (s >= TargetBuff)" and "while (d >= TargetBuff)"
	
	   The sample program will not function correctly as is.
	
	3. Page 402; middle of page (details of /ML and /MD switch).
	   Page 404; bottom of page.
	   Page 410; bottom of page.
	   Page 412; top of page (in the paragraph at the top).
	   Page 412; bottom of page (in the example).
	
	   All define switches to the compiler should have underscores instead
	   of spaces (that is, /D MT should be /D_MT, and /D DLL should be /D_DLL.
	
	   Without this, the correct sections of the include files will not
	   be used. Symptoms include incorrect program operation and link
	   failure (especially obvious with floating-point math functions).
	
	4. Page 407; top of page.
	   Page 411; bottom of page (end of Step 3).
	   Page 412; bottom of page.
	
	      All the link lines should include /NOI.
	
	   Without this, the programs that use run-time in a DLL will likely
	   fail at run-time due to name mismatch. In the SYS2070 error
	   message from the OS, the function name will probably be uppercase
	   with a leading underscore. The actual function name is probably
	   mixed case.
	
	5. Page 411; top of page (end of Step 2).
	
	   This step defines the building of the .DEF file for the
	   application-specific DLL. The .DEF file should also include "DATA
	   MULTIPLE." This fact was mentioned on Page 398.
	
	   If this is not done, the program will likely run correctly until a
	   second process attempts to gain access to the DLL. At that time,
	   the second process will likely overwrite the run-time instance data
	   from the first process.
	
	Microsoft is researching this problem and will post new information
	here as it becomes available.
