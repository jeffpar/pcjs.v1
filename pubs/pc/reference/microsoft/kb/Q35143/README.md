---
layout: page
title: "Q35143: Using GOSUB, GOTO, ON Event GOSUB, ON ERROR GOTO in Modules"
permalink: /pubs/pc/reference/microsoft/kb/Q35143/
---

## Q35143: Using GOSUB, GOTO, ON Event GOSUB, ON ERROR GOTO in Modules

	Article: Q35143
	Version(s): Ox2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 16-DEC-1989
	
	A normal GOSUB Label or GOTO Label statement must be at the same level
	of code as the label. For example, if a GOSUB Label statement occurs
	inside a SUB...END SUB (or FUNCTION...END FUNCTION) procedure block,
	the label must also occur within that block.
	
	This information applies to Microsoft QuickBASIC Versions 4.00 4.00b
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, and to Microsoft BASIC PDS Version 7.00
	for MS-DOS and MS OS/2.
	
	Only the BASIC compiler 7.00 has an enhanced form of local error
	trapping in which the label may be local to the current SUB or
	FUNCTION, as the following example shows:
	
	SUB SUB1
	     ON LOCAL ERROR GOTO errorhandler
	
	EXIT SUB
	errorhandler:
	     RESUME NEXT
	END SUB
	
	However, the following statements must have their labels at the module
	level:
	
	   ON ERROR GOTO Label
	   ON Event GOSUB Label (where "Event" may be COM, KEY, PEN, PLAY,
	                        STRIG, or TIMER)
	
	The "module level" is defined as the area in a source file that is
	outside all subprogram or FUNCTION procedure blocks.
	
	Once the ON Event GOSUB Label and Event ON statements are executed,
	event trapping continues until an Event OFF is executed (where "Event"
	may be COM, KEY, PEN, PLAY, STRIG, or TIMER).
	
	In QuickBASIC Versions 2.00, 2.01, 3.00, and 4.00, the ON ERROR GOTO
	Label statement must be established for each module; otherwise, an
	error occurring in that module will not be trapped, and the program
	will stop.
	
	In contrast to earlier versions, QuickBASIC Versions 4.00b and 4.50
	and Microsoft BASIC Compiler Versions 6.00, 6.00b, and 7.00 for MS-DOS
	and MS OS/2 offer global handling of ON ERROR (as explained in the
	UPDATE.DOC disk file). With global error-handling, an ON ERROR handler
	in the main program handles errors occurring in separate modules when
	those modules do not have their own ON ERROR handlers.
	
	For related information query on the following words:
	
	   subprogram and module and error and resume and QuickBASIC
	
	The following is a code example:
	
	' MODULE 1
	DECLARE SUB mod2sub2 ()
	DECLARE SUB mod1sub1 ()
	DECLARE SUB mod2sub1 ()
	ON ERROR GOTO errhand1  ' Sets first error handler in main module
	KEY 15, CHR$(0) + CHR$(1)  ' Sets up trapping of ESCAPE key.
	KEY(15) ON                 ' Turns on trapping of ESCAPE key.
	ON KEY(15) GOSUB lower     ' "lower" label is at module level
	PRINT "in main"
	GOSUB lower    ' You may GOSUB or GOTO a label in this module
	               ' only at the level of the main module.
	CALL mod1sub1
	CALL mod2sub1  ' Establishes an error handler for mod2
	CALL mod2sub2
	ERROR 3
	END
	lower:
	  PRINT "This gosub/label can be reached";
	  PRINT " only from main level mod1 or"
	  PRINT "by pressing the ESCAPE key the";
	  PRINT " first time in mod2 sub1": PRINT
	  RETURN
	errhand1:
	  PRINT "take care of error on main level mod 1": PRINT
	  RESUME NEXT
	SUB mod1sub1
	    GOSUB localLabel  ' localLabel must be local to the subroutine
	    GOTO done:
	  localLabel:
	    PRINT "I am here in mod1 sub1 simulating error in mod1 subprog1"
	    ERROR 1    'this error is handled ok
	    RETURN
	  done:
	END SUB
	
	' MODULE 2
	mod2: PRINT "this does not get activated/ mod2 main "
	mod2main:
	  PRINT "simulating error in nextmod mod2 main called from subprog2"
	  ERROR 1
	  RETURN
	errhand2:
	  PRINT " took care of the error in mod2 top level":PRINT
	  RESUME NEXT
	SUB mod2sub1
	   ON ERROR GOTO errhand2
	'  Must get new direction once per module in
	'  QuickBASIC 3 AND 4. However, in QuickBASIC
	'  4.00b and BASIC Compiler 6.00, errhand1 will still trap the error
	'  but RESUME NEXT resumes at the END SUB.
	   PRINT "simulating an error "
	   ERROR 1
	   PRINT "press escape"    ' ESCAPE here causes jump
	   FOR i = 1 TO 10000: NEXT ' to routine defined in main
	   ON KEY(15) GOSUB mod2main ' but after this
	   PRINT "press escape again" ' ESCAPE now causes jump
	   FOR i = 1 TO 10000: NEXT    ' to nextmod
	END SUB
	SUB mod2sub2
	   ERROR 2  'this is ok if mod2sub1 is called first
	END SUB
