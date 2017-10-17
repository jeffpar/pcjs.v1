---
layout: page
title: "Q38867: Specifying Both /T and /W Disables Mouse"
permalink: /pubs/pc/reference/microsoft/kb/Q38867/
---

## Q38867: Specifying Both /T and /W Disables Mouse

	Article: Q38867
	Version(s): 2.20    | 2.20
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER |
	Last Modified: 6-DEC-1988
	
	If you invoke CodeView with the following, the use of your mouse is
	disabled:
	
	   CV /T /W program
	
	Don't specify the /T switch. Using /T with /W produces mutually
	exclusive modes of operation.
