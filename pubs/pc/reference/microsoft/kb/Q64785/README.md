---
layout: page
title: "Q64785: ON KEY Key Trap with INKEY&#36; Loop Requires Additional Key Press"
permalink: /pubs/pc/reference/microsoft/kb/Q64785/
---

## Q64785: ON KEY Key Trap with INKEY&#36; Loop Requires Additional Key Press

	Article: Q64785
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900731-96 B_BasicCom
	Last Modified: 13-AUG-1990
	
	A commonly used key-trapping strategy relies on using an INKEY$ loop
	to wait for a key press that is then handled by an ON KEY GOSUB
	handler. Using this strategy requires two key presses: one that
	triggers the ON KEY trap and another to exit the INKEY$ loop upon
	returning from the key handler. When making use of a key handler that
	performs a process transparent to the user, the key trap may appear to
	require two keystrokes for processing to continue. This behavior may
	be problematic for those who want processing to resume after one
	keystroke. This article contains a code example demonstrating this
	behavior and three other code examples illustrating alternate
	key-trapping strategies that require only one key press for processing
	to continue.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	When an INKEY$ loop is used in conjunction with the ON KEY statement
	to wait for a key press, control is passed to the ON KEY handler when
	a trappable key press occurs. Because the ON KEY GOSUB statement
	clears the keyboard buffer, the INKEY$ loop will still be waiting for
	a key press when control is returned from the ON KEY GOSUB handler.
	Therefore, a second key press is required to exit the INKEY$ loop.
	
	This behavior can be overcome either by using the SLEEP statement in
	place of the INKEY$ loop, by setting a flag within the ON KEY handler
	that will cause the INKEY$ loop to abort after a key trap, or by
	RETURNing from the key handler to a line number or label outside of
	the INKEY$ loop.
	
	The following code example demonstrates the requirement for a second
	key press:
	
	   CLS
	   ON KEY(1) GOSUB handler:
	   KEY(1) ON
	   PRINT "Press the F1 key"
	   WHILE INKEY$ = ""
	   WEND
	   END
	   handler:
	           PRINT "In key handler"
	           RETURN
	
	The following strategies can be used to allow processing to continue
	after one key press:
	
	Sample 1: Using The SLEEP Statement
	-----------------------------------
	
	   CLS
	   ON KEY(1) GOSUB handler:
	   KEY(1) ON
	   PRINT "Press the F1 key"
	   SLEEP                    'Note: The SLEEP statement was not supported
	   END                      '      until QuickBASIC version 4.00b. This
	                            '      example will fail in earlier versions.
	   handler:
	           PRINT "In key handler"
	           RETURN
	
	Sample 2: Using Flag to Exit Out of INKEY$ Loop
	-----------------------------------------------
	
	   CONST TRUE = -1
	   CONST FALSE = NOT TRUE
	
	   CLS
	   TrappedFlag% = FALSE
	   ON KEY(1) GOSUB handler:
	   KEY(1) ON
	   PRINT "Press the F1 key"
	   WHILE INKEY$ = "" AND NOT TrappedFlag%
	   WEND
	   END
	
	   handler:
	           TrappedFlag% = TRUE
	           PRINT "In key handler"
	           RETURN
	
	Sample 3: RETURN to a Fixed Line Label or Line Number
	-----------------------------------------------------
	
	   CLS
	   ON KEY(1) GOSUB handler:
	   KEY(1) ON
	   PRINT "Press the F1 key"
	   WHILE INKEY$ = ""
	   WEND
	
	   OutOfLoop:
	   END
	
	   handler:
	           PRINT "In key handler"
	           RETURN OutOfLoop:
	
	WARNING: Do not use the RETURN <line> statement if the ON KEY() GOSUB
	statement at the main-level code traps a key pressed within a SUB or
	FUNCTION procedure, since RETURN <line> would then leave unrecoverable
	return addresses on the stack, which eventually leads to an "Out of
	Stack Space" error after many key-trapping GOSUB iterations. RETURN
	<line> should only be used in the handler for keys trapped at the main
	program level.
	
	Sample 3 above works without producing the "Out of Stack Space" error
	because no keys are pressed or trapped in SUB or FUNCTION procedures.
