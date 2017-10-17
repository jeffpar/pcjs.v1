---
layout: page
title: "Q39586: Forcing FIXSHIFT.COM to Install Using the /I Switch"
permalink: /pubs/pc/reference/microsoft/kb/Q39586/
---

## Q39586: Forcing FIXSHIFT.COM to Install Using the /I Switch

	Article: Q39586
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr SR# S881213-39
	Last Modified: 8-JUN-1989
	
	Because of errors in their ROM BIOS, some machines have
	keyboard-editing problems in QuickBASIC Versions 4.00, 4.00b, and
	4.50. The utility FIXSHIFT.COM corrects many of these problems. If one
	encounters keyboard-editing problems, FIXSHIFT.COM should be
	installed.
	
	If FIXSHIFT.COM is invoked and it displays the message "FIXSHIFT Not
	Required," you can force it to install. You can force FIXSHIFT to
	install using the /I switch. The following can be typed on the DOS
	command line:
	
	   DOS-PROMPT>   FIXSHIFT /I
	
	FIXSHIFT should then display a banner message and a "FIXSHIFT
	Installed" message.
	
	One customer with a PC Craft Turbo computer reported that he had to
	run FIXSHIFT/I to successfully use SHIFT+INSERT to copy text in the
	QB.EXE editor. Microsoft has not tested or confirmed this information
	for the PC Craft Turbo computer -- the information is provided as is.
