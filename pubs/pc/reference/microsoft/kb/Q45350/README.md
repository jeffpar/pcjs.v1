---
layout: page
title: "Q45350: Casting Pointer to Char in the Watch Window Will Hang Machine"
permalink: /pubs/pc/reference/microsoft/kb/Q45350/
---

## Q45350: Casting Pointer to Char in the Watch Window Will Hang Machine

	Article: Q45350
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00
	Last Modified: 8-JUN-1989
	
	If you are watching a pointer cast to a char in the Debug window in
	QuickC Version 2.00, the machine hangs. Other casts perform as
	expected. The example below demonstrates the problem.
	
	Microsoft has confirmed this to be a problem in QuickC Version 2.00.
	We are researching this problem and will post new information as it
	becomes available.
	
	In the QuickC environment, compile with debug options on. Next, set a
	Watch on a pointer and cast it to a char. For example, enter the
	expression "(char) intptr" (without the quotation marks). When this
	expression is entered, the mouse cursor disappears and QuickC no
	longer accepts any keyboard input.
	
	Code Example
	------------
	
	char near * chptr;
	int near * intptr;
	float near * floatptr;
	
	void main (void)
	{
	  chptr = (char near *) 1;
	  intptr = (int near *) 1;
	  floatptr = (float near *) 1;
	  chptr = (char near *) 2;     /* put breakpoint here */
	
	}
	
	QuickC Versions 1.x do not exhibit this problem.
