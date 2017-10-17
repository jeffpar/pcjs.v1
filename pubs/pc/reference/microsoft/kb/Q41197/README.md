---
layout: page
title: "Q41197: QuickC 2.00 Sporadically Fails to Exec Linker in 3.x BOX"
permalink: /pubs/pc/reference/microsoft/kb/Q41197/
---

## Q41197: QuickC 2.00 Sporadically Fails to Exec Linker in 3.x BOX

	Article: Q41197
	Version(s): 2.00
	Operating System: 0S/2
	Flags: ENDUSER | buglist2.00
	Last Modified: 29-MAR-1989
	
	QuickC Version 2.00 appears to have sporadic problems exec'ing the
	linker in the OS/2 Version 1.10 DOS compatibility box.
	
	This problem has been shown to be related to the existence of the
	APPEND path.  If there is an APPEND path designated then this problem
	can occur.  If this problem, which is described in detail below, is
	encountered removing the APPEND, and then rebooting will alleviate
	this problem.
	
	The problem occurs when the QuickC Version 2.00 integrated environment
	is started in the 3.x box and a trivial program (e.g. "main()  { }" )
	is loaded. Small model is selected and you attempt a "rebuild all."
	The program compiles successfully, but fails in the link stage with one
	of the following two error messages:
	
	If the "Make" option is set to "debug", the following error message
	flashes quickly in the upper left-hand corner of the screen, and
	then disappears:
	
	   R6005: Not Enough Memory On Exec
	
	If the Make option is set to "release", the following error message
	appears:
	
	  MAKE:ERROR:
	
	However, shelling out of the QuickC environment reveals that the system
	has 280K available with QuickC loaded, and if an attempt is made to link
	the program while shelled out of the environment, it links with no
	errors.
