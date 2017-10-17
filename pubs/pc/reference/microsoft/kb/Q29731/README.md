---
layout: page
title: "Q29731: Missing Semicolon on Line 17 of Example on Page 85 in Manual"
permalink: /pubs/pc/reference/microsoft/kb/Q29731/
---

## Q29731: Missing Semicolon on Line 17 of Example on Page 85 in Manual

	Article: Q29731
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 29-AUG-1988
	
	On Page 85 of the "Microsoft Editor for MS OS/2 and MS-DOS: User's
	Guide," there is a missing semicolon on line 17.
	   The following line is incorrect:
	
	   cfile = FileNameToHandle("", NULL)
	
	   It should read as follows:
	
	   cfile = FileNameToHandle("", NULL);
