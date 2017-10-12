---
layout: page
title: "Q31991: How LINK Orders and Combines Segments"
permalink: /pubs/pc/reference/microsoft/kb/Q31991/
---

	Article: Q31991
	Product: Microsoft C
	Version(s): 3.x 5.01.20 5.01.21
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 15-JUL-1988
	
	Every segment belongs to a named class such as 'CODE', 'DATA', or
	'BSS'. LINK orders all segments with the same class name contiguously.
	   Within each class, segments are placed in the same order as LINK
	encounters them. Segment classes are placed in the order they appear.
	If you do not give a class name when you define a segment in assembly,
	the segment gets the null class, which is treated like any other segment.
	If the /DOSSEG option is given, or one of the Microsoft language run-time
	libraries is used, LINK imposes the following additional order:
	
	      code (class ending in 'CODE')
	      far data (everything but DGROUP and 'CODE')
	      DGROUP - the default data segment
	          class 'BEGDATA' (special runtime segment)
	          near initialized data (everything but 'BSS' and 'STACK')
	          near BSS--uninitialized data  (class 'BSS')
	          stack
