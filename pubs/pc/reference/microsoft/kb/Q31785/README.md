---
layout: page
title: "Q31785: &quot;Overflow&quot; Error in Intermediate Integer Calculation"
permalink: /pubs/pc/reference/microsoft/kb/Q31785/
---

## Q31785: &quot;Overflow&quot; Error in Intermediate Integer Calculation

	Article: Q31785
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 17-JAN-1991
	
	Microsoft BASIC compilers make certain compile-time assumptions about
	the numerical types of intermediate results in mathematical
	expressions. These assumptions can sometimes lead to an "overflow"
	error at run time.
	
	The information below applies to QuickBASIC versions 4.00, 4.00b, and
	4.50 for MS-DOS, to Microsoft BASIC Compiler versions 6.00 and 6.00b
	for MS-DOS and MS OS/2, and to Microsoft BASIC Professional
	Development System (PDS) versions 7.00 and 7.10 for MS-DOS and MS
	OS/2.
	
	As an example of this behavior, if you run the following program in
	QuickBASIC, you might expect the output to be 36,000; however, an
	"overflow" error displays instead:
	
	   x& = 6 * 6000
	   PRINT x&
	
	QuickBASIC sees that the "6" and the 6000 are both short integers
	(that is, integers between -32,768 and +32,767), so it assumes that
	the intermediate multiplication result should also be a short integer.
	However, an "Overflow" error results because 36,000 is not in the
	range of short integers.
	
	To force the intermediate expression to be calculated as a long
	integer, make the constants into long integers in the first
	calculations performed in that expression. For example, the following
	two statements work without any error:
	
	   x& = 1& * 6 * 6000   ' 1. & suffix makes a constant a long integer.
	   x& = CLNG(6) * 6000  ' 2. CLNG forces type to be long integer.
	
	Using 1& in the multiplication of 1& * 6 creates an intermediate long
	integer variable that forces the subsequent multiplication (* 6000) to
	be done using long integer.
	
	Note that 6 * 6000 * 1& fails with an "overflow" because the first
	multiplication is done as short integer. The calculation 6 * (6000 *
	1&) avoids this "Overflow" error by changing the order of calculation
	so that a long integer intermediate variable is created before
	multiplying by the 6.
	
	Integer Data Type Notation Standards for BASIC
	----------------------------------------------
	
	Note that the number 6 is the same as 6%, and 6000 is the same as
	6000% in BASIC's short integer notation. Appending the percent (%)
	symbol to a constant makes it explicitly a short integer. Appending
	the ampersand symbol (&) to a constant makes it explicitly a long
	integer. Constants whose types are not explicitly declared will
	default as shown in Chapter 2, "Data Types," of the BASIC language
	reference manual for QuickBASIC versions 4.00 and 4.00b, and Microsoft
	BASIC Compiler version 6.00 and 6.00b for MS-DOS and MS OS/2. This
	information is also found in Appendix B of the "Microsoft BASIC 7.0:
	Programmer's Guide" manual for BASIC PDS 7.00 and 7.10.
