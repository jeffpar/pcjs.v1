---
layout: page
title: "Q68144: C1001: Internal Compiler Error: regMD.c, Line 725"
permalink: /pubs/pc/reference/microsoft/kb/Q68144/
---

## Q68144: C1001: Internal Compiler Error: regMD.c, Line 725

	Article: Q68144
	Version(s): 6.00a  | 6.00a
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist6.00a
	Last Modified: 11-JAN-1991
	
	The sample code below produces the following internal compiler error
	when compiled with both global register allocation (/Oe) optimization
	and SS!=DS (/Au or /Aw) options:
	
	   cl /c /Alfu /Oe t.c
	
	   t.c(19) : fatal error C1001: Internal Compiler Error
	                   (compiler file '@(#)regMD.c:1.110', line 725)
	                   Contact Microsoft Product Support Services
	
	The following are three valid workarounds:
	
	1. Compile without /Oe optimization.
	
	2. Use the optimize pragma to turn off /Oe optimization for the
	   function in which the error is occurring. For example, uncomment lines
	   2 and 21 below to eliminate the error.
	
	3. Compile with the /qc (Quick Compile) option.
	
	Sample Code
	-----------
	
	1:  void func1 (struct tag1 *);
	2:  void func2 (struct tag3 _near *hoo, int boo );
	3:
	4:  struct tag3{
	5:          struct tag2 {
	6:                  int Active_Task_Count, Fd;
	7:                  struct tag1 {
	8:                          int i;
	9:                  } moo;
	10:          } Task_Vars[3];
	11:  };
	12: // #pragma optimize("e", off)
	13:  void func3 (struct tag3 _near *hoo, int boo )
	14:  {
	15:     struct tag2 _near *Task_Ptr;
	16:
	17:          Task_Ptr = &hoo->Task_Vars[boo];
	18:          func1(&Task_Ptr->moo);
	19:          if(Task_Ptr->Fd) func2(hoo, boo);
	20:  }
	21: // #pragma optimize("e", on)
	
	Microsoft has confirmed this to be a problem in C version 6.00a. We
	are researching this problem and will post new information here as it
	becomes available.
