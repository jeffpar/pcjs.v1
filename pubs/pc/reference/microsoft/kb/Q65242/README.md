---
layout: page
title: "Q65242: CV1319 Error May Be Caused by CodeView DOS Extender"
permalink: /pubs/pc/reference/microsoft/kb/Q65242/
---

	Article: Q65242
	Product: Microsoft C
	Version(s): 3.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist3.00 fixlist3.10
	Last Modified: 31-AUG-1990
	
	Real-mode CodeView (CV) version 3.00 (shipped with Microsoft C 6.00)
	may encounter problems on certain computers when extended memory is
	utilized for debugging programs. These problems involve the processing
	of interrupts while CodeView 3.00's internal DOS extender is being
	used to run CodeView in protected mode in conjunction with HIMEM.SYS,
	the extended memory (XMS) driver.
	
	The problems manifest themselves in various ways, due to both the
	varied interrupt handling speeds of different machines and the varied
	interactions of CodeView itself running in protected mode while the
	DOS program being debugged is still being run in real mode. The most
	common error is a protection violation, which shows up in CodeView as
	either a CV1319 error (internal error - unrecoverable fault) or as a
	system hang. The errors usually occur when you are paging through the
	code or manipulating the mouse.
	
	Registered Microsoft C 6.00 owners who are experiencing any of these
	problems with CodeView version 3.00 are encouraged to call Microsoft
	Technical Support at (206) 637-7096 to obtain information concerning a
	possible correction for these errors. However, there may be some cases
	where the only solution is to obtain a newer computer BIOS or to use
	CodeView without extended memory.
	Most reported problems have involved IBM PS/2 computers, but a number
	of these problems have also been reported on computers with an AMI
	BIOS. Note that CodeView version 3.10 includes modifications that are
	expected to eliminate most of these interrupt problems, but in some
	instances (especially with older AMI BIOS machines), an update of the
	BIOS may be the only solution.
	
	The easiest workaround to these protected-mode errors is to start
	CodeView without the use of extended memory. This can be done by
	removing the line in CONFIG.SYS that loads the HIMEM.SYS driver (and
	then rebooting the computer). Another option, if HIMEM is already
	loaded, is to start CodeView with the /D command-line option to
	specify explicitly that CodeView should use disk overlays, rather than
	extended or expanded memory. (Otherwise, if extended memory is
	available, CodeView will use the /X option by default.)
	
	Because these problems can occur only when CodeView is running in
	protected mode in extended memory, and because CodeView 3.00 requires
	HIMEM.SYS in order to run in protected mode, the problems are often
	mistakenly attributed to HIMEM.SYS. In reality, HIMEM.SYS is not
	responsible for the errors because it is just the memory manager that
	CodeView utilizes to get at extended memory. The errors are the result
	of an interrupt handling incompatibility between certain hardware
	configurations and the DOS extender built into CodeView.
	
	Microsoft has confirmed this to be a problem in CodeView version 3.00.
	This problem has been corrected in version 3.10.
