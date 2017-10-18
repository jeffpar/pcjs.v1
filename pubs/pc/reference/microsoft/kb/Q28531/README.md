---
layout: page
title: "Q28531: UNDEL Does Not Work with DOS Version 2.x"
permalink: /pubs/pc/reference/microsoft/kb/Q28531/
---

## Q28531: UNDEL Does Not Work with DOS Version 2.x

	Article: Q28531
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 27-MAY-1988
	
	Problem:
	   The UNDEL that came with MASM Version 5.10 does not work properly.
	I am using DOS Version 2.x.
	
	Response:
	   The utilities UNDEL, EXP, RM, and MEGREP are all bound. There is at
	least one known problem with running bound programs under DOS Version
	2.x, that is, you cannot rename the .EXE file to anything other than
	the name BIND outputs it as. For example, if the MAKE file reads as
	follows:
	
	    bind undelp.exe doscalls.lib api.lib -o undelb.exe
	
	then you cannot rename UNDELB.EXE in order for it to work correctly on
	DOS Version 2.x.
