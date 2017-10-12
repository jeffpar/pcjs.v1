---
layout: page
title: "Q58961: If .DLL Is Linked with CRTLIB, Then .EXE Must Be Linked, Too"
permalink: /pubs/pc/reference/microsoft/kb/Q58961/
---

	Article: Q58961
	Product: Microsoft C
	Version(s): 5.10
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 6-MAR-1990
	
	When you write a program that uses a DLL that has been linked with
	CRTLIB.DLL, then the program itself must also link with CRTLIB.DLL.
	The diagram and text in Section 5.2 of MTDYNA.DOC explain this close
	relationship in detail.
	
	Also in MTDYNA.DOC, the table in Section 6 is very useful for
	identifying which components to use for which type of output file
	(.EXE or .DLL). The following is a diagram of the library
	relationships in the table:
	
	               +---------+       |                    +---------+
	           /   | xLIBCyP |       |                /   | LLIBCDLL|
	       single  +---------+       |            single  +---------+
	+-----+/  thread                 |     +-----+/  thread
	| EXE |                          |     | DLL |
	+-\---+\                         |     +-----+\
	  multiple                       |           multiple
	    thread     +---------+       |             thread +---------+
	     \      \  | LLIBCMT |       |                \   | CRTLIB  |
	      \ (or)   +---------+       |                    +---------+
	       \ ________________________________________________/
	
	As long as the .EXE is independent of any DLLs, it links with either
	xLIBCyP.LIB or LLIBCMT.LIB, depending on whether the .EXE is single or
	multithreaded. When the .EXE uses a DLL, the .EXE links with either
	xLIBCyP.LIB or CRTLIB.LIB, depending on whether the DLL is single or
	multithreaded.
	
	Additional .OBJs and .LIBs are linked for multithreaded .EXEs and for
	single and multithreaded DLLs. You can find complete detailed
	information about compiling and linking multithreaded programs and
	dynamic link libraries in MTDYNA.DOC, which is provided on the C 5.10
	disks.
	
	For further information, query on the following words:
	
	   CRTLIB and DLL
