---
layout: page
title: "Q30386: .DATA Directive Causes _DATA Segment Not to Align Paragraph"
permalink: /pubs/pc/reference/microsoft/kb/Q30386/
---

## Q30386: .DATA Directive Causes _DATA Segment Not to Align Paragraph

	Article: Q30386
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 23-MAY-1988
	
	The .DATA directive word aligns the _DATA segment. The .MODEL
	directive defines the _TEXT segment before the _DATA segment.
	Therefore, when the simplified segment directives are used, _DATA does
	not start at a paragraph boundary.
	
	   The following sample code demonstrates this problem:
	
	   .MODEL small
	   .DATA
	   org 0h
	   t1 db "table 1"
	   org 100h
	   t2 db "table 2"
	   .CODE
	   mov  ax, dgroup
	   mov  ds, ax
	   mov  bx, offset t1
	   mov  cx, offset t2
	   end
	
	   DGROUP begins at the previous paragraph boundary, but _DATA, the
	first segment in DGROUP, actually starts at DGROUP:0006. Therefore,
	the offset of t2 could evaluate to _DATA:0100h. This is equivalent to
	DGROUP:0106h.
