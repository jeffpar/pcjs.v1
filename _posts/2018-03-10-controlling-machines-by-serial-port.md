---
layout: post
title: Controlling Machines by Serial Port
date: 2018-03-10 10:00:00
permalink: /blog/2018/03/10/
machines:
  - id: ibm5170
    type: pcx86
    config: /devices/pcx86/machine/5170/ega/640kb/rev1/machine.xml
    drives: '[{name:"10Mb Hard Disk",type:1,path:"/pcjs-disks/pcx86/drives/10mb/MSDOS320-C400.json"}]'
    autoMount:
      A:
        name: None
      B:
        name: None
    autoType: CTTY COM2\r
---

I recently added a new PCjs [TestMonitor](/modules/pcx86/lib/testmon.js) component that is able to deliver user-defined
commands to a PCjs machine via a serial port.  TestMonitor is built into PCx86, and can also be run as a
[command-line utility](/modules/pcx86/bin/testmon.js) to issue commands to a *physical* machine, making it easy to compare
operations between simulated and actual hardware.

You can test it with the PCjs machine below, which has been configured with a [TestController](/modules/pcx86/lib/testctl.js)
window, as well as a hard disk with [MS-DOS 3.20](/disks/pcx86/dos/microsoft/3.20/) and [SYMDEB 4.00](/blog/2018/02/25/)
pre-installed.  After the "CTTY COM2" DOS command is entered, all further DOS input/output is redirected to COM2, which is
connected to the TestController window.

If you want to interact with DOS directly, you can press Ctrl-T to enter the TestMonitor's *terminal* mode; press it again
to return to *prompt* mode.  In *prompt* mode, the TestMonitor monitors the serial port for recognized prompts --
initially, a DOS prompt (eg, "C:\&gt;").  As soon as it detects a DOS prompt, TestMonitor automatically switches from *prompt*
mode to *dos* mode:

    PCx86 TestMonitor v1.60.2
    Use Ctrl-T to toggle terminal mode (COM2)
    mode: terminal
    mode: prompt
    mode: dos

The set of "dos" commands currently defined in [tests.json](/tests/pcx86/testmon/tests.json) includes "symdeb".  Type that
command into the TestMonitor window and press enter:

    symdeb

Assuming TestMonitor successfully runs SYMDEB, it should detect the SYMDEB prompt, as indicated by the following message:

    mode: symdeb

At that point, you can type any of the "symdeb" commands defined by [tests.json](/tests/pcx86/testmon/tests.json).  For example,
one of those commands is "reboot".  Typing "reboot" and pressing enter sends the following SYMDEB command sequence to the
machine:

    a cs:ip
    jmp ffff:0
    
    g

which should cause the machine to reboot.

Another example is the "curtest" (cursor test) command, which uses a simple for-loop to repeatedly change the starting
scan-line of the cursor, and then waits for you to press a key after each change:

    "curtest": "for i=0 to 13 { curstart $i; printf('curstart=%d\n',$i); wait; }"

The "curtest" command relies on the "curstart" command:

    "curstart": "o 3d4 a\ro 3d5 %1\r"

which issues a pair of SYMDEB output ("o") commands to the machine's CRT controller.

Note that for-loops use `$variable` substitution and printf() calls use traditional `%specifier` substitution,
while other commands use either `$argument` or `%argument` substitution, depending on whether the corresponding
argument should be replaced as-is or converted to a hexadecimal value first.

Since "curstart" expects a single hexadecimal argument, and since the for-loop is producing decimal values, the command
uses `%1` to ensure that the first argument is converted to hex before it is substituted.  This means the following
commands are equivalent, replacing all occurrences of `%1` with `a`: 

    curstart 10
    curstart 0xa

At this point, this is mostly just proof-of-concept stuff.  Phase Two of TestMonitor development will involve
adding command verification checks, to determine whether a command was performed successfully and with the desired
result(s), and Phase Three will involve creating a series of low-level tests, exercising CPU features on both real
and simulated hardware in parallel and verifying that both sets of results match.

{% include machine.html id="ibm5170" %}

*[@jeffpar](http://twitter.com/jeffpar)*  
*Mar 10, 2018*
