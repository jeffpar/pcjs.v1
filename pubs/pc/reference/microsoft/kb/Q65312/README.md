---
layout: page
title: "Q65312: Label/Function Search Command Fails Under Codeview 3.00/3.10"
permalink: /pubs/pc/reference/microsoft/kb/Q65312/
---

## Q65312: Label/Function Search Command Fails Under Codeview 3.00/3.10

	Article: Q65312
	Version(s): 3.00 3.10 | 3.00 3.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | buglist3.00 buglist3.10
	Last Modified: 31-AUG-1990
	
	Under CodeView versions 3.00 and 3.10, the Label/Function search
	command is described in the online help as performing a search of the
	current source window for an assembly-language label or function name.
	If the label is found, the debugger should switch from source to
	assembly mode to display a label in a library routine or assembly
	language module.
	
	In reality, this command fails with a message "Error - Unknown
	Symbol". The debugger does not switch into assembly mode. This problem
	can be reproduced by selecting Search from the CodeView menu, then
	selecting Label/Function and typing in "__chkstk" (without the
	quotation marks).
	
	Microsoft has confirmed this to be a problem with CodeView Versions
	3.00 and 3.10. We are researching this problem and will post new
	information here as it becomes available.
