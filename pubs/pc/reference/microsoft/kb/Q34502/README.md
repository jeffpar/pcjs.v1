---
layout: page
title: "Q34502: /NOE Option for Redefinition Error L2044"
permalink: /pubs/pc/reference/microsoft/kb/Q34502/
---

## Q34502: /NOE Option for Redefinition Error L2044

	Article: Q34502
	Version(s): 3.x 5.x | 5.10
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER |
	Last Modified: 13-OCT-1988
	
	The /NOEXTDICTIONARY switch tells the linker NOT to take advantage of
	additional information recorded in Extended Dictionary in the library
	file. This additional information describes which module in the library
	calls any other module from the same library, saving linker number
	of passes through the library file to pick up all required modules.
	
	If you have a call in your code to the library function FOO and FOO
	calls another function BAR from the same library, then at processing
	time of FOO, the linker will pull out BAR. This process occurs because
	the extended dictionary has a link between FOO and BAR.
	
	Linking without /NOE causes the following error if you want to pull
	FOO in from the library but you want to provide its own BAR:
	
	L2044 BAR : symbol multiply defined, use /NOE
	
	This error resulted from the linker pulling FOO and BAR from the
	same library, then later it sees BAR coming from user .OBJ file.
	
	Using /NOE in this case prevents the linker from pulling out
	BAR from the library, so your BAR routine is used instead.
	
	If you have genuine symbol redefinition, then when linking with /NOE
	you will see the following error:
	
	L2025 BAR : symbol defined more than once
