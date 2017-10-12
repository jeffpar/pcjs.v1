---
layout: page
title: "Q39852: Error C2086: Redefinition Caused by Forward Reference"
permalink: /pubs/pc/reference/microsoft/kb/Q39852/
---

	Article: Q39852
	Product: Microsoft C
	Version(s): 1.00 1.01 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 24-JAN-1989
	
	When compiled with any version of the QuickC compiler, the program
	below will produce (at warning level 0) the fatal error.
	
	     C2086:
	     'foo': redefinition.
	
	This error will occur if foo() is typed as being of any class other
	than int, the default return type.
	
	The following program demonstrates this situation:
	
	    main()
	        {
	        int i;
	        i = foo();
	        }
	
	    static int foo()
	        {
	        return(1);
	        }
	
	This is expected behavior for the following reason. The following
	information is from the ANSI draft standard (13 May 1988):
	
	    I. If the declaration of an identifier for an object or a function
	       contains the storage class specifier "extern", the identifier
	       has the same linkage as any _visible_ declaration of the
	       identifier with file scope.
	
	   II. If the declaration of an identifier for a function has no
	       storage class specifier (as is the case with implicit [first
	       use] function uses), its linkage is determined exactly as if it
	       were declared with the storage class specifier "extern".
	
	  III. If the declaration of an identifier for an object or a function
	       has file scope and contains the storage class specifier
	       "static", the identifier has internal linkage.
	
	   IV. If, within a translation unit, the same identifier appears with
	       both internal and external linkage, the behavior is undefined.
	
	A forward reference to a function not yet visible to the compiler will
	be treated as of type EXTERN because the compiler is unaware of its
	storage class. Because it is of type EXTERN, it has external linkage,
	i.e., it is an identifier associated with a function defined
	outside the current module. When the compiler then encounters the
	definition of this function with the STATIC storage class, it
	interprets it as a redefinition of that function. Code has already
	been generated treating it as EXTERN; now it has been declared as
	STATIC. Being STATIC, it then has internal linkage. At this point, the
	identifier has both internal and external linkage and behavior is,
	according to the draft standard, undefined.
	
	The following information is also from the draft standard:
	
	   Undefined behavior - behavior, upon use of a nonportable or
	   erroneous construct of erroneous data, or of indeterminately-valued
	   objects for which the standard imposes no requirements.
	   Permissible undefined behavior ranges from ignoring the situation
	   completely with unpredictable results, to behaving during
	   translation or program execution in a documented manner
	   characteristic of the environment (with or without the issuance of
	   a diagnostic message), to terminating a translation or execution
	   (with the issuance of a diagnostic message).
	
	QuickC's behavior conforms precisely to this guideline. Page 172 of
	the "Microsoft C Language Reference Guide" states that a function
	definition without a storage class specifier defaults to EXTERN.
	QuickC issues a diagnostic message and terminates translation (fatal
	compiler error). Being a one-pass compiler, QuickC has no way of
	determining the storage class of a forward-referenced function,
	unlike C Versions 5.x, and thus deals with it in the manner described.
	
	This behavior also applies to QuickC Version 2.00.
