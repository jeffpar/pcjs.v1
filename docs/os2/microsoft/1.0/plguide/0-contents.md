---
layout: page
title: "Microsoft OS/2 Programmer's Learning Guide"
permalink: /docs/os2/microsoft/1.0/plguide/
---

Programmer's Toolkit
---

Programmer's Learning Guide
---

Version 1.0
---

### Contents

* 1.0 [Introduction](/docs/os2/microsoft/1.0/plguide/chapter1/)
	* 1.1 [Overview](/docs/os2/microsoft/1.0/plguide/chapter1/#overview)
	* 1.2 [What You Need to Start](/docs/os2/microsoft/1.0/plguide/chapter1/#what-you-need-to-start)
	* 1.3 [What This Guide Covers](/docs/os2/microsoft/1.0/plguide/chapter1/#what-this-guide-covers)
	* 1.4 [The Lqh Sample Program](/docs/os2/microsoft/1.0/plguide/chapter1/#the-lqh-sample-program)
	* 1.5 [MS OS/2 Sample Programs](/docs/os2/microsoft/1.0/plguide/chapter1/#ms-os2-sample-programs)
	* 1.6 [MS OS/2 and the C Run-time Library](/docs/os2/microsoft/1.0/plguide/chapter1/#ms-os2-and-the-c-run-time-library)
* 2.0 Overview
	* 2.1 Introduction
	* 2.2 Creating an MS OS/2 Program
	* 2.3 C-Language Header Files
	* 2.4 A Simple Program: Echoing the Command Line
	* 2.5 Using the MS OS/2 Naming Conventions
	* 2.6 Using Structures: Getting the Time of Day
	* 2.7 Using Bit Masks
	* 2.8 Sharing Resources: Playing a Tune
* 3.0 Input and Output
	* 3.1 Introduction
	* 3.2 Opening Files
	* 3.3 Reading and Writing to Files
	* 3.4 Creating a File
	* 3.5 Closing a File
	* 3.6 Standard Input and Output Files
	* 3.7 Redirecting Standard Files
	* 3.8 Wildcards in Filenames
	* 3.9 Asynchronous Reading and Writing
	* 3.10 Moving the File Pointer
	* 3.11 Redirecting Standard Files
	* 3.12 Devices
	* 3.13 Input and Output Control
* 4.0 Keyboard, Mouse, and Screen
	* 4.1 Introduction
	* 4.2 Reading Keystrokes
	* 4.3 Displaying a Character
	* 4.4 Writing a Character to a Specific Location
	* 4.5 Reading Extended ASCII Keys
	* 4.6 Using the Mouse
	* 4.7 Selecting the Events to be Queued
	* 4.8 Reading a String of Characters from the Keyboard
	* 4.9 Writing a String of Characters to the Screen
	* 4.10 Writing Character Cells to the Screen
	* 4.11 Moving and Hiding the Cursor
	* 4.12 Reading Characters from the Screen
	* 4.13 Scrolling the Screen
	* 4.14 Using the ANSI Display Mode
	* 4.15 Opening and Using Logical Keyboards
	* 4.16 Flushing the Keyboard Buffer
	* 4.17 Setting the Keyboard Input Mode
* 5.0 Memory Management
	* 5.1 Introduction
	* 5.2 Allocating and Using Segments
	* 5.3 General-Protection Faults and Segment Violations
	* 5.4 Reallocating a Segment
	* 5.5 Moving and Swapping
* 6.0 Processes and Threads
	* 6.1 Introduction
	* 6.2 Running an Asynchronous Child Process
	* 6.3 Waiting for a Child Process to End
	* 6.4 Retrieving the Termination Status of a Child Process
	* 6.5 Ending a Process
	* 6.6 Terminating a Process
	* 6.7 Cleaning Up Before Ending a Process
	* 6.8 Creating a Thread
	* 6.9 Controlling the Execution of a Thread
	* 6.10 Changing the Priority of a Process
* 7.0 Lqh: A Sample Program
	* 7.1 Introduction
	* 7.2 Lqh Files
	* 7.3 About the Microsoft Help Library
	* 7.4 The Lqh Program
	* 7.5 The Lqhbox Dynamic-Link Library

---

This is a Markdown conversion of the document entitled:

>Microsoft® Operating System/2

>Programmer's Toolkit

>Programmer's Learning Guide

>Version 1.0

That document includes the following copyright and trademark information:

>Information in this document is subject to change without notice and does not represent a commitment on the part
of Microsoft Corporation. The software and/or databases described in this document are furnished under a license
agreement or nondisclosure agreement. The software and/or databases may be used or copied only in accordance with
the terms of the agreement. The purchaser may make one copy of the software for backup purposes. No part of this
manual and/or database may be reproduced or transmitted in any form or by any means, electronic or mechanical,
including photocopying, recording, or information storage and retrieval systems, for any purpose other than the
purchaser's personal use, without the written permission of Microsoft Corporation.
	
>© Copyright Microsoft Corporation, 1988. All rights reserved. Simultaneously published in the U.S. and Canada.
	
>Microsoft®, MS®, and the Microsoft logo are registered trademarks of Microsoft Corporation.
	
>Intel® is a registered trademark of Intel Corporation.
	
>Hayes® is a registered trademark of Hayes Microcomputer Products, Inc.
	
>Document No. 060060004-100-R00-0388
