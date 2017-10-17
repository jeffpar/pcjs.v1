---
layout: page
title: "Q68024: BC.EXE &quot;AS Missing&quot; in TYPE Using Space Between Array and ()"
permalink: /pubs/pc/reference/microsoft/kb/Q68024/
---

## Q68024: BC.EXE &quot;AS Missing&quot; in TYPE Using Space Between Array and ()

	Article: Q68024
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S901121-21 buglist7.00 buglist7.10
	Last Modified: 9-JAN-1991
	
	The BC.EXE compiler gives the error "AS Missing" on an array in a TYPE
	statement if you mistakenly leave a space between the last letter in
	the array name and the left parenthesis. (This misleading error
	message will occur only if you create the program in an editor other
	than QBX.EXE. The problem doesn't occur when you save the program in
	QBX.EXE because QBX.EXE automatically removes the offending space
	character.)
	
	Microsoft has confirmed this to be a problem with the Microsoft BASIC
	Professional Development System versions 7.00 and 7.10 for MS-DOS and
	MS OS/2. We are researching this problem and will new information here
	as it becomes available.
	
	Workaround
	----------
	
	To work around the problem in any editor other than QBX.EXE, remove
	the offending space character.
	
	To reproduce this problem, enter the following code example into any
	text editor other than QBX.EXE. (Note that if you load this program
	into the QBX.EXE environment, the space between the array name and the
	"(" character will automatically be removed.)
	
	TYPE t1
	  s (1 TO 45) AS SINGLE
	END TYPE
	
	The BC.EXE compiler produces the following output when compiling this
	code:
	
	Microsoft (R) BASIC Compiler Version 7.10
	Copyright (C) Microsoft Corporation 1982-1990. All rights reserved.
	 0030   0006       s (1 TO 45)  AS SINGLE
	                     ^ AS missing
	                     ^ Skipping forward to END TYPE statement
	
	45962 Bytes Available
	45853 Bytes Free
	
	    0 Warning Error(s)
	    2 Severe  Error(s)
