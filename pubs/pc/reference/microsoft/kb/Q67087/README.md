---
layout: page
title: "Q67087: Spaces Between /Fe or /Fo and Filename Cause Unclear Warning"
permalink: /pubs/pc/reference/microsoft/kb/Q67087/
---

## Q67087: Spaces Between /Fe or /Fo and Filename Cause Unclear Warning

	Article: Q67087
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | S_QUICKC docerr buglist5.10 buglist6.00 buglist6.00a
	Last Modified: 4-JAN-1991
	
	The /Fe and /Fo compiler options are used to name the executable file
	and the object file, respectively. These switches require that the
	name of the file immediately follows the switch with no intervening
	spaces. If one or more spaces separate the option from the filename,
	the compiler will generate one of the following unexpected warnings:
	
	   Command line warning D4002 : ignoring unknown flag '-Fe'
	   Command line warning D4002 : ignoring unknown flag '-Fo'
	
	This limitation is documented in the online help but the "Microsoft C
	Reference" manual does not make this clear because it shows the
	switches with a space before the filenames. In addition, these
	messages are not indicative of the true nature of the errors, implying
	instead that these options are not implemented.
	
	Microsoft has confirmed this to be a problem in C versions 5.10, 6.00,
	and 6.00a and QuickC versions 2.00, 2.01, 2.50, and 2.51 (buglist2.00,
	buglist2.01, buglist2.50, and buglist2.51). We are researching this
	problem and will post new information here as it becomes available.
