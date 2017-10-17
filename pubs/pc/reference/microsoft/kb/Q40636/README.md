---
layout: page
title: "Q40636: Why QuickBASIC Might Hang; Hardware or Software Conflicts"
permalink: /pubs/pc/reference/microsoft/kb/Q40636/
---

## Q40636: Why QuickBASIC Might Hang; Hardware or Software Conflicts

	Article: Q40636
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S890111-129
	Last Modified: 14-DEC-1989
	
	This article provides a list of possible software and hardware
	conflicts that may cause a program to hang (in the QB.EXE editor or in
	an executable .EXE program). To determine why a program might hang,
	the possibilities below should be checked.
	
	If the steps below are followed and the program still hangs, the
	problem may be related to a coding error or a problem associated with
	QuickBASIC itself.
	
	The information in this article applies to the following products:
	
	1. Microsoft QuickBASIC Versions 1.00, 1.02, 2.00, 2.01, 3.00, 4.00,
	   4.00b, and 4.50 for IBM PC and compatibles
	
	2. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS-DOS and
	   MS OS/2
	
	3. The QBX.EXE environment of Microsoft BASIC PDS Version 7.00 for
	   MS-DOS and MS OS/2.
	
	The following are potential software conflicts:
	
	1. Terminate-and-stay-resident (TSR) programs. QuickBASIC is not
	   designed for use with most TSRs and does not support them.
	   Remove these programs and reboot the computer without loading
	   the TSRs.
	
	2. Networks. Unsupported networks fall into the same category as TSRs,
	   and they should be removed. (However, there should be no problem
	   with the IBM PC Network or MS Network, both of which are
	   supported.)
	
	3. Operating systems. Always use the standard operating system
	   provided by the manufacturer of the computer. QuickBASIC is not
	   supported under multiuser or multitasking operating systems.
	   Try using the standard PC-DOS or MS-DOS with the computer.
	
	4. Extended/expanded memory. QuickBASIC does not use either
	   extended or expanded memory, and the drivers that provide this
	   support should also be removed from the system.
	
	Note: To ensure that there are no programs loaded in memory in all the
	cases above, use the original DOS disk provided for the computer by
	the manufacturer. There should be no special DEVICE=xxx.SYS statements
	in your CONFIG.SYS file and no special programs installed by your
	AUTOEXEC.BAT file.
	
	The following are potential hardware conflicts:
	
	1. Incorrect math-coprocessor settings. If the math-coprocessor switch
	   settings are incorrect, QuickBASIC may hang. By using the command
	   "SET NO87=xxxx" at the DOS prompt, you inform QuickBASIC not to use
	   or check for the math coprocessor. If QuickBASIC then works
	   correctly, the switch settings may be incorrectly set. For more
	   information on the correct switch settings, query on "NO87" in this
	   Knowledge Base.
	
	   Also, the speed of the coprocessor must be equal to or less than
	   the speed of the computer's CPU (central processing unit);
	   otherwise, a numeric exception error can hang the machine.
	
	2. Video systems. The computer's video system should be a standard
	   video system (CGA, EGA, VGA, or MONO-TEXT). There are several
	   options available for checking the video system. Proper
	   configuration of the video hardware can be performed by issuing
	   three MS-DOS MODE commands, as follows:
	
	      MODE MONO -- MONOCHROME SYSTEM
	      MODE BW80 -- MONOCHROME MONITOR with COLOR GRAPHICS ADAPTER
	      MODE CO80 -- COLOR SYSTEM, both ADAPTER and MONITOR
	
	   If QB.EXE Version 4.50 does not operate with your video system, try
	   invoking QuickBASIC with each of the video-specific options, such
	   as the /b (black and white) option, the /nohi (no high-intensity)
	   option, the /g (update screen as fast as possible) option, and the
	   /h (high-resolution) option. For more information, query on the
	   words "compatibilities and QuickBASIC" in the Microsoft Knowledge
	   Base.
