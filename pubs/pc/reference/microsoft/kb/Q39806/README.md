---
layout: page
title: "Q39806: Quote Function and Typing in Graphic Characters in M"
permalink: /pubs/pc/reference/microsoft/kb/Q39806/
---

	Article: Q39806
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 16-MAY-1989
	
	Question:
	
	I want to input some graphics characters in the M editor. However,
	when I try to input the ASCII character 31 using the ALT key and the
	numeric keypad, the M editor beeps and displays the following message:
	
	   "ctrl+_ is not assigned to any editor function"
	
	For the ASCII character 30, the M editor displays the following
	message:
	
	   "ctrl+^ is not assigned to any editor function."
	
	How can I input those characters?
	
	Response:
	
	Use the editing Quote function in the M editor. The Quote function is
	associated with CTRL+P by default. After the Quote function is
	invoked, the following keystroke is taken literally. This function is
	mentioned in the "Microsoft Editor for MS OS/2 and MS-DOS Operating
	Systems User's Guide" on Page 105.
	
	The first 32 characters in the ASCII character set have two
	conflicting uses. As standard ASCII characters, they are used for
	communications control and printer control. They are also used by IBM
	to represent some useful graphics characters.
	
	Using the Quote function in the M editor can prevent these ASCII
	characters from being interrupted as control characters.
