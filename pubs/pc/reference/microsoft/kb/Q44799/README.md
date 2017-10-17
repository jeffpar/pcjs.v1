---
layout: page
title: "Q44799: INSTR() Function Performs ASCII Compare and Is Case Sensitive"
permalink: /pubs/pc/reference/microsoft/kb/Q44799/
---

## Q44799: INSTR() Function Performs ASCII Compare and Is Case Sensitive

	Article: Q44799
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI B_BasicInt B_MQuickB B_BBasic
	Last Modified: 13-DEC-1989
	
	The INSTR function (provided in all Microsoft BASICs) compares the
	ASCII values of the search string with the ASCII values of the string
	to be searched, and is, therefore, case sensitive. For example, when
	INSTR compares "AB" with "Ab", INSTR returns 0 (zero) because the
	strings are different.
	
	This information applies to the following products:
	
	1. Microsoft QuickBASIC Version 1.00 for the Apple Macintosh
	
	2. Microsoft BASIC Compiler Version 1.00 for the Apple Macintosh
	
	3. Microsoft BASIC Interpreter Versions 1.00, 1.01, 2.00, 2.10, and
	   3.00 for the Apple Macintosh
	
	4. Microsoft QuickBASIC Compiler Versions 1.00, 1.01, 1.02, 2.00,
	   2.01, 3.00, 4.00, 4.00b, and 4.50 for the IBM PC
	
	5. Microsoft BASIC Compiler Versions 5.35 and 5.36 for MS-DOS
	
	6. Microsoft BASIC Compiler Versions 6.00, and 6.00b for MS OS/2
	   and MS-DOS
	
	7. Microsoft BASIC Profesional Development System 7.00 for MS-DOS and
	   MS OS/2
	
	8. Microsoft GW-BASIC Interpreter Versions 3.20, 3.22, and 3.23
	
	The INSTR function returns the character position of the first
	occurrence of a string in another string. The syntax for INSTR
	is as follows
	
	   INSTR ( [Start,] string1, string2 )
	
	where the variables refer to the following:
	
	   Variable  Description
	
	   Start     The [optional] character location to begin searching in
	             string1
	
	   string1   The character string to be searched
	
	   string2   The character string to be searched for
	
	The values returned by the INSTR function are as follows:
	
	   Value     Description
	
	   n         Refers to the character position of string2 in string1.
	
	   0         string2 was not found in string1.
	
	   0         string1 is a null string ("").
	
	   0         The value for Start is greater than the length of string1.
	
	If string2 is a null string (""), then INSTR returns the value of 1
	unless a Start argument was specified, in which case it returns a
	value equal to Start.
	
	For more information about the INSTR function, please consult your
	BASIC language reference manual.
	
	Code Example
	------------
	
	   PRINT INSTR("ABCDEF","D")   ' Found in column 4.
	   PRINT INSTR("ABCDEF","d")   ' Not found, since case differs
	
	Output:
	
	   4
	   0
