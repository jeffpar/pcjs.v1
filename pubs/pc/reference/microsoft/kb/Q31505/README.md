---
layout: page
title: "Q31505: &quot;Error During Run-Time Initialization&quot;: Mixing /FPa and /FPi"
permalink: /pubs/pc/reference/microsoft/kb/Q31505/
---

## Q31505: &quot;Error During Run-Time Initialization&quot;: Mixing /FPa and /FPi

	Article: Q31505
	Version(s): 6.00 6.00b 7.00 7.10 | 6.00 6.00b 7.00 7.10
	Operating System: MS-DOS               | OS/2
	Flags: ENDUSER | B_QuickBas
	Last Modified: 4-SEP-1990
	
	When you link separate modules together to make an .EXE program, all
	the modules must have been compiled with the same math package. The
	two math packages available in Microsoft BASIC Compiler versions 6.00
	and 6.00b and in Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 are as follows:
	
	1. BC /FPi (IEEE coprocessor-emulation math, the default)
	2. BC /FPa (alternate math)
	
	If you LINK modules or libraries together that were compiled with both
	the BC /FPa and /FPi options, the .EXE program gives the following
	error message at run time and usually hangs:
	
	   Error during run-time initialization
	
	Combining math packages can cause unpredictable results in the .EXE
	program at run time. After the error message appears, a warm boot
	(CTRL+ALT+DEL) does not work. To reboot, you must turn the computer
	off, then back on.
	
	To avoid this problem, make sure when you LINK routines that they were
	compiled with the same math package. Also, remember that the QB.EXE
	environment of the BASIC compiler and the QBX.EXE environment of BASIC
	PDS 7.00 and 7.10 do not support the alternate math package. In other
	words, object modules compiled with the /FPa switch cannot be placed
	into a Quick library (.QLB file) for use in QB.EXE or QBX.EXE.
