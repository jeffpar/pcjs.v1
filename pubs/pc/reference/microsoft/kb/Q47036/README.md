---
layout: page
title: "Q47036: /CP:X Is Not Valid When Linking Protected-Mode Programs"
permalink: /pubs/pc/reference/microsoft/kb/Q47036/
---

## Q47036: /CP:X Is Not Valid When Linking Protected-Mode Programs

	Article: Q47036
	Version(s): 5.01.21 | 5.01.21
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 26-JUL-1989
	
	Question:
	
	I cannot seem to get the /CPARMAXALLOC linker option to work when I
	link for OS/2 protected mode. When linking a real-mode application, it
	works correctly. Also, when I type "link /help" in protected mode, the
	output indicates that this is a valid option. However, when I try to
	use this option for a protected-mode application, the linker produces
	the following warning:
	
	   LINK : warning L4013: invalid option for new-format executable file
	                         ignored
	
	What am I doing wrong and what does this error message mean?
	
	Response:
	
	As documented on Page 27 in the update section of the Microsoft C
	Optimizing Compiler Version 5.10 "CodeView and Utilities, Microsoft
	Editor, Mixed-Language Programming Guide" manual, the /CPARMAXALLOC
	option is for real-mode applications only. The "link /help" indicates
	that this is a valid option because this option IS valid whenever
	you're linking real-mode applications, regardless of whether the
	linker is running under OS/2 or DOS. (By the same token, it is invalid
	when you're linking a protected-mode application, regardless of which
	operating system you're using.)
	
	This error message was omitted from the documentation. It indicates
	that one of the options that the linker was passed is invalid.
	
	This option is not supported in a protected-mode application because
	the functionality of it is done automatically by the linker.
	Protected-mode applications are not given a 64K default data segment;
	they are only allocated the space that they need. This is documented
	on Page 33 of the same section and manual listed above.
