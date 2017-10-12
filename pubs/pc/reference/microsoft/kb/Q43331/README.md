---
layout: page
title: "Q43331: Changing System Time or Date Will Temporarily Pause Clock"
permalink: /pubs/pc/reference/microsoft/kb/Q43331/
---

	Article: Q43331
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 17-MAY-1989
	
	The system clock temporarily pauses when the time or the date is set.
	This feature prevents cases in which the date or time may need to be
	updated during the actual time change. For example, an attempt to set
	the system date exactly at midnight using _dos_setdate would not
	produce the desired effect if the system changed the date at the same
	time it was being set. Therefore, the system clock pauses.
	
	The effects of such a pause can be seen in the sample program that
	follows. If you run this program, you will find upon exit that the
	system time is the same as when the program was started.
	
	The following is the sample program:
	
	/* Note - this code takes a couple of minutes to run */
	#include <stdio.h>
	#include <dos.h>
	
	struct dosdate_t Date;
	struct dostime_t Time;
	unsigned long loop;
	
	void main(void)  {
	   _dos_getdate(&Date);       /* Show time when starting */
	   _dos_gettime(&Time);
	   printf ("Today's date is %d-%d-%d\n", Date.month, Date.day,
	           Date.year);
	   printf ("Start time = %d:%d\n", Time.hour, Time.minute);
	
	   Date.year = 1988;
	   for (loop = 1; loop <= 200000; loop++) {
	      _dos_setdate(&Date);
	   }
	
	   _dos_getdate(&Date);       /* Show time after loop */
	   _dos_gettime(&Time);
	   printf ("Date is now %d-%d-%d\n", Date.month, Date.day, Date.year);
	   printf ("End time = %d:%d\n", Time.hour, Time.minute);
	}
