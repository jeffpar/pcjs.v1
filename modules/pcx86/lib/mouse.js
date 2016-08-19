/**
 * @fileoverview Implements the PCx86 Mouse component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Jul-01
 *
 * Copyright © 2012-2016 Jeff Parsons <Jeff@pcjs.org>
 *
 * This file is part of PCjs, a computer emulation software project at <http://pcjs.org/>.
 *
 * PCjs is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * PCjs is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with PCjs.  If not,
 * see <http://www.gnu.org/licenses/gpl.html>.
 *
 * You are required to include the above copyright notice in every source code file of every
 * copy or modified version of this work, and to display that copyright notice on every screen
 * that loads or runs any version of this software (see COPYRIGHT in /modules/shared/lib/defines.js).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

if (NODE) {
    var str         = require("../../shared/lib/strlib");
    var web         = require("../../shared/lib/weblib");
    var Component   = require("../../shared/lib/component");
    var State       = require("../../shared/lib/state");
    var PCX86       = require("./defines");
    var Messages    = require("./messages");
    var SerialPort  = require("./serialport");
}

/**
 * Mouse(parmsMouse)
 *
 * The Mouse component has the following component-specific (parmsMouse) properties:
 *
 *      serial: the ID of the corresponding serial component
 *
 * Since the first version of this component supports ONLY emulation of the original Microsoft
 * serial mouse, a valid serial component ID is required.  It's possible that future versions
 * of this component may support other types of simulated hardware (eg, the Microsoft InPort
 * bus mouse adapter), or a virtual driver interface that would eliminate the need for any
 * intermediate hardware simulation (at the expense of writing an intermediate software layer or
 * virtual driver for each supported operating system).  However, those possibilities are extremely
 * unlikely in the near term.
 *
 * If the 'serial' property is specified, then communication will be established with the
 * SerialPort component, requesting access to the corresponding serial component ID.  If the
 * SerialPort component is not installed and/or the specified serial component ID is not present,
 * a configuration error will be reported.
 *
 * TODO: Just out of curiosity, verify that the Microsoft Bus Mouse used ports 0x23D and 0x23F,
 * because I saw Windows v1.01 probing those ports immediately prior to probing COM2 (and then COM1)
 * for a serial mouse.
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsMouse
 */
function Mouse(parmsMouse)
{
    Component.call(this, "Mouse", parmsMouse, Mouse, Messages.MOUSE);

    this.idAdapter = parmsMouse['serial'];
    if (this.idAdapter) {
        this.sAdapterType = "SerialPort";
    }
    this.setActive(false);
    this.fCaptured = this.fLocked = false;

    /*
     * Initially, no video devices, and therefore no input devices, are attached.  initBus() will update aVideo,
     * and powerUp() will update aInput.
     */
    this.aVideo = [];
    this.aInput = [];
    this.setReady();
}

/*
 * From http://paulbourke.net/dataformats/serialmouse:
 *
 *      The old MicroSoft serial mouse, while no longer in general use, can be employed to provide a low cost input device,
 *      for example, coupling the internal mechanism to other moving objects. The serial protocol for the mouse is:
 *
 *          1200 baud, 7 bit, 1 stop bit, no parity.
 *
 *      The pinout of the connector follows the standard serial interface, as shown below:
 *
 *          Pin     Abbr    Description
 *          1       DCD     Data Carrier Detect
 *          2       RD      Receive Data            [serial data from mouse to host]
 *          3       TD      Transmit Data
 *          4       DTR     Data Terminal Ready     [used to provide positive voltage to mouse, plus reset/detection]
 *          5       SG      Signal Ground
 *          6       DSR     Data Set Ready
 *          7       RTS     Request To Send         [used to provide positive voltage to mouse]
 *          8       CTS     Clear To Send
 *          9       RI      Ring
 *
 *      Every time the mouse changes state (moved or button pressed) a three byte "packet" is sent to the serial interface.
 *      For reasons known only to the engineers, the data is arranged as follows, most notably the two high order bits for the
 *      x and y coordinates share the first byte with the button status.
 *
 *                      D6  D5  D4  D3  D2  D1  D0
 *          1st byte    1   LB  RB  Y7  Y6  X7  X6
 *          2nd byte    0   X5  X4  X3  X2  X1  X0
 *          3rd byte    0   Y5  Y4  Y3  Y2  Y1  Y0
 *
 *      where:
 *
 *          LB is the state of the left button, 1 = pressed, 0 = released.
 *          RB is the state of the right button, 1 = pressed, 0 = released
 *          X0-7 is movement of the mouse in the X direction since the last packet. Positive movement is toward the right.
 *          Y0-7 is movement of the mouse in the Y direction since the last packet. Positive movement is back, toward the user.
 *
 * From http://www.kryslix.com/nsfaq/Q.12.html:
 *
 *      The Microsoft serial mouse is the most popular 2-button mouse. It is supported by all major operating systems.
 *      The maximum tracking rate for a Microsoft mouse is 40 reports/second * 127 counts per report, in other words, 5080 counts
 *      per second. The most common range for mice is is 100 to 400 CPI (counts per inch) but can be up to 1000 CPI. A 100 CPI mouse
 *      can discriminate motion up to 50.8 inches/second while a 400 CPI mouse can only discriminate motion up to 12.7 inches/second.
 *
 *          9-pin  25-pin    Line    Comments
 *          shell  1         GND
 *          3      2         TD      Serial data from host to mouse (only for power)
 *          2      3         RD      Serial data from mouse to host
 *          7      4         RTS     Positive voltage to mouse
 *          8      5         CTS
 *          6      6         DSR
 *          5      7         SGND
 *          4      20        DTR     Positive voltage to mouse and reset/detection
 *
 *      To function correctly, both the RTS and DTR lines must be positive. DTR/DSR and RTS/CTS must NOT be shorted.
 *      RTS may be toggled negative for at least 100ms to reset the mouse. (After a cold boot, the RTS line is usually negative.
 *      This provides an automatic toggle when RTS is brought positive). When DTR is toggled the mouse should send a single byte
 *      (0x4D, ASCII 'M').
 *
 *      Serial data parameters: 1200bps, 7 data bits, 1 stop bit
 *
 *      Data is sent in 3 byte packets for each event (a button is pressed or released, or the mouse moves):
 *
 *                  D7  D6  D5  D4  D3  D2  D1  D0
 *          Byte 1  X   1   LB  RB  Y7  Y6  X7  X6
 *          Byte 2  X   0   X5  X4  X3  X2  X1  X0
 *          Byte 3  X   0   Y5  Y4  Y3  Y2  Y1  Y0
 *
 *      LB is the state of the left button (1 means down).
 *      RB is the state of the right button (1 means down).
 *      X7-X0 movement in X direction since last packet (signed byte).
 *      Y7-Y0 movement in Y direction since last packet (signed byte).
 *      The high order bit of each byte (D7) is ignored. Bit D6 indicates the start of an event, which allows the software to
 *      synchronize with the mouse.
 */

Component.subclass(Mouse);

Mouse.ID_SERIAL = 0x4D;

Mouse.BUTTON = {
    LEFT:   0,
    RIGHT:  2
};

/**
 * initBus(cmp, bus, cpu, dbg)
 *
 * @this {Mouse}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {X86CPU} cpu
 * @param {Debugger} dbg
 */
Mouse.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.cmp = cmp;
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    /*
     * Attach the Video component to the CPU, so that the CPU can periodically update
     * the video display via updateVideo(), as cycles permit.
     */
    for (var video = null; (video = cmp.getMachineComponent("Video", video));) {
        this.aVideo.push(video);
    }
};

/**
 * isActive()
 *
 * @this {Mouse}
 * @return {boolean} true if active, false if not
 */
Mouse.prototype.isActive = function()
{
    return this.fActive && (this.cpu? this.cpu.isRunning() : false);
};

/**
 * setActive(fActive)
 *
 * @this {Mouse}
 * @param {boolean} fActive is true if active, false if not
 */
Mouse.prototype.setActive = function(fActive)
{
    this.fActive = fActive;
    /*
     * It's currently not possible to automatically lock the pointer outside the context of a user action
     * (eg, a button or screen click), so this code is for naught.
     *
     *      if (this.aVideo.length) this.aVideo[0].notifyPointerActive(fActive);
     *
     * We now rely on similar code in clickMouse().
     */
};

/**
 * powerUp(data, fRepower)
 *
 * @this {Mouse}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
Mouse.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) {
        if (!data || !this.restore) {
            this.reset();
        } else {
            if (!this.restore(data)) return false;
        }
        if (this.sAdapterType && !this.componentAdapter) {
            var componentAdapter = null;
            while ((componentAdapter = this.cmp.getMachineComponent(this.sAdapterType, componentAdapter))) {
                if (componentAdapter.attachMouse) {
                    this.componentAdapter = componentAdapter.attachMouse(this.idAdapter, this);
                    if (this.componentAdapter) {
                        /*
                         * It's possible that the SerialPort we've just attached to might want to bring us "up to speed"
                         * on the adapter's state, which is why I envisioned a subsequent syncMouse() call.  And you would
                         * want to do that as a separate call, not as part of attachMouse(), because componentAdapter
                         * isn't set until attachMouse() returns.
                         *
                         * However, syncMouse() seems unnecessary, given that SerialPort initializes its MCR to an "inactive"
                         * state, and even when restoring a previous state, if we've done our job properly, both SerialPort
                         * and Mouse should be restored in sync, making any explicit attempt at sync'ing unnecessary (or so I hope).
                         */
                        // this.componentAdapter.syncMouse();
                        break;
                    }
                }
            }
            if (this.componentAdapter) {
                this.aInput = [];       // ensure the input device array is empty before (re)filling it
                for (var i = 0; i < this.aVideo.length; i++) {
                    var input = this.aVideo[i].getInput(this);
                    if (input) this.aInput.push(input);
                }
            } else {
                Component.warning(this.id + ": " + this.sAdapterType + " " + this.idAdapter + " unavailable");
            }
        }
        if (this.fActive) {
            this.captureAll();
        } else {
            this.releaseAll();
        }
    }
    return true;
};

/**
 * powerDown(fSave, fShutdown)
 *
 * @this {Mouse}
 * @param {boolean} [fSave]
 * @param {boolean} [fShutdown]
 * @return {Object|boolean} component state if fSave; otherwise, true if successful, false if failure
 */
Mouse.prototype.powerDown = function(fSave, fShutdown)
{
    return fSave? this.save() : true;
};

/**
 * reset()
 *
 * @this {Mouse}
 */
Mouse.prototype.reset = function()
{
    this.initState();
};

/**
 * save()
 *
 * This implements save support for the Mouse component.
 *
 * @this {Mouse}
 * @return {Object}
 */
Mouse.prototype.save = function()
{
    var state = new State(this);
    state.set(0, this.saveState());
    return state.data();
};

/**
 * restore(data)
 *
 * This implements restore support for the Mouse component.
 *
 * @this {Mouse}
 * @param {Object} data
 * @return {boolean} true if successful, false if failure
 */
Mouse.prototype.restore = function(data)
{
    return this.initState(data[0]);
};

/**
 * initState(data)
 *
 * @this {Mouse}
 * @param {Array} [data]
 * @return {boolean} true if successful, false if failure
 */
Mouse.prototype.initState = function(data)
{
    var i = 0;
    if (data === undefined) data = [false, -1, -1, 0, 0, false, false, 0];
    this.setActive(data[i++]);
    this.xMouse = data[i++];
    this.yMouse = data[i++];
    this.xDelta = data[i++];
    this.yDelta = data[i++];
    this.fButton1 = data[i++];      // FYI, we consider button1 to be the LEFT button
    this.fButton2 = data[i++];      // FYI, we consider button2 to be the RIGHT button
    this.bMCR = data[i];
    return true;
};

/**
 * saveState()
 *
 * @this {Mouse}
 * @return {Array}
 */
Mouse.prototype.saveState = function()
{
    var i = 0;
    var data = [];
    data[i++] = this.fActive;
    data[i++] = this.xMouse;
    data[i++] = this.yMouse;
    data[i++] = this.xDelta;
    data[i++] = this.yDelta;
    data[i++] = this.fButton1;
    data[i++] = this.fButton2;
    data[i] = this.bMCR;
    return data;
};

/**
 * notifyPointerLocked()
 *
 * @this {Mouse}
 * @param {boolean} fLocked
 */
Mouse.prototype.notifyPointerLocked = function(fLocked)
{
    this.fLocked = fLocked;
};

/**
 * captureAll()
 *
 * @this {Mouse}
 */
Mouse.prototype.captureAll = function()
{
    if (!this.fCaptured) {
        for (var i = 0; i < this.aInput.length; i++) {
            if (this.captureMouse(this.aInput[i])) this.fCaptured = true;
        }
    }
};

/**
 * releaseAll()
 *
 * @this {Mouse}
 */
Mouse.prototype.releaseAll = function()
{
    if (this.fCaptured) {
        for (var i = 0; i < this.aInput.length; i++) {
            if (this.releaseMouse(this.aInput[i])) this.fCaptured = false;
        }
    }
};

/**
 * captureMouse(control)
 *
 * NOTE: addEventListener() wasn't supported in Internet Explorer until IE9, but that's OK, because
 * IE9 is the oldest IE we support anyway (since versions prior to IE9 lack the necessary HTML5 support).
 *
 * @this {Mouse}
 * @param {Object} control from the HTML DOM (eg, the control for the simulated screen)
 * @return {boolean} true if event handlers were actually added, false if not
 */
Mouse.prototype.captureMouse = function(control)
{
    if (control) {
        var mouse = this;
        control.addEventListener(
            'mousemove',
            function onMouseMove(event) {
                mouse.processMouseEvent(event);
            },
            false               // we'll specify false for the 'useCapture' parameter for now...
        );
        control.addEventListener(
            'mousedown',
            function onMouseDown(event) {
                mouse.processMouseEvent(event, true);
            },
            false               // we'll specify false for the 'useCapture' parameter for now...
        );
        control.addEventListener(
            'mouseup',
            function onMouseUp(event) {
                mouse.processMouseEvent(event, false);
            },
            false               // we'll specify false for the 'useCapture' parameter for now...
        );
        /*
         * None of these tricks seemed to work for IE10, so I'm giving up hiding the browser's mouse pointer in IE for now.
         *
         *      control['style']['cursor'] = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjbQg61aAAAADUlEQVQYV2P4//8/IwAI/QL/+TZZdwAAAABJRU5ErkJggg=='), url('/versions/images/current/blank.cur'), none";
         *
         * Setting the cursor style to "none" may not be a standard, but it works in Safari, Firefox and Chrome, so that's pretty
         * good for a non-standard!
         *
         * TODO: The reference to '/versions/images/current/blank.cur' is also problematic for anyone who might want
         * to run this app from a different server, so think about that as well.
         */
        control['style']['cursor'] = "none";
        return true;
    }
    return false;
};

/**
 * releaseMouse(control)
 *
 * TODO: Use removeEventListener() to clean up our handlers; since I'm currently using anonymous functions,
 * and since I'm not seeing any compelling reason to remove the handlers once they've been established, it's
 * less code to leave them in place.
 *
 * @this {Mouse}
 * @param {Object} control from the HTML DOM
 * @return {boolean} true if event handlers were actually released, false if not
 */
Mouse.prototype.releaseMouse = function(control)
{
    if (control) {
        control['style']['cursor'] = "auto";
    }
    return false;
};

/**
 * processMouseEvent(event, fDown)
 *
 * @this {Mouse}
 * @param {Object} event object from a 'mousemove', 'mousedown' or 'mouseup' event (specifically, a MouseEvent object)
 * @param {boolean} [fDown] (undefined if neither a down nor up event)
 */
Mouse.prototype.processMouseEvent = function(event, fDown)
{
    if (fDown !== undefined) {
        if (this.fLocked === false) {
            /*
             * If there's no support for automatic pointer locking in the Video component, then notifyPointerActive()
             * will return false, and we will set fLocked to null, ensuring that we never attempt this again.
             */
            if (!this.aVideo.length || !this.aVideo[0].notifyPointerActive(true)) {
                this.fLocked = null;
            }
        }
        this.clickMouse(event.button, fDown);
    } else {
        /*
         * MouseEvent objects contain, among other things, the following properties:
         *
         *      clientX
         *      clientY
         *
         * I've selected the above properties because they're widely supported, not because I need
         * client-area coordinates.  In fact, layerX and layerY are probably closer to what I really want,
         * but I don't think they're available in all browsers.  screenX and screenY would work as well.
         *
         * This is because all we care about are deltas.  We record clientX and clientY (as xMouse and yMouse)
         * merely to calculate xDelta and yDelta.
         */
        var xDelta, yDelta;
        if (this.xMouse < 0 || this.yMouse < 0) {
            this.xMouse = event.clientX;
            this.yMouse = event.clientY;
        }
        if (this.fLocked) {
            xDelta = event['movementX'] || event['mozMovementX'] || event['webkitMovementX'] || 0;
            yDelta = event['movementY'] || event['mozMovementY'] || event['webkitMovementY'] || 0;
        } else {
            xDelta = event.clientX - this.xMouse;
            yDelta = event.clientY - this.yMouse;
        }
        this.xMouse = event.clientX;
        this.yMouse = event.clientY;
        this.moveMouse(xDelta, yDelta, this.xMouse, this.yMouse);
    }
};

/**
 * clickMouse(iButton, fDown)
 *
 * @this {Mouse}
 * @param {number} iButton is Mouse.BUTTON.LEFT (0) for fButton1, Mouse.BUTTON.RIGHT (2) for fButton2
 * @param {boolean} fDown
 */
Mouse.prototype.clickMouse = function(iButton, fDown)
{
    if (this.isActive()) {
        var sDiag = DEBUGGER? ("mouse button" + iButton + ' ' + (fDown? "dn" : "up")) : null;
        switch (iButton) {
        case Mouse.BUTTON.LEFT:
            if (this.fButton1 != fDown) {
                this.fButton1 = fDown;
                this.sendPacket(sDiag);
                return;
            }
            break;
        case Mouse.BUTTON.RIGHT:
            if (this.fButton2 != fDown) {
                this.fButton2 = fDown;
                this.sendPacket(sDiag);
                return;
            }
            break;
        default:
            break;
        }
        this.printMessage(sDiag + ": ignored");
    }
};

/**
 * moveMouse(xDelta, yDelta, xDiag, yDiag)
 *
 * @this {Mouse}
 * @param {number} xDelta
 * @param {number} yDelta
 * @param {number} [xDiag]
 * @param {number} [yDiag]
 */
Mouse.prototype.moveMouse = function(xDelta, yDelta, xDiag, yDiag)
{
    if (this.isActive()) {
        if (xDelta || yDelta) {
            /*
             * As sendPacket() indicates, any x and y coordinates we supply are for diagnostic purposes only.
             * sendPacket() only cares about the xDelta and yDelta properties we provide above, which it then zeroes
             * on completion.
             */
            this.xDelta = xDelta;
            this.yDelta = yDelta;
            this.sendPacket(null, xDiag, yDiag);
        }
    }
};

/**
 * sendPacket(sDiag, xDiag, yDiag)
 *
 * If we're called, something changed.
 *
 * Let's review the 3-byte packet format:
 *
 *              D7  D6  D5  D4  D3  D2  D1  D0
 *      Byte 1  X   1   LB  RB  Y7  Y6  X7  X6
 *      Byte 2  X   0   X5  X4  X3  X2  X1  X0
 *      Byte 3  X   0   Y5  Y4  Y3  Y2  Y1  Y0
 *
 * @this {Mouse}
 * @param {string|null} [sDiag] diagnostic message
 * @param {number} [xDiag] original x-coordinate (optional; for diagnostic use only)
 * @param {number} [yDiag] original y-coordinate (optional; for diagnostic use only)
 */
Mouse.prototype.sendPacket = function(sDiag, xDiag, yDiag)
{
    var b1 = 0x40 | (this.fButton1? 0x20 : 0) | (this.fButton2? 0x10 : 0) | ((this.yDelta & 0xC0) >> 4) | ((this.xDelta & 0xC0) >> 6);
    var b2 = this.xDelta & 0x3F;
    var b3 = this.yDelta & 0x3F;
    if (this.messageEnabled(Messages.SERIAL)) {
        this.printMessage((sDiag? (sDiag + ": ") : "") + (yDiag !== undefined? ("mouse (" + xDiag + "," + yDiag + "): ") : "") + "serial packet [" + str.toHexByte(b1) + "," + str.toHexByte(b2) + "," + str.toHexByte(b3) + "]", 0, true);
    }
    this.componentAdapter.receiveData([b1, b2, b3]);
    this.xDelta = this.yDelta = 0;
};

/**
 * notifyMCR(bMCR)
 *
 * The SerialPort notifies us whenever SerialPort.MCR.DTR or SerialPort.MCR.RTS changes.
 *
 * During normal serial mouse operation, both RTS and DTR must be "positive".
 *
 * Setting RTS "negative" for 100ms resets the mouse.  Toggling DTR requests an identification byte (ID_SERIAL).
 *
 * NOTES: The above 3rd-party information notwithstanding, I've observed that Windows v1.01 initially writes 0x01
 * to the MCR (DTR on, RTS off), spins in a loop that reads the RBR (probably to avoid a bogus identification byte
 * sitting in the RBR), and then writes 0x0B to the MCR (DTR on, RTS on).  This last step is consistent with making
 * the mouse "active", but it is NOT consistent with "toggling DTR", so I conclude that a reset is ALSO sufficient
 * for sending the identification byte.  Right or wrong, this gets the ball rolling for Windows v1.01.
 *
 * @this {Mouse}
 * @param {number} bMCR
 */
Mouse.prototype.notifyMCR = function(bMCR)
{
    var fActive = ((bMCR & (SerialPort.MCR.DTR | SerialPort.MCR.RTS)) == (SerialPort.MCR.DTR | SerialPort.MCR.RTS));
    if (fActive) {
        if (!this.fActive) {
            var fIdentify = false;
            if (!(this.bMCR & SerialPort.MCR.RTS)) {
                this.reset();
                this.printMessage("serial mouse reset");
                fIdentify = true;
            }
            if (!(this.bMCR & SerialPort.MCR.DTR)) {
                this.printMessage("serial mouse ID requested");
                fIdentify = true;
            }
            if (fIdentify) {
                /*
                 * HEADS UP: Everything I'd read about the (original) Microsoft Serial Mouse "reset" protocol says
                 * that the device sends a single byte (0x4D aka 'M').  It's not surprising to think that newer mice
                 * might send additional bytes, but you would think that newer mouse drivers (eg, MOUSE.COM v8.20)
                 * would always be able to deal with mice that sent only one byte.
                 *
                 * You would be wrong.  On an INT 0x33 reset, the v8.20 driver looks for an 'M', then it waits for
                 * another byte (0x42 aka 'B').  If it doesn't receive a 'B', it will accept another 'M'.  But if it
                 * receives something else (or nothing at all), it will spend a long time waiting for it, and then
                 * return an error.
                 *
                 * It's entirely possible that I've done something wrong and inadvertently "tricked" MOUSE.COM into
                 * using the wrong detection logic.  But given the other problems I've seen in MOUSE.COM v8.20, including
                 * its failure to properly terminate-and-stay-resident when its initial INT 0x33 reset returns an error,
                 * I'm not in the mood to give it the benefit of the doubt.
                 *
                 * So, anyway, I solve the terminate-and-stay-resident bug in MOUSE.COM v8.20 by feeding it *two* ID_SERIAL
                 * bytes on a reset.  This doesn't seem to adversely affect serial mouse emulation for Windows 1.01, so
                 * I'm calling this good enough for now.
                 */
                this.componentAdapter.receiveData([Mouse.ID_SERIAL, Mouse.ID_SERIAL]);
                this.printMessage("serial mouse ID sent");
            }
            this.captureAll();
            this.setActive(fActive);
        }
    } else {
        if (this.fActive) {
            /*
             * Although this would seem nice (ie, for the Windows v1.01 mouse driver to turn RTS off when its mouse
             * driver shuts down and Windows exits, since it DID turn RTS on), that doesn't appear to actually happen.
             * At the very least, Windows will have (re)masked the serial port's IRQ, so what does it matter?  Not much,
             * I just would have preferred that fActive properly reflect whether we should continue dispatching mouse
             * events, displaying MOUSE messages, etc.
             *
             * We could ask the ChipSet component to notify the SerialPort component whenever its IRQ is masked/unmasked,
             * and then have the SerialPort pass that notification on to us, but I'm assuming that in the real world,
             * a mouse device that's still powered may still send event data to the serial port, and if there was software
             * polling the serial port, it might expect to see that data.  Unlikely, but not impossible.
             */
            this.printMessage("serial mouse inactive");
            this.releaseAll();
            this.setActive(fActive);
        }
    }
    this.bMCR = bMCR;
};

/**
 * Mouse.init()
 *
 * This function operates on every HTML element of class "mouse", extracting the
 * JSON-encoded parameters for the Mouse constructor from the element's "data-value"
 * attribute, invoking the constructor to create a Mouse component, and then binding
 * any associated HTML controls to the new component.
 */
Mouse.init = function()
{
    var aeMouse = Component.getElementsByClass(document, PCX86.APPCLASS, "mouse");
    for (var iMouse = 0; iMouse < aeMouse.length; iMouse++) {
        var eMouse = aeMouse[iMouse];
        var parmsMouse = Component.getComponentParms(eMouse);
        var mouse = new Mouse(parmsMouse);
        Component.bindComponentControls(mouse, eMouse, PCX86.APPCLASS);
    }
};

/*
 * Initialize every Mouse module on the page.
 */
web.onInit(Mouse.init);

if (NODE) module.exports = Mouse;
