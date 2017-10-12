---
layout: page
title: "Q67482: Link Not Performed During Build or Make"
permalink: /pubs/pc/reference/microsoft/kb/Q67482/
---

	Article: Q67482
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.00 fixlist1.10 fixlist1.11 s_c s_link s_pwb
	Last Modified: 14-DEC-1990
	
	During a build inside the Programmer's WorkBench (PWB) (using PWB.COM)
	or while using NMK.COM from the command line, the build operation
	returns successfully but no .EXE file is created.
	
	This problem may be caused by an incorrectly set COMSPEC environment
	variable. If the COMSPEC environment variable contains any extra
	characters, NMK.COM fails to properly spawn the linker. This affects
	the PWB as well because, under DOS, PWB.COM spawns the build commands
	the same way as NMK.COM. Two examples of COMSPEC environment variables
	that cause this problem are shown in the following:
	
	   COMSPEC=C:\COMMAND.COM /E:512 /P
	   COMSPEC=C:\COMMAND.COM;
	
	Microsoft has confirmed this to be a problem in PWB.COM version 1.00
	and NMK.COM version 1.00. This problem was corrected in PWB.COM
	version 1.10 and NMK.COM version 1.11.
