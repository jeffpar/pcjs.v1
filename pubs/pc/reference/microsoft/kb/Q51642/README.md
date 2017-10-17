---
layout: page
title: "Q51642: QuickC 2.00: /Ot Code Generation Error"
permalink: /pubs/pc/reference/microsoft/kb/Q51642/
---

## Q51642: QuickC 2.00: /Ot Code Generation Error

	Article: Q51642
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm buglist2.00 buglist2.01
	Last Modified: 21-MAR-1990
	
	The following small program, when compiled under QuickC Version 2.00
	or 2.01, with /Ot included in the optimizations, generates the wrong
	code.
	
	With /Ot, the output is as follows:
	
	   array [0] = 0
	
	The correct output is as follows:
	
	   array [0] = 1
	
	The error occurs in the code generated for the following:
	
	   array[index] = test;
	
	/* Ot.c: /Ot optimization error */
	
	#include <stdlib.h>
	#include <stdio.h>
	
	int array[4];
	
	void main(void)
	{
	     int index = 0,
	          test;
	
	     test = atoi("1");
	
	     array[index] = test;
	
	     printf("array [%d] = %d \n", index, array[index]);
	}
	
	Microsoft has confirmed this to be a problem with QuickC Versions 2.00
	and 2.01. We are researching this problem and will post new
	information here as it becomes available.
