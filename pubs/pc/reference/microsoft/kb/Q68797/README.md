---
layout: page
title: "Q68797: _dos_setftime() Fails to Set Date and Time for File on Network"
permalink: /pubs/pc/reference/microsoft/kb/Q68797/
---

	Article: Q68797
	Product: Microsoft C
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | buglist5.10 buglist6.00 buglist6.00a
	Last Modified: 31-JAN-1991
	
	The _dos_setftime() function is used to set the date and time of a
	file. If the file is on a local drive, the function behaves as
	expected; however, if the file resides on a network drive, the date
	and time will not get set correctly. In this case, the _dos_setftime()
	still returns a value indicating successful operation.
	
	Microsoft has confirmed this to be a problem in C versions 5.10, 6.00,
	and 6.00a and QuickC versions 2.00, 2.01, 2.50, and 2.51 (buglist2.00,
	buglist2.01, buglist2.50, and buglist2.51). We are researching this
	problem and will post new information here as it becomes available.
