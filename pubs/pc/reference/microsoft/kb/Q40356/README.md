---
layout: page
title: "Q40356: FileWrite() Function Fails to Write Back Out to the File"
permalink: /pubs/pc/reference/microsoft/kb/Q40356/
---

## Q40356: FileWrite() Function Fails to Write Back Out to the File

	Article: Q40356
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 15-MAY-1989
	
	Problem:
	
	I have a problem using the FileWrite Function programming with the M
	and MEP Editor Version 1.00. I want to read a file (EXAMPLE.DOC) and
	write exactly the same in a new file (FOO.DOC).
	
	Response:
	
	To test the example below, you only have to create a file named
	EXAMPLE.DOC. See the compiler switches at the end of this article. The
	second file FOO.DOC is created, but it is never written to it always
	has zero length.
	
	This is a problem with MEP Version 1.00's FileWrite() function. This
	is one of the problems that kept the filter extension described in the
	"Microsoft Systems Journal" September 1988 from working in Version
	1.00.
	
	Microsoft has confirmed this to be a problem in Version 1.00. We are
	researching this problem and will post new information as it becomes
	available.
	
	The following is a short example where the problem (Function FileWrite
	does not write) occurs:
	
	#include "ext.h"
	#define TRUE    -1
	#define FALSE   0
	#define NULL    ((char *) 0)
	
	flagType pascal EXTERNAL Write(
	unsigned int argData,
	ARG far * pArg,
	flagType fMeta)
	{
	    flagType flg;
	    PFILE pFile;
	    char  *p = "EXAMPLE.DOC";
	    char  *w = "FOO.DOC";
	
	    if((pFile = FileNameToHandle(p,NULL)) == 0)
	    {
	        pFile = AddFile(p);
	        FileRead(p, pFile);
	    }
	    flg = FileWrite(w, pFile);
	    return (flg);
	}
	
	struct swiDesc  swiTable[] ={
	    { NULL, NULL, 0 }
	};
	
	struct cmdDesc  cmdTable[] ={
	    {"Write", Write, 0, NOARG },
	    {NULL,  NULL, 0, 0}
	};
	
	void EXTERNAL WhenLoaded (void)
	{
	    SetKey("Write", "alt+w");
	    DoMessage("Write function now loaded.");
	}
	
	/*
	
	*** Compiler switches I used ***
	
	cl /c /Gs /Asfu %1.c
	cl /Lp /AC /Fe%1.dll exthdrp.obj %1.obj skel.def
	
	  */
