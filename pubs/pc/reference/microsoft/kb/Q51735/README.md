---
layout: page
title: "Q51735: Clock Function Sets errno"
permalink: /pubs/pc/reference/microsoft/kb/Q51735/
---

## Q51735: Clock Function Sets errno

	Article: Q51735
	Version(s): 5.00 5.10 | 5.00 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 16-JAN-1990
	
	Question:
	
	Why does the clock function set errno?
	
	Response:
	
	The clock function uses intdos() to read the system date and time.
	When intdos() calls the date/time interrupt, the carry flag is set
	upon return. The intdos() function interprets the carry flag as an
	error and sets errno to the value in AL. In the case of a request for
	the system date, AL (and therefore, errno) contains the day of the
	week.
