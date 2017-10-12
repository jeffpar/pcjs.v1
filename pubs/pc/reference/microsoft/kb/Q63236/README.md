---
layout: page
title: "Q63236: CV 3.00 Incorrectly Documents helpbuffer Switch as helpbuffers"
permalink: /pubs/pc/reference/microsoft/kb/Q63236/
---

	Article: Q63236
	Product: Microsoft C
	Version(s): 3.00   | 3.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 25-FEB-1991
	
	In the "Configure CodeView" section of the online help for CodeView
	version 3.00, the "helpbuffer" switch is incorrectly listed as
	follows:
	
	   helpbuffers:<size>
	
	This switch should be spelled as follows:
	
	   helpbuffer:<size>
	
	CodeView will not recognize the first spelling. The correct spelling
	was incorporated into the online help beginning with CodeView version
	3.10.
