---
layout: page
title: "Q29845: C 5.10 MTDYNA.DOC: Matrix of Components"
permalink: /pubs/pc/reference/microsoft/kb/Q29845/
---

	Article: Q29845
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-JAN-1991
	
	The following information is from "Section 6: Matrix of Components" of
	the Microsoft C version 5.10 MTDYNA.DOC file.
	
	Matrix of Components
	--------------------
	
	Table 1 lists the various components needed to create multiple-thread
	programs and the two types of dynamic-link libraries discussed above.
	For comparison, a single-thread executable file is also included in
	the table. (A single-thread executable file is simply a regular C
	program.)
	
	The components have the following meanings:
	
	   .OBJ            Object files
	
	   .LIB            Library files
	
	   .h              Location (default) of include files
	
	   DLL             Status of DLL symbol (either defined or not defined)
	
	   xLIBCyP.LIB     Regular C run-time library for protected mode
	                      x = memory model (S, C, M, L)
	                      y = math package (A, E, 7)
	
	Table 1.  Output-File Type
	
	                     Executable                    Dynamic-Link Library
	
	Component  Single Thread    Multiple Thread   Single Thread    Multiple Threa
	---------  -------------    ---------------   -------------    --------------
	
	.OBJ       ...              ...               ...              CRTDLL.OBJ
	                                                               CRTEXE.OBJ
	                                                               CRTLIB.OBJ
	
	.LIB       xCLIBCyP.LIB     LLIBCMT.LIB       LLIBCDLL.LIB     CDLLOBJS.LIB
	                            DOSCALLS.LIB      DOSCALLS.LIB     CDLLOBJS.DEF
	                                                               CDLLSUPP.LIB
	                                                               DOSCALLS.LIB
	
	.h         \INCLUDE         \INCLUDE\MT       \INCLUDE         \INCLUDE\MT
	
	DLL        Not defined      Not defined       Not defined      Defined
