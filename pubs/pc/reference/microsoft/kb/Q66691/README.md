---
layout: page
title: "Q66691: No &quot;Block IF Without END IF&quot; Using IF...THEN REM in QB/QBX.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q66691/
---

## Q66691: No &quot;Block IF Without END IF&quot; Using IF...THEN REM in QB/QBX.EXE

	Article: Q66691
	Version(s): 6.00 6.00b 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | B_QUICKBAS buglist6.00 buglist6.00b buglist7.00 buglist7.10
	Last Modified: 14-NOV-1990
	
	In compiled BASICs that support block IF statements, the following
	statement correctly implies a block IF ... END IF statement, instead
	of a single-line IF statement syntax (whereas GW-BASIC correctly
	treats this as a single-line IF because GW-BASIC has no block IF
	syntax):
	
	   IF expression THEN ' Comment
	
	However, using a THEN REM statement, as follows, poses a problem:
	
	   IF expression THEN REM Comment
	
	The problem is that the QBX.EXE (or QB.EXE) environment interprets
	THEN REM as indicating a single-line IF statement, whereas BC.EXE
	compiler interprets THEN REM as indicating a block IF.
	
	This inconsistency applies to Microsoft QuickBASIC versions 4.00,
	4.00b, 4.50 (buglist4.00, buglist4.00b, buglist4.50) for MS-DOS; to
	Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS and MS
	OS/2; and to Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	When compiling the code example below, BC.EXE gives a "Block IF
	without END IF" error but the QBX.EXE or QB.EXE environment doesn't
	give an error, and interprets the IF ... THEN REM statement as a
	single-line IF statement. If an END IF statement is put at the end of
	the code, the code example will compile with no error in BC.EXE but
	the QBX.EXE or QB.EXE environment will give an "END IF without block
	IF" error.
	
	The problem is caused by the REM statement on the IF line. In the
	QBX.EXE or QB.EXE environment, this case is interpreted as a
	single-line (non-block) IF. The BC.EXE compiler, however, strips off
	the REMark and interprets the line as the start of a block IF
	statement.
	
	Microsoft is researching which consistent syntax requirement should be
	adopted for IF ... THEN REM and will post new information here as it
	becomes available.
	
	Code Example
	------------
	
	IF a = 3 THEN REM  Gives "Block IF without END IF" in BC.EXE
	a = 5
	
	To a avoid this problem, a remark should never be placed after a THEN
	statement. For example, the following code example avoids this problem
	by putting the remark on a separate line:
	
	REM   This remark doesn't cause a problem.
	IF a = 3 THEN
	a = 5
	END IF
