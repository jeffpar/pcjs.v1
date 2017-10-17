---
layout: page
title: "Q31297: A GOTO Inside SELECT CASE Incorrectly Executes ELSE Block"
permalink: /pubs/pc/reference/microsoft/kb/Q31297/
---

## Q31297: A GOTO Inside SELECT CASE Incorrectly Executes ELSE Block

	Article: Q31297
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 5-DEC-1989
	
	In a compiled .EXE program, if a GOTO statement is executed inside of
	a SELECT CASE block, when that CASE is executed as expected, the CASE
	ELSE is also (wrongly) executed.
	
	However, the program behaves correctly when run in the QB.EXE editor.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b and in the Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and OS/2 (buglist6.00, buglist6.00b). This problem
	was corrected in QuickBASIC Version 4.50 and in the Microsoft BASIC
	Compiler Version 7.00 (fixlist7.00).
	
	The following code example demonstrates this problem:
	
	     x=1
	     select case x
	      case 1
	       print "one"
	       goto 100
	100:   print "hundred"
	      case 2
	       print "two"
	      case else
	       print "else"
	     end select
	
	The (incorrect) output from the above program as an .EXE is as
	follows:
	
	   one
	   hundred
	   else
	
	The (correct) output when run in the QuickBASIC environment is as
	follows:
	
	   one
	   hundred
	
	You can work around the problem of using GOTO and a label in a CASE by
	ending that CASE with a GOTO to a label that is after the END SELECT
	statement, as follows:
	
	     x=1
	     select case x
	      case 1
	       goto 100
	       print "never prints"
	100:   print "hundred"
	       goto 200   ' This GOTO is the workaround solution.
	      case 2
	       print "two"
	      case else
	       print "else"
	     end select
	200: print "After END SELECT"
