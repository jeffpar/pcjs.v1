---
layout: page
title: "Q57706: Linker Uses Library Sequence to Resolve External References"
permalink: /pubs/pc/reference/microsoft/kb/Q57706/
---

	Article: Q57706
	Product: Microsoft C
	Version(s): 
	Operating System: 1.x 2.x 3.x 4.06 4.07 5.01.21 5.02 5.03 | 5.01.21 5.02 5.
	Flags: MS-DOS                                  | OS/2
	Last Modified: 26-FEB-1990
	
	ENDUSER |
	
	"The MS-DOS Encyclopedia," Pages 407 and 408, states the following:
	
	   When a public symbol required to resolve an external reference is
	   declared more than once among the object modules in the input
	   libraries, LINK uses the first object module that contains the
	   public symbol. This means that the actual executable code or data
	   associated with a particular external reference can be varied by
	   changing the order in which LINK processes its input libraries...
	
	   Each individual library is searched repeatedly (from first library
	   to last, in the sequence in which they are input to LINK) until no
	   further external references can be resolved.
	
	The following simple case demonstrates the concept:
	
	   Module MAIN   Library A     Library B1    Library C     Library B2
	   +---------+   +----------+  +----------+  +----------+  +----------+
	   | calls A |   | contains |  | contains |  | contains |  | contains |
	   +---------+   |    A,    |  |    B     |  |    C,    |  |    B     |
	                 | calls  C |  +----------+  | calls  B |  +----------+
	                 +----------+                +----------+
	
	The linker determines which copy of Module B to use depending on the
	library sequence. For example, when you link with the following, the
	Module B from Library B2 is selected:
	
	   LINK MAIN,,,A B1 C B2;
	
	The linker looks first in Library C and, unable to resolve the
	reference, proceeds to the next library, B2. If the linker is still
	unable to resolve the reference, it continues searching at Library A.
	
	A slightly more complex case, when Library A contains both Module A
	and Module B, produces different results, as shown below:
	
	   Module MAIN   Library A     (remove B1)   Library C     Library B2
	   +---------+   +----------+                +----------+  +----------+
	   | calls A |   | contains |                | contains |  | contains |
	   +---------+   |    A,    |                |    C,    |  |    B     |
	                 | calls  C |                | calls  B |  +----------+
	                 +----------+                +----------+
	                 | contains |
	                 |    B     |
	                 +----------+
	
	Link with "LINK MAIN,,,A C B2;". In this case, Module B from Library A
	is selected.
	
	Although the linker always follows the same rules for resolution, it
	gets more difficult to determine which version of a module will be
	selected in more complex cases. When feasible, you can avoid this
	problem by putting your selected versions in an .OBJ instead of an
	.LIB. The linker uses any .OBJs to resolve references before it
	uses libraries.
	
	For more information, refer to "The MS-DOS Encyclopedia," Article 20:
	"The Microsoft Object Linker," in the "Object Module Order" section,
	Pages 703-706.
