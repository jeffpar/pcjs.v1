---
layout: page
title: "Q41579: C2073 When Porting Code from QuickC 2.00 to C 5.10"
permalink: /pubs/pc/reference/microsoft/kb/Q41579/
---

## Q41579: C2073 When Porting Code from QuickC 2.00 to C 5.10

	Article: Q41579
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | s_c
	Last Modified: 28-FEB-1989
	
	QuickC Version 2.00 allows arrays to be initialized within functions.
	This procedure is not supported in C Version 5.10. Therefore, code
	that utilizes this added facility of QuickC Version 2.00 will not port
	directly to C Version 5.10.
	
	An attempt to compile the code that initializes arrays declared within
	functions under Version 5.10 of the C optimizing compiler will result
	in the following error message, even though the code compiles with no
	errors and no warnings under Version 2.00 of QuickC:
	
	   C2073: "Cannot Initialize Array In Function"
	
	The following code will compile without error and execute as expected
	when compiled under QuickC Version 2.00, but will fail with the
	compile time error C2073 when compiled under C Version 5.10:
	
	#include <stdio.h>
	void main(void)
	 {
	   char s[10] = "Hello";
	 }
	
	To work around this problem, initialize the array outside of any
	function, as in the following modification of the above example:
	
	#include <stdio.h>
	char s[10] = "Hello";
	
	void main (void)
	   {
	   {
