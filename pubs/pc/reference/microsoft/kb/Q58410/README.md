---
layout: page
title: "Q58410: BUILDRTM &quot;Unresolved External&quot; Using OVLDOS21.OBJ; Not Allowed"
permalink: /pubs/pc/reference/microsoft/kb/Q58410/
---

## Q58410: BUILDRTM &quot;Unresolved External&quot; Using OVLDOS21.OBJ; Not Allowed

	Article: Q58410
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER | docerr
	Last Modified: 8-JAN-1991
	
	The stub file OVLDOS21.OBJ, which is shipped with Microsoft BASIC
	Professional Development System (PDS) Versions 7.00 and 7.10 for
	MS-DOS, can be linked into an .EXE program that uses an extended
	run-time module, but is not allowed to be built into an extended
	run-time module.
	
	The link error "L2029: Unresolved external" displays a few times if
	you attempt to use the BUILDRTM.EXE utility to place the OVLDOS21.OBJ
	file into an extended run-time module.
	
	The following sentences need to be added to Pages 539, 611, and 663 of
	the "Microsoft BASIC 7.0: Programmer's Reference" manual (for versions
	7.00 and 7.10):
	
	   Note that you cannot use BUILDRTM to build the OVLDOS21.OBJ stub
	   file into an extended run-time module. You can link OVLDOS21.OBJ
	   into an .EXE program that uses a normal or extended run-time
	   module.
	
	The following is a correct example to link the OVLDOS21.OBJ stub file
	for use with an extended run-time module:
	
	LINK import.obj+main.obj+OVLDOS21.obj+(sub1)+(sub2),main.exe,,extrtm.lib;
	
	The OVLDOS21.OBJ stub file shipped with BASIC PDS Version 7.00 is
	provided to support code overlays under MS-DOS Version 2.10. This stub
	file is not required if overlays are to be used on MS-DOS Versions 3.00
	and later. For more information about overlays, search for a separate
	article by querying on the following words:
	
	   how and use and LINK and overlays and BASIC and PDS and 7.00
