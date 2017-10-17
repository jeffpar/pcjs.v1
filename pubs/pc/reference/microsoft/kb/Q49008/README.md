---
layout: page
title: "Q49008: /NOI Switch May Cause L2022 and L2029 in PM Programs"
permalink: /pubs/pc/reference/microsoft/kb/Q49008/
---

## Q49008: /NOI Switch May Cause L2022 and L2029 in PM Programs

	Article: Q49008
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 27-OCT-1989
	
	I am compiling and linking a Presentation Manager (PM) program from
	Charles Petzold's "Programming the OS/2 Presentation Manager" and I
	get the following link errors:
	
	   LINK : error L2022: ClientWndProc (alias ClientWndProc) : export
	          undefined
	
	        : error L2029 : 'ClientWndProc' : unresolved external
	
	I get the same errors when compiling WELCOME1.C from the companion
	disk to "Programming the OS/2 Presentation Manager."
	
	The /NOI switch instructs the linker to preserve case. If you are
	using the /NOI switch, the linker will generate these errors because
	EXPENTRY (the export entry point) is defined in OS2DEF.H as follows:
	
	   #define EXPENTRY far pascal
	
	The "pascal" keyword instructs the compiler to use the left-to-right
	calling sequence for the functions that it modifies. The keyword also
	causes the conversion of the function's name to uppercase letters.
	
	All window procedures are defined as EXPENTRY. Thus, the name of your
	window procedure is converted to uppercase letters. In your .DEF, you
	export your window procedures as follows:
	
	   EXPORTS         ClientWndProc
	
	Because of the /NOI switch, the linker does not view ClientWndProc and
	CLIENTWNDPROC as being equal. Consequently, you get the first error
	message "export undefined."
	
	The second error message is generated because ClientWndProc (mixed
	uppercase and lowercase letters) is not recognized as being defined,
	so the linker considers it an "unresolved external."
	
	Removing the /NOI switch from your link line corrects both errors.
