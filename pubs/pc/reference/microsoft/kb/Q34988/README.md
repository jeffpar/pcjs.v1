---
layout: page
title: "Q34988: Errors R6012 to R6015 Documented in QuickC 1.01 Guide"
permalink: /pubs/pc/reference/microsoft/kb/Q34988/
---

	Article: Q34988
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 14-MAR-1990
	
	The C Run-Time error messages below are not included in
	"Appendix E -- Error Messages" in the "Microsoft C Optimizing Compiler
	User's Guide"; nor are they located in ERRMSG.DOC. They are documented
	in the "Microsoft QuickC Compiler Programmer's Guide" on Page 363, as
	follows:
	
	R6012 invalid near pointer reference
	R6013 invalid far pointer reference
	R6014 control-BREAK encountered
	R6015 unexpected interrupt
	
	According to the README.DOC found on the Product Disk for QuickC
	Version 1.00 and on the Setup Disk for QuickC Version 1.01, the
	run-time error messages R6012 and R6013 have changed as follows:
	
	1. R6012 illegal near pointer use
	
	   A null near pointer was used in the program.
	
	   This error only occurs if pointer checking is in effect (i.e.,
	   if the program was compiled in the QuickC environment
	   with the Pointer Check option in the Compile dialog box, the
	   /Zr option on the QCL command line, or the pointer_check
	   pragma in effect).
	
	2. R6013 illegal far pointer use
	
	   An out-of-range far pointer was used in the program.
	
	   This error only occurs if pointer checking is in effect (i.e. if
	   the program was compiled in the QuickC environment with the
	   Pointer Check option in the Compile dialog box, the /Zr option
	   on the QCL command line, or the pointer_check pragma in effect).
	
	In addition, the following new error messages are documented:
	
	1. R6014 control-BREAK encountered
	
	   You pressed CTRL+BREAK to stop the execution of a program within
	   the QuickC environment.
	
	2. R6015 unexpected interrupt
	
	   The program could not be run because it contained unexpected
	   interrupts.
	
	When you create an in-memory program from a program list, QuickC
	automatically creates object files and passes them to the linker. If
	you compile with the Debug option turned on, the object files that
	QuickC passes to the linker contain interrupts that are required
	within the QuickC environment. However, you cannot run a program
	created from such object files outside of the QuickC programming
	environment.
