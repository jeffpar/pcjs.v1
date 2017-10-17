---
layout: page
title: "Q37758: Share Problems Documentation Error for open"
permalink: /pubs/pc/reference/microsoft/kb/Q37758/
---

## Q37758: Share Problems Documentation Error for open

	Article: Q37758
	Version(s): 5.00   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 14-NOV-1988
	
	The important note on Page 446 of the "Microsoft Optimizing 5.1
	Compiler Run-Time Library Reference" manual has an error in the second
	possible work around described in the second paragraph of the note.
	
	"Another work around is to open the file with pmode set to S_IREAD and
	omode..." is incorrect. The word omode should be replaced with the
	word oflag.
