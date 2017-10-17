---
layout: page
title: "Q28037: RESUME NEXT with Single-Line DEF FN RESUMEs Wrongly in QB.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q28037/
---

## Q28037: RESUME NEXT with Single-Line DEF FN RESUMEs Wrongly in QB.EXE

	Article: Q28037
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom buglist4.00 buglist4.00b fixlist4.50
	Last Modified: 31-JAN-1990
	
	In the QB.EXE editor, when an error occurs inside a single-line DEF
	FN function, RESUME NEXT returns control to an unexpected location.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b, and in Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2 (buglist6.00, buglist6.00b). This problem
	was corrected in QuickBASIC Version 4.50 and in Microsoft BASIC
	Professional Development System (PDS) Version 7.00 (fixlist7.00).
	
	In QB.EXE, the code traps the error but resumes to the FOR before it
	exits the loop. (When compiled with BC.EXE, the EXE program handles
	the problem correctly.)
	
	As a workaround, use a multi-line function or FUNCTION procedure
	instead of a single-line DEF FN function.
	
	The problem only occurs with single-line DEF FN and RESUME NEXT. The
	interpreter treats line 20 as the current line (ERL) and resumes at
	line 30. The BASIC compiler says 40 is the current line (ERL) and
	resumes at 50.
	
	The following is a code sample:
	
	   10 on error goto 900
	   20 def FnTest(A) = 1-SQR(A)
	   30 FOR I=4 to -2 STEP -1
	   40    PRINT I, FNTEST(I)
	   50 NEXT
	   60 END
	
	   900 PRINT "No negatives"
	   910 RESUME NEXT
