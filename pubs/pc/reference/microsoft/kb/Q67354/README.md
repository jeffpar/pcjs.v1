---
layout: page
title: "Q67354: putch() Displays Values 9 and 255 Differently in DOS and OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q67354/
---

## Q67354: putch() Displays Values 9 and 255 Differently in DOS and OS/2

	Article: Q67354
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 4-DEC-1990
	
	The putch() function will display different output for the values 9
	(tab) and 255 depending on whether you are running in DOS or OS/2.
	When passing a tab (ASCII 9) to putch() under DOS, the graphic ASCII
	character for 9 is displayed. Under OS/2, a tab is expanded out to
	actual spaces when passed to putch().
	
	When passing the value 255 to putch() under DOS, the value is ignored
	and nothing is displayed. Passing 255 to putch() under OS/2 results in
	a space being displayed.
	
	Because the cprintf() function uses putch() to display characters, the
	same differences will appear with these values when calling cprintf().
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
