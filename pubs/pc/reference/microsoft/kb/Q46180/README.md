---
layout: page
title: "Q46180: STATIC FUNCTION Fails to Retain Value Between Invocations"
permalink: /pubs/pc/reference/microsoft/kb/Q46180/
---

## Q46180: STATIC FUNCTION Fails to Retain Value Between Invocations

	Article: Q46180
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b buglist4.50 B_BasicCom
	Last Modified: 20-SEP-1990
	
	A function that has been declared with the STATIC attribute should
	retain its value between calls. When a STATIC function is called and
	assigned a value, subsequent calls to the function that do not assign
	a new value to the function should always return the previous value,
	even if you leave the function with an EXIT FUNCTION statement. This
	behavior is correctly exhibited by programs compiled with BC.EXE.
	
	However, when you attempt the same procedure in the QB.EXE or QBX.EXE
	environment, a STATIC FUNCTION fails to retain its value in multiple
	invocations, and incorrectly returns a 0 (zero) or null string,
	depending on the type of the function.
	
	Microsoft has confirmed this to be a problem in the QB.EXE environment
	of Microsoft QuickBASIC versions 4.00, 4.00b, and 4.50; in the QB.EXE
	environment of Microsoft BASIC Compiler versions 6.00 and 6.00b
	(buglist6.00, buglist6.00b); and in the QBX.EXE environment of
	Microsoft BASIC Professional Development System (PDS) versions 7.00
	and 7.10 (buglist7.00, buglist7.10). We are researching this problem
	and will post new information here as it becomes available.
	
	The following sample program demonstrates the problem:
	
	   x% = staticfun%(1)
	   PRINT x%   ' Should print 5.
	   x% = staticfun%(0)
	   PRINT x%   ' Should print 5.
	   END
	
	   FUNCTION staticfun%(parm%) STATIC
	     IF parm% = 0 THEN
	       EXIT FUNCTION
	     ELSE
	       staticfun% = 5
	     END IF
	   END FUNCTION
	
	When this program is compiled with BC.EXE, it correctly prints the
	values 5 and 5. From inside the QuickBASIC QB.EXE or QBX.EXE
	environment, it incorrectly prints 5 and 0.
