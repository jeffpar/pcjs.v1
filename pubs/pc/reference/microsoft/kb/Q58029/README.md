---
layout: page
title: "Q58029: Two Toned Colors in &lt;assign&gt; Pseudo File Can Occur"
permalink: /pubs/pc/reference/microsoft/kb/Q58029/
---

	Article: Q58029
	Product: Microsoft C
	Version(s): 1.02    | 1.02
	Operating System: MS-DOS  | OS/2
	Flags: ENDUSER | buglist1.02
	Last Modified: 29-JAN-1990
	
	The <assign> pseudo file can consist of lines in blocks that alternate
	in color starting at the middle of the file. This appears as if you've
	changed multiple editor options, which have just been activated, when
	no changes were actually made. This does not affect the way M.EXE (or
	MEP.EXE) operates.
	
	To see the blocks of alternating color, follow the steps below:
	
	1. Invoke the editor.
	
	2. Press ALT+A <ASSIGN> F2, which implies ARG <ASSIGN> SETFILE.
	
	3. Press ALT+BACKSPACE, which implies UNDO.
	
	4. Press F9 ALT+BACKSPACE, which implies META UNDO.
	
	5. Page down until you see the colored blocks.
	
	Microsoft has confirmed this to be a problem with the Microsoft Editor
	Version 1.02. We are researching this problem and will post new
	information here as it becomes available.
