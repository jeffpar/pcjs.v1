---
layout: page
title: "Q64436: mktime() Function Does Not Flag Invalid Dates Before 1970"
permalink: /pubs/pc/reference/microsoft/kb/Q64436/
---

	Article: Q64436
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | s_quickc buglist6.00 buglist2.50 buglist2.51
	Last Modified: 31-AUG-1990
	
	The mktime() function is documented as returning a -1 if the date in
	the tm structure was before 1980. Actually, a -1 is returned if the
	date is between 1970 and 1980. If the date is earlier than 1970, an
	invalid date is returned.
	
	Sample Code
	-----------
	
	/* The following code reproduces this behavior. */
	
	#include <time.h>
	#include <stdio.h>
	#include <sys\types.h>
	#include <sys\timeb.h>
	#include <string.h>
	
	void main()
	{
	   int c;
	   struct tm vartime = {0, 0, 6, 16, 7, 0, 0, 0, 1};
	
	   for (c = 81; c > 65; c--)
	   {
	      vartime.tm_year = c;
	      printf("Year = %d.\n", c);
	      if (mktime(&vartime) != (time_t) (-1))
	         printf("Time entered is: %s\n\n", asctime(&vartime));
	   }
	}
	
	Microsoft has confirmed this to be a problem in C version 6.00 and in
	QuickC versions 2.50 and 2.51. We are researching this problem and
	will post new information here as it becomes available.
