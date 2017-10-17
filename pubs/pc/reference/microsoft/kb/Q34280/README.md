---
layout: page
title: "Q34280: QB &quot;String Space Corrupt&quot; Using a CONST in a FIELD Statement"
permalink: /pubs/pc/reference/microsoft/kb/Q34280/
---

## Q34280: QB &quot;String Space Corrupt&quot; Using a CONST in a FIELD Statement

	Article: Q34280
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 B_BasicCom
	Last Modified: 12-DEC-1989
	
	If a CONST constant is used as a variable in a FIELD statement and the
	program is run more than once in the QuickBASIC Environment (QB.EXE),
	a "String Space Corrupt" error will be generated.
	
	BC.EXE correctly flags this programming error at compile time with the
	message "Variable required."
	
	Microsoft has confirmed this to be a problem in the QB.EXE in
	Microsoft QuickBASIC Versions 4.00 and 4.00b, and in the version of
	QuickBASIC shipped with the Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS OS/2 and MS-DOS (buglist6.00 and buglist6.00b). This
	problem was corrected in QuickBASIC Version 4.50 and in the QBX.EXE
	environment of the Microsoft BASIC PDS Version 7.00 (fixlist7.00).
	
	To duplicate the problem, run the following sample program twice in
	the QuickBASIC Environment (QB.EXE):
	
	   const x="x"
	   open "test" as #1
	   field #1, 10 as x$
	
	If this program is compiled with BC.EXE, the compiler correctly flags
	the programming error as follows:
	
	Microsoft (R) QuickBASIC Compiler Version 4.00b
	Copyright (C) Microsoft Corp. 1982-1988. All rights reserved.
	 0030   0006    field #1, 10 as x$
	                                ^ Variable required
	
	43059 Bytes Available
	42804 Bytes Free
	
	    0 Warning Error(s)
	    1 Severe  Error(s)
