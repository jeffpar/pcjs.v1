---
layout: page
title: "Q67485: Why locking() May Allow Only Twenty Regions to Be Locked"
permalink: /pubs/pc/reference/microsoft/kb/Q67485/
---

## Q67485: Why locking() May Allow Only Twenty Regions to Be Locked

	Article: Q67485
	Version(s): 4.x 5.x 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 30-JAN-1991
	
	The DOS SHARE.EXE command installs file sharing and locking capability
	within the DOS environment. If SHARE is executed without any
	parameters, the default number of simultaneous file locks is 20.
	Subsequently, the C locking() function will allow only twenty regions
	to be locked at the same time. To change from the default, SHARE
	should be installed with the following parameter (where n is the
	number of simultaneous regions that can be locked):
	
	   SHARE /L:n
