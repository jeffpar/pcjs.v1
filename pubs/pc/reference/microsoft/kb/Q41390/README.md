---
layout: page
title: "Q41390: Handling Events and ERRORs When BASIC Calls Non-BASIC Routines"
permalink: /pubs/pc/reference/microsoft/kb/Q41390/
---

## Q41390: Handling Events and ERRORs When BASIC Calls Non-BASIC Routines

	Article: Q41390
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr B_BasicCom SR# S890202-69
	Last Modified: 22-DEC-1989
	
	This information applies to QuickBASIC Versions 4.00, 4.00b, and 4.50,
	Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and OS/2,
	and Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	The following corrections for documentation errors apply to Page 296
	of the learning and using Microsoft QuickBASIC manual for QuickBASIC
	4.00 and 4.00b and BASIC compiler 6.00 and 6.00b, and to Page 442-443
	of the "Microsoft BASIC Version 7.0: Programmer's Guide" for BASIC PDS
	7.00:
	
	1. The section "Events and Errors" incorrectly implies that BASIC
	   can call a subroutine written in a different language, have that
	   language sense an EVENT or ERROR, and then jump to the error
	   handling routine in BASIC. BASIC is not designed to do this. What
	   happens is that the first event (but not subsequent events) that
	   occurs during the other language procedure is stored on the stack
	   until control returns to BASIC. If the other language procedure
	   calls a BASIC procedure in which the ERROR statement forces an
	   error (or a natural error occurs), then the error handler (if any)
	   in the BASIC program handles the error and RESUMEs as described
	   below.
	
	2. The last sentence is incorrect ("The BASIC statement containing...
	   is the statement that RESUME would reexecute"). This sentence should
	   be changed to say the following:
	
	   "The BASIC statement containing the error (ERROR x%) is the
	   statement that RESUME would reexecute. RESUME NEXT would reexecute
	   at the following statement."
	
	The program shown below is an example of a BASIC program calling a C
	function that calls a BASIC procedure. The program, as written, will
	loop indefinitely between the error-handling routine and the BASIC
	subprogram that generates the error. If the RESUME statement is
	changed to RESUME NEXT, the program executes the next statement in the
	subprogram: PRINT "Return from ERROR".
	
	(The documentation incorrectly states that "The BASIC statement
	containing the call to the non-BASIC code is the statement that RESUME
	would reexecute." According to this statement, the CALL CSUB statement
	would be executed; however, execution actually returns to the BASIC
	subprogram where the error occurred, as described above.)
	
	The following is a code example:
	
	REM ** Here is the BASIC program
	DECLARE SUB jump ()
	DECLARE SUB csub CDECL ()
	CLS
	ON ERROR GOTO errhand
	FOR i = 1 TO 5
	  PRINT " Before call to c ", FRE(-2)
	  CALL csub
	  PRINT " out if c:", FRE(-2)
	NEXT
	PRINT "At end ", FRE(-2)
	END
	errhand:
	   PRINT " error handle => ", FRE(-2)
	   RESUME
	SUB jump
	  print " Generate and Error"
	  ERROR 9
	  print "Return from ERROR "
	END SUB
	
	extern void fortran jump(void);
	void csub(void)
	 {
	   jump();
	 }
