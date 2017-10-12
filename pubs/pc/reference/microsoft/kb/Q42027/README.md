---
layout: page
title: "Q42027: Ambiguous Switch /PAC with QuickC 2.00 Linker"
permalink: /pubs/pc/reference/microsoft/kb/Q42027/
---

	Article: Q42027
	Product: Microsoft C
	Version(s): 4.06
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc b_quickbas docerr
	Last Modified: 22-JAN-1990
	
	Using the /PAC switch with LINK Version 4.06 results in the
	following error:
	
	   fatal error L1001: PAC : option name ambiguous
	
	This same option works correctly on Versions 3.65 and 5.01.21, and is
	documented as being a valid shorthand name for /PACKCODE on Page 131
	of the "QuickC Tool Kit."
	
	The problem is due to a conflict with an option that is not documented
	in the Tool Kit, but is displayed when LINK is invoked with /HELP. The
	option that causes the ambiguity is /PACKDATA, which causes data
	segments to be combined.
	
	The shortest version of /PACKCODE that can be used is /PACKC.
	Similarly, /PACKD is the shortest version of /PACKDATA that can be
	used.
