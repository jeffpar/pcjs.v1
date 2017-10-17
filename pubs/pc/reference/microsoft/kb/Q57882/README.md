---
layout: page
title: "Q57882: BUILDRTM.EXE Requires BASIC 7.00 Component Libraries; SETUP"
permalink: /pubs/pc/reference/microsoft/kb/Q57882/
---

## Q57882: BUILDRTM.EXE Requires BASIC 7.00 Component Libraries; SETUP

	Article: Q57882
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 2-FEB-1990
	
	The BUILDRTM.EXE utility program for Microsoft BASIC Professional
	Development System (PDS) Version 7.00 can be used to create custom
	run-time modules. For BUILDRTM to function, you must have the
	component libraries available.
	
	The component libraries are installed by the BASIC PDS 7.00 SETUP.EXE
	program, but are deleted unless you specify that they be maintained.
	(You are prompted to delete or keep the component libraries during the
	setup procedure).
	
	The following lists show the component libraries needed to use
	BUILDRTM under real mode (MS-DOS) and OS/2 protected mode (note that
	all component library files have a .LIB extension):
	
	Real Mode (MS-DOS) Component Libraries
	--------------------------------------
	
	   B70OBJ.LIB    B70OBN.LIB    B70ORN.LIB    B70ROBJ.LIB   B70RORJ.LIB
	   B70ROBN.LIB   B70RORN.LIB   B70ROEJ.LIB   B70ROEN.LIB   B70S.LIB
	   BLIBFP.LIB    EMR.LIB       B70RLN.LIB    B70RCN.LIB
	
	MS OS/2 Protected Mode Component Libraries
	------------------------------------------
	
	   B70OBJ.LIB    B70OBN.LIB    B70ORN.LIB    B70POBJR.LIB  B70PORJ.LIB
	   B70POBN.LIB   B70PORN.LIB   B70POEJ.LIB   B70POEN.LIB   B70S.LIB
	   BLIBFP.LIB    EMP.LIB       B70PLN.LIB    B70PCN.LIB    OS2.LIB
	
	To install these libraries, run the BASIC PDS 7.00 SETUP.EXE program,
	select the libraries you want to install (real or protected mode), and
	then specify that you want to maintain the component libraries.
