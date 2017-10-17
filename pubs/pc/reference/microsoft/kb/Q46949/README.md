---
layout: page
title: "Q46949: Using CodeView /2 with Hercules Graphics Cards and Libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q46949/
---

## Q46949: Using CodeView /2 with Hercules Graphics Cards and Libraries

	Article: Q46949
	Version(s): 2.20 2.30
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 16-OCT-1990
	
	Using CodeView in the dual-monitor mode with a Hercules graphics card
	as the primary (application) monitor requires the Hercules card to be
	configured in the half mode. Using the Hercules graphics library, the
	monitor must be configured using the config(0) function call. This
	function call is a part of the Hercules graphics library and does not
	use Microsoft graphics library or the MSHERC.COM program. Therefore,
	this information applies only if you are using the Hercules graphics
	libraries. This is NOT the same as using the /h switch with CodeView.
	
	The first page of the Hercules graphics display card is mapped to
	memory location B0000 (same as MDA), and the second page is mapped to
	B8000. The CGA/EGA/VGA also use B8000 as the beginning of their video
	memory. CodeView uses these two different address to run in the
	dual-monitor mode, sending the application output to the primary
	address, usually located at B8000, and the CodeView information to the
	secondary monitor, usually located at B0000.
	
	This works well until a Hercules graphics card is used as the primary
	monitor (in graphics mode) and the CGA/EGA/VGA card is used as the
	secondary monitor. The Hercules graphics card uses both pages (one at
	B0000 and the other at B8000) in the full mode. Therefore, use
	config(0) and only the first page (B0000) will be used and CodeView
	will function properly in dual-monitor mode.
