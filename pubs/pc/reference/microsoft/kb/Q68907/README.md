---
layout: page
title: "Q68907: Incorrect Code Generated for "FILD QWord Ptr""
permalink: /pubs/pc/reference/microsoft/kb/Q68907/
---

	Article: Q68907
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 1-FEB-1991
	
	The sample code below generates incorrect code when compiled under
	Microsoft C versions 6.00 and 6.00a.
	
	Compiling the sample code with /Fa (to produce an assembly listing)
	shows the following statement to correspond with the inline assembly
	statement in the sample code:
	
	   fld     QWORD PTR [bp+4]
	
	The correct instruction should be:
	
	   fild      QWORD PTR [bp+4]
	
	Furthermore, CodeView version 3.00 shows the statement as:
	
	   ???      QWORD PTR [bp+4]
	
	When the /qc (quick compile) option is specified, the code is
	correctly generated:
	
	   fild     QWORD PTR [bp+4]
	
	Sample Code
	-----------
	
	/* Compile with /Fa /Zi /Od */
	
	typedef struct qw_tag {
	    unsigned char b[10];
	} qw;
	
	void _cdecl foo( qw a );
	
	void main( )
	{
	        qw a;
	        foo( a );
	}
	
	void _cdecl foo( qw a )
	{
	    _asm  fild qword ptr a
	}
	
	Microsoft has confirmed this to be a problem in C versions 6.00 and
	6.00a. We are researching this problem and will post new information
	here as it becomes available.
