---
layout: page
title: "Q68694: RTF Codes &#92;fi&lt;n&gt; and &#92;li&lt;n&gt; Use Twips Instead of Spaces"
permalink: /pubs/pc/reference/microsoft/kb/Q68694/
---

## Q68694: RTF Codes &#92;fi&lt;n&gt; and &#92;li&lt;n&gt; Use Twips Instead of Spaces

	Article: Q68694
	Version(s): 1.06   | 1.06
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 31-JAN-1991
	
	The Rich Text Format codes \fi<n> and \li<n> used for creating help
	files are incorrectly described in the online help. The online help
	states that the code \fi<n> indents the first line of the paragraph
	<n> spaces, and the code \li<n> indents the entire paragraph <n>
	spaces from the left margin.
	
	However, the value of <n> is the number of twips and not the number of
	spaces. A twip is 1/20 of a point or 1/1440 of an inch; 180 twips
	approximates one space (that is, \li720 will indent the entire
	paragraph four spaces).
	
	Page 4 of the "Professional Advisor Library Reference" describes the
	RTF codes \fi and \li but does not mention the <n> parameter to indent
	the paragraphs.
	
	Page 155 of the "Microsoft C Advanced Programming Techniques" manual
	describes the correct syntax for the RTF codes but does not mention the
	format for <n>.
