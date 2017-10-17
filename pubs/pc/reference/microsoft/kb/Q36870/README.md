---
layout: page
title: "Q36870: Error C2106 when Assigning a String Literal to a char Array"
permalink: /pubs/pc/reference/microsoft/kb/Q36870/
---

## Q36870: Error C2106 when Assigning a String Literal to a char Array

	Article: Q36870
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 18-OCT-1988
	
	A common error in C is to attempt to fill a character array, defined
	as char arrayname[somelength], with a string constant by use of the
	simple-assignment operator (i.e., the equal sign, = ). This error
	causes the compiler error "error C2106: '=' : left operand must be
	lvalue."
	
	Example 1, which does not compile and causes this error, follows
	immediately. An extended example (Example 2), which compiles and runs
	and demonstrates some concepts, is given below along with its output.
	
	The following is Example 1:
	
	/* This code gives compiler error C2106. */
	#include <string.h>
	char string1[10];
	
	void main(void);
	void main(void)
	{
	        string1 = "String1";
	}
	
	As another way to fill an array, non-auto (i.e. global) char arrays
	and char pointers (starting with C Version 5.00) may be initialized
	when declared as in the following two lines:
	
	char string1[10] = "String1";
	char *string2 = "String2";
	
	The following is Example 2:
	
	/* This example demonstrates some string usage principles. */
	#include <stdio.h>
	#include <string.h>
	#include <malloc.h>
	
	char string1[40];       /* string1 is an array of char  */
	char *string2;          /* string2 is a pointer to char */
	        /* Important: Know when to malloc space for string2. */
	
	void main(void);
	void main(void)
	{
	            /* This shows the correct way to achieve the   */
	            /* assignment intended by string1 = "String1"; */
	        strcpy(string1, "Contents of string1");
	        printf("1:%s\n\n", string1);
	
	            /* These two assignments show two ways to     */
	            /* use a char pointer with a string literal.  */
	        string2 = "Contents of string2"; /* point to the literal */
	        printf("2:%s\n", string2);
	            /* allocate memory for char *string2 to point at */
	        string2 = (char *) malloc(sizeof(string1));
	        strcpy(string2, "Contents of string2, again");
	        printf("3:%s\n\n", string2);
	        free(string2);
	
	        /* This shows a failed attempt to fill a char  */
	            /* array by assignment through a char pointer. */
	        string2 = string1;
	        string2 = "Contents of string2, but not string1";
	        printf("4:%s\n", string1);
	        printf("5:%s\n\n", string2);
	
	            /* This shows how correctly to use a pointer   */
	            /* to fill a char array with a string literal. */
	        string2 = string1;
	        strcpy(string2, "Contents of string2, and also string1");
	        printf("6:%s\n", string1);
	        printf("7:%s\n\n", string2);
	}
	
	The output of this example is as follows:
	
	1:Contents of string1
	
	2:Contents of string2
	
	3:Contents of string2, again
	
	4:Contents of string1
	5:Contents of string2, but not string1
	
	6:Contents of string2, and also string1
	7:Contents of string2, and also string1
