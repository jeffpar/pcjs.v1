---
layout: page
title: "Q59279: /INC and Overlays Are Not Supported at the Same Time"
permalink: /pubs/pc/reference/microsoft/kb/Q59279/
---

## Q59279: /INC and Overlays Are Not Supported at the Same Time

	Article: Q59279
	Version(s): 5.01.20 5.01.21 5.02 5.03
	Operating System: MS-DOS
	Flags: ENDUSER | docsup
	Last Modified: 15-MAY-1990
	
	LINK.EXE does not support the use of /INCREMENTAL (or /INC) switch and
	overlays at the same time. This is because ILINK.EXE, which is invoked
	by the /INC option, does not support overlays. One of the two
	operations is ignored.
	
	The linker produces a working executable file, but one of the
	following WARNING messages may be produced:
	
	   L4013: Overlays: option ignored for segmented-executable file
	   L4014: /INCREMENTAL : Option ignored for realmode executable file
	
	If no warning message is produced, the linker takes an unpredictable
	path. If this is the case, the executable file that is produced could
	be corrupted and should NOT be relied upon.
