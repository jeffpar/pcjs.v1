---
layout: page
title: "Q39137: Unresolved External _main in crt0.asm when Compiling with /P"
permalink: /pubs/pc/reference/microsoft/kb/Q39137/
---

	Article: Q39137
	Product: Microsoft C
	Version(s): 1.00 1.01
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.00 buglist1.01 docerr
	Last Modified: 12-JAN-1989
	
	The "Microsoft QuickC Programmer's Guide" explicitly states that
	invoking QCL with the /P, /E, or /EP switches produces a preprocessor
	listing file but no .OBJ file, even if /Fo is also specified. This is
	incorrect. A 524-byte .OBJ will be produced.
	
	QCL will not link when one of these switches is specified; however,
	when a make file or batch file that calls the linker is used in the
	compilation process, the following error is generated:
	
	   LINK : error L2029 : Unresolved externals:
	   _main in file(s):
	   c:\qc\lib\slibce.lib (dos\crt0.asm)
	
	C Version 5.10 handles these switches as documented.
	
	Microsoft has confirmed this to be a problem in Versions 1.00 and 1.01.
	We are researching this problem and will post new information as it
	becomes available.
