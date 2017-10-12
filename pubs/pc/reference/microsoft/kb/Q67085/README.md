---
layout: page
title: "Q67085: NOF Is Default for LINK, Not /F as C "Reference" States"
permalink: /pubs/pc/reference/microsoft/kb/Q67085/
---

	Article: Q67085
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr S_C
	Last Modified: 4-JAN-1991
	
	On pages 30 and 31 of the "Microsoft C Reference" manual shipped with
	C versions 6.00 and 6.00a, there are contradictory references to the
	far-call translation options available for LINK. On page 30 under the
	/F[ARCALLTRANSLATION] option, far-call translations are listed as
	being "turned on by default." On the other hand, on page 31 under the
	/NOF[ARCALLTRANSLATION] option, far-calls are listed as being "off by
	default."
	
	The statement on page 30 is the one that is incorrect because the
	correct default for far-call translations is "off." Far calls are done
	only when /F is explicitly specified to LINK.
	
	Note that when the CL command is used to invoke LINK, CL itself is
	responsible for passing the /F option to the linker.
