---
layout: page
title: "Q68143: Stringize Operator Fails to Insert Backslashes"
permalink: /pubs/pc/reference/microsoft/kb/Q68143/
---

	Article: Q68143
	Product: Microsoft C
	Version(s): 5.10 6.00 6.00a | 5.10 6.00 6.00a
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER | buglist 5.10 buglist6.00 buglist6.00a s_quickc
	Last Modified: 31-JAN-1991
	
	The stringizing operator is used only with the arguments of macros. If
	a # precedes a formal parameter in the definition of a macro, the
	actual argument is enclosed in double quotation marks and treated as a
	string when the macro is expanded.
	
	If the argument contains characters that normally must be preceded by
	a backslash (\) when appearing in a string (such as " or \), the
	backslash should be automatically inserted. However, there are many
	cases where the preprocessor fails to do this.
	
	Below are some sample macros that use the stringize operator. They are
	followed by a line showing the incorrect preprocessor output
	(compiling with /P) and the output that was expected.
	
	Sample Code
	-----------
	
	Example 1:
	
	    #define print_filename(x) printf(#x);
	
	    main()
	    {
	     print_filename(d:\test\sscanf.c)
	    }
	
	Preprocessor Output:
	
	   printf("d:\test\sscanf.c");
	
	Expected Output:
	
	   printf("d:\\test\\sscanf.c");
	
	Example 2:
	
	    #define print_filename(x) printf(#x);
	
	    main()
	    {
	       print_filename(This: \" prints an escaped double quote mark)
	    }
	
	Preprocessor Output:
	
	   printf("This: \\" prints an escaped double quote mark")
	
	Expected Output:
	
	   printf("This: \\\" prints an escaped double quote mark")
	
	Example 3:
	
	    #define print_stuff(x) printf(#x);
	
	    main()
	    {
	       print_stuff(I am printing a quote: ")
	    }
	
	Preprocessor Output:
	
	   error C2001: newline in constant
	   fatal error C1057: unexpected end-of-file in macro
	                              expansion (missing ')'?)
	
	Expected Output:
	
	   printf("I am printing a quote: \"");
	
	Microsoft has confirmed this to be a problem in C versions 5.10, 6.00,
	and 6.00a and QuickC versions 2.00, 2.01, 2.50, and 2.51 (buglist2.00,
	buglist2.01, buglist2.50, and buglist2.51). We are researching this
	problem and will post new information here as it becomes available.
