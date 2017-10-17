---
layout: page
title: "Q67272: C1001: Internal Compiler Error: codegen.x, Line 559"
permalink: /pubs/pc/reference/microsoft/kb/Q67272/
---

## Q67272: C1001: Internal Compiler Error: codegen.x, Line 559

	Article: Q67272
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00 fixlist6.00a
	Last Modified: 4-DEC-1990
	
	If the sample code below is compiled with the Microsoft C Compiler
	version 6.00, using /AL and /Oe, the following internal compiler error
	will be generated:
	
	   C1001: Internal Compiler Error
	   (compiler file '@(#)codegen.x:1.148', line 559)
	   Contact Microsoft Product Support Services
	
	This error will not be generated if the /Oe optimization is used with
	/Og and/or /Ol. Microsoft has confirmed this to be a problem in
	Microsoft C version 6.00. This problem has been corrected in Microsoft
	C version 6.00a.
	
	Sample Code
	-----------
	
	#define DB_PTERM_PTR(id)  (db_ptr[id] ? db_ptr[id] : db_swap_in(id))
	
	extern DBRS_PTERM *db_swap_in(int);
	extern DBRS_PTERM **db_ptr;
	
	typedef struct
	{
	   int type;
	   int factors[1];
	}  DBRS_PTERM;
	
	void foo(int pt_id)
	{
	   int id;
	   int i, j, k;
	
	   j = 0;
	   for (i=0;(id=DB_PTERM_PTR(pt_id)->factors[i]) != 0; i++)
	   {
	      for(k=j;k>=0;--k)
	      {}
	      DB_PTERM_PTR(pt_id)->factors[j++] = id;
	   }
	}
