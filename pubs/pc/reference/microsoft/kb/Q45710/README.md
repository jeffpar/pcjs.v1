---
layout: page
title: "Q45710: L2002 When Linking Small Model Main with Other Memory Models"
permalink: /pubs/pc/reference/microsoft/kb/Q45710/
---

	Article: Q45710
	Product: Microsoft C
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QuickC
	Last Modified: 14-AUG-1989
	
	An attempt to link a module that has been compiled in the small memory
	model with a module compiled in the medium or large memory model
	produces the following error:
	
	   L2002: fixup overflow
	
	The cause, in this particular case, of the "fixup overflow" error
	message is not documented in the C Version 5.10 "CodeView and
	Utilities, Microsoft Editor, Mixed-Language Programming Guide" on Page
	366.
	
	Normally, you should NOT link programs that contain different memory
	models. All modules should be compiled using the same memory model.
	(It is possible to use the "near" and "far" keywords to produce
	mixed-model programs, but this is tricky and usually doesn't give much
	performance gain.)
	
	If the following module, MOD1.C
	
	    #include<stdio.h>
	
	    void main(void);
	
	    void main()
	    {
	        printf(" module 1 \n");
	        mod2();
	    }
	
	is linked with the module, MOD2.C
	
	    #include<stdio.h>
	
	    void mod2(void);
	
	    void mod2()
	    {
	        printf(" module 2 \n");
	    }
	
	in various memory models, the following results occur:
	
	    Memory Model      Result
	    ------------      ------
	    MOD1  | MOD2
	    ------|-----
	          |
	     /AS  | /AM       L2002 : fixup overflow
	          |
	     /AS  | /AL       L2002 : fixup overflow
	          |
	     /AM  | /AS       Links, hangs on run
	          |
	     /AM  | /AL       Executes normally
	          |
	     /AL  | /AS       Links, hangs on run
	          |
	     /AL  | /AM       Links, prints trash for MOD2 on run
