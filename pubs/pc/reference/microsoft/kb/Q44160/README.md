---
layout: page
title: "Q44160: How to Debug Large QuickC 2.00 Program Inside the Environment"
permalink: /pubs/pc/reference/microsoft/kb/Q44160/
---

	Article: Q44160
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 18-MAY-1989
	
	Question:
	
	I have a very large QuickC Version 2.00 program that is too big to
	debug in the QuickC 2.00 environment. How can I debug part of my
	program without including debug information for the whole application?
	
	Response:
	
	QuickC 2.00 does not give you the option to turn debug information on
	or off for single modules; however, there are ways to trick QuickC
	2.00 into compiling part of the application without debug information.
	
	By turning off the debug information, you can recompile some of the
	modules without debug information. When you are ready to run the
	application, turn debugging back on and recompile the changed modules.
	You must shell out to DOS at this point to delete the old executable
	file, which will force QuickC to relink before running. When you
	select RUN, QuickC will ask if you want to rebuild. If you select yes,
	all of the modules will be recompiled. If you select no, QuickC will
	link only the existing object files before executing the program.
	
	Note: To turn off debug information, go to the Options-Make menu and
	select the release flags. Do not try to turn off debugging information
	by selecting line numbers only in the compiler flags.
