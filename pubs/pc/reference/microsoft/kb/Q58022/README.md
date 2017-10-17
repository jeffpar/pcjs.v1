---
layout: page
title: "Q58022: QB.EXE Variable Is Wrongly Global If Name Same as COMMON Array"
permalink: /pubs/pc/reference/microsoft/kb/Q58022/
---

## Q58022: QB.EXE Variable Is Wrongly Global If Name Same as COMMON Array

	Article: Q58022
	Version(s): 4.00 4.00b
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.00 buglist4.00b fixlist4.50 SR# S900110-109
	Last Modified: 7-FEB-1990
	
	Naming a variable the same as an array in COMMON incorrectly makes the
	variable global in the following program when run in the QB.EXE
	environment of QuickBASIC Version 4.00 or 4.00b.
	
	Microsoft has confirmed this to be a problem in QuickBASIC Versions
	4.00 and 4.00b. This problem was corrected in QuickBASIC Version 4.50.
	
	To work around this problem, you can either upgrade to Version 4.50 or
	compile the program to an .EXE with BC.EXE.
	
	Code Example
	------------
	
	The value of the variable "test2" incorrectly changes when the
	function "test" is called. This behavior is incorrect because the
	variable in the main program is not SHARED, and therefore, the test2
	variable in the function should be kept separate from the one in the
	main module. The problem is related to passing an array, test2(), in
	the COMMON SHARED statement that has the same name as the variable,
	test2.
	
	  DEFDBL T
	  DECLARE FUNCTION test (temp%)
	  DIM test2(100)
	  COMMON SHARED test2()
	    test2 = 1.299933
	    CLS
	    PRINT "Before Test Test2 = "; test2
	    res = test(10)
	    PRINT "After Test Test2 = "; test2
	 END
	
	FUNCTION test (temp%)
	    PRINT "Test2 = "; test2
	    test2 = 3.999
	    PRINT "Test2 =  "; test2
	    test = test2
	END FUNCTION
