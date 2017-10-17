---
layout: page
title: "Q39916: Using _dos_findfirst to Get the Time and Date"
permalink: /pubs/pc/reference/microsoft/kb/Q39916/
---

## Q39916: Using _dos_findfirst to Get the Time and Date

	Article: Q39916
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |  s_quickc
	Last Modified: 30-DEC-1988
	
	The code below illustrates how to extract the time and the date out of
	the C run-time function _dos_findfirst. The program prints out the
	time and the date of the creation of the file "test".
	
	This information also applies to QuickC.
	
	The time at which the file was last written is returned as a binary
	value in a word formatted as follows:
	
	   Bits     Meaning
	
	   0-4      Number of seconds DIVIDED BY TWO
	        (to find actual number of seconds, multiply by two)
	   5-10     Minutes
	   11-15    Hours, based on a 24-hour clock
	
	The date at which the file was last written is returned as a binary
	value in a word formatted as follows:
	
	   Bits     Meaning
	
	   0-4      Day of the month
	   5-8      Month (1 = January and so on)
	   9-15     Number of the year minus 1980
	
	The following is a sample code:
	
	#include <dos.h>
	#include <stdio.h>
	
	struct {
	  unsigned biseconds: 5;  /* in units of TWO seconds */
	  unsigned minutes: 6;
	  unsigned hours:   5;
	} *ptime;
	
	struct{
	  unsigned day:   5;
	  unsigned month: 4;
	  unsigned year:  7;
	} *pdate;
	
	struct find_t c_file;
	
	main()
	{
	   _dos_findfirst ("test", _A_NORMAL, &c_file);
	
	   system("cls");
	
	   ptime = &c_file.wr_time;
	   pdate = &c_file.wr_date;
	
	   printf ("Created at %u:%u:%u",\
	            ptime->hours, ptime->minutes, ptime->seconds * 2);
	        /* NOTE: seconds are divided by two when stored,
	             so we have to multiply by two to get
	             the proper value.... */
	
	   printf ("on %u-%u-%u.",\
	            pdate->month, pdate->day, pdate->year);
	}
	
	The program might produce the following output (depending on when the
	file "test" was created):
	
	   Created at 10:32:28 on 12-19-8
	
	Note that the seconds field of the time will always be even.
	
	For more information on function _dos_findfirst, see "Microsoft C 5.1
	Optimizing Compiler Run-Time Library Reference," starting on Page 194.
