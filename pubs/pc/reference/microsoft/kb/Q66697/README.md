---
layout: page
title: "Q66697: Compiler Incorrectly Generates 80186+ Code"
permalink: /pubs/pc/reference/microsoft/kb/Q66697/
---

	Article: Q66697
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 11-NOV-1990
	
	The sample code below incorrectly generates the instruction "shl bx,
	2" for 8086/8088 machines when compiled with the large or compact
	memory model (/AL or /AC). When using an 8086/8088 machine, the only
	valid second operands are cl and 1. The ability to use an immediate
	value other than 1 was not available until the 80186.
	
	Sample Code
	-----------
	
	extern int bar (double *,double *, double *, double *,
	                int, int, void *, int, char, int);
	
	void foo (double *, double *, double *, double *,
	                int, int, int, int, int, int);
	
	#define RESET 0x02
	
	void foo (double * dPtr1, double *dPtr2, double *dPtr3,
	          double * dPtr4, int i1, int i2, int i3, int i4,
	          int i5, int i6)
	{
	   double **ldPtrPtr;
	
	   bar(dPtr1, dPtr2, dPtr3, dPtr4, i4, i1, &ldPtrPtr[i4][i1],
	       RESET, RESET, i6);
	}
