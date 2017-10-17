---
layout: page
title: "Q39185: BC.EXE &quot;Variable Name Not Unique&quot; Using Period in Identifier"
permalink: /pubs/pc/reference/microsoft/kb/Q39185/
---

## Q39185: BC.EXE &quot;Variable Name Not Unique&quot; Using Period in Identifier

	Article: Q39185
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 SR# S881130-29 ptm214
	Last Modified: 26-FEB-1990
	
	The following program gives a "Variable Name Not Unique" error when
	you attempt to compile with BC.EXE or the Make .EXE File... option in
	QuickBASIC Versions 4.00, 4.00b, and 4.50:
	
	   DIM cur.pos AS INTEGER
	   DIM cur(1,1) AS INTEGER
	
	Microsoft has confirmed this to be a problem with Microsoft QuickBASIC
	Versions 4.00, 4.00b, and 4.50 for MS-DOS, and Microsoft BASIC
	Compiler Versions 6.00 and 6.00b for MS-DOS and OS/2 (buglist6.00,
	buglist6.00b).  The problem was corrected in Microsoft BASIC
	Professional Development System (PDS) Version 7.00.
	
	The same program runs correctly within the QB.EXE editor environment.
	
	To work around the problem, do not use a period (.) in a variable name
	except for an element in a user-defined type (defined with TYPE...END
	TYPE). Another workaround is to use DIM CUR%(1,1) (using the % type
	suffix) instead of DIM CUR(1,1) AS INTEGER.
	
	The error appears in the BC.EXE compiler output listing as follows:
	
	   DIM cur.pos AS INTEGER
	   DIM cur(1,1) AS INTEGER
	                   ^Variable Name Not Unique
