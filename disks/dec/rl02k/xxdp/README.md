---
layout: page
title: DEC RL02K Disk Images: XXDP+
permalink: /disks/dec/rl02k/xxdp/
---

DEC RL02K Disk Images: XXDP+
----------------------------

To boot the "XXDP+ Diagnostics" disk, start a [PDP-11/70](devices/pdp11/machine/1170/panel/debugger/) and select
the "XXDP+ Diagnostics" disk from the "Disk Drive Controls", click "Load", and wait for the message:

	Mounted disk "XXDP+ Diagnostics" in drive RL0

Then start the machine (click "Run") and make sure the following prompt has been displayed:

	PDP-11 MONITOR V1.0
	
	BOOT> 

At the prompt, type "BOOT RL0".  The following text should appear:

	CHMDLD0 XXDP+ DL MONITOR
	BOOTED VIA UNIT 0
	28K UNIBUS SYSTEM
	
	ENTER DATE (DD-MMM-YY): 
	
	RESTART ADDR: 152010
	THIS IS XXDP+.  TYPE "H" OR "H/L" FOR HELP.
	
	.

The "H" command displays the following information:

	       Monitor Commands
	       ----------------
	
	          R              run a program
	          L              load a program
	          S              start a program
	          C              run a batch job (chain)
	          D              list directory of load medium
	          F              set the terminal fill count
	          E              enable alternate system device
	          H              type help information
	
	
	       DRS Commands
	       ------------
	               Execution
	               ---------
	          START          start the diagnostic and initialize
	          RESTART        start diagnostic and do not initialize
	          CONTINUE       continue   diagnostic   at   test   that    was
	                         interrupted by a ^C
	          PROCEED        continue from an error halt
	
	               Units Under Test
	               ----------------
	          ADD            activate a unit for testing
	          DROP           deactivate a unit
	          DISPLAY        print a list of device information
	
	               Flags
	               -----
	          FLAGS          print status of all flags
	          ZFLAGS         reset all flags
	
	               Statistics
	               ----------
	          PRINT          print statistical information
	
	               Exitting
	               --------
	          EXIT           return to XXDP+ runtime monitor
	
	
	       DRS Command Switches
	       --------------------
	          /TESTS:test-list    execute only the tests specified
	          /PASS:ddddd         execute ddddd passes (ddddd = 1 to 64000)
	          /FLAGS:flag-list    set specified flags
	          /EOP:ddddd          report end-of-pass after each ddddd passes
	                              (ddddd = 1 to 64000)
	          /UNITS:unit-list    command will affect only specified units
	
	
	       DRS Flags
	       ---------
	
	          Flag      Effect
	          ----      ------
	          HOE       halt on error  -  control  is  returned  to  runtime
	                    services command mode
	          LOE       loop on error
	          IER       inhibit all error reports
	          IBE       inhibit all error reports except first level  (first
	                    level  contains  error  type,  number,  PC, test and
	                    unit)
	          IXE       inhibit extended  error  reports  (those  called  by
	                    PRINTX macro's)
	          PRI       direct messages to line printer
	          PNT       print test number as test executes
	          BOE       "bell" on error
	          UAM       unattended mode (no manual intervention)
	          ISR       inhibit  statistical  reports  (does  not  apply  to
	                    diagnostics   which   do   not  support  statistical
	                    reporting)
	          IDR       inhibit program dropping of units
	          ADR       execute autodrop code
	          LOT       loop on test
	          EVL       execute  evaluation  (on  diagnostics   which   have
	                    evaluation support)
	
	
	       UPD1 Commands
	       -------------
	          CLR       clear UPD1 program buffer
	          LOAD      load a program
	          MOD       modify file image in memory
	          XFR       set transfer address
	          HICORE    set upper memory limit for dump
	          LOCORE    set lower memory limit for dump
	          DUMP      dump a program image
	          DEL       delete a file
	          BOOT      bootstrap a device
	
	
	       UPD2 Commands
	       -------------
	          File Manipulation
	          -----------------
	          DIR       give directory of specified medium
	          PIP       transfer a file or files
	          FILE      transfer a file or files
	          DEL       delete a file or files
	          REN       rename a file
	
	          File Modification
	          -----------------
	          CLR       clear UPD2 program buffer
	          LOAD      load a program
	          MOD       modify file image in memory
	          XFR       set transfer address
	          HICORE    set upper memory limit for dump
	          LOCORE    set lower memory limit for dump
	          DUMP      dump a program image
	
	          New Medium Creation
	          -------------------
	          ZERO      initialize a medium
	          SAVM      save a monitor on a disk
	          SAVE      save a monitor on a tape
	          COPY      copy entire medium
	
	          Miscellaneous
	          -------------
	          ASG       assign a logical name to a device
	          DO        execute an indirect command file
	          READ      read a file to check validity
	          EOT       write end-of-tape mark
	          DRIVER    load a device driver
	
	          Returning to Monitor
	          --------------------
	          BOOT      bootstrap a device
	          EXIT      return control to the runtime monitor
	
	          Printing
	          --------
	          PRINT     print a file on the line printer
	          TYPE      type a file on the console terminal
	
	
	       PATCH Commands
	       --------------
	          BOOT           Boot specified device
	          CLEAR          Clear input table
	          EXIT           Return to XXDP+ monitor
	          GETM           Load DEC/X11 MAP file
	          GETP           Load saved input table
	          KILL           Delete address from input table
	          MOD            Enter address in input table
	          PATCH          Crreate patched file
	          SAVP           Save input table
	          TYPE           Print input table on terminal
	
	
	       XTECO Non-edit Commands
	       -----------------------
	          TEXT - create new text file
	          TECO - modify a file on disk
	          EDIT - modify a file
	          TYPE - type a file on the console terminal
	          PRINT - print a file on the line printer
	          DIR - list directory of specified medium
	          EXIT - return to monitor
	
	
	       XTECO Edit Commands
	       -------------------
	
	          Pointer Location
	          ----------------
	          L - move the pointer line by line
	          C - move the pointer character by character
	          J - move the pointer to the beginning of text
	          ZJ - move the pointer to the end of text
	
	          Search
	          ------
	          S - search for specified string in text now in memory
	          N - search for specified string in remainder of text file
	
	          Modify/Display Text
	          -------------------
	          T - type text
	          D - delete character(s)
	          K - delete line(s)
	          I - insert text
	          A - append text to that currently in memory
	
	          Terminating Edit Mode
	          ---------------------
	          EX - exit edit mode
	<FF>

