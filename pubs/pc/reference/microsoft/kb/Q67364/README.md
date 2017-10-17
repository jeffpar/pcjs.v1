---
layout: page
title: "Q67364: QBX.EXE &quot;EMS Corrupt&quot; Using Expanded Memory in Windows 3.00"
permalink: /pubs/pc/reference/microsoft/kb/Q67364/
---

## Q67364: QBX.EXE &quot;EMS Corrupt&quot; Using Expanded Memory in Windows 3.00

	Article: Q67364
	Version(s): 7.00 7.10
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 9-JAN-1991
	
	When trying to utilize expanded memory, QBX.EXE (from Microsoft BASIC
	PDS versions 7.00 and 7.10) will have problems running under Microsoft
	Windows version 3.00 enhanced mode if Windows 3.00 has not set the
	starting page-frame address for expanded memory. QBX.EXE will try to
	use expanded memory if it is available, unless the QBX /E:0 switch is
	used.
	
	For QBX.EXE to successfully use expanded memory, Windows needs to
	create a consecutive 64K page-frame area in the High Memory Area
	(HMA), C000 hex to EFFF hex. If this memory area is not available for
	use by QBX.EXE 7.00, QBX.EXE will give an "EMS corrupt" error message
	and return to the DOS window, or if run from an application icon, will
	return back to the Program Manager. QBX.EXE version 7.10 will fail to
	make use of expanded memory and will not give an error message.
	
	If QBX.EXE fails when trying to use expanded memory, the EMMExclude
	setting in the [386enh] section of your Windows SYSTEM.INI file may
	need to be changed. EMMExclude is needed to keep Windows from using
	the same memory as another device that Windows cannot detect, such as
	a network card, video card, or parts of BIOS for certain machines. To
	enable QBX.EXE to work correctly, use the EMMExclude setting for the
	minimum amount of memory, and try to move the address space used by
	network and video cards to consecutive addresses starting at C000 hex.
	Also, if there is an area of memory that you know is NOT in use, then
	the EMMInclude or EMMPageFrame setting can be used to tell Windows
	that this area is available for use.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
	
	(For more information, see the application note "Memory Management
	Under Windows 3.00," which is available from the Windows Applications
	Support Group at Microsoft Product Support Services.)
	
	Windows 3.00 attempts to determine what other devices are using the
	address space C000 to EFFF hex before creating the page frame area.
	Sometimes Windows will not detect that another process is using a
	section of memory and will try to use that section of memory for
	itself. The following are symptoms that this may be happening:
	hanging; Windows immediately returning to the MS-DOS prompt after
	displaying the Windows logo; or video problems such as garbage on the
	screen or flashing colors. In this situation, the command EMMExclude
	is used to prevent Windows from conflicting with other devices.
	
	Also, in some situations Windows will sometimes mistakenly think that
	a section of memory is in use and will avoid creating the page frame
	area there. To make sure that Windows uses an area of memory, you can
	use the EMMInclude command. Also, the EMMPageFrame command can be used
	to specify the specific area for the expanded memory page frame.
	EMMPageFrame will only work if Windows thinks that area is available.
	
	The following memory map shows the common usage of each area of memory
	from A000 to EFFF hex:
	
	Address    Used By                  Common Usage
	-------    -------                  ------------
	
	A000-BFFF  Display adapter reserve  EGA and VGA use all, CGA and MDA
	                                    use a portion.
	
	C000-DFFF  ROM expansion            Used for I/O channel BIOS.
	
	                                    C000-C3FF: EGA BIOS.
	                                    C000-DFFF: many VGA cards use the
	                                    whole range.
	                                    C600-C63F: PGA communications area.
	                                    C800-CBFF: hard disk BIOS.
	                                    D000-DFFF: unused.
	                                    C800-DFFF: commonly used by
	                                    network cards.
	
	E000-EFFF  Expansion of system      Used by many ATs and PS/2s but
	           ROM                      not used by other computers.
	
	For example, if you have video card A, which requires address space
	C000 to C7FF hex, and network card B, which requires C800 to D7FF hex,
	use the following EMMExclude command:
	
	   EMMExclude=C000-D7FF
	
	This should provide enough space for QBX.EXE to use expanded memory.
	
	If it is not possible to move the required HMA for the given
	applications to consecutive addresses, then you can give multiple
	EMMExclude commands. For example, if you have an IBM PS/2 that uses
	E000-EFFF hex for parts of its BIOS area that cannot be moved, and a
	network card that can use addresses C000 to CFFF or C7FF to D7FF, then
	you need to use the following EMMExclude commands:
	
	   [386enh]
	   EMMExclude= C000-CFFF
	   EMMExclude= E000-EFFF
	
	The lower memory area for the network card should be chosen to limit
	memory fragmentation in the High Memory Area. If you know you are not
	using the area C800-DFFF and Windows still does not create a page
	swapping area, then use the EMMInclude command to force Windows to try
	and use that area of memory. The EMMInclude command overrides the
	EMMExclude command for the parts of memory that the two statements may
	have in common:
	
	   [386enh]
	   EMMInclude= C800-DFFF
	   EMMExclude= C000-CFFF
	   EMMExclude= E000-EFFF
	
	Instead of using the EMMInclude command, the EMMPageFrame command can
	be used to tell Windows exactly where to start the page frame area if
	Windows believes that the specified area is available for use:
	
	   [386enh]
	   EMMPageFrame=C800
	   EMMExclude= C000-CFFF
	   EMMExclude= E000-EFFF
	
	Making Windows create a page swapping area may not be possible with
	some machine configurations. If the above clues do not help create a
	page frame area, then the Windows Applications Unit of Microsoft
	Product Support Services may have more information about your
	particular machine configuration and may be able to help you further.
	
	Code Example
	------------
	
	The following BASIC PDS program will tell you at what address, if any,
	a page frame has been set. By compiling as shown and running the
	program in the Windows DOS box, you can determine if and where Windows
	is creating the expanded memory page frame.
	
	To make a stand-alone executable program out of the following code
	sample, perform the following steps from the DOS prompt:
	
	   BC emspage.bas /o;
	   LINK emspage.obj,,,QBX.LIB;
	
	'This is the sample program emspage.bas
	REM $INCLUDE: 'QBX.BI'
	DIM inregs AS regtype
	DIM outregs AS regtype
	inregs.ax = &H4100
	CALL interrupt(&H67, inregs, outregs)
	IF (outregs.ax AND &HFF00) = 0 THEN
	   PRINT "PAGE FRAME ADDRESS: "; HEX$(outregs.bx)
	ELSE
	   PRINT "PAGE FRAME ADDRESS: NONE "
	END IF
