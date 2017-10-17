---
layout: page
title: "Q67273: Error in Installation Manual for bounds-error() Routine"
permalink: /pubs/pc/reference/microsoft/kb/Q67273/
---

## Q67273: Error in Installation Manual for bounds-error() Routine

	Article: Q67273
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 4-DEC-1990
	
	Page 58 of the Microsoft C "Installing and Using the Professional
	Development System" manual is unclear when stating that the program
	example will overwrite bounds and CodeView will catch that error. The
	program returns the following run-time error upon exiting the
	bounds_error routine, rather than when the error actually took place:
	
	   run-time error R6012
	   - illegal near-pointer use
	
	The manual states:
	
	   The program runs until it reaches the "for" statement in the
	   "bounds_error" function, where the array bounds are exceeded. The
	   output window reports an error while a CodeView dialog box
	   indicates the program has terminated.
	
	This statement implies that the program will fail when the bounds of
	the array are exceeded, which is not entirely true.
	
	The program will indeed fail in this case because the array bounds are
	exceeded, overwriting stack information in the process. However, the
	program will not fail until *after* the for loop when the
	bounds_error() function terminates. At that time, the pointer check
	function will determine that the stack has been overwritten and will
	issue the error message above.
	
	If the array had not been stack based (that is, global or static) and
	the stack data had not been trashed, the program would not have
	failed. However, important data may still have been lost. To trap
	overwrite errors of this nature, you could use "Bounds Checker" by
	Nu-Mega.
	
	Sample Code
	-----------
	
	void bounds_error(void)
	{
	   int loop, the_num[10];
	   for(loop=0;loop<15;loop++)
	      the_num[loop]=loop;
	}
	void main(void)
	{
	   bounds_error();
	}
