---
layout: page
title: "Q61231: C 6.00 README: CV: Blank Screen Debugging Under Earlier OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q61231/
---

## Q61231: C 6.00 README: CV: Blank Screen Debugging Under Earlier OS/2

	Article: Q61231
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-APR-1990
	
	The following information is taken from the C Version 6.00 README.DOC
	file.
	
	Blank Screen While Debugging Under OS/2 1.20
	--------------------------------------------
	
	If your screen group goes blank after returning from debugging, check
	to see if the following conditions are true:
	
	- You are running CodeView under OS/2 1.20
	
	- You are using the two-monitor option (/2)
	
	If all of the above conditions are true, take the following steps to
	determine if you need to upgrade your version of OS/2:
	
	1. Type "syslevel" at an OS/2 command prompt. This identifies the
	   version of OS/2 you have installed.
	
	   Note: Identifying the version alone does not indicate a problem.
	   The conditions above must be present before an upgrade is required.
	
	2. If the syslevel command returns the value "xr04043" and you have
	   experienced the difficulties described above, contact your OS/2
	   distributor for an upgrade.
