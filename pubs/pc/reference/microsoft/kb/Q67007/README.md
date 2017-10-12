---
layout: page
title: "Q67007: How to Execute a Function From the Command or Watch Window"
permalink: /pubs/pc/reference/microsoft/kb/Q67007/
---

	Article: Q67007
	Product: Microsoft C
	Version(s): 2.x 3.00 3.10 3.11 | 2.x 3.00 3.10 3.11
	Operating System: MS-DOS             | OS/2
	Flags: ENDUSER | docerr s_c 6.00 6.00a
	Last Modified: 4-DEC-1990
	
	Page 201 of the "Advanced Programming Techniques" (APT) manual that
	accompanies Microsoft C versions 6.00 and 6.00a states that "any C
	function in your program (whether user-written or from the library)
	can be called from the Command window or the Watch window."
	
	This statement is not completely true. Actually, only functions
	compiled with full CodeView symbolic information can be called. This
	restriction eliminates all of the C run-time functions from being
	executed in this manner because they contain no symbolic information.
	A simple example of how to call a C run-time function is shown below.
	
	If an attempt is made to execute a function that has not been compiled
	with symbolic information via the Command window, the following error
	will be displayed in the Command window:
	
	   CV1017 Error: Syntax error
	
	In CodeView versions 2.x, an "unknown symbol" error is displayed in
	the Command window.
	
	If an attempt is made to add the function to the Watch window via the
	Watch menu and the "Add Watch" command, CodeView will ignore the entry
	and beep. In versions 2.x, CodeView will give an "unknown symbol"
	error.
	
	The APT gives an example of calling a C function from the Command
	window via the following command:
	
	   ?funcname (varlist)
	
	This command will only invoke the function and display its return
	value in the Command window. To add the function to the Watch window,
	a slightly different command must be used, as follows:
	
	   w?funcname (varlist)
	
	The function name can also be added to the Watch window by choosing
	the Watch menu and the "Add Watch" command, and typing only the
	function name plus its variable list enclosed in parenthesis. Neither
	the "w" or the "?" are needed in this situation.
	
	It is important to note that you should be sure that the screen
	flip/swap option on the Options menu is turned on if the function you
	execute performs any screen input or output.
	
	For example, if you want to call a C run-time function or any other
	function that does not contain CodeView symbolic information, you must
	create a shell function that calls the desired function itself and
	gives the same return value.
	
	Therefore, if you wanted to call the C run-time function sqrt()
	directly from the CodeView Command window or Watch window, you would
	create a shell function that resembles the following:
	
	1. #include <math.h>
	2. double my_sqrt(double x)
	3. {
	4.    return(sqrt(x)) ;
	5. }
	
	You would then compile this function with CodeView information by
	compiling with the /Zi switch, and then link it into your program
	being sure to include /CO in your link command. Note that your program
	does not need to make a call to the function in order for it to be
	available for direct execution.
	
	To execute this function from the Command window, enter the following
	command:
	
	   ?my_sqrt(4.0)
	
	The return value should be displayed on the next line in the Command
	window. In this example, 2.0000000000000 should be displayed as a
	result of the square root of 4.0.
	
	To add the function to the Watch window via the Command window, you
	would enter the following command:
	
	   w?my_sqrt(4.0)
	
	The function could also be added to the watch window by choosing the
	"Add Watch" command from the Watch menu and entering the following at
	the Add Watch prompt:
	
	   my_sqrt(4.0)
	
	When a function is added to the Watch window, that function is
	executed any time the Watch window is updated.
	
	Although these examples show a constant value as the parameter to the
	function, any variable that is in scope at the time could be entered
	as a parameter.
