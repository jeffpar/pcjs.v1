---
layout: page
title: "Q44452: -Zg Won't Handle Untagged Aggregate typedef Parameters"
permalink: /pubs/pc/reference/microsoft/kb/Q44452/
---

## Q44452: -Zg Won't Handle Untagged Aggregate typedef Parameters

	Article: Q44452
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 1-JUN-1989
	
	The -Zg switch causes the Microsoft C Version 5.10 Optimizing Compiler
	to generate a list of function prototypes from the input file. This is
	documented on Page 86 of the "Microsoft C for the MS-DOS Operating
	System: User's Guide."
	
	It is noted on Page 87 of the same manual that structure, enumerated,
	and union types that are used as formal parameters must be tagged.
	Using untagged aggregate types as formal parameters results in the
	following message being generated for each instance of untagged
	aggregate type parameters:
	
	   warning C4032 : unnamed struct/union as parameter
	
	Typedefs are expanded in the prototype listing. If an aggregate type
	has no tag then the prototype is commented out and the type of the
	parameter is labeled, in the case of a structure, as follows:
	
	   struct UNNAMED
	
	There is no way to prevent the compiler from expanding the typedefs
	and from disliking the untagged aggregate types.
	
	The program below, when compiled in the following manner
	
	   cl -Zg whack.c
	
	produces the following output:
	
	    extern  void main(void );
	    extern  int Woof(struct ure a);
	    /* int Heave(struct UNNAMED a); */
	    whack.c(29) : warning C4032 : unnamed struct/union as parameter
	
	/* Demonstration of typedef expansion when compiling with /Zg
	 */
	typedef struct ure      // This one's tagged
	{
	    int     x;
	    int     y;
	} URE;
	
	typedef struct          // This one's not tagged
	{
	    int     x;
	    int     y;
	} IME;
	
	void main()
	{
	    URE     Ok;         // Tagged type variable
	    IME     NotOk;      // Untagged type variable
	
	    Woof( Ok );
	    Heave( NotOk );
	}
	
	int Woof( URE a )
	{
	    return( 0 );
	}
	
	int Heave( IME a )
	{
	    return( 0 );
	}
