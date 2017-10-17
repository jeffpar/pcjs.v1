---
layout: page
title: "Q45907: QuickBASIC's Hierarchy of Operations"
permalink: /pubs/pc/reference/microsoft/kb/Q45907/
---

## Q45907: QuickBASIC's Hierarchy of Operations

	Article: Q45907
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S890605-156 B_BasicCom B_GWBasicI
	Last Modified: 27-DEC-1989
	
	The following information on "Hierarchy of Operations" was taken from
	Pages 45-46 of the "Microsoft QuickBASIC 4.0: BASIC Language
	Reference" manual for Versions 4.00 and 4.00b. This information also
	applies to the following products:
	
	1. Microsoft GW-BASIC Versions 3.20, 3.22, and 3.23
	
	2. QuickBASIC Versions 1.00, 1.01, 1.02, 2.00, 2.01, 3.00, 4.00,
	   4.00b, and 4.50
	
	3. Microsoft BASIC Compiler Versions 5.35, 5.36, 6.00, and 6.00b
	
	4. Microsoft BASIC PDS Version 7.00.
	
	The BASIC operators have an order of precedence, that is, when several
	operations take place within the same program statement (without being
	grouped by parentheses), some operations are executed before others.
	Operations are executed in the following order:
	
	1. Arithmetic operations
	
	   a. Exponential (^)
	
	   b. Negation (-)
	
	   c. Multiplication and division (*, /)
	
	   d. Integer division (\)
	
	   e. Modula arithmetic (MOD)
	
	   f. Addition and subtraction (+, -)
	
	2. Relational operations (=, >, <, <>, <=, >=)
	
	3. Logical operations
	
	   a. NOT
	
	   b. AND
	
	   c. OR
	
	   d. XOR
	
	   e. EQV
	
	   f. IMP
	
	An exception to the order of operations listed above occurs when an
	expression has adjacent exponentiation and negation operators. In this
	case, the negation is done first. For example, the following statement
	prints the value .0625 (equivalent to 4^-2), not -16 (equivalent to
	-(4^2)):
	
	   PRINT 4 ^ -2
	
	If operators on the same precedence level appear in the same
	expression, they are computed from left to right.
	
	For more information on the "Hierarchy of Operations," consult the
	BASIC language reference manual for your version of BASIC.
