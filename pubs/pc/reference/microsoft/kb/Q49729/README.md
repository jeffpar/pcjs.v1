---
layout: page
title: "Q49729: Clock: C Function -- Documentation Supplement"
permalink: /pubs/pc/reference/microsoft/kb/Q49729/
---

## Q49729: Clock: C Function -- Documentation Supplement

	Article: Q49729
	Version(s): 5.10   |  5.10
	Operating System: MS-DOS |  OS/2
	Flags: ENDUSER | S_QuickC S_QuickAsm docsup
	Last Modified: 17-JUL-1990
	
	The clock function is documented as telling how much processor time
	has been used by the calling process. This definition is misleading.
	
	The clock function returns a clock_t (long) value, which is the
	difference between the time field (for seconds) and millitm field (for
	milliseconds) in the structure that is returned from two calls to the
	ftime function. The first call to ftime is made within the start-up
	code of the executing program, and the second call is made when the
	clock function is explicitly called in your code.
	
	This means that the value returned by clock is the number of CLK_TCKs
	(milliseconds) elapsed since the start-up code was executed, or -1 if
	the function was unsuccessful.
	
	Note: On most IBM PCs and compatibles, the clock speed is not fast
	enough to compute milliseconds, or indeed, hundredths of seconds. The
	ftime function calls interrupt 21, function 2Ch (under DOS), which
	returns, among other information, the seconds in hundredths. The
	hundredths information is an estimation from the clock speed, which is
	approximately 18.2 ticks per second on most PCs. This hundredths value
	is multiplied by 10 to get the millisecond value.
	
	Below is information on resetting the initial time value.
	
	The clock function references an external variable called _citime.
	This causes _cinitim.asm to get linked in to the .EXE, which in turn
	enters a function called _inittime into the start-up initialization
	table.
	
	The _inittime function, which is then called by the start-up code,
	simply makes a call to the ftime function, passing it a static timeb
	structure. Any further calls to the clock function subtract the values
	in this structure from the values in the structure returned by the
	ftime call in the clock function.
	
	In some cases, you might want to know the time elapsed between two or
	more internal points in a program. To reset the initial time value,
	make a call to the function _inittime, which makes a call to ftime,
	resetting the initial time structure to the current time. All
	subsequent calls to the clock function return the elapsed time since
	the last _inittime call.
	
	Other sources of information include the Version 5.10 "Microsoft C for
	the MS-DOS Operating System: Run-Time Library Reference," Page 167 and
	the clock function in the "C Run-Time Library Source Routines," which
	is available as a separate package.
