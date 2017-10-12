---
layout: page
title: "Q12230: IRQ Settings and Mouse Installation"
permalink: /pubs/pc/reference/microsoft/kb/Q12230/
---

	Article: Q12230
	Product: Microsoft C
	Version(s): 1.x 2.x 3.x 4.x 5.x 6.x 1.00
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 19-SEP-1988
	
	The jumper on the bus mouse should be checked before the card is
	installed in any computer, especially if the card is moved from one
	machine to another. The board's jumper controls which interrupt
	request (IRQ) line is used. IRQ lines are used to facilitate
	information transfer from such I/O devices as disk controllers and
	serial ports. The jumper avoids IRQ conflicts with other devices
	already installed in the computer. Under each pair of pins on the card
	is a number between 2 and 5 (inclusive). The jumper selects the IRQ
	line. Microsoft ships the boards with the jumper set to IRQ 2, for
	installation in a typical IBM PC or PC XT. Because IBM changed the IRQ
	architecture in the PC AT by using using IRQ 2 for the second IRQ
	controller, the bus mouse jumper is usually set to IRQ 5 on an AT.
	
	While these jumper settings are correct for most installations, you
	should verify which (if any) IRQ lines are being used by every device
	already installed in the machine. There can be only one active device
	per IRQ line. Refer to the technical manuals for each manufacturer's
	product or contact the manufacturer directly for this information. The
	following is an IRQ allocation table as defined in the IBM PC and AT
	technical reference manuals (other manufacturers' software, hardware
	and add-on boards must follow this convention in order to be IBM
	compatible):
	
	                                        PC-AT
	IRQ Line        PC, PC-XT       CTLR 1          CTLR 2
	
	    0             Timer         Timer     | IRQ8  Clock
	    1            Keyboard      Keyboard   | IRQ9  Redirected IRQ2
	    2            Reserved       CTLR 2 <--| IRQ10 Reserved
	    3              COM2          COM2     | IRQ11 Reserved
	    4              COM1          COM1     | IRQ12 Reserved
	    5           Hard disk        LPT2     | IRQ13 Coprocessor
	    6          Floppy disk   Floppy disk  | IRQ14 Hard disk
	    7             LPT1-3         LPT1     | IRQ15 Reserved
	
	Because the mouse can be jumpered in the IRQ range of 2 through 5 and
	there can be only one active device per IRQ line, the bus mouse can be
	installed only if at least one of these lines is free.
	
	For example, a bus mouse is to be installed in an IBM PC-AT with an
	IBM PC-AT Serial/Parallel Adapter configured as COM1 and LPT1,
	respectively; a Color Graphics Adapter; and a multi-function card with
	128K of memory and a serial port configured as COM2. On this computer,
	there is only one IRQ line still available on IRQ controller 1: IRQ 5.
	IRQ 2 is used by the AT's second IRQ controller and IRQ lines 4 and 3
	are used by COM1 and COM2. The CGA does not use an IRQ line and the
	parallel port uses IRQ 7, which falls outside of the mouse's range.
	The bus mouse should be jumpered for IRQ 5, thereby using the last IRQ
	line in the normal IRQ range of 0 through 7 of the first IRQ controller.
	The user of this computer should be aware of this for future
	expansion.
	
	The Enhanced Graphics Adapter (EGA) is now becoming a popular display
	card for PCs and XTs. The EGA includes a hardware feature that allows
	software to enable interrupts on IRQ2 to indicate the start of
	vertical retrace. Therefore, if an EGA and bus mouse are installed in
	a PC or XT, IRQ2 is no longer available for the mouse. In a full XT
	with a hard disk, two serial ports, an EGA, and a bus mouse, there
	will be an IRQ line overlap between two devices. Therefore, one device
	will have to be sacrificed to free up an IRQ line for the bus mouse.
	This is not a design deficiency of the bus mouse; it is a fundamental
	design restriction in the PCs and XTs.
	
	As discussed above, there are only eight IRQ lines in the PC and XT,
	of which four are used up by the motherboard and other standard
	equipment. The other four lines go quickly. Almost all expansion cards
	require that a free IRQ line be available, such as the following:
	
	1. Network cards
	2. Bisync communication cards
	3. Tape back-up units
	4. Some clock/calendar hardware
	5. Serial communication cards
	6. EGAs
	7. Emulation boards
	8. Hard disk controllers
	
	There are more desirable devices to install in a machine than IRQ
	lines to handle them. To help relieve the crowding of IRQ lines, the
	IBM AT includes a second IRQ controller with seven more lines.
	Currently, hardware is evolving to take advantage of the new AT
	architecture.
	
	Once the hardware is installed, the software must be loaded. When the
	mouse driver loads, using either MOUSE.SYS from CONFIG.SYS or
	MOUSE.COM from a batch file or the keyboard, the file will be loaded
	into memory and the driver will then install itself. This installation
	requires a few seconds. Various operations are undertaken, including
	mouse hardware initialization. This is the primary reason for the
	delay before the mouse installation message appears.
	
	If the error message "MOUSE: Microsoft mouse not found!" appears,
	there can be a number of hardware-related causes, such as a broken
	mouse; however, the problem more likely is an IRQ contention problem
	either between the mouse and another device or between the serial
	ports.
	
	Typical bus mouse related problems are between the mouse and the hard
	disk controller, i.e., bus mouse jumpered on IRQ 5 in an XT or IRQ 2
	in an AT. The common symptom for this problem is the inability to
	perform a warm boot (CTRL+ALT+DEL). If the bus mouse is jumpered on
	the same line as a serial port, network card, or emulator card,
	irregular and unreproducible system crashes can occur. In Windows,
	with a bus mouse doubled up on the IRQ line used by a modem, the mouse
	will "go away" when communications software is run.
	
	The standard isolation procedure is to verify IRQ-line usage and if no
	problems are uncovered, the next step is to remove as much hardware as
	possible. In this way, the conflict should be uncovered between
	particular devices and a resolution of the problem will follow.
