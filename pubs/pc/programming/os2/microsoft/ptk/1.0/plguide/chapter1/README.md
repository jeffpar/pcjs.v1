---
layout: page
title: "Microsoft OS/2 Programmer's Learning Guide: Introduction"
permalink: /pubs/pc/programming/os2/microsoft/ptk/1.0/plguide/chapter1/
---

Microsoft OS/2 Programmer's Learning Guide
---

Introduction
---

### 1.1 Overview

The *Microsoft® Operating System/2 Programmer's Learning Guide* is intended to help the experienced C programmer
make the transition to writing programs that use the Microsoft Operating System 2 application programming interface.
The guide provides explanations of how to use the MS® OS/2 functions, types, and data structures to carry out useful
tasks, and illustrates these explanations with program samples that you can compile and run with MS OS/2.

### 1.2 What You Need to Start

To start using this guide, you need the following:

+ Experience using MS OS/2
+ Experience writing C-language programs

The C programming language is the preferred development language for MS OS/2 programs. Many of the programming
features of MS OS/2 were designed with C and other high-level languages in mind. MS OS/2 programs can also be
developed in Pascal, FORTRAN, BASIC, and assembly language, but C is the most straightforward and easiest language
to use to access MS OS/2 functions. For this reason, all program samples in this guide are written in the C
programming language.

Before you start any development, you should review the *Microsoft Operating System/2 Programmer's Reference*.
The reference introduces the basic concepts of MS OS/2 and fully defines each MS OS/2 system function. Also, for
an explanation of what development tools you need to compile, link, and debug MS OS/2 programs, read the *Microsoft
Operating System/2 Programming Tools* manual.

### 1.3 What This Guide Covers

This guide shows how to use many features of MS OS/2. In particular, it shows how to do the following:

+ Use the file-system functions to open, read from, and write to files.
+ Use text-based video-input and -output functions to write text to and control the format of the system screen.
+ Use the mouse input functions to read events from the mouse, such as mouse motions and button clicks.
+ Use the keyboard-input functions to read characters and keystrokes from the system keyboard.
+ Use memory-allocation functions to allocate additional memory for your program.
+ Use process-control functions to start child processes and threads.

This guide does not cover some of the advanced features of MS OS/2. For example, it does not show how to use monitors,
dynamic linking, queues, subsystem registration, or national-language code-page support. However, there are several
MS OS/2 sample programs provided with the *MS OS/2 Programmer's Toolkit* that do illustrate these features.

### 1.4 The Lqh Sample Program

This guide shows how to build a sample program similar to the QuickHelp on-line help program provided with the MS OS/2
Programmer's Toolkit. Chapter 7, "Lqh: A Sample Program," contains an overview of the **lqh** source and an explanation
of how the MS OS/2 functions are used in the program.

The **lqh** source files are provided on disk.

### 1.5 MS OS/2 Sample Programs

In addition to the **lqh** program presented in this guide, there are many additional sample program sources on the disks
provided with the MS OS/2 Programmer's Toolkit.  These small sample programs demonstrate the features of MS OS/2,
including features not described in this guide, such as monitors, dynamic linking, queues, and binding.

The following list briefly describes the MS OS/2 sample programs included in the MS OS/2 Programmer's Toolkit:

**Program**   | **Description**
:------------ | :-------------
alloc         | Allocates memory (bound).
argument      | Passes parameters to threads.
asmexmpl      | Creates and manages threads in assembly language.
asyncio       | Shows how to use asynchronous input and output functions to write to the screen.
beepc         | Beeps the speaker (bound).
config        | Displays the machine configuration (bound).
country       | Displays the current country information (bound).
critsec       | Uses a critical section to prevent conflict between two threads that are using the **printf** function.
csalias       | Creates alias code segments.
cwait         | Waits for a child process to exit.
datetime      | Prints the date and time (bound).
dosexit       | Uses the **DosExit** function to exit threads.
dynlink       | Shows how to create C and assembly-language dynamic­link libraries (bound).
exitlist      | Sets up an exit routine and then exits.
fsinfo        | Gets and sets volume information for drive A (bound).
getenv        | Prints the first element of the environment (bound).
hello         | Writes "Hello, world" to the screen (bound).
huge          | Allocates "huge" memory (bound).
infoseg       | Prints information about a process.
iopl          | Gets and displays the current cursor position.
keys          | Prints keycodes by using the **KbdCharIn** function (bound).
kill          | Uses the **DosKillProcess** function to terminate a thread.
machmode      | Displays the machine mode (bound).
monitors      | Registers and terminates monitors.
move          | Moves files (bound).
pipes         | Uses pipes.
qhtype        | Opens  les and prints out handle information (bound).
queues        | Uses queues to transfer data between consumer and server processes.
realloc       | Increases and decreases the size of a segment.
session       | Uses the session-manager functions.
setmaxfh      | Sets the maximum number of file handles to 30.
setvec        | Modifies the interrupt-vector table (bound).
share         | Passes keystrokes between processes that are using shared memory.
signal        | Uses a signal handler to catch the CONTROL+C key (bound).
sleep         | Sleeps for a while (bound).
suballoc      | Uses the suballocation functions (bound).
suspend       | Suspends and resumes a thread.
threads       | Creates and manages threads.
timer         | Sleeps and then beeps three times.
version       | Prints the DOS version (bound).
vioreg        | Registers a Vio subsystem.

The following sample programs are extended examples that combine many of the features illustrated in the previous
samples:

**Program**   | **Description**
:------------ | :-------------
terminal      | Emulates a terminal and can be used with a direct connection to a host or through a Hayes modem.
sse           | Edits text (bound).
cpgrep        | Searches strings, using threads to make the speed of the search as fast possible.
ds            | Displays and moves directory trees, and creates and uses an initialization file in the directory specified by the environment variable USER.
filelist      | Lists files in a directory (bound).
life          | Demonstrates how to use the the mouse interface in a bound program (bound).
mandel        | Displays the Mandelbrot set, using EGA high-resolution graphics.
bigben        | Displays a digital clock, demonstrating the Vio functions (bound).
setega        | Sets 25/43-line mode (bound).
chaser        | Demonstrates the use of threads (requires a mouse).

### 1.6 MS OS/2 and the C Run-time Library

Many of the sample programs included in the MS OS/2 Programmer's Toolkit combine both MS OS/2 and C run-time functions
to carry out their tasks.  Although you can use C run-time functions in MS OS/2 programs, the program samples in this
guide use MS OS/2 functions exclusively.

In general, there are no special restrictions on using C run-time functions, as long as you use the appropriate version
of the C run-time library.  For more information about using C run-time functions with MS OS/2 programs, see the
*Microsoft C Optimizing Compiler Version 5.1 Update*.
