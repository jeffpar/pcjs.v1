---
layout: page
title: "Q64787: How to Run QuickBASIC 4.50 on Two Floppy System (No Hard Disk)"
permalink: /pubs/pc/reference/microsoft/kb/Q64787/
---

## Q64787: How to Run QuickBASIC 4.50 on Two Floppy System (No Hard Disk)

	Article: Q64787
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 5-SEP-1990
	
	This article describes an optimal method to set up and use Microsoft
	QuickBASIC version 4.50 on a dual (two) floppy system that does not
	have a hard drive. You can use either 3.5-inch disks or 5.25-inch
	disks.
	
	For a listing of the contents of each 4.50 release disk, query in this
	Knowledge Base on the following word:
	
	   QB45QCK
	
	Make (SETUP) Copies of Release Disks
	------------------------------------
	
	To set up QuickBASIC 4.50 to operate on a two-floppy system lacking a
	hard disk drive, you can either use SETUP.EXE or copy all of each
	original floppy to a working floppy disk. Then, put the ORIGINAL disks
	in a safe place. The 5.25-inch (354K) disk version comes on five
	disks.
	
	Do NOT use the ORIGINAL disks except to make working copies. By never
	using the ORIGINAL disks and just running from copies, you can be more
	sure of having a secure backup. This applies to all software products.
	
	Because there is insufficient space on one normal-density (354K)
	floppy to have COMMAND.COM, QB.EXE, and QB45QCK.HLP, you should create
	a separate, bootable "source" disk that includes COMMAND.COM. The
	source files of programs that you write can be stored on this source
	disk. Please refer to the FORMAT command in your MS-DOS manual to
	learn how to make a bootable floppy disk.
	
	How to Set Up 3.5-Inch (720K) Disk Version of 4.50
	--------------------------------------------------
	
	If you have a 3.5-inch disk system, QuickBASIC comes on three 3.5-inch
	(720K) disks. There is no 3.5-inch Utilities 2 disk because it has
	been combined with the 3.5-inch Utilities 1 disk. If the SETUP program
	prompts you for the Utilities 2 disk, keep the Utilities 1 disk in the
	drive and continue with SETUP.
	
	For the 3.5-inch (720K) disk version of 4.50 (three disks), set up as
	described below:
	
	1. Format a bootable disk, then copy the following to it: your MS-DOS
	   COMMAND.COM file, all the files you need from the 4.50 Program Disk,
	   and the source files you want to compile.
	
	2. Start up with this Program/source disk in Drive B and the help files
	   disk in Drive A. (The QB45ENER.HLP and QB45ADVR.HLP help files will
	   be on the same disk, requiring one less swap when you use the Help
	   system compared to 354K disks.)
	
	3. Make Drive B the current drive and type QB.
	
	4. In QB.EXE, choose Set Paths from the Options menu and set all paths
	   with the following:
	
	      A:\;B:\
	
	   Notes
	   -----
	
	   When you are prompted for a file not currently in a disk drive, you
	   should use Drive A for all disk swaps.
	
	   Press SHIFT+F1 to access the help system.
	
	How to Run QB.EXE on 354K Floppies
	----------------------------------
	
	Once you have created a bootable source disk and copies of the release
	disks as explained above, you can run QuickBASIC on 354K floppies
	as follows:
	
	1. Insert your copy of the Program disk in Drive A.
	
	2. Insert your "source" disk in Drive B.
	
	3. Type the following:
	
	      B:   (to make Drive B the current drive)
	
	4. Type the following:
	
	      A:\QB    (to run QB.EXE while Drive B is the current drive)
	
	5. In QB.EXE, choose Set Paths from the Options menu and set all
	   paths with the following:
	
	      A:\;B:\
	
	   (This path information is stored in the A:\QB.INI file. If you
	   change items in the Options menu, QB.INI is automatically created
	   in the directory where you are running QB.EXE.)
	
	Press SHIFT+F1 to access the help system. When the Program disk is in
	Drive A, no disk swapping is necessary to access the QB45QCK.HLP help
	file. You will be prompted to swap the disk if other .HLP files are
	needed while using the help system.
	
	When prompted for any disk, swap in Drive A (not in Drive B).
	
	When you open a source file in QB.EXE (using ALT+F+O), the default
	directory will be the current directory (Drive B), which contains .BAS
	source files.
	
	How to Use Make EXE File Option on 354K Floppies
	------------------------------------------------
	
	If you choose the Make EXE File option (from the Run menu) within
	QB.EXE, the first prompt will be for BC.EXE. The Utilities 1 disk
	should be inserted in Drive A, and your response to the prompt will be
	"A:". This ensures that BC can find the .BAS file in Drive B.
	
	The .OBJ file will be put in the working directory on Drive B and will
	thus be kept with the source code. (If the working directory was Drive
	A when you invoked QB.EXE, the .OBJ file would be put on the Utilities
	1 disk, which doesn't have enough room to hold the .OBJ file.)
	
	The next prompt will be for the location of the BCOM45.LIB or
	BRUN45.LIB library (which isn't found automatically yet since Drive B
	is the current drive). In either case, your response should be "A:".
	If you are prompted for BRUN45.LIB, no disk swapping is necessary. If
	you are prompted for BCOM45.LIB, a disk swap is needed.
	
	The .EXE file will be written to the source disk (in Drive B).
	
	After the Make EXE File operation is completed, you will be prompted
	for QB.EXE; the response once again is "A:" (which requires another
	disk swap to load QB.EXE).
	
	As you can see, you will always be using Drive A for disk swapping,
	which should be easy to remember. When in doubt of where to swap,
	always swap in Drive A.
	
	How to Avoid Excessive Disk Swapping
	------------------------------------
	
	Putting all programs necessary for an operation (such as Make EXE
	File) on one disk helps save disk swapping. However, if you plan to
	compile with the BC /O (Stand-alone .EXE) option, note that the size
	of BC.EXE plus BCOM45.LIB is 318,400 bytes, which does not leave
	enough space on a 354K disk to add LINK.EXE, which has 69,133 bytes.
	This means you need to do extra disk swapping when choosing the
	Stand-Alone .EXE (BC /O) option on 354K disks (compared to choosing
	the EXE Requiring BRUN45.EXE option).
	
	To avoid disk swapping, QuickBASIC can be run on high-density disks
	(such as high-density 3.5-inch floppies, high-density 5.25-inch
	floppies, or a hard disk).
	
	How to Run an .EXE program
	--------------------------
	
	To run an .EXE program, quit QB.EXE or choose Shell from the File menu.
	Either one will return you to Drive B where your newly created .EXE
	program is located. If the .EXE is a stand-alone program (compiled BC
	/O, which uses the BCOM45.LIB library), it can be run as is. If the
	EXE requires the run-time module (BRUN45.EXE), the BRUN45.EXE file
	must be located on the source disk (Drive B).
	
	(QuickBASIC 4.50 may not allow you to use BRUN45.EXE in one drive
	while the other drive is the current drive. If you get the "Input
	Run-time Module Path" prompt, try typing "A:\" instead of
	"A:\BRUN45.EXE". If this doesn't find the BRUN45.EXE module even
	though it is on Drive A, you must put BRUN45.EXE on the source disk in
	the current drive.)
	
	With both your compiled .EXE program and BRUN45.EXE on the source disk
	(on the current drive), you will not be prompted to find BRUN45.EXE at
	run time. Note that BRUN45.EXE takes up 77,440 bytes of disk space. To
	make more room, remove unneeded sample programs and unneeded .OBJ
	files after making .EXE programs.
	
	How to Make the SHELL Command Work on Your System
	-------------------------------------------------
	
	If you get "Illegal Function Call" when you attempt to execute SHELL
	(with the SHELL statement in a program or the DOS Shell option from
	the QB.EXE File menu), you probably do not have the COMMAND.COM file
	in the current disk directory or specified in your COMSPEC MS-DOS
	environment variable. SHELL must know where to find COMMAND.COM.
	
	Because there is insufficient space on one normal-density (354K)
	floppy to have COMMAND.COM, QB.EXE, and QB45QCK.HLP, Microsoft
	suggests creating a separate, bootable disk that includes COMMAND.COM
	and your source files. When you SHELL to DOS (using the disk strategy
	described in this article), the default drive will be Drive B, which
	contains the bootable source-file disk.
	
	When doing a SHELL, a program first looks for COMMAND.COM in the
	directory specified by the system COMSPEC environment variable, then
	looks next in the current directory.
	
	The MS-DOS SET command can be used to assign the COMSPEC environment
	variable in your AUTOEXEC.BAT file or on the MS-DOS command line, as
	follows:
	
	   SET COMSPEC=A:\COMMAND.COM
	
	To tell MS-DOS where to find COMMAND.COM, you can also specify the
	following command in your MS-DOS version 3.20 CONFIG.SYS file, and
	reboot your system
	
	   SHELL=A:\COMMAND.COM /E:1000 /P
	
	where /E:<size> sets the size (in bytes) for MS-DOS environment space,
	and /P tells the command processor that it is the first program in the
	system so that it can process the MS-DOS EXIT command. This SHELL=
	statement may not work correctly under MS-DOS version 3.30, but it
	works properly under MS-DOS version 3.20.
	
	Note: COMMAND.COM is the program that processes all command-line
	arguments that you type in MS-DOS.
