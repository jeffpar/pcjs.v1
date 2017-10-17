---
layout: page
title: "Q38335: sscanf Example Using a Comma (,) as Delimiter"
permalink: /pubs/pc/reference/microsoft/kb/Q38335/
---

## Q38335: sscanf Example Using a Comma (,) as Delimiter

	Article: Q38335
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 12-DEC-1988
	
	The example below shows how to use the sscanf C Run-Time function
	to read from an internal buffer delimiting fields with a comma (,).
	The key is to use the brackets in the format of sscanf function. The
	format would be %[^','], which tells the function to read from the
	buffer until a comma (,) is reached.
	
	The following is a C source example illustrating the use of brackets
	and the caret (^):
	
	#include <math.h>
	#include <stdio.h>
	
	char *tokenstring = "first,25.5,second,15";
	int result, i;
	double fp;
	char o[10], f[10], s[10], t[10];
	
	main()
	{
	 result = sscanf(tokenstring, "%[^','],%[^','],%[^','],%s", o, s, t, f);
	 fp = atof(s);
	 i  = atoi(f);
	 printf("%s\n %lf\n %s\n %d\n", o, fp, t, i);
	}
