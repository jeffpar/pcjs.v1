---
layout: page
title: "Q31498: &quot;Unsupported Video Mode&quot; When Loading Microsoft Editor"
permalink: /pubs/pc/reference/microsoft/kb/Q31498/
---

## Q31498: &quot;Unsupported Video Mode&quot; When Loading Microsoft Editor

	Article: Q31498
	Version(s): 1.00 1.02 | 1.00 1.02
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 28-JUL-1989
	
	It is possible when loading M.EXE or MEP.EXE to receive an
	"Unsupported video mode, please change modes and restart" error
	message. This message may mean that the hardware is not supported.
	
	Graphics cards supported in this situation include IBM's CGA, EGA,
	MCGA, MDPA, and VGA and the Hercules card. An example of an
	unsupported system is the 8514 video adapter.
	
	In MS-DOS (or OS/2 real mode), the Microsoft Editor (M) supports the
	8514/A graphics card, but in OS/2 protected mode, MEP Version 1.00
	does not support this graphics card. A "video mode not supported"
	error message occurs in protected mode.
	
	The Microsoft Editor Version 1.02 supports the 8514/A graphics card in
	both real and protected mode. This version is currently available with
	FORTRAN 5.00.
