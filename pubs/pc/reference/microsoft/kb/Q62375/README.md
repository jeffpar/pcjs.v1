---
layout: page
title: "Q62375: Fatal /nologo and /e Switch Interaction"
permalink: /pubs/pc/reference/microsoft/kb/Q62375/
---

	Article: Q62375
	Product: Microsoft C
	Version(s): 1.20   | 1.20
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist1.20
	Last Modified: 22-JUN-1990
	
	Using the /nologo switch in conjunction with /e switch can cause ILINK
	version 1.20 to fail. The problem will occur when an incremental link
	cannot be performed and the command specified by the /e switch is
	performed instead. If the /e switch is preceded anywhere on the
	command line by /nologo, then the link will fail.
	
	For example, the following command line
	
	    ILINK /nologo /e "link hello;" hello.exe
	
	where hello.obj exists but hello.exe doesn't, will produce the
	following messages:
	
	   Microsoft (R) Segmented-Executable Linker  Version 5.10
	   Copyright (C) Microsoft Corp 1984-1990.  All rights reserved.
	
	   LINK : fatal error L1089:  : cannot open response file
	   ILINK : warning L4252: file '/e.exe' does not exist
	   ILINK : performing full link
	   ILINK : fatal error L1233: 'link' returned 2
	
	Placing the /nologo switch after the /e switch on the command line
	will alleviate the problem.
	
	Microsoft has confirmed this to be a problem with LINK version 1.20.
	We are researching this problem and will post new information here as
	it becomes available.
