---
layout: page
title: "Q43700: C: Loop Optimization Causes Internal Compiler Error"
permalink: /pubs/pc/reference/microsoft/kb/Q43700/
---

## Q43700: C: Loop Optimization Causes Internal Compiler Error

	Article: Q43700
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 26-SEP-1989
	
	The two programs shown below demonstrate the following internal
	compiler error. The error occurs in the Microsoft C Optimizing
	Compiler Version 5.10, when compiled with loop and alias relaxation
	optimization enabled, and either the compact or large-memory models.
	
	    fatal error C1001 : Internal Compiler Error
	       (compiler file '@(#)regMD.c:1.117', line 1861)
	       Contact Microsoft Technical Support
	
	An easy workaround is to not use the /Oal combination, or use a
	different memory model.
	
	The first program is as follows:
	
	int flags = 0;                         /* change to int j, flags = 0 */
	void main(int argc, char *argv[])
	{
	    int i,j;                           /* change to int i; */
	    for (i=1; i<argc; i++)
	        switch(argv[i][0]) {
	            case '-':
	                for (j=1; argv[i][j]; j++)
	                    switch (argv[i][j]) {
	                        case 'a' : flags |= 0x1; break;
	                        case 'b' : flags |= 0x2; break;
	                        case 'c' : flags |= 0x4; break;
	                        case 'd' : case '?': default: flags = 0x8; break;
	                    }
	       }
	}
	
	To work around this problem, move the declaration of "j" outside of
	main().
	
	The second program is as follows:
	
	typedef struct  LINE {
	        short   l_used;
	        char    l_text[1];
	}       LINE;
	
	typedef struct  WINDOW {
	        LINE *w_dotp;
	}       WINDOW;
	
	extern  WINDOW  *curwp;
	
	void main()
	{
	        int    nicol;
	        int    c;
	        int    i;
	
	        for (i=0; i< curwp->w_dotp->l_used; ++i) {
	                c = curwp->w_dotp->l_text[i]&0xFF;
	                if (c!=' ' && c!='\t')
	                        break;
	                if (c == '\t')
	                        nicol |= 0x07;
	                ++nicol;
	        }
	}
	
	You can work around this problem by adding a new variable of type
	pointer to WINDOW and then using this pointer in the assignment to the
	variable "c". For example, you can change the for loop in the code to
	appear as follows:
	
	        for (i=0; i< curwp->w_dotp->l_used; ++i) {
	              WINDOW *foo1;
	                foo1 = curwp;
	                c = foo1->w_dotp->l_text[i]&0xFF;
	
	                if (c!=' ' && c!='\t')
	                        break;
	                if (c == '\t')
	                        nicol |= 0x07;
	                ++nicol;
	
	Microsoft is researching this problem and will post new information as
	it becomes available.
