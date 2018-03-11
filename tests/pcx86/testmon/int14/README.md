---
layout: page
title: PCx86 INT 14h TSR
permalink: /tests/pcx86/testmon/int14/
---

PCx86 INT 14h TSR
-----------------

[INT14.ASM](INT14.ASM) is a Terminate-and-Stay-Resident (TSR) utility that scans the ROM BIOS Data Area for a COM port
whose I/O address is 0x2F8.  If one is found, then the utility installs replacement INT 14h services for that COM port.
Also, unless the /P option ("polled mode") is specified, the utility also installs a hardware interrupt handler for IRQ
3 (the traditional IRQ for a port at address 0x2F8), and enables interrupt-driven I/O for the COM port.

INT14.COM is designed to be built with [Microsoft Macro Assembler 4.00](/disks/pcx86/tools/microsoft/masm/4.00/) using
the following commands:

    masm int14,,int14;
    link int14;
    exe2bin int14.exe int14.com

INT14.COM is intended to be run on an actual IBM PC/XT/AT, so that the PCjs [TestMonitor](/modules/pcx86/bin/testmon.js)
command-line utility can be used to control the PC.  Here's the procedure:

- Turn on your PC
- Boot DOS 2.00 or later
- Load the PCjs INT14 TSR: "INT14"
- Run the DOS CTTY command: "CTTY COM2" 
- On your connected machine, run the PCjs TestMonitor utility: "node testmon.js"

You should now be able to control the PC using the TestMonitor utility, in your choice of either "terminal mode" or
"command mode".

WARNING: Not all serial port adapters support interrupt-driven I/O, either because:

- The adapter is broken
- The adapter's IRQ has been disabled

If yours doesn't seem to work, then install INT14.COM with /P for "polled mode":

    INT14 /P

In "polled mode", no hardware interrupt handler is installed.  Instead, the INT 14h functions attempt to control
the flow of incoming characters by toggling the RTS line.  However, that may not be sufficient for high speeds (e.g.,
9600 baud), so it's recommended that you use the PC's COM port at the default speed of 2400 baud, which you can also
set with the DOS **MODE** command:

    MODE COM2:2400,N,8,1

testmon.js uses the same default speed of 2400 baud, which you can explicitly set or change as needed:

    node testmon.js --baud=2400

There are currently no `parity`, `databits`, or `stopbits` overrides, so you should always use "N,8,1" with the DOS
**MODE** command.
