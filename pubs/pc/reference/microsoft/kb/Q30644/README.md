---
layout: page
title: "Q30644: Trapping FP Execptions with In-Line 8087 Code"
permalink: /pubs/pc/reference/microsoft/kb/Q30644/
---

	Article: Q30644
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 27-OCT-1988
	
	Problem:
	
	I am following the instructions on Pages 167-68 of the "Microsoft C
	Optimizing Compiler User's Guide" to generate true in-line 8087 code.
	I can link a module to remove the fixups for the interrupts, but I can
	no longer handle floating-point exceptions using the signal function.
	
	Response:
	
	This is a documentation error. To trap floating-point exceptions with
	the signal function while having true in-line 8087 code, you need to
	add the following instructions to your FIXUP.ASM module:
	
	           extrn __fpmath:far
	           extrn __fptaskdata:far
	           extrn __fpsignal:far
	
	           CDATA   segment word common 'DATA'
	                   dw      0
	                   dd      __fpmath
	                   dd      __fptaskdata
	                   dd      __fpsignal
	           CDATA   ends
	
	Without the previous code, the start-up code will not initialize
	the emulator and the signal function returns an error when you attempt
	to use signal to trap floating-point exceptions.
