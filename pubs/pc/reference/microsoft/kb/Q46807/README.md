---
layout: page
title: "Q46807: Unrecognized Switch /Z1 Is Caused by Wrong Linker"
permalink: /pubs/pc/reference/microsoft/kb/Q46807/
---

	Article: Q46807
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickAsm
	Last Modified: 18-AUG-1989
	
	Question:
	
	Immediately after setting up QuickC Version 2.00, an attempt to
	compile a file results in the error message "unrecognized switch Z1".
	The manual does not document this switch, and in addition, a /Z1
	switch is not being used in this instance. How can the compiler be
	made to finish compilation?
	
	Response:
	
	This is a simple LINK version problem. The "Z1" switch is unrecognized
	by LINK 3.05, and the error is returned directly to the screen (over
	the top of the program text). Check to make sure that the proper
	version of the linker (4.06) is being found and used.
