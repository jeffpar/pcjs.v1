---
layout: page
title: "Q27631: Fixed String Initializing, Space &amp; Null Bytes, LEN, and RTRIM&#36;"
permalink: /pubs/pc/reference/microsoft/kb/Q27631/
---

## Q27631: Fixed String Initializing, Space &amp; Null Bytes, LEN, and RTRIM&#36;

	Article: Q27631
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 9-FEB-1990
	
	An uninitialized fixed-length string is filled with null bytes. When
	you initialize a fixed-length string to be equal to "" (the "null
	string"), the string will be filled with blank bytes. This behavior of
	fixed-length strings differs from variable-length strings, and may
	affect your program's use of functions like RTRIM$ in ways you don't
	expect (see code examples below).
	
	Note that a null byte has an ASCII value of zero, the same as is
	returned by the CHR$(0) function, whereas a blank byte has an ASCII
	value of 32, the same as is returned by the CHR$(32) function.
	
	The length shown by the LEN function for a fixed-length string x will
	always be the fixed size n determined in the DIM x AS STRING * n
	statement.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	Note that fixed-length strings are not supported in QuickBASIC
	Versions 3.00 and earlier.
	
	Note that LEN(RTRIM$(x)) returns the actual length of just the
	non-null, nonblank contents of x if x is an INITIALIZED fixed-length
	string. (This is because RTRIM$ actually returns a variable-length
	string.) If x is an UNINITIALIZED fixed-length string, LEN(RTRIM$(x))
	always returns the fixed, dimensioned length, since RTRIM$ is ignored
	in this case.
	
	The following code example demonstrates the difference between
	assigned and unassigned fixed-length strings:
	
	   DIM s AS STRING * 10                          'initially nulls
	   PRINT LEN(s),LEN(RTRIM$(s)),ASC(RIGHT$(s,1))  '10,10 and 0 (null)
	   s = ""                                        'pad with spaces
	   PRINT LEN(s),LEN(RTRIM$(s)),ASC(RIGHT$(s,1))  '10,0 and 32 (space)
	
	In the following sample program, A is a fixed-length string with a
	length of 10 bytes, and B$ is a variable-length string. Both A and B$
	are assigned a string of ten blank characters (ASCII value 32).
	
	   DIM a AS STRING * 10
	   B$ = SPACE$(10)
	   PRINT LEN(RTRIM$(a))  ' Prints 10 since fixed string is uninitialized.
	   PRINT LEN(RTRIM$(b$))  ' Prints 0 for variable-length string.
	   a = ""
	   PRINT LEN(RTRIM$(a))  ' prints 0 as the length of the trimmed string
	                         ' returned by RTRIM$ since fixed string is all
	                         ' blanks.
	
	Note that the RTRIM$ function returns a variable-length string, even
	when a fixed-length string is its argument in parentheses. In the
	above program, the LEN function is operating on the variable-length
	string returned by the RTRIM$ function.
	
	The following code example illustrates one case where the incorrect
	assumption that fixed-length strings are automatically initialized to
	spaces will cause unexpected results. The INPUT statement will never
	get executed, unless the fixed length STRING "s" is initialized to all
	blanks:
	
	DIM s AS STRING * 10        'Desired result: wait until something entered.
	's = ""                     'Uncomment this line for expected results.
	WHILE RTRIM$(s) = ""        'Fails first time since RTRIM$(s)=10 nulls.
	   INPUT "Input data: ",s   'Never executed
	WEND
