---
layout: page
title: "Q62668: R6000 Stack Overflow After Deleting Current Makefile"
permalink: /pubs/pc/reference/microsoft/kb/Q62668/
---

	Article: Q62668
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-JUL-1990
	
	If you are viewing your makefile in a window in PWB 1.00, then delete
	the makefile from a shell; attempting to make the window containing
	the makefile active will cause a run-time error R6000, stack overflow.
	
	To duplicate this problem, bring up a sample program and set the
	program list to that file's makefile. Next, open up another window
	and open the makefile in that window. Now, either from the Run.Run
	<DOS-OS/2> Command menu or the File.<DOS-OS/2> Shell, delete that
	makefile.
	
	After returning back to the PWB, make the window containing the
	makefile the active program list either by pressing the F6 key to
	toggle windows or by clicking the left mouse button in that window.
	
	You will be faced with a popup message saying "File has been deleted
	from disk. Delete from memory?" Answering "yes" brings up the popup
	six to eight more times. Then, PWB will abort to the system prompt
	with an R6000 (stack overflow) error message and another message, "File
	has been deleted from disk."
	
	Microsoft has confirmed this to be a problem in PWB version 1.00. We
	are researching this problem and will post new information here as it
	becomes available.
