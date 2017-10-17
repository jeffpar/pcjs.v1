---
layout: page
title: "Q43587: Why _setvideomode() May Fail to Set Some Modes"
permalink: /pubs/pc/reference/microsoft/kb/Q43587/
---

## Q43587: Why _setvideomode() May Fail to Set Some Modes

	Article: Q43587
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKC setvideomode _setvideomode
	Last Modified: 25-MAY-1989
	
	The following are possible reasons that _setvideomode() might fail
	when attempting to set a video mode:
	
	1. Some of the older IBM EGA (enhanced graphics adapter) cards only
	   have 64K of video memory. As such, they cannot display the
	   640 x 350 16 (_ERES16COLOR) color EGA mode. However,
	   lower-resolution modes may work correctly because they don't
	   require that much memory.
	
	2. There are EGA cards that have dip-switch settings to set the card
	   into high- or low-resolution modes. Some BIOS ignore these dip
	   switches and set the mode to high resolution. However, the
	   _setvideomode() function does its own checking and may honor the
	   dip-switch settings depending on the particular card. Setting the
	   dip switches properly for the high-resolution modes should resolve
	   the problem.
	
	3. The video card may not support the requested mode. If the card does
	   not support the mode, then _setvideomode() cannot set it into that
	   mode.
	
	4. Many VGA cards have non-standard extended modes that are unique to
	   those cards. _setvideomode() supports only standard video modes
	   and, thus, will not recognize the extended modes.
