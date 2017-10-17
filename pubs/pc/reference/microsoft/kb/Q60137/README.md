---
layout: page
title: "Q60137: WIDTH Syntax Correction; WIDTH Parameter Is Required"
permalink: /pubs/pc/reference/microsoft/kb/Q60137/
---

## Q60137: WIDTH Syntax Correction; WIDTH Parameter Is Required

	Article: Q60137
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900315-50 docerr B_QuickBas
	Last Modified: 15-JAN-1991
	
	The following WIDTH statement syntax (taken from the documentation
	listed further below) incorrectly indicates that both "screenwidth%"
	and  ", screenheight%" are optional:
	
	   WIDTH [screenwidth%][, screenheight%]
	
	According to the above syntax description, "WIDTH" with no parameters
	is a legal statement; however, WIDTH with no arguments correctly
	causes the following error in the QBX.EXE environment:
	
	   Expected: # or LPRINT or expression or ,
	
	The syntax description for the WIDTH statement should be corrected to
	read as follows:
	
	   WIDTH {screenwidth% | , screenheight% | screenwidth%, screenheight%}
	
	Note that screenwidth% is measured in columns, and screenheight% is
	measured in lines.
	
	This correction applies to the WIDTH statement on page 449 of the
	"Microsoft QuickBASIC 4.0: Language Reference" for 4.00 and 4.00b; on
	page 409 of the "Microsoft BASIC 7.0: Language Reference" manual for
	BASIC PDS 7.00 and 7.10; to the WIDTH statement in the QBX.EXE
	Microsoft Advisor online Help system from Microsoft BASIC Professional
	Development System (PDS) version 7.00; and in the QB.EXE QB Advisor
	online Help system from Microsoft QuickBASIC version 4.50.
	
	This documentation error has been corrected in the QBX.EXE online Help
	in BASIC PDS 7.10.
	
	The following section of the QBX.EXE online Help system defines the
	notation used for syntax description (in all of the above products):
	
	[optional item]      Items inside square brackets are optional; you
	                     do not have to use them in the statement.
	
	{choice1 | choice2}  Braces and a vertical bar indicate a choice
	                     between two or more items. You must use one of
	                     the items in the statement unless the braces
	                     are enclosed in square brackets.
