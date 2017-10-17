---
layout: page
title: "Q37309: QB 2.x and 3.00 INT86 Requires VARPTR, but Not 4.00 INT86OLD"
permalink: /pubs/pc/reference/microsoft/kb/Q37309/
---

## Q37309: QB 2.x and 3.00 INT86 Requires VARPTR, but Not 4.00 INT86OLD

	Article: Q37309
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |  B_BasicCom
	Last Modified: 4-SEP-1990
	
	The interrupt routines INT86OLD and INT86XOLD are meant to emulate the
	INT86 and INT86X routines found in earlier versions, but they are
	invoked differently, as described in this article.
	
	INT86 and INT86X routines are found only in QuickBASIC versions 2.00,
	2.01, and 3.00. The INT86OLD and INT86XOLD are included in Microsoft
	QuickBASIC versions 4.00, 4.00b, and 4.50; in Microsoft BASIC Compiler
	versions 6.00 and 6.00b for MS-DOS; and in Microsoft BASIC PDS
	versions 7.00 and 7.10 for MS-DOS.
	
	In QuickBASIC versions 2.x and 3.00, the offset of the register arrays
	must be passed to INT86 and INT86X using the VARPTR function. For
	INT86OLD and INT86XOLD (found in later versions), VARPTR is not
	required. [This difference is noted on Page 87 in the "Microsoft
	QuickBASIC 4.0: BASIC Language Reference" manual for versions 4.00 and
	4.00b, and on Page 87 in the Microsoft BASIC Compiler 6.0: BASIC
	Language Reference" manual for versions 6.00 and 6.00b.]
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50 for MS-DOS; to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS-DOS; and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	The newer versions of BASIC listed above have replaced the INT86 and
	INT86X statements with the following easier-to-use routines: CALL
	INTERRUPT and CALL INTERRUPTX. For more information about these newer
	routines, query in this Knowledge Base on the following word:
	
	   QB4INT
	
	The syntax for INT86 and INT86X (used in QuickBASIC versions 2.00,
	2.01, and 3.00) is as follows:
	
	   CALL INT86 (int_no, VARPTR(in_array(x)), VARPTR(out_array(y)))
	   CALL INT86X (int_no, VARPTR(in_array(x)), VARPTR(out_array(y)))
	
	The syntax for INT86OLD and INT86XOLD (used in later versions for
	backwards statement-compatibility) is as follows:
	
	   CALL INT86OLD (int_no, in_array(), out_array())
	   CALL INT86XOLD (int_no, in_array(), out_array())
