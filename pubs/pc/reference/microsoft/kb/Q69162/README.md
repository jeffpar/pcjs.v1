---
layout: page
title: "Q69162: VAL Function Returns &quot;Type Mismatch&quot; for Some Invalid Numbers"
permalink: /pubs/pc/reference/microsoft/kb/Q69162/
---

## Q69162: VAL Function Returns &quot;Type Mismatch&quot; for Some Invalid Numbers

	Article: Q69162
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BASICCOM SR# S910121-320
	Last Modified: 14-FEB-1991
	
	The VAL function may return the error message "Type mismatch" in
	specific cases if the string value is not a valid number. In most
	other cases, VAL normally returns 0 (zero) for invalid numbers.
	
	This information applies to Microsoft QuickBASIC 4.00, 4.00b, and
	4.50, to Microsoft BASIC Compiler 6.00 and 6.00b, and to Microsoft
	BASIC Professional Development System (PDS) 7.00 and 7.10.
	
	Microsoft is researching this problem and will post new information
	here as it becomes available.
	
	The VAL function returns the numeric value of a string expression that
	represents a number. VAL interprets the sequence of characters until a
	character is found that cannot be recognized as part of a number. If
	the string is not a valid number (such as a string of alphabetic
	characters), the VAL function returns zero. However, in certain cases,
	a string of alphabetic characters will return the "Type mismatch"
	error.
	
	The problem often occurs with a string expression that starts out with
	a valid numeric expression, such as "&" (for example, &H for
	hexadecimal notation), "-" (for example, a negative number), or "+"
	(for example, a positive number), but follows that with an invalid
	character. When parsing such a string, the VAL function will encounter
	an invalid numeric format and give "Type mismatch" when it should
	return zero.
	
	Examples
	--------
	
	PRINT VAL("12.32")            '12.32 prints correctly
	PRINT VAL("s%k&r3ds")         '0 prints correctly
	PRINT VAL("&+%we3")        'Gives "Type mismatch", but should be 0
	
	The string expressions listed below generate the "Type mismatch" error
	when passed to the VAL function. This is not a complete list.
	
	Each line in the table below shows combinations of characters, which
	are grouped by the following rules:
	
	   [] = Encloses symbol required to pass to VAL
	   |  = Logical or (separates choices in a list of characters)
	   char = CHR$(32) through CHR$(126)
	   real = A valid number which contains a decimal point
	   NULL = A byte value equal to 0 (zero)
	   integer = A valid number with no decimal point
	
	List of known string of symbols:
	
	[ & | D | E | NULL ] +% [ NULL | char ]
	[ & | D | E | NULL ] +& [ NULL | char ]
	[ & | D | E | NULL ] +@ [ NULL | char ]
	[ & | D | E | NULL ] -% [ NULL | char ]
	[ & | D | E | NULL ] -& [ NULL | char ]
	[ & | D | E | NULL ] -@ [ NULL | char ]
	
	[ + | - | . | integer | NULL ] .% [ NULL | char ]
	[ + | - | . | integer | NULL ] .& [ NULL | char ]
	
	[ + | - | . | real | NULL ] D% [ NULL | char ]
	[ + | - | . | real | NULL ] D& [ NULL | char ]
	[ + | - | . | real | NULL ] D@ [ NULL | char ]
	[ + | - | . | real | NULL ] E% [ NULL | char ]
	[ + | - | . | real | NULL ] E& [ NULL | char ]
	[ + | - | . | real | NULL ] E@ [ NULL | char ]
	
	[ . ][ real ][ % | & ]
	[ E | D ][ integer ][ % | & | @ ]
	
	For other examples where the VAL function gives a "Type mismatch"
	error, query on the following words:
	
	   BASIC and VAL and type and mismatch
