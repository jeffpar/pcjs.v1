---
layout: page
title: "Q43788: M.EXE Editor's CALLTREE Does Not Support BASIC Source Files"
permalink: /pubs/pc/reference/microsoft/kb/Q43788/
---

## Q43788: M.EXE Editor's CALLTREE Does Not Support BASIC Source Files

	Article: Q43788
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | B_QuickBas SR# S890212-9
	Last Modified: 1-FEB-1990
	
	The CALLTREE program used by the Microsoft M.EXE editor does not
	produce meaningful results for BASIC source files. The CALLTREE
	utility is provided with the Microsoft Editor for use with Microsoft C
	and Microsoft Macro Assembler (MASM). It returns a listing of a C or
	MASM program's function-calling structure in a tree format. CALLTREE
	processes BASIC files with no error messages; however, the results are
	not correct.
	
	This information applies to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, to Microsoft BASIC Professional
	Development System (PDS) Version 7.00, and to Microsoft QuickBASIC
	Versions 2.00, 2.01, 3.00, 4.00, 4.00b, and 4.50. (Note: The Microsoft
	M.EXE editor comes with the BASIC compiler 6.00 and 6.00b and
	Microsoft BASIC PDS Version 7.00 but not with any version of the
	QuickBASIC package.)
	
	Code Example
	------------
	
	The following is the BASIC SOURCE FILE for testing CALLTREE:
	
	DECLARE SUB anysub1 ()
	DECLARE SUB anysub3 ()
	DECLARE SUB anysub2 ()
	
	CLS
	CALL anysub3
	END
	
	SUB anysub1
	  PRINT "inside of subroutine 1"
	END SUB
	
	SUB anysub2
	PRINT "Inside of subroutine 2"
	CALL anysub1
	END SUB
	
	SUB anysub3
	  PRINT "Inside of subroutine 3"
	  CALL anysub2
	END SUB
	
	The following is the CALLTREE OUTPUT for the above BASIC file:
	
	anysub1
	anysub3
	anysub2
	
	The following is the C SOURCE FILE for testing CALLTREE:
	
	void func1(void)
	{
	  printf("Inside of function 1\n");
	}
	
	void func2(void)
	{
	  printf("inside of function 2\n");
	  func1();
	}
	
	void func3(void)
	{
	  printf("Inside of function 3\n");
	  func2();
	}
	
	void main(void)
	{
	  func3();
	}
	
	The following is the CALLTREE OUTPUT for the above C program:
	
	func1
	|   printf?
	func2
	|   printf?
	|   func1
	|   |   printf?
	func3
	|   printf?
	|   func2
	|   |   printf?
	|   |   func1
	|   |   |   printf?
	main
	|   func3
	|   |   printf?
	|   |   func2
	|   |   |   printf?
	|   |   |   func1
	|   |   |   |   printf?
