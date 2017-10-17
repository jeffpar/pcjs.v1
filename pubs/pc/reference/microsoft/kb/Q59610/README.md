---
layout: page
title: "Q59610: OS/2 SDK Version of CVP 2.30 Won't Debug DosLoadModule DLLs"
permalink: /pubs/pc/reference/microsoft/kb/Q59610/
---

## Q59610: OS/2 SDK Version of CVP 2.30 Won't Debug DosLoadModule DLLs

	Article: Q59610
	Version(s): 2.30
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 11-JUL-1990
	
	The OS/2 version 1.10 Software Development Kit (SDK) includes a
	prerelease version of protected-mode CodeView (CVP) version 2.30. This
	version is identical to the regular retail release of CVP 2.30, except
	that it does not allow the debugging of DLLs loaded with
	DosLoadModule. The regular retail version of CVP 2.30 is included with
	FORTRAN 5.00 and the OS/2 Presentation Manager Toolkit for OS/2
	version 1.10. This release DOES support debugging DLLs loaded at run
	time with DosLoadModule.
	
	The prerelease version of CVP 2.30 released in the OS/2 SDK may be
	identified by a file date of 2-24-89. The regular release version is
	dated 3-21-89. The file date is the only discernible difference
	between these two versions since the files themselves are exactly the
	same size.
