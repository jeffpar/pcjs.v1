---
layout: page
title: "Q57366: DateSerial# Accepts Values Outside Range for Arguments"
permalink: /pubs/pc/reference/microsoft/kb/Q57366/
---

## Q57366: DateSerial# Accepts Values Outside Range for Arguments

	Article: Q57366
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr SR# S891227-47
	Last Modified: 8-JAN-1991
	
	Page 425 of the "Microsoft BASIC 7.0: Language Reference" manual (for
	7.00 and 7.10) states that the DateSerial# function will generate an
	"Illegal function call" if values are specified outside the given
	ranges of the following:
	
	   year%  - A year from 1753 to 2078
	   month% - A month from 1 to 12
	   day%   - A day from 1 to 31
	
	An "Illegal function call" is only generated if the year, month, and
	day arguments generate a serial number outside the valid range of
	-53,688 to 65,380. The corresponding dates for this range are January
	1, 1753, to December 31, 2078.
	
	The README.DOC file provided with Microsoft BASIC Professional
	Development System (PDS) Versions 7.00 and 7.10 notes this
	documentation error.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	The DateSerial# function can return serial numbers for dates in the
	following range, inclusive:
	
	   DATE:     January 1, 1753, to December 31, 2078
	   SERIAL#:           -53688 to 65380
	
	The DateSerial# function generates an "Illegal function call" only if
	the arguments passed to it generate a serial number outside the range
	of -53,688 to 65,380. The following example uses a value outside the
	given range for the "month%" argument, but does not generate an
	"Illegal function call":
	
	   theDate# = DateSerial#(89, 13, 1)
	
	The serial number returned in the above call actually corresponds to
	the date January 1, 1990. A value of 13 logically corresponds to the
	month following December. Since December is the last month of a year,
	the year value is incremented by 1, and the month value is reset to 1,
	which corresponds to January; therefore, the following two calls to
	DateSerial# return the same serial number:
	
	   theDate# = DateSerial#(89, 13, 1)
	   theDate# = DateSerial#(90,  1, 1)
	
	Negative numbers work in the same way. A value of "-1" for the month
	argument refers to the month of November in the previous year. The
	following to calls to DateSerial# return the same serial number:
	
	   theDate# = DateSerial#(90, -1, 1)
	   theDate# = DateSerial#(89, 11, 1)
	
	The following are example calls to DateSerial# that generate the
	"Illegal function call" error message since the resulting serial
	number falls outside the valid range:
	
	   theDate# = DateSerial#(2078, 12, 32)  ->  January   1, 2079
	   theDate# = DateSerial#(2078, 13,  1)  ->  January   1, 2079
	   theDate# = DateSerial#(1753,  0, 31)  ->  December 31, 1752
