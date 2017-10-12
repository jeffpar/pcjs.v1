---
layout: page
title: "Q42110: QuickC Err Msg C2086: Redefinition Caused by Forward Reference"
permalink: /pubs/pc/reference/microsoft/kb/Q42110/
---

	Article: Q42110
	Product: Microsoft C
	Version(s): 1.00 1.01 2.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 2-MAY-1989
	
	The program below will produce (at warning level 0) the following
	fatal error in QuickC Version 1.0x if language extensions are
	disabled, and in QuickC Version 2.00 whether extensions are enabled or
	not:
	
	    C2086:
	    'foo' : redefinition
	
	The warning message will be generated in QuickC Version 1.0x if
	language extensions are enabled:
	
	    C4074:
	    non standard extension used - 'redefined extern to static'
	
	The program is as follows:
	
	    main()
	        {
	        int i;
	        i = foo();
	        }
	
	    static int foo()
	        {
	        return(1);
	        }
	
	This error will occur if foo() is typed as being of any class other
	than int, the default return type. This is expected behavior.
	
	Microsoft has implemented ANSI compatibility as well as a number of
	extensions to the C Language. The extensions allow for more flexible
	compilation. The following is included in the ANSI draft standard (13
	May 1988):
	
	I.
	
	If the declaration of an identifier for an object or a function
	contains the storage class specifier 'extern', the identifier has the
	same linkage as any _visible_ declaration of the identifier with file
	scope.
	
	II.
	
	If the declaration of an identifier for a function has no storage
	class specifier [as is the case with implicit (first use) function
	uses], its linkage is determined exactly as if it were declared with
	the storage class specifier 'extern'.
	
	III.
	
	If the declaration of an identifier for an object or a function has
	file scope and contains the storage class specifier 'static', the
	identifier has internal linkage.
	
	IV.
	
	If, within a translation unit, the same identifier appears with both
	internal and external linkage, the behavior is undefined.
	
	This explanation means that a forward reference to a function not yet
	visible to the compiler will be treated as of type EXTERN because the
	compiler is unaware of its storage class. Because it is of type EXTERN
	it has external linkage, meaning that it is an identifier associated
	with a function defined outside the current module. When the compiler
	then encounters the definition of this function with the STATIC
	storage class it interprets it as a redefinition of that function --
	code has already been generated treating it as EXTERN; now it has been
	declared as STATIC. Being STATIC it then has internal linkage. At this
	point, the identifier has both internal and external linkage and
	behavior is, according to the draft standard, undefined.
	
	The following information also is from the draft standard:
	
	Undefined behavior: Behavior, upon use of a nonportable or erroneous
	construct of erroneous data, or of indeterminately-valued objects for
	which the standard imposes no requirements. Permissible undefined
	behavior ranges from ignoring the situation completely with
	unpredictable results, to behaving during translation or program
	execution in a documented manner characteristic of the environment
	(with or without the issuance of a diagnostic message), to terminating
	a translation or execution (with the issuance of a diagnostic
	message).
	
	QuickC's behavior conforms perfectly to this guideline. Page 172 of
	the "Microsoft C Language Reference Guide" states clearly that a
	function definition without a storage class specifier defaults to
	EXTERN. QuickC issues a diagnostic message and either terminates
	translation with a fatal compiler error if language extensions are
	disabled, or produces a warning message in QuickC Version 1.0x if
	language extensions are enabled.
	
	Being a one-pass compiler, QuickC has no way of determining the
	storage class of a forwardly referenced function, unlike C 5.xx, and
	thus deals with it in the manner described.
	
	The language-extensions switch makes a difference because of the
	extension that allows for benign type redefinitions within the same
	scope. While the QuickC Compiler programmer's guide (page 171) only
	mentions that benign TYPEDEF redefinitions will be allowed, this
	behavior also applies to benign function type redefinitions in QuickC
	Version 1.0x. QuickC Version 2.00 does not allow this type of
	redefinition.
