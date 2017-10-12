---
layout: page
title: "Q63319: Unknown Function psrch with Brief Emulation in PWB"
permalink: /pubs/pc/reference/microsoft/kb/Q63319/
---

	Article: Q63319
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-JUL-1990
	
	When using the Brief emulation feature of the Programmer's WorkBench
	version 1.00, reinitialization of the TOOLS.INI file will cause a
	number of unknown functions to appear when you try to use them. In
	short, most of the unknown functions that may be reported are related
	to search features such as the psearch switch. The error message
	associated with this search feature is commonly "Unknown function
	psrch."
	
	This error occurs only after you use the Initialize function.
	
	The Initialize function discards current macro definitions and rereads
	the appropriate section of TOOLS.INI. This is not exactly the same as
	restarting PWB; the Autostart macro is not executed after Initialize.
	The BRIEF emulation depends on the Autostart macro to define the
	search functions.
	
	To recover the definition of the missing macros, execute the toggle_re
	BRIEF emulation macro (CTRL+F6). To avoid having to remember to
	execute this macro, you can add this to the main section of TOOLS.INI:
	
	   reinit:=Initialize Autostart
	   reinit:Shift+F8
	
	Or you can define the macros as follows:
	
	   psrch:=arg arg "String to Search for" prompt ->can
	                                           psearch => :>can cancel
	   msrch:=arg arg "String to Search for" prompt ->can
	                                           msearch => :>can cancel
	   qrepl:=arg arg qreplace
	   srchname:="REoff"
