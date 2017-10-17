---
layout: page
title: "Q36611: Share Problems Using sopen and Incorrect oflag"
permalink: /pubs/pc/reference/microsoft/kb/Q36611/
---

## Q36611: Share Problems Using sopen and Incorrect oflag

	Article: Q36611
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 12-OCT-1988
	
	The "important" note on Page 550 of the "Microsoft Optimizing 5.1
	Compiler Run-Time Library Reference" manual has an error in the second
	condition listed as causing problems when opening a new file with the
	sopen function under DOS Versions 3.00, 3.10, or 3.20 with SHARE
	installed.
	
	"With oflag set to any combination that includes O_FLAG..." is
	incorrect. There is no O_FLAG setting available. The oflag setting
	should be O_CREAT | O_RDWR. This oflag setting with pmode set to
	S_IREAD requires that shflag be set to SH_COMPAT to avoid problems
	with the new file created by sopen.
	
	The problems that can occur when the wrong sopen options are used
	include not opening the new file, or opening the new file but not
	being able to write to it resulting in a file of zero length.
	
	These problems may also occur in DOS Version 3.30.
