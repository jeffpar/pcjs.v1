---
layout: page
title: "Q67041: Structure Tags Visible Outside of Function Prototype Scope"
permalink: /pubs/pc/reference/microsoft/kb/Q67041/
---

## Q67041: Structure Tags Visible Outside of Function Prototype Scope

	Article: Q67041
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | S_QUICKC buglist6.00 buglist6.00a
	Last Modified: 28-NOV-1990
	
	The scope of an identifier in C is determined by the placement of its
	declaration. According to the ANSI specification, if an identifier's
	declarator or type specification appears within a list of parameter
	declarations in a function prototype, the identifier is said to have
	"function prototype scope." This scope terminates at the end of the
	function prototype. In the C and QuickC compilers, this scope is not
	correctly terminated for structure and union tags, and a C2025 error
	may be incorrectly generated.
	
	The following sample code demonstrates this problem:
	
	/* Compile with the /Za option */
	void main(void)
	{
	    int num;
	    union tag1 { int   i;
	                 float f; };
	    {
	        void func1( float num, struct tag1 *ptr );
	    }
	}
	
	The identifier "tag1" is a struct/union tag that does appear twice,
	but because the second instance appears in the prototype for func1(),
	it should have scope that is local to the prototype only. The same is
	true for "num".
	
	In section 3.1.2.1 of the ANSI specification, it states the following:
	
	   If an outer declaration of a lexically identical identifier exists
	   in the same name space, it is hidden until the current scope
	   terminates, after which it again becomes visible.
	
	Thus, both of these identifiers should not be visible outside of the
	prototype itself. Yet, the compiler correctly allows the name "num" to
	be reused, while incorrectly generating the following error for
	"tag1":
	
	   error C2025: 'tag1' : enum/struct/union type redefinition
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a and QuickC 2.50 and 2.51 (buglist2.50 and buglist2.51). We are
	researching this problem and will post new information here as it
	becomes available.
