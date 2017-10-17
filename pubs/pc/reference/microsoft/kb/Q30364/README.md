---
layout: page
title: "Q30364: _remappalette() Does Not Work on Hercules or Olivetti Cards"
permalink: /pubs/pc/reference/microsoft/kb/Q30364/
---

## Q30364: _remappalette() Does Not Work on Hercules or Olivetti Cards

	Article: Q30364
	Version(s): 5.10 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 15-JAN-1991
	
	Question:
	
	When I try to remap the default black background color to white,
	nothing changes on my screen. I have tried _remappalette() and
	_remapallpalette(), but neither work. I am working with a Hercules
	monochrome graphics card.
	
	Response:
	
	These functions do not support the Hercules card. On page 488 of the
	"Microsoft C Version 5.10 Run-time Library Reference Manual," there is
	a note stating that _remappalette() and _remapallpalette() work only
	with an EGA or VGA card. In the C 6.00 and 6.00a online help, there is
	a note explaining that either of these functions will generate an
	error if they are called on a system with an Olivetti and Hercules
	display adapter.
