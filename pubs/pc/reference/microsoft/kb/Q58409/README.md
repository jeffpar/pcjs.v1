---
layout: page
title: "Q58409: 7.00 Problem Passing Near Fixed String to Recursive FUNCTION"
permalink: /pubs/pc/reference/microsoft/kb/Q58409/
---

## Q58409: 7.00 Problem Passing Near Fixed String to Recursive FUNCTION

	Article: Q58409
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist7.00 fixlist7.10
	Last Modified: 20-SEP-1990
	
	The problem described below is so rare that it will not be encountered
	by most readers.
	
	When passing a fixed-length string variable as a variable-length
	string parameter to a recursive FUNCTION procedure in the program
	below, the fixed-length string variable is nulled (reduced to "") when
	the FUNCTION procedure returns if you compiled with BC.EXE using near
	strings. Renaming the FUNCTION procedure eliminates this problem.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC
	Professional Development System (PDS) version 7.00 for MS-DOS and MS
	OS/2. This problem was corrected in BASIC PDS version 7.10.
	
	Note that this problem occurs only if the original variable is a
	fixed-length string and you are executing from a program compiled to
	use near strings. If the original variable is a variable-length string
	or the program uses far strings (either in the QBX.EXE environment or
	in a compiled program), this error does not occur.
	
	The program below demonstrates the error. To reproduce the problem,
	compile and link the program using Microsoft BASIC PDS 7.00 as
	follows:
	
	   BC /o Recfun.bas;
	   LINK Recfun.bas;
	
	Executing the program below shows that the string variable "parm1" is
	nulled after the return from the recursive function call to "CTRL".
	
	To work around the problem, do one of the following:
	
	1. Add the /Fs (far strings) option to the compile line.
	
	2. Rename the CTRL FUNCTION procedure to FUN2 (or some other name).
	
	3. Change the DIM statement for "original" to read as follows:
	
	      DIM original AS STRING
	
	Code Example
	------------
	
	The following program, RECFUN.BAS, shows the problem:
	
	   DECLARE FUNCTION Fun1% (parm1 AS STRING)
	   DECLARE FUNCTION ctrl% (parm1 AS STRING, parm2 AS STRING)
	   CONST CASEONE = "1"
	   CONST CASETWO = "2"
	   DIM original AS STRING * 3   'Remove "* 3" to work around problem.
	   CLS
	   original = "ooo"
	   retval% = Fun1%(original)
	   END
	
	   FUNCTION ctrl% (parm1 AS STRING, parm2 AS STRING)
	     DIM retval       AS INTEGER
	     IF parm2 = CASEONE THEN
	       PRINT "Caseone: parm1=["; parm1; "]": SLEEP 1
	     ELSE
	       PRINT "Case two:"
	       PRINT "before recursion:  parm1=["; parm1; "]": SLEEP 1
	       retval = ctrl%(parm1, CASEONE)
	       PRINT "after recursion :  parm1=["; parm1; "]": SLEEP 1
	     END IF
	   END FUNCTION
	
	   FUNCTION Fun1% (parm1 AS STRING)
	     DIM retval         AS INTEGER
	     retval = ctrl%(parm1, CASETWO)
	   END FUNCTION
	
	Workaround
	----------
	
	To work around the problem, rename CTRL to FUN2 as follows:
	
	   DECLARE FUNCTION Fun1% (parm1 AS STRING)
	   DECLARE FUNCTION fun2% (parm1 AS STRING, parm2 AS STRING)
	   CONST CASEONE = "1"
	   CONST CASETWO = "2"
	   DIM original AS STRING * 3   'Remove "* 3" to make it work
	   CLS
	   original = "ooo"
	   retval% = Fun1%(original)
	   END
	
	   FUNCTION Fun1% (parm1 AS STRING)
	     DIM retval         AS INTEGER
	     retval = fun2%(parm1, CASETWO)
	   END FUNCTION
	
	   FUNCTION fun2% (parm1 AS STRING, parm2 AS STRING)
	     DIM retval       AS INTEGER
	     IF parm2 = CASEONE THEN
	       PRINT "Caseone: parm1=["; parm1; "]": SLEEP 1
	     ELSE
	       PRINT "Case two:"
	       PRINT "before recursion:  parm1=["; parm1; "]": SLEEP 1
	       retval = fun2%(parm1, CASEONE)
	       PRINT "after recursion :  parm1=["; parm1; "]": SLEEP 1
	     END IF
	   END FUNCTION
