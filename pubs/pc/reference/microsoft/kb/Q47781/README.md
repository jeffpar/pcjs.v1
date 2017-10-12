---
layout: page
title: "Q47781: QCL Default Compile Options"
permalink: /pubs/pc/reference/microsoft/kb/Q47781/
---

	Article: Q47781
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickASM
	Last Modified: 10-OCT-1989
	
	The QuickC defaults when compiling at the command line with QCL are as
	follows:
	
	   /AS      - small memory model
	   /F2048   - stack size of 2K
	   /FPi     - inline 8087/80287 instructions
	   /G0      - 8086/8088 instruction set
	   /Gt32767 - data size threshold (compact, large, huge models only)
	   /Ot      - optimize for speed
	   /W1      - warning level
	   /Ze      - enable Microsoft extensions
	
	To view the full list of command-line compiler options, type the
	following at the DOS prompt:
	
	   QCL /help
	
	You can find detailed information about all the compiler options in
	the "Microsoft QuickC Tool Kit," Chapter 4, QCL command reference.
