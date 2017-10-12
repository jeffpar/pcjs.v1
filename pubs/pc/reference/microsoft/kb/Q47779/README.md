---
layout: page
title: "Q47779: Linking without /NOI Causes SYS2070 in Program Calling CRTLIB"
permalink: /pubs/pc/reference/microsoft/kb/Q47779/
---

	Article: Q47779
	Product: Microsoft C
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER | SR# G890807-24188
	Last Modified: 16-JAN-1990
	
	Programs that are linked with the C run-time library DLL (CRTDLL),
	without the /NOI switch, fail with the following message:
	
	   SYS2070:  The system could not demand load the application's
	   segment.  CRTLIB __STDOUT is in error.
	
	To avoid the problem, use the /NOI switch when linking. The proper use
	of /NOI is described in Section 5.2 of the MTDYNA.DOC file supplied
	with Microsoft C Version 5.10.
