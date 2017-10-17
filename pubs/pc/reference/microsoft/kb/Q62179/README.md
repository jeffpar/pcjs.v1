---
layout: page
title: "Q62179: NOGRAPH.OBJ Listed in Online Help Is Actually TXTONLY.OBJ"
permalink: /pubs/pc/reference/microsoft/kb/Q62179/
---

## Q62179: NOGRAPH.OBJ Listed in Online Help Is Actually TXTONLY.OBJ

	Article: Q62179
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 26-NOV-1990
	
	In C version 6.00, an object file is sent out with the package to help
	decrease the size of executable files by about 8K to 10K. The online
	help states that the name of the object file is NOGRAPH.OBJ; in fact,
	the name of the file is TXTONLY.OBJ.
	
	To get any information on what this object file does, you can type "qh
	NOGRAPH.OBJ" (without the quotation marks). This will bring up
	QuickHelp with the information on this particular file.
	
	The help states that NOGRAPH.OBJ is used to reduce the size of an
	executable that uses only the text-mode functions from GRAPHICS.LIB.
	
	The actual filename is TXTONLY.OBJ.
