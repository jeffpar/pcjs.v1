---
layout: page
title: "Q42212: /CO before /DO Causes Problems in LINK"
permalink: /pubs/pc/reference/microsoft/kb/Q42212/
---

## Q42212: /CO before /DO Causes Problems in LINK

	Article: Q42212
	Version(s): 3.65 4.06 5.01
	Operating System: MS-DOS
	Flags: ENDUSER | h_masm s_pascal h_fortran buglist3.65 buglist5.01
	Last Modified: 28-MAR-1989
	
	When compiling or assembling with the /Zi switch to include CodeView
	symbolic information and linking with /CO to preserve it, the
	placement of the /DO switch is crucial. If the /CO switch is specified
	before /DO, the following behavior may occur when running CodeView:
	
	   Message                                Behavior
	
	   Enter directory for  (cr for none)?    When CodeView is executed,
	                                          no source code will appear.
	
	   Unable to open file
	
	   Internal debugger error: 13            When attempting to change
	                                          from assembly view to source
	                                          CodeView. Hanging of the
	                                          machine when executing
	                                          CodeView.
	
	If switching the order of the /CO and the /DO switches does not
	take care of the problem then you have to put the .DOSSEG into
	your MASM routines and not use the /DO switch.
	
	Microsoft has confirmed this to be a problem in Versions 3.65 and
	5.01. We are researching this problem and will post new information as
	it becomes available.
	
	While LINK Version 5.01 may be used in OS/2, the /DO switch has no
	meaning. Using it, however, causes the linker to GP fault if /CO
	precedes /DO.
