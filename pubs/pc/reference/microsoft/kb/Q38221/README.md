---
layout: page
title: "Q38221: /Au Switch Loads DS for Each Function, Not Module"
permalink: /pubs/pc/reference/microsoft/kb/Q38221/
---

	Article: Q38221
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.00 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 21-NOV-1988
	
	Page 1 of the the "Microsoft C 5.10 (and 5.00) Quick Reference Guide"
	states the following under the /Au switch:
	
	   "SS not equal to DS; DS loaded for each module"
	
	This should read as follows:
	
	   "SS not equal to DS; DS loaded for each function"
	
	This message is correctly noted on Page 154 of the "Microsoft C 5.1
	Optimizing Compiler User's Guide."
