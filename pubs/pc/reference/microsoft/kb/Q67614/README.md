---
layout: page
title: "Q67614: PWB Menu Hyperlink in PWB.HLP is Inconsistent in Version 1.10"
permalink: /pubs/pc/reference/microsoft/kb/Q67614/
---

	Article: Q67614
	Product: Microsoft C
	Version(s): 1.10   | 1.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 23-JAN-1991
	
	When selecting help on the Programmer's WorkBench (PWB) version 1.10
	from the Categories menu in QuickHelp version 1.70, the help screen
	for Microsoft Advisor Help System is presented instead. This behavior
	may be duplicated by following the procedure outlined below:
	
	1. Start QuickHelp without an argument to get help on any topic. This
	   will bring up the main help screen.
	
	2. Select the Programmer's WorkBench choice under the Categories menu.
	
	Instead of bringing up the help screen for Programmer's WorkBench, you
	will see the screen for the Microsoft Advisor Help System.
	
	If the PWB.HLP help file is decoded using helpmake as follows
	
	   helpmake /D /T /Opwb.doc pwb.hlp
	
	we can see that the reason for this is that the .context directive for
	Programmer's WorkBench appears in the wrong section in the decoded
	help file. The following line
	
	   .context Programmer's Workbench
	
	appears above the section for "Microsoft Advisor Contents." To correct
	the problem, move the .context directive for Programmer's WorkBench to
	the proper section, which is the "Programmer's WorkBench Contents."
	
	The helpfile must then be recompressed, as follows:
	
	   helpmake /E7 /T /Opwb.hlp pwb.doc
	
	The choice of /E7 is shown here for demonstration purposes only, and
	is strictly arbitrary in this case. If maximum compression is desired,
	the numerical argument to the /E switch may be left off, or /E15 may
	be specified. Maximum compression will restore the database as close
	to its original size and state as possible.
