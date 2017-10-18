---
layout: page
title: "Q34979: Multiple Communal Definitions Incorrectly Allowed"
permalink: /pubs/pc/reference/microsoft/kb/Q34979/
---

## Q34979: Multiple Communal Definitions Incorrectly Allowed

	Article: Q34979
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 12-JAN-1989
	
	MASM is incorrectly allowing multiple communal definitions of a single
	variable. The COMDEF record produced by MASM in the object module
	contains the definition from the last COMM directive. The problem
	occurs on code similar to the following:
	
	comm c1:byte:44
	comm far c1:byte:22
	comm far c1:byte:11
	comm c1:byte:33
	
	Microsoft has confirmed this to be a problem in Version 5.10. We are
	researching this problem and will post new information as it becomes
	available.
