---
layout: page
title: "Q60254: Qccom Cannot Parse Combined /G&#42; Options from Environment"
permalink: /pubs/pc/reference/microsoft/kb/Q60254/
---

	Article: Q60254
	Product: Microsoft C
	Version(s): 2.00 2.01 2.50 2.51
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm buglist2.00 buglist2.01 fixlist2.50 fixlist2.51
	Last Modified: 18-APR-1990
	
	If you set the cl environment variable to include the /G2s, /G2w,
	/Gsw, or /G2sw option and then compile any program within the QuickC
	2.00 or 2.01 environment, you will receive the following compiler
	error:
	
	   Fatal Error C1007: Unrecognized flag '<flag>' in 'qccom'.
	
	<flag> is replaced by the cl option you set in the environment
	variable (/G2s, /G2w, /Gsw, or /G2sw). If you break up the switch to
	separate components (for example, /G2w becomes /G2 /Gw), qccom parses
	the options correctly.
	
	If you are using QuickC 2.50 or 2.51, the environment variables are
	parsed correctly.
	
	1. Type the following line at the DOS prompt:
	
	      set cl=/G2sw
	
	2. Enter QuickC, and bring up any source file. Compiling the file will
	   give you the error message shown above.
	
	3. Now, exit QuickC and break up the environment variable by typing
	   the following:
	
	      set cl=/G2 /Gs /Gw
	
	   If you attempt to compile a new program, the error will not occur.
