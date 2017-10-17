---
layout: page
title: "Q38309: Selecting Large Text Blocks with Microsoft Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q38309/
---

## Q38309: Selecting Large Text Blocks with Microsoft Editor

	Article: Q38309
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 4-MAY-1989
	
	Question:
	
	When I want to select a large block of code for the clipboard, I press
	ALT+A, then the DOWN ARROW key until I reach the last line I want to
	select. This process is very slow if the block I am selecting is
	several pages long (almost a whole file). Is there a way to move
	faster to select a block than by using the CURSOR key (such as the
	equivalent of ^K-B and ^K-K in Wordstar)?
	
	Response:
	
	CTRL+PGDN (Ppara) serves this purpose, as documented on Pages 91 and
	104 of the "Microsoft Editor for MS OS/2 and MS-DOS Operating Systems:
	User's Guide." This key sequence will move you to a new paragraph each
	time you press the keys. If the movement sequence you want to use
	contains an Arg, it is either used by the command or canceled.
	
	A faster method is to define a couple of macros to help out. First, we
	need a macro that will mark the beginning spot in the text, as
	follows:
	
	   txtmark:=arg arg "first" mark
	   txtmark:alt+t
	
	The second macro automates using the mark as an argument, as follows:
	
	  callmark:=arg "first"
	  callmark:alt+u
	
	You can put these lines in your TOOLS.INI file.
	
	To use this pair, move to the first spot, press ALT+T, then move up or
	down using any movement keys to the second spot. Finally, press ALT+U
	and press a key that allows a markarg as an argument. (The Copy and
	Ldelete functions are among these.) Note: no highlighting occurs, so
	you'll have to be careful.
	
	Note: if you want the argument to be entire lines rather than a box,
	the cursor MUST be in the same column when you press ALT+U as it was
	when you pressed ALT+T. If you put it in a different column, you will
	be selecting a box argument rather than a line argument.
