---
layout: page
title: "Q39257: Hardware Compatibilities with QuickBASIC Version 4.50"
permalink: /pubs/pc/reference/microsoft/kb/Q39257/
---

## Q39257: Hardware Compatibilities with QuickBASIC Version 4.50

	Article: Q39257
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S881212-9
	Last Modified: 14-FEB-1991
	
	QuickBASIC version 4.50 is more selective of the video hardware on
	which it will operate than QuickBASIC versions 4.00 and 4.00b.
	QuickBASIC requires a video card that is 100-percent compatible with
	an IBM CGA, EGA, VGA, or Hercules monochrome card.
	
	If QB.EXE version 4.50 does not operate with your video system, try
	invoking QuickBASIC with each of the video-specific options, such as
	the /b (black and white) option, the /nohi (no high intensity) option,
	the /g (update screen as fast as possible) option, and the /h (high
	resolution) option. Also, try setting the video mode from MS-DOS using
	the Mode command before starting QuickBASIC (for example, Mode CO80
	and Mode BW80).
	
	If a ghost image appears after running QuickBASIC on your video
	system, use the MS-DOS Mode command to clear the screen if CLS doesn't
	clear it.
	
	Below are computers and video adapters listed as compatible and
	incompatible with QuickBASIC version 4.50.
	
	The following video cards were successfully tested with QuickBASIC
	version 4.50:
	
	   (Note: If the card is a VGA but not an IBM PS/2 VGA, there will be
	   problems swapping on screen 10.)
	
	   AST EGA (256K)
	   COMPAQ PORTABLE (monochrome)
	   COMPAQ VGC (Compaq's name for VGA)
	   Daewoo (Leading Edge/AT) EGA (256K) monochrome
	   Genoa EGA (256K)
	   Genoa EGA (256K) monochrome
	   Hercules monochrome
	   IBM EGA 256K
	   IBM EGA 64K
	   IBM PC Convertible
	   IBM VGA (Non-PS/2)
	   IBM PS/2 VGA
	   IBM MCGA
	   IBM EGA (64K) with monochrome
	   IBM CGA
	   IBM MDPA
	   NCR EGA
	   Olivetti monochrome
	   Olivetti EGA (256K)
	   Olivetti VGA
	   Paradise Autoswitch EGA (256K)
	   PC Limited VGA
	   Tandy EGA (256K)
	   Vega Video Seven (7) Deluxe EGA (256K)
	   Zenith EGA monochrome
	
	If the QB.EXE environment looks fine before running a program but is
	not visible after running the program, try invoking SCREEN 0,0 at the
	end of the program, or in QB.EXE's immediate window (F6 key). One
	customer reported this solution on a Compaq 2e mono VGA, where the VGA
	video card is built-in.
	
	The following is a list of known compatibility problems:
	
	1. According to Microsoft's testing, the following cards loaded
	   QB.EXE, but had numerous problems with screen swapping:
	
	      Tecmar VGA
	      Quadram VGA
	      Vega Video Seven (7) FastWrite VGA
	      Vega VGA (a customer suggested QB /H for better Vega VGA
	                behavior)
	
	2. According to Microsoft's testing, the following cards will not
	   load QB.EXE:
	
	      COMPAQ Laptop (BIOS problem - no correction)
	      COMPAQ SLT/286 (okay with AC power, fails with battery, unless
	                     you disable the power-conservation utility
	                     PWRCON.EXE or PWRCON.COM)
	      Genoa SuperVGA HiRes
	      ATI VIP VGA
	      Sigma EGA!
	
	In addition, the cards below have been reported by customers as
	potential problem cards. The problems range from hanging the machine
	to causing an unreadable display. Microsoft has not tested QuickBASIC
	version 4.50 on the hardware listed below; therefore, we do not
	guarantee compatibility. The potential problem cards are as follows
	(this information may be inaccurate because it is reported secondhand
	and is unconfirmed by Microsoft):
	
	1. Computers with the following video cards installed (potential
	   QuickBASIC compatibility problems):
	
	      ATI VIP card
	      Vega VGA from Video Seven (7) (although one customer said
	         QB /H corrected QB.EXE problems with Vega VGA)
	      Sigma VGA
	      Everex EGA
	      Older Quadram CGA cards
	      Unisys CGA
	      NEC EGA
	      AST Turbo Scan EGA -- A customer reported he couldn't invoke
	         QB.EXE 4.50 in 80- or 43-line mode on a PC clone with this
	         card.
	      Tecmar VGA -- In 43-line mode, the last seven lines on the screen
	         are truncated. This was found to be a problem with the Tecmar
	         VGA ROM versions 1.08 and 1.09.
	      Packard Bell EGA -- A customer reported that the QB Express
	         tutorial failed on this card, but Setup and the QB.EXE editor
	         ran correctly.
	      Paradise Auto-Switching VGA -- Two customers reported that this
	         card caused QB.EXE 4.50 to hang when run on an IBM XT.
	
	2. Computers, as follows (potential problems):
	
	      Sperry PCs and XTs with Hercules and CGA cards
	      Tandy 1000s with Tandy Enhanced CGA cards
	      Leading Edge Model M (which comes with CGA or Hercules)
	      Leading Edge Model D (but according to one customer, it might
	         work on BIOS version 3.00 or later)
	      IBM PCjr
	      Zenith 151, an XT compatible, with EGA Boca, and up-to-date BIOS
	      DEL 310 models that come with Vega Video Seven (7), VGA 16-bit
	         graphics (try QB /H for better results)
	      DEL AT-compatible with VGA monochrome system, Vega Video Seven (7)
	         16-bit graphics card. Visibility problems reported in QB.EXE.
	         The following reportedly do not help: QB /NOHI, /B, /H, and
	         /G, and the Mode CO80 and Mode BW80 commands in DOS.
	      Hyundai XT (Other non-XT Hyundai models may be OK, according to
	         one customer.)
	      Austin 286/12-5 computer -- a customer reported that QuickBASIC
	         generated an "illegal function call" error when he tried to
	         use SCREEN 9. This computer comes standard with a WDM-20 EGA
	         card integrated into the motherboard and it seems that
	         QuickBASIC will not recognize this card because SCREEN modes
	         other than 0 give "Illegal function call."
	
	A customer using the Zenith 151 reported an "Internal Stack Failure"
	when holding down an arrow key for scrolling in the QB.EXE version
	4.50 editor.
	
	A customer reported that several QuickBASIC version 4.50 programs
	(including DEMO1.EXE) fail to run on several Tandy 3000 computers with
	a built-in EGA card connected to a RGB CM11 monitor. (The same program
	works on the customer's Tandy 3000 if it is compiled with QuickBASIC
	version 4.00.) There were no TSRs running on the customer's system,
	and the Mode CO80 and CO40 DOS commands did not help.
	
	For the ATI VGA Wonder card, some customers have reported "Illegal
	Function Call" errors when using SCREEN 9 in QuickBASIC programs.
	However, another customer reported that the ATI VGA Wonder card works
	properly if you run the setup correctly for the monitor type connected
	(monochrome, multisync, color, etc.). For example, if a monochrome
	monitor is connected to the card but the setup is not set correctly,
	SCREEN 9 fails, but SCREEN 10 may work. Setting the ATI VGA Wonder
	card for the monochrome monitor makes SCREEN 9 work successfully.
