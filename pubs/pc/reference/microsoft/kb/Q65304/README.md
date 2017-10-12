---
layout: page
title: "Q65304: C2059 and C2065 May Be Caused by Not Including stdio.h"
permalink: /pubs/pc/reference/microsoft/kb/Q65304/
---

	Article: Q65304
	Product: Microsoft C
	Version(s): 5.x 6.00 | 5.x 6.00
	Operating System: MS-DOS   | OS/2
	Flags: ENDUSER |
	Last Modified: 31-AUG-1990
	
	When a function prototype has a pointer of type FILE in the parameter
	list and stdio.h is not included, it will give the error on the "*"
	because the compiler assumes that FILE is a data name instead of a
	typedef, which it really is. To eliminate the error, include stdio.h
	before the FILE typedef is used in the code.
	
	The same problem (not including stdio.h) may manifest itself as the
	following error message:
	
	   C2065 : 'FILE' : undefined
	
	The workaround is the same.
	
	Sample Code
	-----------
	
	void test(FILE *fp); // This line will cause the C2059 error.
	
	void main ()
	{
	  FILE *fp;          // This line will cause the C2065 error.
	
	  test(fp);
	
	}
	
	void test(FILE *vp)
	{
	}
