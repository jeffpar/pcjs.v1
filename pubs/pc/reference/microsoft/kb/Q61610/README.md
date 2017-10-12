---
layout: page
title: "Q61610: Behavior of /Oa and /Ow Safer in C 6.00"
permalink: /pubs/pc/reference/microsoft/kb/Q61610/
---

	Article: Q61610
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-JUL-1990
	
	The detection of common aliasing practices has been improved in the
	Microsoft C version 6.00 code generator. The primary difference is
	that the compiler now tries to detect when the address of a variable
	has been taken and then to protect against aliasing corruption of that
	variable even when the /Oa option is selected. If no options are
	selected that invoke the global optimizer (/Oe, /Og, /Ol), the
	optimizer depends on the preprocessor marking all variables that have
	had their address taken (&).
	
	With global optimization, the optimizer itself does the necessary data
	flow analysis to determine if an address has been taken. This makes
	/Oa safer when used in conjunction with global optimization because it
	can detect addresses being taken even in the absence of the address-of
	operator (&).
	
	Aliasing is defined as being when more than one expression refers to a
	single memory location, as in the following example:
	
	int x,*p,a[3];
	
	void main(void)
	{
	   p=&x; // Now *p and x are aliases to the same memory location.
	
	   x=5;  // There are now two ways to assign values to that memory.
	   *p=4;
	
	   a[2]=myfunc(p);
	 // Passing aliases to functions can cause problems when using /Oa.
	
	   p=a;
	 // Arrays also can be aliased; now *p and a[0] are common aliases.
	}
	
	Common aliasing problems can occur when the compiler causes one of
	these aliases to be stored in a register to speed up code execution.
	If both aliases subsequently are used to change the same memory
	location, one may change the register value and the other the actual
	in-memory value. Furthermore, when the register variable is finally
	unloaded, its value will overwrite whatever changes may have been made
	to memory.
	
	There are two places where variables stored in registers can become
	corrupted through aliasing problems. One place is across function
	calls where functions are assumed to not corrupt the value. The other
	place is by assignments through pointer variables. The following
	paragraphs and table summarize the susceptibility of different types
	of data to the above mentioned corruption:
	
	Local Variables
	---------------
	
	Because of their restricted scope, local variables are assumed by the
	compiler to be safe from aliasing problems. Therefore, locals are
	prime candidates for register storage and if for some reason aliasing
	occurs, they are prone to common aliasing problems both over function
	calls and through pointer assignment.
	
	Global Variables
	----------------
	
	Because of their extensive scope, global variables can often
	accumulate multiple aliases. Therefore, the code generator causes them
	to be unloaded from registers before function calls to preserve their
	value. However, globals are still prone to aliasing problems through
	pointer assignment with /Oa and/or /Ow.
	
	*p
	--
	
	*p represents a pointer variable accessed primarily to change its
	associated memory location. *p as a variable can be stored in a
	register, and therefore, can be affected by common aliasing problems.
	It is protected under default optimizations by the code generator.
	Under /Ow, it is protected across function calls but not from
	assignment through another pointer (for example, a *x). Under /Oa, *p
	is not protected as a separate symbol at all.
	
	Address Taken
	-------------
	
	If a variable's address has been taken, the C code generator will
	protect it from common aliasing pitfalls in all but one case involving
	the /Oa switch. If a local variable's address is taken and passed to a
	function, the local variable's value can then be changed within the
	function through an alias without protection from common aliasing
	problems.
	
	The following two further limitations apply to the above rule:
	
	1. If global optimization is not invoked, the code generator does not
	   always recognize if an address is taken without the use of the
	   address-of operator (&). This is only an issue for arrays because
	   they are the only object whose address can be taken without the
	   operator. What this means is that given - int *p,a[4]; p=&a[0] is
	   compatible with /Oa, but p=a is not protected.
	
	2. The checking is done only on a procedure-by-procedure basis, so if
	   the address of a global is taken outside of the current procedure,
	   it won't be detected.
	
	The following interference table summarizes the effects of the code
	generator in the various circumstances described above:
	
	   Var Type   Effect of Function Call   Effect of Assign Thru Pointer
	   --------   -----------------------   -----------------------------
	
	              /O    /Ow   /Oa           /O   /Ow   /Oa
	   local       N     N     N             N    N     N
	   global      Y     Y     Y             Y    N     N
	   *p          Y     Y     N             Y    N     N
	   addr-taken  Y     Y     N             Y    Y     Y
	
	   N - Variable in register not protected from common aliasing problems.
	   Y - Variable unloaded from registers to memory (protected).
	
	For more information see the "Microsoft C Advanced Programming
	Techniques" manual, Pages 13-15.
