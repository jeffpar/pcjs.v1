---
layout: page
title: "Q45514: 4.50 Manual Has Misleading Note for Calling FUNCTION Procedure"
permalink: /pubs/pc/reference/microsoft/kb/Q45514/
---

## Q45514: 4.50 Manual Has Misleading Note for Calling FUNCTION Procedure

	Article: Q45514
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | docerr SR# S890518-133
	Last Modified: 20-DEC-1989
	
	The Note on Page 46 of the "Microsoft QuickBASIC: Programming in
	BASIC" manual for Version 4.50 is misleading. It reads as follows:
	
	   NOTE: The program example above is written for use in the QB
	   environment only. It cannot be compiled using the BC command
	   from DOS.
	
	Technically, this note is correct because the program example leaves
	out the DECLARE statement for the FUNCTION procedure (GetInput$). The
	DECLARE is necessary for compilation. However, if the program is
	entered in the QuickBASIC environment, the DECLARE will automatically
	be added when the program is Saved. This misleading comment does not
	appear in the documentation for Microsoft BASIC PDS Version 7.00.
