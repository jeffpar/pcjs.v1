---
layout: page
title: "Q67080: Functions in Function Prototypes Cannot Have Typedef Arguments"
permalink: /pubs/pc/reference/microsoft/kb/Q67080/
---

## Q67080: Functions in Function Prototypes Cannot Have Typedef Arguments

	Article: Q67080
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | S_QUICKC buglist5.10 buglist6.00 buglist6.00a
	Last Modified: 4-DEC-1990
	
	According to the ANSI specification, types and typedefs should both be
	able to exist interchangeably in function prototypes, and the
	Microsoft C and QuickC compilers do allow function prototypes to
	include typedefs in the parameter type list. However, the compilers do
	not allow parameters to functions or function pointers within the type
	list to have typedef'd parameters. For example, given the following
	declarations
	
	   typedef int FirstType;
	   typedef int SecondType;
	   int foo( int, FirstType, int *( SecondType ) );
	
	the compilers have no problem with "FirstType" but they will halt with
	an error when they reach "SecondType".
	
	Although the syntax is correct according to ANSI, the compilers
	incorrectly generate the following error when they encounter the
	second typedef:
	
	   error C2061: syntax error : identifier 'SecondType'
	
	Microsoft has confirmed this to be a problem in C versions 5.10, 6.00,
	and 6.00a and QuickC versions 2.00, 2.01, 2.50, and 2.51 (buglist2.00,
	buglist2.01, buglist2.50, and buglist2.51). We are researching this
	problem and will post new information here as it becomes available.
