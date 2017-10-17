---
layout: page
title: "Q31170: SELECT, IF, FOR, DO, WHILE, CASE, and SUB Structure Errors"
permalink: /pubs/pc/reference/microsoft/kb/Q31170/
---

## Q31170: SELECT, IF, FOR, DO, WHILE, CASE, and SUB Structure Errors

	Article: Q31170
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 21-DEC-1989
	
	A common programming error is to incorrectly close one type of
	control structure inside another. In many cases, you may get an error
	message that does not seem to apply. However, if you look more
	closely, you will find a structure in the program that was not
	properly closed.
	   The following are errors that you can receive in QuickBASIC when
	you have improperly nested control structures:
	
	   1. CASE               without SELECT
	   2. ELSE               without IF
	   3. IF                 without END IF
	   4. END IF             without block IF
	   5. FOR                without NEXT
	   6. NEXT               without FOR
	   7. DO                 without LOOP
	   8. LOOP               without DO
	   9. WHILE              without WEND
	  10. WEND               without WHILE
	  11. SELECT             without END SELECT
	  12. SUB/FUNCTION       without END SUB/FUNCTION
	  13. END SUB/FUNCTION   without SUB/FUNCTION
	
	   If one of the above errors occurs, one of the following situations
	has occurred:
	
	   1. A control structure has been opened but never closed.
	   2. A control structure has been closed but never opened.
	   3. A control structure has been closed outside of the block it
	controls.
	
	   The following program demonstrates the problem:
	
	REM This program executes correctly and does not
	REM produce any error messages. However, the nature of
	REM the code is complex enough that it can easily lead to
	REM an improper error message if the control structures
	REM are not terminated properly. For example, deleting any
	REM line of this program causes a control structure error.
	
	SUB MySub
	 SELECT CASE x
	    CASE 1
	       IF 0 THEN
	         FOR i = 1 TO x
	            DO
	               WHILE 0
	               WEND
	            LOOP UNTIL 0
	         NEXT i
	       ELSE IF 0 THEN x = 1
	       END IF
	    CASE ELSE
	 END SELECT
	END SUB
