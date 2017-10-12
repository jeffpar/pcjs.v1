---
layout: page
title: "Q31611: RunTmLibRef ftime Returns millitm to 100ths"
permalink: /pubs/pc/reference/microsoft/kb/Q31611/
---

	Article: Q31611
	Product: Microsoft C
	Version(s): 4.00 5.00 5.10 | 5.10
	Operating System: MS-DOS         | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 12-OCT-1988
	
	The ftime function is described in a misleading way in the
	"Microsoft C 5.1 Optimizing Compiler Run-Time Library Reference" ,
	Page 308 for C Version 5.x and Page 217 for C Version 4.00.
	   The field millitm in the timeb structure that ftime returns is
	described to hold the value of the fraction of a second in
	milliseconds. The field contains three digits as described;
	however, the last digit always is zero. Thus, the function returns
	millitm incremented to the nearest one hundredth of a second.
	   Note also that this function uses the system clock to determine
	the time. Since the resolution of the clock on PC's is about 1/18.2
	seconds, the time function can not be more accurate than that.
