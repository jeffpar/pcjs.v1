---
layout: page
title: "Q62456: Incorrect Results When Compiling with Near Strings"
permalink: /pubs/pc/reference/microsoft/kb/Q62456/
---

## Q62456: Incorrect Results When Compiling with Near Strings

	Article: Q62456
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900517-165
	Last Modified: 1-JUN-1990
	
	A program compiled with the Near Strings option (without /Fs) may
	produce incorrect results when the program uses a combination of the
	following:
	
	1. The LEN function on a variable length string
	2. Integer division
	3. String concatenation
	
	The same program will run correctly when run from the QBX.EXE
	environment or when compiled with Far Strings (with /Fs).
	
	Microsoft has confirmed this to be a problem in the BC.EXE 7.00
	compiler provided with Microsoft BASIC Professional Development System
	(PDS) version 7.00 for MS-DOS and MS OS/2. We are researching this
	problem and will post new information here as it becomes available.
	This problem does not occur in earlier versions of Microsoft BASIC
	Compiler (BC.EXE).
	
	This problem results from incorrect optimization by the BC.EXE 7.00
	compiler. You can disable these optimizations by either compiling with
	the /X compiler switch or by including line numbers in the area of the
	program where the error occurs.
	
	The following steps reproduce the problem:
	
	1. Use the LEN function on a variable-length string.
	
	2. Take the number returned by the LEN function and perform integer
	   division on that number.
	
	3. Reassign a concatenated string to the variable-length string
	   mentioned in step 1.
	
	4. Again, use the LEN function on the variable-length string and
	   perform integer division on that result.
	
	If the program is compiled with Near Strings, the result of the
	calculation in Step 4 will be incorrect.
	
	The program below demonstrates the problem. The second PRINT statement
	should display a value of 9; however, if the program is compiled with
	Near Strings, a 0 will be displayed instead. The value returned by
	LEN(a$) is correct, but when integer division is performed on this
	value, an incorrect result is produced.
	
	   PRINT LEN(a$) \ 2
	   a$ = "concatenate " + "strings"
	   PRINT LEN(a$) \ 2        'the value printed here is incorrect
	   END
	
	Listed below are four different methods to work around the problem:
	
	1. Compile the program with /X or include line numbers in the area
	   of the program where the problem occurs. Both of these actions
	   disable some of the compiler optimizations that are the cause
	   of this problem.
	
	2. Do not use integer division. Instead, perform regular division
	   and then use the INT function to get the desired result, as in the
	   following example:
	
	      PRINT INT(LEN(a$) / 2)
	      a$ = "concatenate " + "strings"
	      PRINT INT(LEN(a$) / 2)
	      END
	
	3. Avoid string concatenation, as follows:
	
	      PRINT LEN(a$) \ 2
	      a$ = "concatenate strings"  'assign a$ to 1 string instead of
	                                  'using concatenation
	      PRINT LEN(a$) \ 2
	      END
	
	4. Assign the string that was created by concatenating strings to
	   another string variable. Then, perform the LEN function on the
	   new string, as in the following example:
	
	      PRINT LEN(a$) \ 2
	      a$ = "concatenate " + "strings"
	      b$ = a$                'insert this line
	      PRINT LEN(b$) \ 2      'and perform the rest of the
	                             'calculations on b$
	      END
