---
layout: page
title: "Q68383: TZ and tzset Only Use Whole Hours: How to Work Around"
permalink: /pubs/pc/reference/microsoft/kb/Q68383/
---

	Article: Q68383
	Product: Microsoft C
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | s_quickc
	Last Modified: 6-FEB-1991
	
	Question:
	
	In looking through the documentation for the TZ environment variable
	and the tzset() function, it appears that only whole hours can be used
	for time-zone adjustments. I want to calculate the time in SriLanka,
	which is 330 minutes off of GMT. How should I do that?
	
	Response:
	
	It is true that the TZ environment variable allows only whole numbers.
	This may change in a future release of the run-time libraries when we
	support the POSIX implementation (which would allow for partial
	hours). In the meantime, the only workaround is to use a second
	environment variable (for example, TZ2) as an indicator so you can add
	the thirty minutes to the times returned by, and passed to, functions
	that return and use local times.
