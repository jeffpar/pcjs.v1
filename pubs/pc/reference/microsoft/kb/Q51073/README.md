---
layout: page
title: "Q51073: QuickC 2.00: C1007: Switches Not Recognized by QCCOM"
permalink: /pubs/pc/reference/microsoft/kb/Q51073/
---

	Article: Q51073
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickasm s_link
	Last Modified: 15-MAR-1990
	
	The QuickC Version 2.00 environment does not recognize the following
	QuickC Version 2.00 switches in the CL environment variable:
	
	   Switch      Operation                Workaround
	   -------     ---------------------    ----------------------------
	
	   /Fe         Names executable file    Not supported in environment.
	
	   /Fo         Names object file        Not supported in environment.
	
	   /Fm         Creates link map file    Set MAP FILE option in
	                                        Options.Make Linker Flags.
	
	   /FPi        Selects emulator libs    QC Default.
	
	   /link       Passes linker options    Supported options can be set
	                                        in Options.Make Linker Flags.
	
	   /Oailt      Specifies Optimizations  QC does not recognize options
	                                        in combined form. Separate
	                                        options (i.e., /Ot /Oa /Ol).
	
	   /Lr         Specifies real mode lib  Not supported in environment.
	
	   /Lc         Specifies real mode lib  Not supported in environment.
	
	   /Lp         Specifies prot mode lib  Not supported in environment.
	
	Using any of these switches results in the following fatal error
	message, where <switch> is the switch in the CL environment variable:
	
	   fatal error C1007: Unrecognized flag '<switch>' in 'qccom'
	
	The QCL command-line compiler will accept these switches.
