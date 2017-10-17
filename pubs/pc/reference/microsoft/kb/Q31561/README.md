---
layout: page
title: "Q31561: Time and Date from _dos_findfirst(), _dos_findnext()"
permalink: /pubs/pc/reference/microsoft/kb/Q31561/
---

## Q31561: Time and Date from _dos_findfirst(), _dos_findnext()

	Article: Q31561
	Version(s): 5.00 5.10 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 15-JAN-1991
	
	The 2-byte return values of the time and date fields returned by
	_dos_findfirst and _dos_findnext are divided into bit ranges that must
	be translated to meaningful values. This translation is usually done
	by combinations of masking and right-shifts (>>).
	
	The following is the time field:
	
	   Bits 0BH-0FH = hours (0 through 23)
	   Bits 05-0AH  = minutes (0 through 59)
	   Bits 00-04H  = number of 2-second increments (0 through 29)
	
	The following is the date field:
	
	   Bits 09-0FH  = year (relative to 1980)
	   Bits 05-08H  = month (0 through 12)
	   Bits 00-04H  = day of month (0 through 31)
