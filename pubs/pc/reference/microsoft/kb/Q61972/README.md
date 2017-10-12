---
layout: page
title: "Q61972: Internal Compiler Error: @(#)regMD.c:1.100, Line 4634"
permalink: /pubs/pc/reference/microsoft/kb/Q61972/
---

	Article: Q61972
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 29-MAY-1990
	
	The sample code shown below generates the following internal compiler
	error when compiled with the /Ole optimization switch in Compact and
	Large memory models:
	
	   foo.c(22) : fatal error C1001: Internal Compiler Error
	               (compiler file '@(#)regMD.c:1.100', line 4634)
	               Contact Microsoft Product Support Services
	
	Sample Code
	-----------
	
	#include <stdio.h>
	#include <malloc.h>
	
	void main ()
	{
	   char *s1,*s2;
	   int  len;
	   char c;
	   int j;
	
	   s1 = malloc(sizeof(char *));
	   s2 = malloc(sizeof(char *));
	
	   s1 = "this is junk1";
	   s2 = "this is junk2";
	   len = 10;
	
	   for(j=0; j<len; j++){
	      c = s1[j];
	      s1[j]=s2[j];
	      s2[j] = c;     // This line causes error
	      }
	
	   printf (" Done swapping memory ");
	}
	
	The following are two suggested workarounds:
	
	1. Use the #pragma optimize("le", off) statement at the beginning of
	   the module to disable optimization and the #pragma optimize("", on)
	   statement after the module to reenable optimization.
	
	2. Make "c" a pointer to a character. For example, instead of
	
	      char c;
	
	   use the following:
	
	      char *c = " ";
	
	   Also, change the assignment from
	
	      c = s1[j];
	
	   to the following:
	
	      c[0] = s1[j];
