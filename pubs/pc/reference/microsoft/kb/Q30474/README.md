---
layout: page
title: "Q30474: BRIEF TOOLS.INI File Assigns Two Commands to F5 in M.EXE"
permalink: /pubs/pc/reference/microsoft/kb/Q30474/
---

## Q30474: BRIEF TOOLS.INI File Assigns Two Commands to F5 in M.EXE

	Article: Q30474
	Version(s): 1.00    | 1.00
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER |
	Last Modified: 1-SEP-1988
	
	Problem:
	
	After I configure the Microsoft M.EXE Editor in the BRIEF mode and
	invoke Psearch (F5 key), I receive the following error message:
	
	"Invalid argument."
	
	However, Msearch (ALT+F5) functions correctly.
	
	Response:
	
	The BRIEF TOOLS.INI file assigns two commands to F5. The first
	occurrence in the file is for Psearch and the second is for
	DeleteWindow.
	
	To correct the problem, one of the commands should be mapped to a
	different key. Make sure the new key is not already in use.
	
	The following is an example of the incorrect portion of the
	BRIEF.INI file:
	
	   ; TOOLS.INI file for BRIEF(tm) configuration
	   [M]
	          .
	          .
	          .
	   Psearch:F5
	          .
	          .
	          .
	   ; WINDOWS
	   ;
	   ; Delete Current Window is F5
	   DeleteWindow:=meta window
	   DeleteWindow:F5
	   ;
	   ;
	   ;
	   ; BRIEF is a trademark of UnderWare, INC.
