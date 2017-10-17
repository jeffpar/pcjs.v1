---
layout: page
title: "Q40196: &quot;&#42;&#92;&quot; Viewed as Continuation Character in Comment"
permalink: /pubs/pc/reference/microsoft/kb/Q40196/
---

## Q40196: &quot;&#42;&#92;&quot; Viewed as Continuation Character in Comment

	Article: Q40196
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: enduser |
	Last Modified: 17-JAN-1989
	
	In C, comments are delimited by /*  and */. If the closing delimiter
	is typed as *\ instead of */, then the backslash will be viewed as a
	continuation marker. As a result, the compiler considers everything up
	to the next */ as a comment. This behavior has the potential to
	comment out executable instructions and data declarations, which may
	not be your intent.
	
	The following code example illustrates this situation and potential
	implications:
	
	void main()
	{
	  /* this is a comment, but the end delimiter is incorrect *\
	
	  int  temp ;
	  printf ("hello") ;
	
	  /* and will be interpreted as a continuation marker so the
	     initial comment will be viewed as ending here. */
	
	  /* This will eliminate the printf() and
	     the declaration of 'temp'. */
	}
	
	This is expected behavior for QuickC Version 2.00. The interpretation
	of the backslash as a continuation character is similar in the
	following printf() code:
	
	    printf ("Donde esta \
	             el bano") ;
	
	The parsing of the string literal for this printf() will view the
	backslash, "\", as a continuation marker just as the compiler will
	view the backslash in "*\" as a continuation marker.
