---
layout: page
title: "Q35536: How to Write and Use C Extensions"
permalink: /pubs/pc/reference/microsoft/kb/Q35536/
---

	Article: Q35536
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | appnote
	Last Modified: 6-JAN-1989
	
	The following information is taken from an application note called
	"Microsoft Editor Questions and Answers." The application note also is
	available from Microsoft Product Support Services by calling (206)
	454-2030.
	
	C Extensions and How to Write and Use Them
	
	C extensions allow you to further customize the editor by creating new
	editor functions and switches through programs that you write in the C
	programming language. They are much more powerful than macros because
	macros depend on the existence of editor functions.
	
	C extensions are compiled with a special memory-model that does not
	use a main() function, but rather uses special names and structures
	that the editor alone recognizes. They are linked with an object
	module that makes low-level functions used within the editor itself
	available to be called by your C extension. The file produced from
	linking is separate from the main program but is loaded into memory
	with the editor. The editor then will call your module whenever you
	invoke one of your C extension functions.
