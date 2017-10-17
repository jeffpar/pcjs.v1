---
layout: page
title: "Q40777: Using /ND to Put Uninitialized Data in a Named Segment"
permalink: /pubs/pc/reference/microsoft/kb/Q40777/
---

## Q40777: Using /ND to Put Uninitialized Data in a Named Segment

	Article: Q40777
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 16-MAY-1989
	
	Question:
	
	When I compile the example below with the /NDsegname switch, why don't
	the variables a and b end up in the segname_BSS segment?
	
	#include <stdio.h>
	
	int a,b,c=2;
	
	main()
	{
	
	}
	
	How do I get my uninitialized global data and static data to go into
	the named data segment (namely segname_BSS)?
	
	Response:
	
	Variables that are declared outside of a function and not initialized
	are communal. The BTDATA_BSS segment is for uninitialized static data.
	So, when compiling with /ND:
	
	int a;      /* goes to FAR_BSS   */
	int b = 5;  /* goes to STUFF     */
	static c;   /* goes to STUFF_BSS */
	
	The reason that "int a;" is treated in this way is that it's legal to
	have such declarations in several modules as long as at most one of
	the declarations contains an initializer. The linker combines all
	these definitions into one. If it were subject to the /ND switch, the
	variable could be in different segments in different modules, which
	would be impossible to link.
	
	So, to put the variable in the STUFF group, either declare the
	variable static or initialize it (like either b or c above).
