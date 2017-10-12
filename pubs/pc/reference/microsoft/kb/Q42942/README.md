---
layout: page
title: "Q42942: Dump Command on Arrays in FORTRAN Gives Syntax Error"
permalink: /pubs/pc/reference/microsoft/kb/Q42942/
---

	Article: Q42942
	Product: Microsoft C
	Version(s): 1.10 2.20 | 2.20
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | H_FORTRAN buglist2.20 buglist2.30
	Last Modified: 21-AUG-1989
	
	Microsoft CodeView Versions 2.20 and 2.30 gives a "Syntax error" when
	attempting to use the Dump command on an array of dimension greater
	than 1.
	
	For example, issuing the DI i(1,3) command to dump the contents of an
	array element fails.
	
	To work around this problem use one of the following methods:
	
	1. Use the "?" command, as follows:
	
	      ? i(1,3)
	
	2. Enclose each dimension index within parentheses and omit the comma,
	   as follows:
	
	      DI i((1)(3))
	
	   DI i(1(3)) and DI i((1)3) are also acceptable.
	
	   A three dimensional example would look like the following:
	
	      DI j(1(2)3)
	
	   Any permutation of the parenthesis around the index is sufficient.
	
	Microsoft has confirmed this to be a problem in Versions 2.20 and
	2.30. We are researching this problem and will post new information as
	it becomes available.
