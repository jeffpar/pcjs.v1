---
layout: page
title: "Q42849: Unimplemented Switch /BI with QuickC 2.00 Linker"
permalink: /pubs/pc/reference/microsoft/kb/Q42849/
---

## Q42849: Unimplemented Switch /BI with QuickC 2.00 Linker

	Article: Q42849
	Version(s): 4.06
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKC
	Last Modified: 24-JAN-1990
	
	The /BINARY switch for Link Version 4.06 is documented on Page 122 of
	the "Microsoft QuickC Tool Kit" as a switch used to create .COM files
	for assembly-language programs. Its shorthand version is /BI. This
	switch is an alternative to creating .EXE files and then running them
	through EXE2BIN.
	
	This switch is currently not implemented, a fact documented in the
	README.DOC on line 665, "Creating a .COM file." Using it will result
	in the following error:
	
	    fatal error L1002: BINARY : unrecognized option name
