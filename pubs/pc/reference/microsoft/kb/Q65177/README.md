---
layout: page
title: "Q65177: &quot;Out of Stack Space&quot; Using RETURN &lt;linenumber&gt; for SUB Event"
permalink: /pubs/pc/reference/microsoft/kb/Q65177/
---

## Q65177: &quot;Out of Stack Space&quot; Using RETURN &lt;linenumber&gt; for SUB Event

	Article: Q65177
	Version(s): 6.00 6.00b 7.00 7.10 | 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | B_QuickBas
	Last Modified: 4-SEP-1990
	
	If an event occurs in a procedure (SUB or FUNCTION), then returning
	from event-handling with the RETURN <linenumber> statement always
	leaves unrecoverable information on the stack, which can lead to the
	error message "Out of Stack Space" after many trapped events.
	
	This behavior is a result of violating the following design rule: to
	correctly restore (pop) the stack after handling an event, you must
	always return to the procedure level where the event occurred. This
	applies to all events trapped with the ON <event> GOSUB statement
	(where <event> includes COM, KEY, PEN, PLAY, TIMER, STRIG, and
	others).
	
	RETURN <linenumber> or <linelabel> is only designed to return from
	events that occur at the module-level (main-level) code. This
	correctly pops the stack.
	
	You must use RETURN without the <linenumber> or <linelabel> option if
	you want to RETURN to a SUB or FUNCTION procedure where an event was
	trapped. This correctly pops the stack.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2; to
	Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS and MS
	OS/2; and to Microsoft QuickBASIC versions 1.00, 1.01, 1.02, 2.00,
	2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS.
	
	To demonstrate the "Out of stack space" message, run the following
	program and hold down the ESC key, which will be trapped in a loop
	until the error occurs. The "Out of stack space" error occurs because
	this program incorrectly allows events in the SUB to be handled by the
	RETURN <linelabel> instead of an ordinary RETURN.
	
	Code Example
	------------
	
	DECLARE SUB test ()
	' This is an example where the RETURN <linenumber>
	' statement gives you "Out of Stack Space" (after about 53 ESC key
	' trap iterations in QBX.EXE, or 118 if compiled in BC.EXE) when the
	' event (pressing the ESC key) is trapped in a SUB procedure.
	KEY 15, CHR$(0) + CHR$(1)    ' Trap ESC key
	ON KEY(15) GOSUB escape
	KEY(15) ON
	PRINT "now in main"
	again:
	  CALL test
	  PRINT "Done"
	END
	escape:
	  j = j + 1
	' The FRE(-2) function returns a value decreased at each iteration by
	' the number of bytes of stack (associated with the SUBprogram) that
	' were lost:
	  PRINT j; "ESC key was pressed. Continue in main. FRE(-2)="; FRE(-2)
	  KEY(15) ON   ' <-- Must say KEY(15) ON here or else the
	               '   RETURN <linelabel> statement will leave the
	               '   ON KEY(15) GOSUB trap still active, which does an
	               '   implied KEY(15) STOP. If the key had been trapped
	               '   in the main program, then RETURN <linelabel> would
	               '   work normally, and you wouldn't have to use
	               '   KEY(15) ON here.
	  RETURN again
	
	SUB test STATIC
	PRINT "Now in SUB"
	WHILE INKEY$ = "": WEND
	PRINT "You pressed some key other than ESC."
	END SUB
	
	References:
	
	The following is taken from Page 296 (under the "RETURN Statement") of
	"Microsoft BASIC 7.0: Language Reference" for versions 7.00 and 7.10:
	
	   RETURN with a line label or line number can return control to a
	   statement in the module-level code only, not in procedure-level
	   code.
	
	The following is taken from Page 227 (under the heading "ON event
	Statement") of "Microsoft BASIC 7.0: Language Reference" for versions
	7.00 and 7.10:
	
	   The RETURN linenumber or RETURN linelabel forms of RETURN can be
	   used to return to a specific line from the trapping routine. Use
	   this type of return with care, however, because any GOSUB, WHILE,
	   or FOR statements active at the time of the trap remain active.
	   BASIC may generate error messages such as NEXT without FOR. In
	   addition, if an event occurs in a procedure, a RETURN linenumber or
	   RETURN linelabel statement cannot get back into the procedure
	   because the line number or label must be in the module-level code.
	
	The above information is accurate, but it should be added that if an
	event occurs in a procedure (SUB or FUNCTION), then returning from
	event-handling with the RETURN <linenumber> statement leaves
	unrecoverable information on the stack, which eventually leads to the
	error message "Out of Stack Space" after many trapped events.
