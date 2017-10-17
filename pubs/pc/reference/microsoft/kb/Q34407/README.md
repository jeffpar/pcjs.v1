---
layout: page
title: "Q34407: BSAVE/BLOAD File Format Explained for BASIC; 7-Byte Header"
permalink: /pubs/pc/reference/microsoft/kb/Q34407/
---

## Q34407: BSAVE/BLOAD File Format Explained for BASIC; 7-Byte Header

	Article: Q34407
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI
	Last Modified: 9-JAN-1991
	
	A file saved with the BSAVE statement has a 7-byte header with the
	following hexadecimal format:
	
	   ww xx xx yy yy zz zz
	
	   ww:     A signature byte equal to 253, which tells DOS and other
	           programs that this is a BASIC BSAVE/BLOAD format file.
	   xx xx:  The segment address from the last BSAVE.
	   yy yy:  The offset address from the last BSAVE.
	   zz zz:  The number of bytes BSAVEd.
	
	This information applies to Microsoft QuickBASIC versions 3.00, 4.00,
	4.00b, and 4.50 for MS-DOS; to Microsoft BASIC Compiler versions 6.00
	and 6.00b for MS-DOS; and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	This information is provided as is. The BSAVE format is not guaranteed
	to be the same in a future release.
	
	Microsoft GW-BASIC Interpreter (versions 3.20, 3.22, and 3.23) uses
	the same 7-byte header string, and also repeats the 7-byte string,
	appending it after the final data byte. BASICA (provided in IBM or
	Compaq ROM on some computer models) does not repeat the 7-byte string
	at the end. GW-BASIC and BASICA both terminate the file with ASCII 26,
	also known as a CTRL+Z character (hex 1A). QuickBASIC and Microsoft
	BASIC Compiler don't append CTRL+Z or repeat the 7-byte string at the
	end.
	
	To determine whether a file was BSAVEd by GW-BASIC, BASICA, or
	QuickBASIC, compare the length of the memory saved against the file
	length. The difference is 15 bytes in GW-BASIC, 7 bytes in QuickBASIC,
	and 8 bytes in BASICA.
	
	Despite the slight format differences, files BSAVEd under any of the
	three above BASIC dialects correctly BLOAD into each other BASIC.
