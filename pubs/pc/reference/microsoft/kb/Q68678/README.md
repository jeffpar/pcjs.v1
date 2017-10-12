---
layout: page
title: "Q68678: Help Files for QuickC Require Special "Backtrace" Declaration"
permalink: /pubs/pc/reference/microsoft/kb/Q68678/
---

	Article: Q68678
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | docerr s_quickc s_helpmake
	Last Modified: 11-FEB-1991
	
	When creating a help file using the Microsoft Helpmake utility, !B is
	defined to have the effect of backtracing to the previous help screen
	(if available). However, this is true only when using QuickHelp or the
	Programmer's WorkBench (PWB). If an attempt is made to use this help
	file with QuickC, the link will issue a beep and no backtrace will be
	allowed.
	
	The documentation included with Microsoft C version 6.00 does not
	reference the exclamation (!) character as being a special function.
	However, on pages 20-21, the "Professional Advisor Library Reference"
	lists all the options available for this command. It also states that
	the !CQ.HB command will allow QuickC version 2.00 compatibility.
	However, it should be noted that the compatibility for this function
	is for QuickC version 2.50 as well. The use of this command gives
	complete compatibility through C versions 6.00 and 6.00a, as well as
	QuickC versions 2.50 and 2.00.
	
	Another error in the documentation is that !CQ.HB must be in all
	lowercase letters (that is, !cq.hb). HelpMake will not issue an error
	message with an uppercase command, but it will also not allow a
	backtrace to be performed.
