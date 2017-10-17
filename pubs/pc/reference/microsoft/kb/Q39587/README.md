---
layout: page
title: "Q39587: QB Advisor 4.50 &quot;Help: ON ERROR Statement Details&quot; Correction"
permalink: /pubs/pc/reference/microsoft/kb/Q39587/
---

## Q39587: QB Advisor 4.50 &quot;Help: ON ERROR Statement Details&quot; Correction

	Article: Q39587
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr SR# S881206-71
	Last Modified: 19-JAN-1989
	
	The paragraph in the QuickBASIC Version 4.50 QB Advisor (on-line help
	facility) that describes how to perform error trapping in a SUB or
	FUNCTION procedure or DEF FN function is incorrect, and an incorrect
	example is shown.
	
	The paragraph incorrectly states that a SUB, FUNCTION, or DEF FN block
	can contain an error-handling routine. The error handler-label and
	RESUME must be at the main-program level or module level.
	
	The "Help: ON ERROR Statement Details" should instead say the
	following:
	
	   To have an error-handling routine trap errors occurring within a
	   SUB, FUNCTION, or DEF FN block, you need to place the error-
	   handling routine at the module-level code (before the SUB or
	   FUNCTION procedure definition). A label (such as Labelx) marks the
	   start of the error-handler routine. The ON ERROR GOTO Labelx
	   statement must be an executable statement within the same module as
	   Labelx, but Labelx is put OUTSIDE the SUB...END SUB or
	   FUNCTION...END FUNCTION procedure block, and the
	   ON ERROR GOTO Labelx statement can be put INSIDE the
	   procedure block or main program.
	
	Note: QuickBASIC Version 4.50 uses global-error handling. For more
	information about global-error handling, please search for "GLOBAL",
	"ERROR", "HANDLING", and "4.50" in this KnowledgeBase.
	
	The following program correctly demonstrates the flow of control when
	an error occurs in a SUB procedure:
	
	DECLARE SUB dork ()
	  CALL dork
	  PRINT "This is the last statement in main module"
	END
	
	handler:
	  PRINT "error 50 has occurred"
	  RESUME NEXT
	
	SUB dork()
	  ON ERROR GOTO handler
	  ERROR 50              'This forces an error to occur
	  PRINT "In the subroutine"
	END SUB
	
	You can find the incorrect paragraph in the QB Advisor "Help: ON ERROR
	Statement Details," as follows:
	
	1. Run QB.EXE Version 4.50.
	
	2. Press SHIFT+F1 to invoke the QB Advisor Help menu.
	
	3. Select Index.
	
	4. Press PAGE DOWN key, or press "O" to jump directly to the Keywords
	   beginning with the letter "O", then cursor to the ON ERROR statement
	   and select it.
	
	5. Select Details. The following window title appears:
	
	      "Help: ON ERROR Statement Details"
	
	6. Scroll down to the seventh paragraph. This paragraph and the
	   example program below contain errors.
	
	The following is the INCORRECT paragraph and example that can be found
	in the HELP facility:
	
	   " [ The following information is in error: ]
	   SUB and FUNCTION procedures and DEF FN functions can contain their
	   own error handlers. The error handler must be located after the
	   last executable statement but before the END SUB, END FUNCTION, or
	   END DEF statement. To keep the error handler from executing when
	   there is no error, the procedure or function must terminate with an
	   EXIT SUB, EXIT FUNCTION, or EXIT DEF statement immediately ahead of
	   the error handler, as in the following example:
	
	SUB InitializeMatrix (var1, var2, var3, var4)
	      .
	      .
	   ON ERR GOTO ErrorHandler    ' [ Should be ON ERROR, not ON ERR! ]
	      .
	      .
	   EXIT SUB         ' [ EXIT SUB is optional (not required). ]
	
	   ErrorHandler:    ' [ Must move this after END SUB !]
	      .
	      .
	   RETURN           ' [ Use RESUME, not RETURN!  Must move
	                    '   ErrorHandler...RESUME to after END SUB ]
	
	END SUB
	[ end of incorrect HELP example. ] "
