---
layout: page
title: "Q67352: Typedef and Struct Member with Same Name Give Bad C2062 Error"
permalink: /pubs/pc/reference/microsoft/kb/Q67352/
---

	Article: Q67352
	Product: Microsoft C
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | S_QUICKC buglist5.10 buglist6.00 buglist6.00a
	Last Modified: 4-DEC-1990
	
	If an identifier is used both as a typedef name and as the name of a
	structure member, the compiler may incorrectly generate a C2062 error.
	This error depends on which way the identifier is first used, but it
	should not be generated in either case. According to the ANSI
	specification, using the same identifier in these two different
	contexts is perfectly acceptable.
	
	The following code sample demonstrates this problem. Notice that "foo"
	is used as both a typedef name and as the name of a character pointer
	in a structure:
	
	typedef char foo[80];
	
	struct stype {
	              int   num;
	              char *foo;
	             };
	
	void main(void)
	{ }
	
	When this code is compiled, the following error message is generated:
	
	   file.c(5) : error C2062: type 'foo' unexpected
	
	The compiler appears to check the typedef name space when it gets to a
	structure member name, but the reverse is not true. Thus, when a name
	is used first as a typedef and later as a structure member name, the
	C2062 error is generated. On the other hand, the compiler accepts the
	code when the name is used in the structure first and later as a
	typedef name. Therefore, in the code above, reversing the positions of
	the struct and the typedef, so that the struct comes first, will allow
	the code to compile without error.
	
	This same exact problem may occur when building a PWB extension if
	both EXT.H and BIOS.H are included in the same source file. If EXT.H
	is included before BIOS.H, then the following error is generated:
	
	   bios.h(77) : error C2062: type 'buffer' unexpected
	
	This is due to "buffer" being used as a typedef name in EXT.H and as a
	structure member name in BIOS.H. As in the example given above,
	reversing the order of the two definitions will eliminate the problem.
	So, although it is rare to use BIOS functions in a PWB extension, if
	you want to do so, just include BIOS.H before EXT.H.
	
	Microsoft has confirmed this to be a problem in C versions 5.10, 6.00,
	and 6.00a and QuickC versions 2.00, 2.01, 2.50, and 2.51 (buglist2.00,
	buglist2.01, buglist2.50, and buglist2.51). We are researching this
	problem and will post new information here as it becomes available.
