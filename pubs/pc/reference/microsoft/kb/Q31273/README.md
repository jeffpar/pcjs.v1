---
layout: page
title: "Q31273: INPUT X% Statement Gives No &quot;Type Mismatch&quot; for d, e, !, or #"
permalink: /pubs/pc/reference/microsoft/kb/Q31273/
---

## Q31273: INPUT X% Statement Gives No &quot;Type Mismatch&quot; for d, e, !, or #

	Article: Q31273
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist3.00 buglist4.00 buglist4.00b buglist4.50
	Last Modified: 21-SEP-1990
	
	A "Type Mismatch" error does not occur if the INPUT statement receives
	any of the following noninteger-type symbols in an integer variable:
	
	1. d (double-precision exponential)
	
	2. e (exponential)
	
	3. ! (single-precision exponential)
	
	4. # (double-precision exponential)
	
	Instead, a value of 0 (zero) is input. QuickBASIC automatically
	converts the noninteger-type symbol to zero (0) instead of giving a
	"Type Mismatch" error message.
	
	Microsoft has confirmed this to be a problem in QuickBASIC versions
	3.00, 4.00, 4.00b, and 4.50 for MS-DOS; in Microsoft BASIC Compiler
	versions 6.00, 6.00b (buglist6.00, buglist6.00b) for MS-DOS and MS
	OS/2; in Microsoft BASIC Professional Development System versions 7.00
	and 7.10 for MS-DOS and OS/2 (buglist7.00, buglist7.10); and in
	Microsoft GW-BASIC Interpreter versions 3.20, 3.22, and 3.23
	(buglist3.20, buglist3.22, buglist3.23) for MS-DOS. We are researching
	this problem and will post new information here as it becomes
	available.
	
	Note: The "Type Mismatch" error message occurs in the above products,
	except for BASIC PDS 7.00 and 7.10, if you input only a percent sign
	("%", which marks integer constants) in response to INPUT for an
	integer variable. In BASIC PDS 7.00 and 7.10, a % is correctly input
	with a value of zero.
	
	The following code demonstrates the above problem:
	
	' A value of zero is input if the following noninteger-type
	' characters are input into an integer variable: d (double exponential),
	' e (single precision exponential), !, and #
	INPUT "ENTER AN INTEGER ",i%
	PRINT i%
	END
	
	Additional reference words: B_GWBasicI B_BasicCom
