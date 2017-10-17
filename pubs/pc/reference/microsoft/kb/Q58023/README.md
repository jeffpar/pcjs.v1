---
layout: page
title: "Q58023: Multidimensional Limit for Undeclared (Non-DIMmed) Arrays"
permalink: /pubs/pc/reference/microsoft/kb/Q58023/
---

## Q58023: Multidimensional Limit for Undeclared (Non-DIMmed) Arrays

	Article: Q58023
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom docerr SR# S900108-52
	Last Modified: 5-MAR-1990
	
	When you reference an array without first dimensioning it with the DIM
	statement, it is an undeclared array, and the highest element
	subscript in each dimension always defaults to 10.
	
	No errors should occur for an undeclared array that has 3 or fewer
	dimensions, as in the following example:
	
	   X(1,1,1)=0
	
	However, if the undeclared (non-DIMMed) array has more than three or
	four dimensions, such as X(1,1,1,1,1), you may get one or more of the
	following error messages, depending upon the product version and the
	number of dimensions referenced:
	
	   Subscript out of range
	   Out of data space
	   Out of memory
	   Array not dimensioned
	   Array too big
	
	Which error message displays depends on whether the array type is
	string or numeric, how many dimensions you give the undeclared array,
	whether the program is run in the QuickBASIC QB.EXE environment or
	compiled with BC.EXE, and which version of BASIC or QuickBASIC is
	used.
	
	This information applies to Microsoft QuickBASIC Versions 1.00, 1.01,
	1.02, 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50 for MS-DOS, to Microsoft
	BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and MS OS/2, and to
	Microsoft BASIC Professional Development System (PDS) Version 7.00 for
	MS-DOS and MS OS/2.
	
	You can easily test to see exactly which errors are generated for all
	combinations of the criteria above. Note that it is always safe to
	access any undeclared array as long as it does not have more than 3
	dimensions. (Note: Don't confuse dimensions with number of subscripts
	per dimension.)
	
	Regarding this topic, there is a difference between versions of
	QuickBASIC up to 3.00 and Versions 4.00 and later. In Versions 4.00
	and later, undeclared numeric arrays can have 4 or fewer dimensions,
	and undeclared variable-length-string arrays can have 3 or fewer
	dimensions. Versions of QuickBASIC earlier than 4.00 require all
	undeclared arrays to have 3 or fewer dimensions. The restrictions that
	apply to Versions 4.00 and later also apply to Microsoft BASIC
	Compiler Versions 6.00 and 6.00b and Microsoft BASIC Professional
	Development System (PDS) Version 7.00.
	
	The following code examples illustrate the minimum number of
	dimensions in the undeclared array that are needed to generate an
	error for specific versions of QuickBASIC, BASIC Compiler, and BASIC
	PDS:
	
	'QuickBASIC Versions 1.00, 1.01, 2.00, 2.01, and 3.00:
	PRINT a(1,2,3,4)  ' Numeric array, error for 4 or more dimensions
	PRINT a$(1,2,3,4) ' Variable-length string array, error 4 or more dims
	
	'QuickBASIC Versions 4.00, 4.00b, 4.50, BASIC compiler Versions 6.00
	' and 6.00b, and BASIC PDS Version 7.00:
	PRINT a(1,2,3,4,5) ' Numeric array, error for 5 or more dimensions
	PRINT a$(1,2,3,4) ' Variable-length string array, for 4 or more dims.
	
	To eliminate the errors, dimension the arrays to the size(s) you want
	using the DIM statement.
	
	The above limitations need to be added on the page referenced in the
	Index entry under "Arrays, dimensioning" in the following manuals:
	
	1. "Microsoft QuickBASIC 4.5: BASIC Language Reference" for Version
	   4.50
	
	2. "Microsoft QuickBASIC 4.0: BASIC Language Reference" manual for
	   Versions 4.00 and 4.00b
	
	3. "Microsoft QuickBASIC Compiler" Versions 2.0x and 3.00 manual
	
	4. "Microsoft BASIC Version 7.0: Language Reference" manual
	
	5. "Microsoft BASIC Compiler 6.0: BASIC Language Reference" for
	   Versions 6.00 and 6.00b
