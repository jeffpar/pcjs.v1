---
layout: page
title: "Q65934: CV /E Avoids Windows 3.00 386 Enhanced Mode Protection Error"
permalink: /pubs/pc/reference/microsoft/kb/Q65934/
---

	Article: Q65934
	Product: Microsoft C
	Version(s): 2.35 3.00 3.10
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900919-57 B_QuickBas B_BasicCom W_Win3
	Last Modified: 24-OCT-1990
	
	When you start Microsoft CodeView under Windows 3.00 in a 386 enhanced
	mode DOS box, the following error message is displayed:
	
	   You have attempted to run protected-mode application under 386
	   enhanced mode. To run the application, exit and run Windows using
	   either the WIN /s or the WIN /r command.
	
	However, using WIN /s or /r is unnecessary. To avoid the error
	message, start CodeView with the /E option to tell CodeView that
	expanded memory is available, as follows:
	
	   CV /E
	
	This information applies to Microsoft CodeView versions 2.35, 3.00,
	and 3.10 for MS-DOS.
	Note that CodeView version 2.35 is shipped with Microsoft BASIC
	Professional Development System (PDS) version 7.00; CodeView version
	3.00 is shipped with Microsoft C Compiler PDS version 6.00; and
	CodeView 3.10 is shipped with Microsoft BASIC PDS version 7.10.
	
	You may find that after the error message is generated, if you return
	to the DOS box and wait a few seconds, CodeView will start up. To
	avoid the error message, start CodeView as follows with the expanded
	memory (/E) switch (where <filename.exe> is the name of the program
	you want to debug):
	
	   CV /E <filename.exe>
	
	To increase the size of programs that can be loaded into CodeView in
	conjunction with the /E switch, you can create a PIF file for CodeView
	and specify -1 for the Expanded Memory KB Limit, which instructs
	Windows to give the program all the EMS that it needs.
	
	CodeView will run without the above error message in a Windows 3.00
	DOS box in standard mode, WIN /S.
