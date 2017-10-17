---
layout: page
title: "Q68875: Error L2029 May Be Caused by Improperly Renaming Libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q68875/
---

## Q68875: Error L2029 May Be Caused by Improperly Renaming Libraries

	Article: Q68875
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | s_link s_quickc
	Last Modified: 1-FEB-1991
	
	Although you may have been able to link other programs without a
	problem, in certain cases, the link error "L2029: Unresolved External"
	may be generated for some of the following symbols:
	
	   __aFlmul
	   __aFfalrem
	   __aFalshl
	   __aFnaldiv
	
	The L2029 error may be occurring because you are using a library that
	does not contain all of the necessary functions, due to improper
	installation or renaming.
	
	The problem could result because the C compiler was installed without
	combined libraries, or because the file
	
	   xLIBCR.LIB
	
	was improperly renamed to the following
	
	   xLIBCE.LIB
	
	(where x = S, M, C or L).
	
	In this case, the linker will incorrectly use xLIBCE.LIB, assuming
	that it is a combined library containing all of the necessary
	functions.
	
	To resolve the problem, reinstall the C run-time libraries by typing
	"setup /lib" from drive A with the Setup disk loaded. Then choose
	"Yes" for "Combined Libraries" when prompted.
	
	Note that this problem may also occur with QuickC versions 2.50 and
	2.51.
