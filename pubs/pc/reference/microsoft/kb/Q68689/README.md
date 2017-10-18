---
layout: page
title: "Q68689: Error L2029 with Unresolved Externals in CRTCOM.LIB"
permalink: /pubs/pc/reference/microsoft/kb/Q68689/
---

## Q68689: Error L2029 with Unresolved Externals in CRTCOM.LIB

	Article: Q68689
	Version(s): 2.51
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 31-JAN-1991
	
	If you are attempting to build a .COM file from a .ASM file and you
	get the following unresolved external references on the link step, you
	may have included CRTCOM.LIB in error:
	
	   _main            __NMSG_WRITE
	   __FF_MSGBANNER   __nullcheck
	   __setenvp        __fptrap
	   __setargv        __acrtmsg
	
	This file is automatically included on the link line if the link
	options are set to generate a .COM file from a .C file. To change this,
	choose Make from the Options menu, choose the Linker Flags menu, and
	change "Generate .COM file" to ASM.
	
	
	
	
	
	
	Microsoft Programmer's Work Bench [Development Environment]
	=============================================================================
