---
layout: page
title: "Q30828: Tags Let You Use the Same TOOLS.INI File for M and MEP"
permalink: /pubs/pc/reference/microsoft/kb/Q30828/
---

	Article: Q30828
	Product: Microsoft C
	Version(s): 1.00
	Operating System: OS/2
	Flags: ENDUSER | TAR76127
	Last Modified: 8-JUN-1988
	
	Question:
	   I have the same commands for M and for MEP. I want to load the
	QUICKHELP utility if I am running OS/2. However, in my TOOLS.INI file,
	if I put in the following information, MEP never reads the rest of
	the TOOL.INI file:
	
	   [mep]
	    load:qhmep
	   [m mep]
	    rest of the commands
	    .
	    .
	
	   How should I do this without making two (almost identical) files,
	one for [m] and one for [mep]?
	
	Response:
	   Through the use of tags, it is possible to use the same TOOLS.INI
	file in both protect mode and real mode/DOS. The tag must specify the
	program name along with the version of the operating system as in the
	following example:
	
	   [m-3.2]    => MS-DOS 3.2
	   [m-10.0]   => OS/2 1.0 protect mode
	   [m-10.0R]  => OS/2 1.0 real mode
	   [m-10.10]  => OS/2 1.1 protect mode
	   [m-10.10R] => OS/2 1.1 real mode
	
	   The following change should be made to your TOOLS.INI file:
	
	       [m mep]
	                commands that are non operating system dependent
	            .
	            .
	            .
	
	       [mep-10.0]
	            load:qhmep
	
	   The number used in the tag is the major and minor version number of
	of the operating system being used. Under OS/2 this information can be
	found by calling the API routine DosGetVersion. The call can be made
	from any language that supports the use of the API,including C Version
	5.10, MASM Version 5.10, FORTRAN Version 4.10, PASCAL Version 4.10,
	and BASCOM Version 6.00. Under DOS, this information is displayed with
	the DOS VER command.
