---
layout: page
title: "Q43006: A C Extension to Select an Arbitrary Number of Lines of Text"
permalink: /pubs/pc/reference/microsoft/kb/Q43006/
---

	Article: Q43006
	Product: Microsoft C
	Version(s): 1.00
	Operating System: MS-DOS
	Flags: ENDUSER | extension highlight select
	Last Modified: 1-JUN-1989
	
	To select an arbitrary number of lines of text in the Microsoft
	Editor, I must use the Arg function, then use the DOWN ARROW key until
	the desired number of lines are selected. This is inconvenient if more
	than a few lines are to be selected.
	
	This article provides a simple editor extension that selects the
	number of lines you specify.
	
	For information on loading the function, refer to the M editor
	reference manual.
	
	To invoke the function, use the Arg key to introduce the argument
	(i.e., the number of lines to be selected), then press the key
	assigned to the function. In Version 1.00 of M, the selected text will
	not be highlighted.   In Version 1.02 of M, the selected text will be
	highlighted, however further cursor movements will change the selected
	area without altering the highlighted area.
	
	================ Make file ===============
	
	BASE=select
	CFLAGS=-c -W2 -Asfu -Gs
	LINKFLAGS=/NOI /NOD
	
	$(BASE).obj : $(BASE).c
	    cl $(CFLAGS) $(BASE).c
	
	$(BASE).exe : $(BASE).obj
	    link exthdr.obj $(BASE), $(BASE), \
	    $(LINKFLAGS),clibcer.lib;
	
	================ select.c ================
	
	#include "ext.h"
	#include <stdlib.h>
	
	#define TRUE    -1
	#define FALSE   0
	#define NULL    ((char *) 0)
	
	flagType pascal EXTERNAL Select (argData, pArg, fMeta)
	unsigned int argData;
	ARG far * pArg;
	flagType fMeta;
	{
	    int  nCount, i ;
	
	    if (pArg->argType == TEXTARG)
	        if (nCount = atoi (pArg->arg.textarg.pText))
	            {
	            for (i = 0 ; i < nCount ; i++)
	                fExecute ("Arg Down") ;
	            }
	
	    return TRUE;
	}
	
	struct swiDesc  swiTable[] =
	{
	    {   NULL, NULL, NULL    }
	};
	
	struct cmdDesc  cmdTable[] =
	{
	    {"Select", Select, 0, TEXTARG},
	    {NULL,  NULL, NULL, NULL}
	};
	
	WhenLoaded ()
	{
	     SetKey("SELECT","ALT+B");
	     return TRUE;
	}
