---
layout: page
title: "Q40027: #pragma pack() Affects Declarations, not Definitions"
permalink: /pubs/pc/reference/microsoft/kb/Q40027/
---

	Article: Q40027
	Product: Microsoft C
	Version(s): 5.00 5.10 | 5.00 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 5-JAN-1989
	
	Question:
	
	I need to use the preprocessor directive "#pragma pack()" to control
	how structure data are "packed" into memory. However, I don't know
	where to stick it. Should I place it before a declaration (creating a
	type) or before a definition (allocating space)?
	
	Response:
	
	The pack pragma affects declarations; not definitions. Place #pragma
	pack() prior data declarations.
	
	The following program demonstrates usage of #pragma pack():
	
	/* Elements of variables of type struct x will be byte-aligned. */
	#pragma pack(1)
	struct x { int a; char b; int c; };
	
	/* Elements of variables of type struct y will be word-aligned. */
	#pragma pack(2)
	struct y { int a; char b; int d; };
	
	/* The pragma below does NOT affect the definitions that follow. */
	#pragma pack(4)
	
	struct x X;
	struct y Y;
	
	void main (void)
	{ /* dummy main */ }
