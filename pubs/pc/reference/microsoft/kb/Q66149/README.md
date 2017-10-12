---
layout: page
title: "Q66149: Must Use Parentheses with _fpreset()"
permalink: /pubs/pc/reference/microsoft/kb/Q66149/
---

	Article: Q66149
	Product: Microsoft C
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 24-OCT-1990
	
	When using the signal() function, it is necessary to call the
	_fpreset() function before calling longjmp() within the function
	referenced by signal(). If this is not done, the program will give
	unpredictable results. In the program example below, due to user error
	the loop is executed twelve times, then a pointer gets lost (caused by
	longjmp) and proceeds to hang the machine (under OS/2 you will get a
	protection violation) because the _fpreset function doesn't have
	parentheses after it.
	
	Even though "_fpreset" is stated within the fperror() function in the
	code example below, it is evaluated only as an expression rather than
	a function because the parentheses required to call a function are not
	included in the statement [for example, "_fpreset()"]. Therefore,
	_fpreset is evaluated but no value is assigned to it, which gives it
	the characteristics of an assembly language NOP instruction.
	
	If you compile this code with the default warning level, there won't
	be any warnings or indications of error, so you might think the
	compiler is generating incorrect code; in fact, if you compile the
	code on warning level 4 (/W4), you will get "warning C4205: statement
	has no effect", which indicates that the _fpreset will have no effect,
	or in other words, is going to do nothing.
	
	Sample Code
	-----------
	
	#include <signal.h>
	#include <setjmp.h>
	#include <conio.h>
	#include <stdio.h>
	#include <float.h>
	
	void fperror(int sig, int num);
	jmp_buf mark;
	
	double val, d;
	int fpe, st, k;
	
	void main(void)
	{
	   d=0;
	   signal (SIGFPE, fperror);
	   while(!kbhit())
	   {
	      val=100;
	      st=0;
	      fpe=setjmp(mark);
	      if(fpe==0)
	      {
	         printf("BEFORE /0 st = %-4d k = %-5d\n", st, k++);
	         val=val/d;
	         printf("NOERR val = %f st = %-4d\n", val, st);
	      }
	      else
	      {
	         printf("FPERROR val = %f st = %-4d\n", val, st);
	      }
	   }
	}
	
	void fperror(int sig, int num)
	   {
	      _fpreset;          /* should be "_fpreset()" */
	      st=1;
	      longjmp(mark,-1);
	   }
