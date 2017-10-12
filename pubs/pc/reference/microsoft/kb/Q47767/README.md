---
layout: page
title: "Q47767: Getting SYS2070 While Using MEP"
permalink: /pubs/pc/reference/microsoft/kb/Q47767/
---

	Article: Q47767
	Product: Microsoft C
	Version(s): 1.02
	Operating System: OS/2
	Flags: ENDUSER | MEP
	Last Modified: 26-SEP-1989
	
	Problem:
	
	When I start MEP, I receive the following error:
	
	     |---------------------------------------------------------------|
	     | SYS2070: The system could not demand load the                 |
	     | application's segment. MSHELP HELPGETINFO is in error.        |
	     | For additional detailed information also see message SYS0127. |
	     |---------------------------------------------------------------|
	     |                     End the program                           |
	     |_______________________________________________________________|
	
	After selecting "End the program," I receive the following message:
	
	   A non-recoverable error occurred.
	   The process ended.
	
	Response:
	
	The MEP program is picking up an old version of MSHELP.DLL. The likely
	source is from the OS/2 Presentation Manager Toolkit. To correct this
	problem, replace the old MSHELP.DLL with the current MSHELP.DLL.
	
	If there is no MSHELP.DLL on the LIB path, then MEP loads and seems to
	function correctly, but there will be no help available.
