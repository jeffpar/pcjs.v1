---
layout: page
title: "Q49501: Ftime: C Function -- Documentation Supplement"
permalink: /pubs/pc/reference/microsoft/kb/Q49501/
---

	Article: Q49501
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC S_QuickASM docsup
	Last Modified: 17-JUL-1990
	
	The ftime function takes a pointer to a timeb structure as its only
	parameter and has no return value. Ftime calculates the current time
	and returns it by modifying the timeb structure. The structure
	contains the following elements in the given order:
	
	Name      Type           Description
	----      ----           -----------
	
	time      time_t(long)   The time in seconds since 00:00:00 Greenwich
	                         mean time, January 1, 1970. This time is
	                         calculated under MS-DOS by calling Int 21,
	                         function 2Ah (Get Date), converting the
	                         results to seconds, and adding the current
	                         time, which is also converted to seconds.
	
	millitm   USHORT         Fraction of a second in milliseconds. This
	                         value is actually not milliseconds on most
	                         systems. On most IBM PCs and compatibles, the
	                         clock speed is not fast enough to compute
	                         milliseconds, or indeed, hundredths of
	                         seconds. The ftime function calls interrupt
	                         21, function 2Ch (under DOS), which returns,
	                         among other information, the seconds in
	                         hundredths. The hundredths information is an
	                         estimation based on the clock speed, which is
	                         approximately 18.2 ticks per second on most
	                         PCs. The hundredths value is then multiplied
	                         by ten to get the millisecond value.
	
	timezone  short          The difference in minutes, moving westward,
	                         between Greenwich mean time and local time.
	                         This is equal to the global variable
	                         timezone, from a call to the tzset function.
	
	dstflag   short          This flag is nonzero if daylight savings
	                         time (DST) is currently in effect for the local
	                         time zone. This is done by a call to the
	                         internal function _isindst. This function
	                         takes a timeb structure as a parameter and
	                         returns an integer flag. This is the rule for
	                         years before 1987; a time is in DST if it is
	                         on or after 02:00:00 on the last Sunday in
	                         April and before 01:00:00 on the last Sunday
	                         in October. This is the rule for years
	                         starting with 1987; a time is in DST if it
	                         is on or after 02:00:00 on the first Sunday
	                         in April and before 01:00:00 on the last
	                         Sunday in October. (See tzset for more
	                         information on DST.)
	
	Other sources of information include the Version 5.10 "Microsoft C for the
	MS-DOS Operating System: Run-Time Library Reference," Pages 308-9 and
	the ftime function in the "C Run-Time Library Source Routines".
