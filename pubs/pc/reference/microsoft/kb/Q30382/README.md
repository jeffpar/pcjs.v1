---
layout: page
title: "Q30382: Command Line Option /Z Is Ignored after Processing"
permalink: /pubs/pc/reference/microsoft/kb/Q30382/
---

## Q30382: Command Line Option /Z Is Ignored after Processing

	Article: Q30382
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | buglist5.10
	Last Modified: 23-MAY-1988
	
	The /Z command line option tells the assembler to print out any
	offending lines and any error messages it generates. The switch will
	work up to the first include statement.
	   When an include file is processed a flag is cleared by mistake.
	   The workaround for this problem is to bracket the include directive
	by the .XLIST or .LIST directive. Do not include a .LIST directive in
	the include file. This process will guarantee that the flag is set
	after the include file is processed.
	   Microsoft is researching this problem and will post new information
	as it becomes available.
