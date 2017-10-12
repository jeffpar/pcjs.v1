---
layout: page
title: "Q61636: Saving Compiler Results File in the PWB"
permalink: /pubs/pc/reference/microsoft/kb/Q61636/
---

	Article: Q61636
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-MAY-1990
	
	The Programmer's WorkBench (PWB) deletes the compiler results file
	upon exiting the PWB. In DOS or OS/2, the file can be saved if the
	compiler results window is made current and the File.Save As menu
	option is selected.
	
	The compiler results file will appear similar to the following:
	
	   +++ PWB  [E:\] Rebuild
	           NMAKE  /z /a /f E:\pwb.mak
	        cl /c /W4 /Fm /Ot /FoGLOBL.obj GLOBL.C
	   Microsoft (R) C Optimizing Compiler Version 6.00
	   Copyright (c) Microsoft Corp 1984-1990. All rights reserved.
	
	   GLOBL.C
	        echo @GLOBL.lrf > NUL
	        link @GLOBL.lrf
	
	   Microsoft (R) Segmented-Executable Linker  Version 5.10
	   Copyright (C) Microsoft Corp 1984-1990.  All rights
	   reserved.
	
	   Object Modules [.OBJ]: GLOBL.obj,GLOBL.exe,NUL, /NOD:SLIBCE
	   SLIBCEP , /NOI /BATCH /EXE /FAR /PACKC;
