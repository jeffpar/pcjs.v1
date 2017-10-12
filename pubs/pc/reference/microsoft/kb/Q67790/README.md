---
layout: page
title: "Q67790: %n Format Specifier May Be Ignored in C 6.00 sscanf()"
permalink: /pubs/pc/reference/microsoft/kb/Q67790/
---

	Article: Q67790
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER |
	Last Modified: 6-FEB-1991
	
	If the "%n" format specifier is used within a sscanf() function and
	the format specifier before it causes the last character to be read
	from the string of data, the %n will be ignored and the sscanf()
	function will return without making the %n assignment. This is correct
	per ANSI specifications, since an input failure before the %n
	parameter is evaluated.
	
	The code below demonstrates the problem. Notice that the last
	parameter passed (d) does not get changed. The sscanf() statement
	finishes making assignments as soon as it reaches the end of the
	string.
	
	Sample Code
	-----------
	
	#include <stdio.h>
	
	void main(void)
	{
	   int a,b,c,d;
	   char buffer[50];
	   a=b=c=d=0;
	
	   sscanf("100Dummy2","%n%d%n%s%n",&a,&b,&c,buffer,&d);
	
	   printf("%d  %d  %d\n",a,c,d);
	}
	
	Output
	------
	
	0  3  0
