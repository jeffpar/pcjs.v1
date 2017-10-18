---
layout: page
title: "Q47030: .COM File Example Produces Warning"
permalink: /pubs/pc/reference/microsoft/kb/Q47030/
---

## Q47030: .COM File Example Produces Warning

	Article: Q47030
	Version(s): 2.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 26-JUL-1989
	
	Page 80 of the "QuickAssembler Programmer's Guide" contains an example
	of a .COM file. This example produces a nonfatal warning if assembled
	and run. The warning reads as follows:
	
	   warning A5132: .Startup found without matching .Exit
	
	Accessing Quick Help reveals that the use of the .Startup directive
	should be used in conjunction with an .Exit directive. To eliminate
	this warning, place an .Exit directive on the line preceding the END
	statement in the example shown in the "QuickAssembler Programmer's
	Guide." The warning issued is a nonfatal warning. The program should
	function correctly.
