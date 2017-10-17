---
layout: page
title: "Q23308: Debugging High Resolution EGA or VGA Graphics"
permalink: /pubs/pc/reference/microsoft/kb/Q23308/
---

## Q23308: Debugging High Resolution EGA or VGA Graphics

	Article: Q23308
	Version(s): 1.00 1.10 2.00 2.10 2.20 2.30 | 2.20 2.30
	Operating System: MS-DOS                        | OS/2
	Flags: ENDUSER | TAR61178
	Last Modified: 14-AUG-1989
	
	Question:
	
	I am trying to debug a program that does EGA or VGA graphics. When I
	continue from a breakpoint after the program has painted the screen,
	the screen is not as it was before the breakpoint. I think that all
	colors have been turned to black, but I am not sure.
	
	I tried this procedure with no switches, with /s, and with /t. The
	program is using the EGA in 640x350 16-color mode. Is this supposed to
	work? If it does not work, why not? What will you do about supporting
	the higher modes for the new machines such as the Personal System 2
	series from IBM?
	
	Response:
	
	This behavior is partly related to the size of the buffer that
	CodeView creates for storing screen information. If you are running on
	a CGA, EGA or VGA board, this buffer is by default 16K. If you are running
	on a monochrome board, this buffer is by default 4K. As you are
	finding, 16K is simply not enough memory for a color image using
	640x350 resolution (the maximum resolution supported would be
	640x200).
	
	One of the reasons why CodeView does not have the ability to handle
	the buffer requirements of an EGA image is that the EGA registers are
	write only. There is no way for CodeView to detect what mode the EGA
	currently is in so it can adjust the size accordingly. Also note that
	with the different resolutions the image is stored in different memory
	locations. The black on black characters may simply be a blank image
	because CodeView cannot tell that the resolution is different and
	therefore the image is located elsewhere.
	
	With the PS/2 machines this is not an issue because the EGA registers
	have read capability. We are reviewing this with regard to future
	implementations of CodeView.
	
	The following are some ways to work around this current limitation:
	
	1. Try writing a routine that will place the display in the desired
	   mode before you invoke CodeView. CodeView will be able to judge
	   which mode is currently in effect and can locate the image in the
	   correct area of memory. Note that the image will not be displayed
	   in color. You will only see the higher resolution since the buffer
	   is not big enough.
	
	2. Debug your applications that run in high resolution graphics with a
	   second monitor (use the /2 switch). Since the display is going to a
	   different screen, CodeView will not have to worry about changing
	   the video modes or the buffering.
