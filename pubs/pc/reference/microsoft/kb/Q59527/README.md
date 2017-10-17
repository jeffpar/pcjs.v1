---
layout: page
title: "Q59527: Using RIGHT ARROW on Dialog Line Locks Keyboard or GP Faults"
permalink: /pubs/pc/reference/microsoft/kb/Q59527/
---

## Q59527: Using RIGHT ARROW on Dialog Line Locks Keyboard or GP Faults

	Article: Q59527
	Version(s): 1.02   | 1.02
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.02
	Last Modified: 15-MAY-1990
	
	Manipulating text on the dialog line must be handled differently in
	the Microsoft Editor (M) Version 1.00 than in 1.02. If you use an M
	Version 1.00 procedure in M Version 1.02 under DOS, the keyboard will
	lock up and alternating screens of jumbled characters may appear on
	the screen. Under OS/2, you will get a GP fault resulting in the
	termination of MEP by the operating system.
	
	The problem can be observed by using the following steps from within
	the editor:
	
	Note: Remember that under DOS your machine will hang!
	
	1. Press ALT+A to invoke the <arg> function.
	
	2. Type any character (for example, the letter "d").
	
	3. Hold down the RIGHT ARROW key. When the text in the dialog line has
	   scrolled off the left side of the screen, in M 1.00 the editor will
	   issue a beep. In M 1.02, the machine will lock in DOS or GP fault
	   in OS/2. This problem occurs even if you omit Step 2, but it is
	   more difficult to see the error.
	
	To retain the same functionality in M 1.02, instead of using the RIGHT
	ARROW key to move the cursor to the right, use the SPACEBAR. Using
	the SPACEBAR rather than the RIGHT ARROW key allows you to take
	advantage of the maximum arg line limit without the error.
	
	Microsoft has confirmed this to be a problem in Version 1.02. We are
	researching this problem and will post new information here as it
	becomes available.
