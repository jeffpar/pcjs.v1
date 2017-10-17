---
layout: page
title: "Q57925: Array Elements Are Passed in Temporary Variables for BC /D"
permalink: /pubs/pc/reference/microsoft/kb/Q57925/
---

## Q57925: Array Elements Are Passed in Temporary Variables for BC /D

	Article: Q57925
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S891229-91
	Last Modified: 8-FEB-1990
	
	In a program compiled with the BC /D debug switch, array elements that
	are passed to a SUB or FUNCTION are passed using temporary variables.
	A program that is not compiled with the /D debug switch passes actual
	array elements and does not use temporary variables.
	
	When using the /D debug switch, taking the VARSEG and VARPTR of an
	array element in the module level code returns the address of the
	array element in memory. However, when taking the VARSEG and VARPTR of
	the array element once it has been passed as a parameter to a SUB or
	FUNCTION, VARSEG and VARPTR return the address of the temporary
	variable that the array element is stored in.
	
	In addition, a program that is being run in the QB.EXE or QBX.EXE
	environment passes array elements using temporary variables since
	debug mode is always on in the environment.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	The following sample program demonstrates how BASIC uses temporary
	variables when passing array elements to a SUB or FUNCTION when
	compiled with the /D debug option:
	
	   DIM A%(100)
	   A%(1) = 1
	
	   PRINT "The address of the array element before the call"
	   PRINT VARSEG(A%(1)), VARPTR(A%(1))
	   CALL subtest(A%(1))
	   PRINT "The address of the array element after the call"
	   PRINT VARSEG(A%(1)), VARPTR(A%(1))
	
	   SUB subtest(tempvar%)
	     PRINT "The address of the array element during the call"
	     PRINT "This address should be different if using /D debug switch"
	     PRINT VARSEG(tempvar%), VARPTR(tempvar%)
	   END SUB
	
	Compile and link the code as follows:
	
	   BC /d Test.bas;
	   LINK Test.bas;
