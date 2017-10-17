---
layout: page
title: "Q58609: ON...GOSUB Example from QB 4.50 Help Gives &quot;Label Not Defined&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q58609/
---

## Q58609: ON...GOSUB Example from QB 4.50 Help Gives &quot;Label Not Defined&quot;

	Article: Q58609
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900208-105 B_BasicCom
	Last Modified: 26-FEB-1990
	
	The ON...GOSUB example from the QB Advisor online Help system in
	Microsoft QuickBASIC Version 4.50 causes a "Label not defined" error
	when run without modification. This is not a documentation error,
	since the preface to the example states "the following program
	fragment...", thus implying that the code is incomplete.
	
	The Microsoft Advisor online Help system for QBX.EXE (QuickBASIC
	Extended) in Microsoft BASIC Professional Development System (PDS)
	Version 7.00 for MS-DOS has a complete working example for ON...GOSUB.
	
	ON...GOSUB Example from QB.EXE Version 4.50
	-------------------------------------------
	
	The following example, taken from the ON...GOSUB example in the
	QuickBASIC 4.50 online Help system, produces a "Label not defined"
	error on the ON...GOSUB statement:
	
	'The following program fragment causes program control to branch to
	'one of the four subroutines listed, depending on the value of Chval:
	
	DO
	    CLS
	    PRINT "1) Display attendance at workshops."
	    PRINT "2) Calculate total registration fees paid."
	    PRINT "3) Print mailing list."
	    PRINT "4) End program."
	    PRINT : PRINT "What is your choice?"
	    DO
	       Ch$ = INKEY$
	    LOOP WHILE Ch$ = ""
	    Chval = VAL(Ch$)
	    IF Chval > 0 AND Chval < 5 THEN
	        ON Chval GOSUB Shop, Fees, Mailer, Progend
	    END IF
	LOOP
	END
	
	To use the above example, you must define the four GOSUB labels
	(Shop:, Fees:, Mailer:, and Progend:).
	
	ON...GOSUB Example from QBX.EXE Version 7.00
	--------------------------------------------
	
	The following similar example from the QBX.EXE online Help system runs
	without error:
	
	'This example uses the ON...GOSUB statement to cause program control to
	'branch to one of three subroutines, depending on the value of Chval.
	
	CLS    'Clear screen.
	Attend = 20
	Fees = 5 * Attend
	PRINT "1  Display attendance at workshops"
	PRINT "2  Calculate total registration fees paid"
	PRINT "3  End program"
	PRINT : PRINT "What is your choice?"
	Choice:
	    DO
	       ch$ = INKEY$
	    LOOP WHILE ch$ = ""
	    Chval = VAL(ch$)
	    IF Chval > 0 AND Chval < 4 THEN
	        ON Chval GOSUB Shop, Fees, Progend
	    END IF
	END
	Shop:
	    PRINT "ATTENDANCE IS", Attend
	    RETURN Choice
	Fees:
	    PRINT "REGISTRATION FEES ARE $"; Fees
	    RETURN Choice
	Progend:
	    END
