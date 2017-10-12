---
layout: page
title: "Q66775: Global Unsized Array May Result in L2029: Unresolved External"
permalink: /pubs/pc/reference/microsoft/kb/Q66775/
---

	Article: Q66775
	Product: Microsoft C
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 5.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | S_QUICKC S_LINK
	Last Modified: 10-NOV-1990
	
	A globally declared unsized array in Microsoft C is considered to be
	an external declaration. A module with this type of declaration must
	be linked with another .OBJ that contains a declaration for the same
	global array, which includes the size, or an "L2029: unresolved
	external" error will result during linking.
	
	Because a global unsized array declaration is considered external, the
	C compiler has no way of determining whether the unspecified size was
	intentional or a programming error; therefore, no compiler error
	message is generated. If it is an error, it will be detected only at
	link time. The following code demonstrates this problem:
	
	   int foo[];
	
	   void main(void)
	   {
	   }
	
	If this code is compiled and linked, the following error will be
	generated at link time:
	
	   error L2029: '_foo' : unresolved external
	
	However, if a separate object module that declares foo with a size
	(for example, "int foo[2]") is linked in with the above code, no LINK
	error will be generated.
	
	This behavior is expected and will occur with all Microsoft C and
	QuickC compilers.
