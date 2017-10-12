---
layout: page
title: "Q68688: Specifying Anchor Blocks in Help Files in RTF"
permalink: /pubs/pc/reference/microsoft/kb/Q68688/
---

	Article: Q68688
	Product: Microsoft C
	Version(s): 1.05   | 1.05
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 31-JAN-1991
	
	Rich Text Format (RTF) is a text format supported by Microsoft Word
	and other word processors. HELPMAKE.EXE can use an RTF file (and the
	RTF symbols) to create help databases for the Microsoft Advisor.
	However, because \a (Anchor text for cross-reference) is not an RTF
	symbol, there is no documented method for creating hyperlinks that
	have more than one word.
	
	When Helpmake encodes RTF, any text between an RTF code and hidden
	text on a single line becomes a hyperlink. For example, the following
	
	   {\bHyperlink here}{\vhyperlink.dat}
	
	will cause "Hyperlink here" to be displayed in bold type, and be a
	hyperlink to the topic "hyperlink.dat". To create an anchor block of
	unformatted text, use the \plain code. For example, the following
	
	   {\plainplain hyperlink}{\vhyperlink.dat}
	
	will cause "plain hyperlink" to be displayed in normal text, and be a
	hyperlink to "hyperlink.dat". If you want to create a hyperlink that
	has only one word, anchor blocks are not needed. Finally, a link must
	fit entirely on one line. You cannot continue invisible or anchored
	text over a line break.
	
	Sample Code
	-----------
	
	   {\rtf0
	   >> open \par
	   {\b Include:}   <fcntl.h>, <io.h>, <sys\\types.h>, <sys\\stat.h>
	
	   {\b Prototype:}  int open(char *path, int flag[, int mode]);\par
	       flag: O_APPEND  O_BINARY   O_CREAT  O_EXCL  O_RDONLY\par
	        O_RDWR    O_TEXT   O_TRUNC  O_WRONLY\par
	        (can be joined by |)\par
	       mode: S_IWRITE  S_IREAD   S_IREAD | S_IWRITE\par
	   \par
	   {\b Returns:}    a handle if successful, or -1 if not.\par
	     errno:  EACCES, EEXIST, EMFILE, ENOENT\par
	   \par
	   {\b See also:}   {\plain Example Program}{\v open.ex},\par
	   {\ul Template}{\v open.tp}, access, chmod, close,\par
	   creat, dup, dup2, fopen, sopen, umask\par
	   }
	
	For more information, see the online help and Chapter 7 in the
	"Microsoft C Advanced Programming Techniques" manual.
