---
layout: page
title: "Q45688: BC.EXE 4.50 &quot;Internal Error Near 361F&quot; Passing Integers to SUB"
permalink: /pubs/pc/reference/microsoft/kb/Q45688/
---

## Q45688: BC.EXE 4.50 &quot;Internal Error Near 361F&quot; Passing Integers to SUB

	Article: Q45688
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890606-96 buglist4.50
	Last Modified: 9-JUL-1990
	
	A compiler error message, "Internal error near 361F," occurs when the
	code below is compiled with the BC.EXE that comes with QuickBASIC
	version 4.50.
	
	This problem does NOT occur in the QuickBASIC 4.50 environment, in
	QuickBASIC Compiler versions 4.00 or 4.00b, in BASIC Compiler versions
	6.00 or 6.00b, or in BASIC Professional Development System (PDS)
	version 7.00.
	
	The code example below will cause an "Internal error near 361F" with
	BC.EXE in QuickBASIC 4.50. The problem seems to stem from the
	complicated integer computation.
	
	To work around this problem, use a temporary variable for part of the
	calculation.
	
	Microsoft has confirmed this to be a problem in QuickBASIC version
	4.50. Microsoft is researching this problem and will post new
	information here as it becomes available.
	
	The following is a code example:
	
	SUB test (i0%, i1%, i2%, i3%)       '4 integer parameters necessary
	'Work-around: use temporary variable:
	' temp% = i3% \ i2%
	' i1% = i1% + temp% + 1
	i1% = i1% + i3% \ i2% + 1           'remove any operation fixes
	i3% = 1                             'this line is necessary
	END SUB
