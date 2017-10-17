---
layout: page
title: "Q58411: C Char Parameters Passed from BASIC as 2-Byte Parameters"
permalink: /pubs/pc/reference/microsoft/kb/Q58411/
---

## Q58411: C Char Parameters Passed from BASIC as 2-Byte Parameters

	Article: Q58411
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900126-85 B_BasicCom S_C S_QuickC BAS2C
	Last Modified: 9-FEB-1990
	
	Microsoft C uses 2 bytes when passing single-byte parameters;
	therefore, to pass a single-byte data item by value between C and
	BASIC, the BASIC parameter must be DECLAREd as an INTEGER.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50 for MS-DOS, to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2, to Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and MS OS/2, to
	Microsoft QuickC Versions 2.00 and 2.01 for MS-DOS, and to Microsoft C
	Compiler Versions 5.00 and 5.10 for MS-DOS and MS OS/2.
	
	The two programs below demonstrate passing a character by value from
	BASIC to C.
	
	To run the programs, do the following:
	
	1. Compile as follows, depending on which language you are using:
	
	   a. Compile in BASIC as follows:
	
	         BC testb ;
	
	   b. For Microsoft C Versions 5.00 and 5.10, compile as follows:
	
	         CL -c -AL test.c ;
	
	   c. For Microsoft QuickC, compile as follows:
	
	         QCL -c -AL test.c ;
	
	2. LINK with the following line:
	
	      LINK /NOE testb+test ;
	
	The following program, TESTB.BAS, illustrates passing characters from
	BASIC to C by using the ASCII values and DECLAREing the C char
	parameter with BYVAL var AS INTEGER:
	
	   DECLARE SUB test CDECL (BYVAL a%, BYVAL b%)
	   CALL test(ASC("A"), ASC("B"))
	   END
	
	TEST.C is as follows:
	
	   void test(char a, char b)
	     {
	     printf("%c %c\n",a,b);
	     }
	
	When compiled and run, TESTB.EXE displays the following:
	
	   A B
