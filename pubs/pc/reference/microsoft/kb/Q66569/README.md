---
layout: page
title: "Q66569: LIB Version 3.17 Available for Increased Library Capacity"
permalink: /pubs/pc/reference/microsoft/kb/Q66569/
---

	Article: Q66569
	Product: Microsoft C
	Version(s): 3.17   | 3.17
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | appnote SS0329.ARC s_lib
	Last Modified: 17-DEC-1990
	
	The Microsoft Library Utility (LIB.EXE) version 3.17 is available to
	registered users of Microsoft language products who are experiencing
	difficulty creating libraries with older versions of LIB due to
	capacity limits. If you are the registered owner of a Microsoft
	language product, you may obtain LIB 3.17 as an application note from
	Microsoft Product Support Services by calling (206) 637-7096.
	
	LIB 3.17 can also be found in the Software/Data Library by searching
	on the keyword SS0329, the Q number of this article, or S12776. SS0329
	was archived using the PKware file-compression utility.
	
	Older versions of the Microsoft Library Manager are somewhat limited
	as far as the size of a library that can be created or the number of
	modules or symbols that a library can contain. These limits are not
	specific because the actual limits for any particular library are the
	result of a combination of factors including the number of modules,
	the number of symbols, the page size used, and the order in which
	items are added to the library.
	
	One indication of a library capacity problem is if a previously usable
	library suddenly causes the linker to generate the error message
	"L1101: invalid object module" after some additions to the library.
	
	Newer versions of LIB, such as version 3.17, have improved capacity
	over the earlier versions. Thus, libraries with a greater number of
	object modules, and/or a greater overall size, should be possible,
	even though the exact limits are still specific to each particular
	library.
	
	No documentation for the Library Manager is supplied with the
	application note because its usage and commands are identical to
	previous versions. Any questions concerning the usage, command syntax,
	or options for this version can be addressed by referring to existing
	LIB documentation.
