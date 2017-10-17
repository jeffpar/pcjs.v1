---
layout: page
title: "Q47026: Second sscanf Fails After sscanf Using %i Format"
permalink: /pubs/pc/reference/microsoft/kb/Q47026/
---

## Q47026: Second sscanf Fails After sscanf Using %i Format

	Article: Q47026
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-JUL-1989
	
	The Microsoft C 5.10 run-time function sscanf fails to scan a string
	if the following conditions are met:
	
	1. An initial sscanf using the %i format specifier is carried out on a
	   string with leading white space characters.
	
	2. A second sscanf of a string with leading white space characters
	   will fail.
	
	To work around this problem, do one of the following:
	
	1. Change the format string "%i" to "%d".
	
	2. Change the format string for the second and all following sscanf's so
	   that it causes all leading spaces to be removed. For example, use a
	   format of " %d" instead of "%d".
	
	The following program demonstrates this problem when compiled
	with Microsoft C 5.10 using default compiler options:
	
	#include <stdio.h>
	
	void main(void)
	{
	  char  *str1= "  23  ";
	  char  *str2= "  99  ";
	  int   val0;
	  int   val1;
	  int   val2;
	
	  sscanf(str2,"%d", &val1);     /* this line works correctly */
	  sscanf(str1,"%i", &val0);     /* this line works correctly */
	  sscanf(str2,"%d", &val2);     /* this line will fail       */
	
	  if(val1 != val2)
	        printf("sscanf test failed \n");
	  else
	        printf("sscanf passed test\n");
	}
	
	Microsoft is researching this problem and will post new information as
	it becomes available.
