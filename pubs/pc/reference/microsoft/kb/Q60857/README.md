---
layout: page
title: "Q60857: CodeView Does Not Watch Local Variables in Subprogram"
permalink: /pubs/pc/reference/microsoft/kb/Q60857/
---

## Q60857: CodeView Does Not Watch Local Variables in Subprogram

	Article: Q60857
	Version(s): 4.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 fixlist4.00b fixlist4.50 B_BasicCom
	Last Modified: 19-APR-1990
	
	CodeView does not display correct values for local variables in
	SUBprograms in QuickBASIC Version 4.00. With local individual
	(nonarray) variables, the watch always displays 0 (or "" for strings).
	Adding a watch on a local array element causes CodeView to display the
	message "Too many array bounds given." This is a problem with the
	BC.EXE 4.00 compiler, not with CodeView.
	
	Microsoft has confirmed this to be problem in Microsoft QuickBASIC
	Version 4.00 for MS-DOS. This problem was corrected in Microsoft
	QuickBASIC Versions 4.00b and 4.50 for MS-DOS, Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS and OS/2 (fixlist6.00,
	fixlist6.00b), and Microsoft BASIC Professional Development System
	(PDS) Version 7.00 (fixlist7.00).
	
	Code Example
	------------
	
	The following code example demonstrates the problems with watching a
	local variable in a SUB in CodeView with QuickBASIC 4.00. Use the
	following steps to reproduce this problem:
	
	1. Compile the program with /Zi, and link with /CO with the BC.EXE
	   4.00 compiler. You cannot do this from within the QuickBASIC
	   environment.
	
	2. Start CodeView as follows:
	
	      CV localv.exe
	
	3. Step through the program using the F8 key until you are inside the
	   SUBprogram.
	
	4. Choose Add Watch from the Watch menu (or press CTRL+W). Type the
	   name of the variable to be watched in the dialog box.
	
	5. Continue to step through the subprogram with the F8 key. The
	   variables being watched will not change in the watch window.
	
	Code Example
	------------
	
	   'Compile and link lines:
	   '
	   ' BC /Zi localcv;
	   ' LINK /CO localcv;
	   CALL test(1)
	   END
	
	   SUB test (param%)                 'Watch param% displays correctly
	   DIM array%(10)                    'Watch array%(10) -> Too many
	                                     'bounds
	   locali% = 10                      'Watch locali% displays 0
	   PRINT param%, locali%, array%(10) 'These print correctly
	   END SUB
