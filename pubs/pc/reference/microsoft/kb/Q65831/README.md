---
layout: page
title: "Q65831: BASIC 7.00 QBX.EXE: PAINT Statement Uses Far Heap"
permalink: /pubs/pc/reference/microsoft/kb/Q65831/
---

## Q65831: BASIC 7.00 QBX.EXE: PAINT Statement Uses Far Heap

	Article: Q65831
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900920-17 buglist7.00 fixlist7.10
	Last Modified: 18-OCT-1990
	
	In the QBX.EXE environment of Microsoft BASIC Professional Development
	System (PDS) version 7.00, the PAINT statement allocates an area of
	memory in the far heap that cannot be deallocated.
	
	Microsoft has confirmed this to be a problem in the QBX.EXE
	environment of Microsoft BASIC PDS version 7.00 for MS-DOS. This
	problem was corrected in the QBX.EXE environment of Microsoft BASIC
	PDS version 7.10 for MS-DOS.
	
	The following code example demonstrates the problem. When run inside
	the QBX.EXE environment of version 7.00, the values returned by the
	FRE(-1) function are different. The problem does not appear in a
	compiled .EXE program.
	
	Code Example
	------------
	
	   CLS
	   SCREEN 1
	   CIRCLE (190, 100), 100, 1, , , .3  'Draw an ellipse
	   PRINT FRE(-1)                      'Print far heap memory available
	   PAINT (190, 100), 2, 1             'Fill in the ellipse
	   PRINT FRE(-1)   'This FRE(-1) value is different than previous FRE(-1)
