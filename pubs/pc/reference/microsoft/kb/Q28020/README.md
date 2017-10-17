---
layout: page
title: "Q28020: How to Modify the BASIC 6.00 Run-Time Module with BUILDTRM"
permalink: /pubs/pc/reference/microsoft/kb/Q28020/
---

## Q28020: How to Modify the BASIC 6.00 Run-Time Module with BUILDTRM

	Article: Q28020
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 7-FEB-1990
	
	Using BUILDRTM, you can modify the default BASIC run-time modules. The
	runtime can be customized to a particular application. You can add
	routines to or delete routines from the BASIC runtime.
	
	This information applies to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS-DOS and MS OS/2 and to Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and MS OS/2. The
	following are the default run-time module names for the applicable
	products:
	
	   BC 6.00          BC 6.00b        PDS 7.00
	   -------          --------        --------
	
	   BRUN60ER.EXE     BRUN61ER.EXE    BRT70ENR.EXE
	   BRUN60AR.EXE     BRUN61AR.EXE    BRT70EFR.EXE
	                                    BRT70ANR.EXE
	                                    BRT70AFR.EXE
	
	For more information, please refer to Section 3.3 of the "Microsoft
	BASIC Compiler 6.0: User's Guide" for Microsoft BASIC Compiler Version
	6.00 or 6.00b, or Chapter 21 of the "Microsoft BASIC 7.0: Programmer's
	Guide" for Microsoft BASIC PDS Version 7.00.
	
	The following is an example:
	
	   ===== EXPORT.LST =====
	
	   #OBJECTS
	   NOLPT.OBJ
	   NOGRAPH.OBJ
	   MYROUTINE.OBJ
	
	   #EXPORTS
	   myroutine1
	   myroutine2
	   myroutine3
	
	   ===== COMMAND LINE to CREATE the RUNTIME =====
	
	   BUILDRTM newruntime export.lst
	
	   ===== COMMAND LINE to USE the RUNTIME =====
	
	   LINK IMPORT.OBJ your objects,executable,,NEWRUNTIME.LIB /NOD
