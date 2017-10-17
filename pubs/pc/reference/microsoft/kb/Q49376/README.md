---
layout: page
title: "Q49376: COM Port Time-Out Halts Redirection of CVP to Remote Terminal"
permalink: /pubs/pc/reference/microsoft/kb/Q49376/
---

## Q49376: COM Port Time-Out Halts Redirection of CVP to Remote Terminal

	Article: Q49376
	Version(s): 2.20 2.30
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 27-OCT-1989
	
	When using protected-mode CodeView (CVP) under OS/2, there is a
	problem with the serial communications (COM) ports timing out after 60
	to 90 seconds of inactivity. This time-out makes it essentially
	impossible to do remote terminal debugging with CVP. Once the time-out
	occurs, no further input is accepted from the remote terminal. The
	only workaround is to quit CodeView and begin again, or to do a break
	and then restart the redirection to the COM port.
	
	The CodeView Debugger allows redirection of input and output to a file
	or device. This procedure is commonly used to set up a remote (dumb)
	terminal for CodeView input and output, while the PC screen is used
	for displaying the program input and output. The terminal is connected
	through a COM port, which eliminates the need for a second video
	adapter as is required when using two monitors with the /2 option.
	Entering "=COM1" at the CodeView command prompt enables input and
	output redirection to the device designated as COM1.
	
	This debugging arrangement works great with CodeView under MS-DOS, but
	it becomes unworkable with CVP under OS/2 because the internal calls
	that are used to set up the redirection do not account for time-outs
	due to inactivity. Thus, if you are entering commands from the remote
	terminal at a steady pace, everything proceeds smoothly. However, if you
	stop and wait for more than about 60 seconds without doing any input,
	the port will time-out and leave you stranded because the keyboard no
	longer responds.
	
	In a normal debugging session, it is quite likely that there would be
	many instances greater than 60 seconds where input is not yet needed
	or desired; therefore, this situation quickly becomes intolerable. The
	only way to regain control is to enter CTRL+C at the PC keyboard,
	which ends the redirection. At that point, you could enter "=COM1"
	again on the PC keyboard to restart the redirection if you so desired.
