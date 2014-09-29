/**
 * @fileoverview Implements the PCjs ChipSet component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * @suppress {missingProperties}
 * Created 2012-Sep-14
 *
 * Copyright © 2012-2014 Jeff Parsons <Jeff@pcjs.org>
 *
 * This file is part of PCjs, which is part of the JavaScript Machines Project (aka JSMachines)
 * at <http://jsmachines.net/> and <http://pcjs.org/>.
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
 * that loads or runs any version of this software (see Computer.sCopyright).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * PCjs program for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

"use strict";

if (typeof module !== 'undefined') {
    var str = require("../../shared/lib/strlib");
    var usr = require("../../shared/lib/usrlib");
    var web = require("../../shared/lib/weblib");
    var Component = require("../../shared/lib/component");
    var State = require("./state");
}

/**
 * ChipSet(parmsChipSet)
 *
 * The ChipSet component has the following component-specific (parmsChipSet) properties:
 *
 *      model:          "5150", "5160", "5170", etc (should correspond to a ChipSet.MODEL_* constant)
 *      scaleTimers:    true to divide timer cycle counts by the CPU's cycle multiplier (default is false)
 *      sound:          true to enable (experimental) sound support (default); false to disable
 *      sw1:            8-character binary string representing the SW1 DIP switches (SW1[1-8])
 *      sw2:            8-character binary string representing the SW2 DIP switches (SW2[1-8]) (MODEL_5150 only)
 *      rtcDate:        optional RTC date to be used on resets; use the ISO 8601 format; eg: "2011-10-10T14:48:00"
 *
 * The conventions used for the sw1 and sw2 strings are that the left-most character represents DIP switch [1],
 * the right-most character represents DIP switch [8], and "1" means the DIP switch is ON and "0" means it is OFF.
 * 
 * Internally, we convert the above strings into binary values that the 8255A PPI returns, where DIP switch [1]
 * is bit 0 and DIP switch [8] is bit 7, and 0 indicates the switch is ON and 1 indicates it is OFF.
 *
 * For reference, here's how the SW1 and SW2 switches correspond to the internal 8255A PPI bit values:
 *
 *      SW1[1]    (bit 0)     "0xxxxxxx" (1):  IPL,  "1xxxxxxx" (0):  No IPL
 *      SW1[2]    (bit 1)     reserved
 *      SW1[3,4]  (bits 3-2)  "xx11xxxx" (00): 16Kb, "xx10xxxx" (01): 32Kb,  "xx01xxxx" (10): 48Kb,  "xx00xxxx" (11): 64Kb
 *      SW1[5,6]  (bits 5-4)  "xxxx11xx" (00): none, "xxxx10xx" (01): CGA40, "xxxx01xx" (10): CGA80, "xxxx00xx" (11): MDA80
 *      SW1[7,8]  (bits 7-6)  "xxxxxx11" (00): 1 FD, "xxxxxx10" (01): 2 FD,  "xxxxxx01" (10): 3 FD,  "xxxxxx00" (11): 4 FD
 *      
 * Note: FD refers to floppy drive, and IPL refers to an "Initial Program Load" floppy drive.
 *
 *      SW2[1-4]    (bits 3-0)  "NNNNxxxx": number of 32Kb blocks of I/O expansion RAM present
 *
 * TODO: There are cryptic references to SW2[5] in the original (5150) TechRef, and apparently the 8255A PPI can
 * be programmed to return it (which we support), but its purpose is unclear to me (see PPI_B_ENABLE_SW2).
 *
 * For example, sw1="01110011" indicates that all SW1 DIP switches are ON, except for SW1[1], SW1[5] and SW1[6],
 * which are OFF. Internally, the order of these bits must reversed (to 11001110) and then inverted (to 00110001)
 * to yield the value that the 8255A PPI returns. Reading the final value right-to-left, 00110001 indicates an
 * IPL floppy drive, 1X of RAM (where X is 16Kb on a MODEL_5150 and 64Kb on a MODEL_5160), MDA, and 1 floppy drive.
 *
 * WARNING: It is possible to set SW1 to indicate more memory than the RAM component has been configured to provide.
 * This is a configuration error which will cause the machine to crash after reporting a "201" error code (memory
 * test failure), which is presumably what a real machine would do if it was similarly misconfigured.  Surprisingly,
 * the BIOS forges ahead, setting SP to the top of the memory range indicated by SW1 (via INT 0x12), but the lack of
 * a valid stack causes the system to crash after the next IRET.  The BIOS should have either halted or modified
 * the actual memory size to match the results of the memory test.
 *
 * This component provides support for many of the following components (except where a separate component is noted).
 * This list is taken from p.1-8 ("System Unit") of the IBM 5160 (PC XT) Technical Reference Manual (as revised
 * April 1983), only because I didn't see a similar listing in the original 5150 TechRef.
 *
 *      Port(s)         Description
 *      -------         -----------
 *      000-00F         DMA Chip 8237A-5                                [see below]
 *      020-021         Interrupt 8259A                                 [see below]
 *      040-043         Timer 8253-5                                    [see below]
 *      060-063         PPI 8255A-5                                     [see below]
 *      080-083         DMA Page Registers                              [see below]
 *          0Ax [1]     NMI Mask Register                               [see below]
 *          0Cx         Reserved
 *          0Ex         Reserved
 *      200-20F         Game Control
 *      210-217         Expansion Unit
 *      220-24F         Reserved
 *      278-27F         Reserved
 *      2F0-2F7         Reserved
 *      2F8-2FF         Asynchronous Communications (Secondary)         [see the SerialPort component]
 *      300-31F         Prototype Card
 *      320-32F         Hard Drive Controller                           [see the HDC component]
 *      378-37F         Printer
 *      380-38C [2]     SDLC Communications
 *      380-389 [2]     Binary Synchronous Communications (Secondary)
 *      3A0-3A9         Binary Synchronous Communications (Primary)
 *      3B0-3BF         IBM Monochrome Display/Printer                  [see the Video component]
 *      3C0-3CF         Reserved
 *      3D0-3DF         Color/Graphics (Motorola 6845)                  [see the Video component]
 *      3EO-3E7         Reserved
 *      3FO-3F7         Floppy Drive Controller                         [see the FDC component]
 *      3F8-3FF         Asynchronous Communications (Primary)           [see the SerialPort component]
 *
 * [1] At power-on time, NMI is masked off, perhaps because models 5150 and 5160 also tie coprocessor
 * interrupts to NMI.  Suppressing NMI by default seems odd, because that would also suppress memory
 * parity errors.  TODO: Determine whether "power-on time" refers to the initial power-on state of the
 * NMI Mask Register or the state that the BIOS "POST" (Power-On Self-Test) sets.
 *
 * [2] These devices cannot be used together since their port addresses overlap.
 * 
 *      MODEL_5170      Description
 *      ----------      -----------
 *          070 [3]     CMOS Address                                    ChipSet.CMOS_ADDR.PORT
 *          071         CMOS Data                                       ChipSet.CMOS_DATA.PORT
 *          0F0         Coprocessor Clear Busy (output 0x00)
 *          0F1         Coprocessor Reset (output 0x00)
 *          
 * [3] Port 0x70 doubles as the NMI Mask Register: output a CMOS address with bit 7 clear to enable NMI
 * or with bit 7 set to disable NMI (apparently the inverse of the older NMI Mask Register at port 0xA0).
 * Also, apparently unlike previous models, the MODEL_5170 POST leaves NMI enabled.  And fortunately, the
 * coprocessor interrupt line is no longer tied to NMI (it uses IRQ 13).
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsChipSet
 */
function ChipSet(parmsChipSet)
{
    Component.call(this, "ChipSet", parmsChipSet, ChipSet);

    this.model = parmsChipSet['model'];
    this.model = (this.model !== undefined? parseInt(this.model, 10) : ChipSet.MODEL_5150);

    /*
     * Given that the ROM BIOS is hard-coded to load boot sectors @0000:7C00, the minimum amount of system RAM
     * required to boot is therefore 32Kb.  Whether that's actually enough to run any or all versions of PC-DOS is
     * a separate question.  FYI, with only 16Kb, the ROM BIOS will still try to boot, and fail miserably.
     */
    this.sw1Init = this.parseSwitches(parmsChipSet['sw1'], ChipSet.PPI_SW.MEMORY.X4 | ChipSet.PPI_SW.MONITOR.MDA);

    /*
     * SW2 describes the number of 32Kb blocks of I/O expansion RAM that's present in the system. The MODEL_5150 ROM BIOS
     * only checked/supported the first four switches, so the maximum amount of additional RAM specifiable was 15 * 32Kb,
     * or 480Kb.  With a maximum of 64Kb on the motherboard, the MODEL_5150 ROM BIOS could support a grand total of 544Kb.
     * 
     * For MODEL_5160 (PC XT) and up, memory expansion cards had their own configuration switches, and the motherboard SW2
     * switches for I/O expansion RAM were eliminated.  Instead, the ROM BIOS scans the entire address space (up to 0xA0000)
     * looking for additional memory.  As a result, the only mechanism we provide for adding RAM (above the maximum of 256Kb
     * supported on the motherboard) is the "size" parameter of the RAM component.  NOTE: If you use the "size" parameter,
     * you will not be able to dynamically alter the memory configuration; the RAM component will ignore any changes to SW1.
     */
    this.sw2Init = this.parseSwitches(parmsChipSet['sw2'], 0);

    /*
     * The SW1 memory switches specify a multiplier; the number of Kb that they multiply is model-dependent:
     * 16Kb on a MODEL_5150, 64Kb otherwise.
     */
    this.kbSW = (this.model == ChipSet.MODEL_5150? 16 : 64);

    this.cDMACs = this.cPICs = 1;
    if (this.model >= ChipSet.MODEL_5170) {
        this.cDMACs = this.cPICs = 2;
    }
    this.fScaleTimers = parmsChipSet['scaleTimers'] || false;
    this.sRTCDate = parmsChipSet['rtcDate'];

    /*
     * Here, I'm finally getting around to trying the Web Audio API.  Fortunately, based on what little I know about
     * sound generation, using the API to make the same noises as the IBM PC speaker should be straightforward.
     * 
     * To start, we create an audio context, unless the 'sound' parameter has been explicitly set to false.
     * 
     * From:
     * 
     *      http://developer.apple.com/library/safari/#documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/PlayingandSynthesizingSounds/PlayingandSynthesizingSounds.html
     *      
     * "Similar to how HTML5 canvas requires a context on which lines and curves are drawn, Web Audio requires an audio context
     *  on which sounds are played and manipulated. This context will be the parent object of further audio objects to come....
     *  Your audio context is typically created when your page initializes and should be long-lived. You can play multiple sounds
     *  coming from multiple sources within the same context, so it is unnecessary to create more than one audio context per page."
     */
    this.fSpeaker = false;
    if (parmsChipSet['sound']) {
        if (window && 'webkitAudioContext' in window) {
            // noinspection JSPotentiallyInvalidConstructorUsage
            this.contextAudio = new webkitAudioContext();
        } else {
            if (DEBUG) this.log("webkitAudioContext not available");
        }
    }

    this.setReady();
}

Component.subclass(Component, ChipSet);

/*
 *  Supported Models
 */
ChipSet.MODEL_5150 = 5150;
ChipSet.MODEL_5160 = 5160;
ChipSet.MODEL_5170 = 5170;

/*
 * Values returned by ChipSet.getSW1VideoMonitor()
 */
ChipSet.MONITOR = {};
ChipSet.MONITOR.NONE            = 0;
ChipSet.MONITOR.TV              = 1;    // TV (lower resolution; not currently supported)
ChipSet.MONITOR.COLOR           = 2;    // Color Display (5153)
ChipSet.MONITOR.MONO            = 3;    // Monochrome Display (5151)
ChipSet.MONITOR.EGACOLOR        = 4;    // Enhanced Color Display (5154) in High-Res Mode
ChipSet.MONITOR.EGAEMULATION    = 5;    // Enhanced Color Display (5154) in Emulation Mode

/*
 *  8237A DMA Controller (DMAC) I/O ports
 * 
 *  MODEL_5150 and up uses DMA channel 0 for memory refresh cycles and channel 2 for the FDC
 *  MODEL_5160 and up uses DMA channel 3 for HDC transfers
 *  MODEL_5170 and up contain *two* DMA Controllers, which we refer to as DMA0 and DMA1; channel 4
 *  on DMA1 is used to "cascade" channels 0-3 from DMA0, so only channels 5-7 are available on DMA1 
 *  
 *  QUESTION: Why does the MODEL_5150 ROM BIOS set the page register for channel 1 (port 0x83) to zero?
 * 
 *  For FDC DMA notes, refer to:        http://wiki.osdev.org/ISA_DMA
 *  For general DMA notes, refer to:    http://www.freebsd.org/doc/en/books/developers-handbook/dma.html
 */
ChipSet.DMA0 = {};
ChipSet.DMA0.INDEX = 0;
ChipSet.DMA0.PORT_CH0_ADDR      = 0x00; // OUT: starting address        IN: current address
ChipSet.DMA0.PORT_CH0_COUNT     = 0x01; // OUT: starting word count     IN: remaining word count
ChipSet.DMA0.PORT_CH1_ADDR      = 0x02; // OUT: starting address        IN: current address
ChipSet.DMA0.PORT_CH1_COUNT     = 0x03; // OUT: starting word count     IN: remaining word count
ChipSet.DMA0.PORT_CH2_ADDR      = 0x04; // OUT: starting address        IN: current address
ChipSet.DMA0.PORT_CH2_COUNT     = 0x05; // OUT: starting word count     IN: remaining word count
ChipSet.DMA0.PORT_CH3_ADDR      = 0x06; // OUT: starting address        IN: current address
ChipSet.DMA0.PORT_CH3_COUNT     = 0x07; // OUT: starting word count     IN: remaining word count
ChipSet.DMA0.PORT_CMD_STATUS    = 0x08; // OUT: command register        IN: status register
ChipSet.DMA0.PORT_REQUEST       = 0x09;
ChipSet.DMA0.PORT_MASK          = 0x0A;
ChipSet.DMA0.PORT_MODE          = 0x0B;
ChipSet.DMA0.PORT_CLEAR_FF      = 0x0C;
ChipSet.DMA0.PORT_MASTER_CLR    = 0x0D;
ChipSet.DMA0.PORT_CLEAR_MASK    = 0x0E; // TODO: Provide handlers
ChipSet.DMA0.PORT_ALL_MASK      = 0x0F; // TODO: Provide handlers
ChipSet.DMA0.PORT_CH2_PAGE      = 0x81; // OUT: DMA channel 2 page register
ChipSet.DMA0.PORT_CH3_PAGE      = 0x82; // OUT: DMA channel 3 page register
ChipSet.DMA0.PORT_CH1_PAGE      = 0x83; // OUT: DMA channel 1 page register
ChipSet.DMA0.PORT_CH0_PAGE      = 0x87; // OUT: DMA channel 0 page register (unusable; See "The Inside Out" book, p.246)

ChipSet.DMA1 = {};
ChipSet.DMA1.INDEX = 1;
ChipSet.DMA1.PORT_CH6_PAGE      = 0x89; // OUT: DMA channel 6 page register (MODEL_5170)
ChipSet.DMA1.PORT_CH7_PAGE      = 0x8A; // OUT: DMA channel 7 page register (MODEL_5170)
ChipSet.DMA1.PORT_CH5_PAGE      = 0x8B; // OUT: DMA channel 5 page register (MODEL_5170)
ChipSet.DMA1.PORT_CH4_PAGE      = 0x8F; // OUT: DMA channel 4 page register (MODEL_5170; unusable; aka "refresh" page register?)
ChipSet.DMA1.PORT_CH4_ADDR      = 0xC0; // OUT: starting address        IN: current address
ChipSet.DMA1.PORT_CH4_COUNT     = 0xC2; // OUT: starting word count     IN: remaining word count
ChipSet.DMA1.PORT_CH5_ADDR      = 0xC4; // OUT: starting address        IN: current address
ChipSet.DMA1.PORT_CH5_COUNT     = 0xC6; // OUT: starting word count     IN: remaining word count
ChipSet.DMA1.PORT_CH6_ADDR      = 0xC8; // OUT: starting address        IN: current address
ChipSet.DMA1.PORT_CH6_COUNT     = 0xCA; // OUT: starting word count     IN: remaining word count
ChipSet.DMA1.PORT_CH7_ADDR      = 0xCC; // OUT: starting address        IN: current address
ChipSet.DMA1.PORT_CH7_COUNT     = 0xCE; // OUT: starting word count     IN: remaining word count
ChipSet.DMA1.PORT_CMD_STATUS    = 0xD0; // OUT: command register        IN: status register
ChipSet.DMA1.PORT_REQUEST       = 0xD2;
ChipSet.DMA1.PORT_MASK          = 0xD4;
ChipSet.DMA1.PORT_MODE          = 0xD6;
ChipSet.DMA1.PORT_CLEAR_FF      = 0xD8;
ChipSet.DMA1.PORT_MASTER_CLR    = 0xDA;
ChipSet.DMA1.PORT_CLEAR_MASK    = 0xDC; // TODO: Provide handlers
ChipSet.DMA1.PORT_ALL_MASK      = 0xDE; // TODO: Provide handlers

ChipSet.DMA_CMD = {};
ChipSet.DMA_CMD.M2M_ENABLE      = 0x01;
ChipSet.DMA_CMD.CH0HOLD_ENABLE  = 0x02;
ChipSet.DMA_CMD.CTRL_DISABLE    = 0x04;
ChipSet.DMA_CMD.COMP_TIMING     = 0x08;
ChipSet.DMA_CMD.ROT_PRIORITY    = 0x10;
ChipSet.DMA_CMD.EXT_WRITE_SEL   = 0x20;
ChipSet.DMA_CMD.DREQ_ACTIVE_LO  = 0x40;
ChipSet.DMA_CMD.DACK_ACTIVE_HI  = 0x80;

ChipSet.DMA_MASK = {};
ChipSet.DMA_MASK.CHANNEL        = 0x03;
ChipSet.DMA_MASK.CHANNEL_SET    = 0x04;

ChipSet.DMA_MODE = {};
ChipSet.DMA_MODE.CHANNEL        = 0x03;
ChipSet.DMA_MODE.XFER           = 0x0C;
ChipSet.DMA_MODE.XFER_VERIFY    = 0x00;
ChipSet.DMA_MODE.XFER_WRITE     = 0x04;
ChipSet.DMA_MODE.XFER_READ      = 0x08;
ChipSet.DMA_MODE.AUTOINIT       = 0x10;
ChipSet.DMA_MODE.DECREMENT      = 0x20;
ChipSet.DMA_MODE.MODE           = 0xC0;
ChipSet.DMA_MODE.MODE_DEMAND    = 0x00;
ChipSet.DMA_MODE.MODE_SINGLE    = 0x40;
ChipSet.DMA_MODE.MODE_BLOCK     = 0x80;
ChipSet.DMA_MODE.MODE_CASCADE   = 0xC0;

ChipSet.DMA_FDC = 0x02;                 // DMA channel assigned to the Floppy Drive Controller (FDC)
ChipSet.DMA_HDC = 0x03;                 // DMA channel assigned to the Hard Drive Controller (HDC)

/*
 * 8259A Programmable Interrupt Controller (PIC) I/O ports
 * 
 * Internal registers:
 * 
 *      ICW1    Initialization Command Word 1 (sent to port ChipSet.PIC.PORT_LO)
 *      ICW2    Initialization Command Word 2 (sent to port ChipSet.PIC.PORT_HI)
 *      ICW3    Initialization Command Word 3 (sent to port ChipSet.PIC.PORT_HI)
 *      ICW4    Initialization Command Word 4 (sent to port ChipSet.PIC.PORT_HI)
 *      IMR     Interrupt Mask Register
 *      IRR     Interrupt Request Register
 *      ISR     Interrupt Service Register
 *      IRLow   (IR having lowest priority; IR+1 will have highest priority; default is 7)
 *      
 * Note that ICW2 effectively contains the starting IDT vector number (ie, for IRQ 0),
 * which must be multiplied by 4 to calculate the vector offset, since every vector is 4 bytes long.
 *  
 * Also, since the low 3 bits of ICW2 are ignored in 8086/8088 mode (ie, they are effectively
 * treated as zeros), this means that the starting IDT vector can only be a multiple of 8.
 *
 * So, if ICW2 is set to 0x08, the starting vector number (ie, for IRQ 0) will be 0x08, and the
 * 4-byte address for the corresponding ISR will be located at offset 0x20 in the real-mode IDT.
 *  
 * ICW4 is typically set to 0x09, indicating 8086 mode, non-automatic EOI, buffered/slave mode.
 *  
 * QUESTION: Why did the original ROM BIOS choose buffered/slave over buffered/master?  Did it simply
 * not matter in pre-AT systems with only one PIC, or am I misreading something?
 *
 * TODO: Consider support for level-triggered PIC interrupts, even though the original IBM PCs
 * (up through MODEL_5170) used only edge-triggered interrupts.
 */
ChipSet.PIC0 = {};                      // all models: the "master" PIC
ChipSet.PIC0.INDEX              = 0;
ChipSet.PIC0.PORT_LO            = 0x20;
ChipSet.PIC0.PORT_HI            = 0x21;

ChipSet.PIC1 = {};                      // MODEL_5170 and up: the "slave" PIC
ChipSet.PIC1.INDEX              = 1;
ChipSet.PIC1.PORT_LO            = 0xA0;
ChipSet.PIC1.PORT_HI            = 0xA1;

ChipSet.PIC_LO = {};
ChipSet.PIC_LO.ICW1             = 0x10; // set means ICW1
ChipSet.PIC_LO.ICW1_ICW4        = 0x01; // ICW4 needed (otherwise ICW4 must be sent)
ChipSet.PIC_LO.ICW1_SNGL        = 0x02; // single PIC (and therefore no ICW3; otherwise there is another "cascaded" PIC)
ChipSet.PIC_LO.ICW1_ADI         = 0x04; // call address interval is 4 (otherwise 8; presumably ignored in 8086/8088 mode)
ChipSet.PIC_LO.ICW1_LTIM        = 0x08; // level-triggered interrupt mode (otherwise edge-triggered mode, which is what PCs use)

ChipSet.PIC_HI = {};
ChipSet.PIC_HI.ICW2_VECTOR      = 0xF8; // starting vector number (bits 0-2 are effectively treated as zeros in 8086/8088 mode)

ChipSet.PIC_HI.ICW4_8086        = 0x01;
ChipSet.PIC_HI.ICW4_AUTO_EOI    = 0x02;
ChipSet.PIC_HI.ICW4_MASTER      = 0x04;
ChipSet.PIC_HI.ICW4_BUFFERED    = 0x08;
ChipSet.PIC_HI.ICW4_FULLY_NESTED= 0x10;

ChipSet.PIC_HI.OCW1_IMR         = 0xFF;

ChipSet.PIC_LO.OCW2             = 0x00; // bit 3 (PIC_LO.OCW3) and bit 4 (ChipSet.PIC_LO.ICW1) are clear in an OCW2 command byte
ChipSet.PIC_LO.OCW2_IR_LVL      = 0x07;
ChipSet.PIC_LO.OCW2_OP_MASK     = 0xE0; // of the following valid OCW2 operations, the first 4 are EOI commands (all have ChipSet.PIC_LO.OCW2_EOI set)
ChipSet.PIC_LO.OCW2_EOI         = 0x20; // non-specific EOI (end-of-interrupt)
ChipSet.PIC_LO.OCW2_EOI_SPEC    = 0x60; // specific EOI
ChipSet.PIC_LO.OCW2_EOI_ROT     = 0xA0; // rotate on non-specific EOI
ChipSet.PIC_LO.OCW2_EOI_ROTSPEC = 0xE0; // rotate on specific EOI
ChipSet.PIC_LO.OCW2_SET_ROTAUTO = 0x80; // set rotate in automatic EOI mode
ChipSet.PIC_LO.OCW2_CLR_ROTAUTO = 0x00; // clear rotate in automatic EOI mode
ChipSet.PIC_LO.OCW2_SET_PRI     = 0xC0; // bits 0-2 specify the lowest priority interrupt

ChipSet.PIC_LO.OCW3             = 0x08; // bit 3 (PIC_LO.OCW3) is set and bit 4 (PIC_LO.ICW1) clear in an OCW3 command byte (bit 7 should be clear, too)
ChipSet.PIC_LO.OCW3_READ_IRR    = 0x02; // read IRR register
ChipSet.PIC_LO.OCW3_READ_ISR    = 0x03; // read ISR register
ChipSet.PIC_LO.OCW3_READ_CMD    = 0x03;
ChipSet.PIC_LO.OCW3_POLL_CMD    = 0x04; // poll
ChipSet.PIC_LO.OCW3_SMM_RESET   = 0x40; // special mask mode: reset
ChipSet.PIC_LO.OCW3_SMM_SET     = 0x60; // special mask mode: set
ChipSet.PIC_LO.OCW3_SMM_CMD     = 0x60;

/*
 * The priorities of IRQs 0-7 are normally high to low, unless the master PIC has been reprogrammed.
 * Also, if a slave PIC is present, the priorities of IRQs 8-15 fall between the priorities of IRQs 1 and 3.
 * 
 * As the MODEL_5170 TechRef states:
 * 
 *      "Interrupt requests are prioritized, with IRQ9 through IRQ12 and IRQ14 through IRQ15 having the
 *      highest priority (IRQ9 is the highest) and IRQ3 through IRQ7 having the lowest priority (IRQ7 is
 *      the lowest).
 *      
 *      Interrupt 13 is used on the system board and is not available on the I/O channel.  Interrupt 8 is
 *      used for the real-time clock."
 *      
 * This priority scheme is a byproduct of IRQ8 through IRQ15 (slave PIC interrupts) being tied to IRQ2 of
 * the master PIC.  As a result, the two other system board interrupts, IRQ0 and IRQ1, continue to have the
 * highest priority, by default.
 */
ChipSet.IRQ = {};
ChipSet.IRQ.TIMER0              = 0x00;
ChipSet.IRQ.KBD                 = 0x01;
ChipSet.IRQ.SLAVE               = 0x02;
ChipSet.IRQ.COM2                = 0x03;
ChipSet.IRQ.COM1                = 0x04;
ChipSet.IRQ.HDC                 = 0x05; // MODEL_5160 uses this for the HDC; MODEL_5170 designates it for LPT2
ChipSet.IRQ.FDC                 = 0x06;
ChipSet.IRQ.LPT1                = 0x07;
ChipSet.IRQ.RTC                 = 0x08;
ChipSet.IRQ.IRQ2                = 0x09;
ChipSet.IRQ.COPROC              = 0x0D;
ChipSet.IRQ.ATHDC               = 0x0E; // MODEL_5170 uses this for the HDC

/*
 * 8253 Programmable Interval Timer (PIT) I/O ports 
 */
ChipSet.TIMER0 = {};
ChipSet.TIMER0.INDEX            = 0;
ChipSet.TIMER0.PORT             = 0x40; // used for time-of-day (prior to MODEL_5170)

ChipSet.TIMER1 = {};
ChipSet.TIMER1.INDEX            = 1;
ChipSet.TIMER1.PORT             = 0x41; // used for memory refresh   

ChipSet.TIMER2 = {};
ChipSet.TIMER2.INDEX            = 2;
ChipSet.TIMER2.PORT             = 0x42; // used speaker tone generation

ChipSet.TIMER_CTRL = {};
ChipSet.TIMER_CTRL.PORT         = 0x43; // write-only control register (use the Read-Back command to get status)
ChipSet.TIMER_CTRL.BCD          = 0x01;
ChipSet.TIMER_CTRL.MODE         = 0x0E;
ChipSet.TIMER_CTRL.MODE0        = 0x00; // interrupt on terminal count
ChipSet.TIMER_CTRL.MODE1        = 0x02; // programmable one-shot
ChipSet.TIMER_CTRL.MODE2        = 0x04; // rate generator
ChipSet.TIMER_CTRL.MODE3        = 0x06; // square wave generator
ChipSet.TIMER_CTRL.MODE4        = 0x08; // software-triggered strobe
ChipSet.TIMER_CTRL.MODE5        = 0x0A; // hardware-triggered strobe
ChipSet.TIMER_CTRL.RW           = 0x30;
ChipSet.TIMER_CTRL.RW_LATCH     = 0x00;
ChipSet.TIMER_CTRL.RW_LSB       = 0x10;
ChipSet.TIMER_CTRL.RW_MSB       = 0x20;
ChipSet.TIMER_CTRL.RW_BOTH      = 0x30;
ChipSet.TIMER_CTRL.SC           = 0xC0;
ChipSet.TIMER_CTRL.SC_CTR0      = 0x00;
ChipSet.TIMER_CTRL.SC_CTR1      = 0x40;
ChipSet.TIMER_CTRL.SC_CTR2      = 0x80;
ChipSet.TIMER_CTRL.SC_BACK      = 0xC0;

ChipSet.TIMER_TICKS_PER_SEC     = 1193181;

/*
 * 8255A Programmable Peripheral Interface (PPI) I/O ports, for Cassette/Speaker/Keyboard/SW1/etc
 * 
 * Normally, 0x99 is written to PPI_CTRL.PORT, indicating that PPI_A.PORT and PPI_C.PORT are INPUT ports
 * and PPI_B.PORT is an OUTPUT port.
 * 
 * However, the MODEL_5160 ROM BIOS initially writes 0x89 instead, making PPI_A.PORT an OUTPUT port.
 * However, I'm guessing that's just some sort of "diagnostic mode" operation, because all it writes
 * to PPI_A.PORT are a series of "checkpoint" values (ie, 0x01, 0x02, and 0x03) before updating PPI_CTRL.PORT
 * with the usual 0x99.
 */
ChipSet.PPI_A = {};                     // this.bPPIA
ChipSet.PPI_A.PORT              = 0x60; // INPUT: keyboard scan code (PPI_B_CLEAR_KBD must be clear)

ChipSet.PPI_B = {};                     // this.bPPIB
ChipSet.PPI_B.PORT              = 0x61; // OUTPUT (although it has to be treated as INPUT, too: the keyboard interrupt handler reads it, OR's PPI_B_CLEAR_KBD, writes it, and then rewrites the original read value)
ChipSet.PPI_B.CLK_TIMER2        = 0x01; // ALL: set to enable clock to TIMER2
ChipSet.PPI_B.SPK_TIMER2        = 0x02; // ALL: set to connect output of TIMER2 to speaker (MODEL_5150: clear for cassette)
ChipSet.PPI_B.ENABLE_SW2        = 0x04; // MODEL_5150: set to enable SW2[1-4] through PPI_C.PORT, clear to enable SW2[5]; MODEL_5160: unused (there is no SW2 switch block on the MODEL_5160 motherboard)
ChipSet.PPI_B.CASS_MOTOR_OFF    = 0x08; // MODEL_5150: cassette motor off
ChipSet.PPI_B.ENABLE_SW_HI      = 0x08; // MODEL_5160: clear to read SW1[1-4], set to read SW1[5-8]
ChipSet.PPI_B.DISABLE_RW_MEM    = 0x10; // ALL: clear to enable RAM parity check, set to disable
ChipSet.PPI_B.DISABLE_IO_CHK    = 0x20; // ALL: clear to enable I/O channel check, set to disable
ChipSet.PPI_B.CLK_KBD           = 0x40; // ALL: clear to force keyboard clock low
ChipSet.PPI_B.CLEAR_KBD         = 0x80; // ALL: clear to enable keyboard scan codes (MODEL_5150: set to enable SW1 through PPI_A.PORT)

ChipSet.PPI_C = {};                     // this.bPPIC
ChipSet.PPI_C.PORT              = 0x62; // INPUT (see below)
ChipSet.PPI_C.SW                = 0x0F; // MODEL_5150: SW2[1-4] or SW2[5], depending on whether PPI_B_ENABLE_SW2 is set or clear; MODEL_5160: SW1[1-4] or SW1[5-8], depending on whether PPI_B_ENABLE_SW_HI is clear or set
ChipSet.PPI_C.CASS_DATA_IN      = 0x10;
ChipSet.PPI_C.TIMER2_OUT        = 0x20;
ChipSet.PPI_C.IO_CHANNEL_CHK    = 0x40; // used by NMI handler to detect I/O channel errors
ChipSet.PPI_C.RW_PARITY_CHK     = 0x80; // used by NMI handler to detect R/W memory parity errors

ChipSet.PPI_CTRL = {};                  // this.bPPICtrl
ChipSet.PPI_CTRL.PORT           = 0x63; // OUTPUT: initialized to 0x99, defining PPI_A and PPI_C as INPUT and PPI_B as OUTPUT
ChipSet.PPI_CTRL.A_IN           = 0x10;
ChipSet.PPI_CTRL.B_IN           = 0x02;
ChipSet.PPI_CTRL.C_IN_LO        = 0x01;
ChipSet.PPI_CTRL.C_IN_HI        = 0x08;
ChipSet.PPI_CTRL.B_MODE         = 0x04;
ChipSet.PPI_CTRL.A_MODE         = 0x60;

/*
 * On the MODEL_5150, the following PPI_SW bits are exposed through PPI_A.
 * On the MODEL_5160, either the low or high 4 bits are exposed through PPI_C_SW, if PPI_B_ENABLE_SW_HI is clear or set.
 */
ChipSet.PPI_SW = {};
ChipSet.PPI_SW.FDRIVE = {};
ChipSet.PPI_SW.FDRIVE.IPL       = 0x01; // MODEL_5150: IPL ("Initial Program Load") floppy drive attached; MODEL_5160: "Loop on POST"
ChipSet.PPI_SW.COPROC           = 0x02; // MODEL_5150: reserved; MODEL_5160: coprocessor installed
ChipSet.PPI_SW.MEMORY = {};
ChipSet.PPI_SW.MEMORY.X1        = 0x00; // MODEL_5150: "X" is 16Kb; MODEL_5160: "X" is 64Kb
ChipSet.PPI_SW.MEMORY.X2        = 0x04;
ChipSet.PPI_SW.MEMORY.X3        = 0x08;
ChipSet.PPI_SW.MEMORY.X4        = 0x0C;
ChipSet.PPI_SW.MEMORY.MASK      = 0x0C;
ChipSet.PPI_SW.MEMORY.SHIFT     = 2;
ChipSet.PPI_SW.MONITOR = {};
ChipSet.PPI_SW.MONITOR.CGA40    = 0x10;
ChipSet.PPI_SW.MONITOR.CGA80    = 0x20;
ChipSet.PPI_SW.MONITOR.MDA      = 0x30;
ChipSet.PPI_SW.MONITOR.MASK     = 0x30;
ChipSet.PPI_SW.MONITOR.SHIFT    = 4;
ChipSet.PPI_SW.FDRIVE.ONE       = 0x00; // 1 floppy drive attached (or 0 drives if PPI_SW_FDRIVE_IPL is not set -- MODEL_5150 only)
ChipSet.PPI_SW.FDRIVE.TWO       = 0x40; // 2 floppy drives attached
ChipSet.PPI_SW.FDRIVE.THREE     = 0x80; // 3 floppy drives attached
ChipSet.PPI_SW.FDRIVE.FOUR      = 0xC0; // 4 floppy drives attached
ChipSet.PPI_SW.FDRIVE.MASK      = 0xC0;
ChipSet.PPI_SW.FDRIVE.SHIFT     = 6;

/*
 * 8042 Keyboard Controller I/O ports (MODEL_5170)
 * 
 * On the MODEL_5170, port 0x60 is treated as KBD_DATA rather than PPI_A (although the 5170 BIOS also refers
 * to it as "PORT_A").  This is the 8042's output buffer and should be read only when KBD_STATUS.OUTBUFF_FULL set.
 * 
 * The MODEL_5170 also uses port 0x61 (PPI_B), which the BIOS refers to as "8042 READ WRITE REGISTER (PORT_B)",
 * but it is not discussed in the MODEL_5170 TechRef's 8042 documentation.  There are brief references to bits 0
 * and 1 (PPI_B.CLK_TIMER2 and PPI_B.SPK_TIMER2), and the BIOS sets bits 3-7 to "DISABLE PARITY CHECKERS"
 * (principally PPI_B.DISABLE_RW_MEM and PPI_B.DISABLE_IO_CHK, which are bits 4 and 5); why the BIOS also sets
 * bits 3 and 6-7 is unclear and undocumented, since it uses 11111100B rather than defined constants.
 * 
 * The bottom line is, even on a MODEL_5170, PPI_B is still used for speaker control and parity checking.  It's
 * not clear whether that port is managed by the 8042 or independent circuitry.
 * 
 * PPI_B on a MODEL_5170 is also bi-directional: at one point, the BIOS reads bit 5 (PPI_B.DISABLE_RW_MEM) to verify
 * that it's alternating (the BIOS calls that bit "REFRESH_BIT").
 * 
 * PPI_C and PPI_CTRL are neither documented nor used by the MODEL_5170 BIOS, so I'm assuming they're obsolete.
 */
ChipSet.KBD_DATA = {};                  // this.b8042OutBuff
ChipSet.KBD_DATA.PORT           = 0x60;

ChipSet.KBD_DATA.CMD = {};              // this.b8042CmdData (KBD_DATA.CMD "data bytes" written to port 0x60, after writing a KBD_CMD byte to port 0x64)
ChipSet.KBD_DATA.CMD.PC_COMPAT  = 0x40; // generate IBM PC-compatible scan codes
ChipSet.KBD_DATA.CMD.PC_MODE    = 0x20;
ChipSet.KBD_DATA.CMD.NO_CLOCK   = 0x10; // disable keyboard by driving "clock" line low
ChipSet.KBD_DATA.CMD.NO_INHIBIT = 0x08; // disable inhibit function
ChipSet.KBD_DATA.CMD.SYS_FLAG   = 0x04; // this value is propagated to ChipSet.KBD_STATUS.SYS_FLAG 
ChipSet.KBD_DATA.CMD.INT_ENABLE = 0x01; // generate an interrupt when the controller places data in the output buffer

ChipSet.KBD_DATA.SELF_TEST = {};
ChipSet.KBD_DATA.SELF_TEST.OK   = 0x55;

ChipSet.KBD_DATA.INTF_TEST = {};
ChipSet.KBD_DATA.INTF_TEST.OK   = 0x00;
ChipSet.KBD_DATA.INTF_TEST.CSLO = 0x01;
ChipSet.KBD_DATA.INTF_TEST.CSHI = 0x02;
ChipSet.KBD_DATA.INTF_TEST.DSLO = 0x03;
ChipSet.KBD_DATA.INTF_TEST.DSHI = 0x04;

ChipSet.KBD_DATA.INPORT = {};           // this.b8042InPort
ChipSet.KBD_DATA.INPORT.EN256KB = 0x10; // enable 2nd 256Kb of system board RAM
ChipSet.KBD_DATA.INPORT.MFG_OFF = 0x20; // manufacturing jumper not installed
ChipSet.KBD_DATA.INPORT.MONO    = 0x40; // monochrome monitor is primary display
ChipSet.KBD_DATA.INPORT.KBD_ON  = 0x80; // keyboard unlocked

ChipSet.KBD_DATA.OUTPORT = {};          // this.b8042OutPort
ChipSet.KBD_DATA.OUTPORT.RESET  = 0x01;
ChipSet.KBD_DATA.OUTPORT.A20    = 0x02;
ChipSet.KBD_DATA.OUTPORT.OBFULL = 0x10;
ChipSet.KBD_DATA.OUTPORT.IBEMPTY= 0x20;
ChipSet.KBD_DATA.OUTPORT.KBCLK  = 0x40;
ChipSet.KBD_DATA.OUTPORT.KBDATA = 0x80;

ChipSet.KBD_DATA.TESTPORT = {};         // generated "on the fly"
ChipSet.KBD_DATA.TESTPORT.CLOCK = 0x01;
ChipSet.KBD_DATA.TESTPORT.DATA  = 0x02;

ChipSet.KBD_CMD = {};                   // this.b8042InBuff (on write to port 0x64, interpret this as a CMD)
ChipSet.KBD_CMD.PORT            = 0x64;
ChipSet.KBD_CMD.READ_CMD        = 0x20;
ChipSet.KBD_CMD.WRITE_CMD       = 0x60; // followed by a command byte written to KBD_DATA.PORT (see KBD_DATA.CMD) 
ChipSet.KBD_CMD.SELF_TEST       = 0xAA; // self-test (KBD_DATA.SELF_TEST_OK is placed in the output buffer if no errors)
ChipSet.KBD_CMD.INTF_TEST       = 0xAB; // interface test
ChipSet.KBD_CMD.DIAG_DUMP       = 0xAC; // diagnostic dump
ChipSet.KBD_CMD.DISABLE_KBD     = 0xAD; // disable keyboard
ChipSet.KBD_CMD.ENABLE_KBD      = 0xAE; // enable keyboard
ChipSet.KBD_CMD.READ_INPORT     = 0xC0; // read input port and place data in output buffer (use only if output buffer empty)
ChipSet.KBD_CMD.READ_OUTPORT    = 0xD0; // read output port and place data in output buffer (use only if output buffer empty)
ChipSet.KBD_CMD.WRITE_OUTPORT   = 0xD1; // next byte written to KBD_DATA.PORT (port 0x60) is placed in the output port (see KBD_DATA.OUTPUT)
ChipSet.KBD_CMD.READ_TEST       = 0xE0;
ChipSet.KBD_CMD.PULSE_OUTPORT   = 0xF0; // this is the 1st of 16 commands (0xF0-0xFF) that pulse bits 0-3 of the output port

ChipSet.KBD_STATUS = {};                // this.b8042Status (on read from port 0x64)
ChipSet.KBD_STATUS.PORT         = 0x64;
ChipSet.KBD_STATUS.OUTBUFF_FULL = 0x01;
ChipSet.KBD_STATUS.INBUFF_FULL  = 0x02; // set if the controller has received but not yet read data written to the input buffer (not normally set) 
ChipSet.KBD_STATUS.SYS_FLAG     = 0x04;
ChipSet.KBD_STATUS.CMD_FLAG     = 0x08; // set on write to KBD_CMD (port 0x64), clear on write to KBD_DATA (port 0x60)
ChipSet.KBD_STATUS.NO_INHIBIT   = 0x10;
ChipSet.KBD_STATUS.XMT_TIMEOUT  = 0x20;
ChipSet.KBD_STATUS.RCV_TIMEOUT  = 0x40;
ChipSet.KBD_STATUS.PARITY_ERR   = 0x80; // last byte of data received had EVEN parity (ODD parity is normally expected)
ChipSet.KBD_STATUS.OUTBUFF_DELAY= 0x100;

/*
 * MC146818A RTC/CMOS Ports (MODEL_5170)
 * 
 * Write a CMOS address to ChipSet.CMOS_ADDR.PORT, then read/write data from/to ChipSet.CMOS_DATA.PORT.
 * 
 * The ADDR port also controls NMI: write an address with bit 7 clear to enable NMI or set to disable NMI.
 */
ChipSet.CMOS_ADDR = {};                 // this.bCMOSAddr
ChipSet.CMOS_ADDR.PORT          = 0x70;
ChipSet.CMOS_ADDR.RTC_SEC       = 0x00;
ChipSet.CMOS_ADDR.RTC_SEC_ALRM  = 0x01;
ChipSet.CMOS_ADDR.RTC_MIN       = 0x02;
ChipSet.CMOS_ADDR.RTC_MIN_ALRM  = 0x03;
ChipSet.CMOS_ADDR.RTC_HOUR      = 0x04;
ChipSet.CMOS_ADDR.RTC_HOUR_ALRM = 0x05;
ChipSet.CMOS_ADDR.RTC_WEEK_DAY  = 0x06;
ChipSet.CMOS_ADDR.RTC_MONTH_DAY = 0x07;
ChipSet.CMOS_ADDR.RTC_MONTH     = 0x08;
ChipSet.CMOS_ADDR.RTC_YEAR      = 0x09;
ChipSet.CMOS_ADDR.RTC_STATUSA   = 0x0A;
ChipSet.CMOS_ADDR.RTC_STATUSB   = 0x0B;
ChipSet.CMOS_ADDR.RTC_STATUSC   = 0x0C;
ChipSet.CMOS_ADDR.RTC_STATUSD   = 0x0D;
ChipSet.CMOS_ADDR.DIAG          = 0x0E;
ChipSet.CMOS_ADDR.SHUTDOWN      = 0x0F;
ChipSet.CMOS_ADDR.FDRIVE        = 0x10;
ChipSet.CMOS_ADDR.HDRIVE        = 0x12;
ChipSet.CMOS_ADDR.EQUIP         = 0x14;
ChipSet.CMOS_ADDR.BASEMEM_LO    = 0x15;
ChipSet.CMOS_ADDR.BASEMEM_HI    = 0x16; //the BASEMEM values indicate the total Kb of base memory, up to 0x280 (640Kb)
ChipSet.CMOS_ADDR.EXTMEM_LO     = 0x17;
ChipSet.CMOS_ADDR.EXTMEM_HI     = 0x18; //the EXTMEM values indicate the total Kb of extended memory, up to 0x3C00 (15Mb)
ChipSet.CMOS_ADDR.CHKSUM_HI     = 0x2E;
ChipSet.CMOS_ADDR.CHKSUM_LO     = 0x2F; // CMOS bytes included in the checksum calculation: 0x10-0x2D
ChipSet.CMOS_ADDR.EXTMEM2_LO    = 0x30;
ChipSet.CMOS_ADDR.EXTMEM2_HI    = 0x31;
ChipSet.CMOS_ADDR.CENTURY_DATE  = 0x32; // BCD value for the current century (eg, 0x19 for 20th century, 0x20 for 21st century)
ChipSet.CMOS_ADDR.BOOT_INFO     = 0x33; // 0x80 if 128Kb expansion memory installed, 0x40 if Setup Utility wants an initial setup message 
ChipSet.CMOS_ADDR.MASK          = 0x3F;
ChipSet.CMOS_ADDR.TOTAL         = 0x40;
ChipSet.CMOS_ADDR.NMI_DISABLE   = 0x80;

ChipSet.CMOS_DATA = {};                 // this.abCMOSData
ChipSet.CMOS_DATA.PORT          = 0x71;

ChipSet.CMOS_STATUSA = {};              // abCMOSData[ChipSet.CMOS_ADDR.RTC_STATUSA]
ChipSet.CMOS_STATUSA.UIP        = 0x80; // bit 7: 1 indicates Update-In-Progress, 0 indicates date/time ready to read
ChipSet.CMOS_STATUSA.DV         = 0x70; // bits 6-4 (DV2-DV0) are programmed to 010 to select a 32.768Khz time base
ChipSet.CMOS_STATUSA.RS         = 0x0F; // bits 3-0 (RS3-RS0) are programmed to 0110 to select a 976.562us interrupt rate

ChipSet.CMOS_STATUSB = {};              // abCMOSData[ChipSet.CMOS_ADDR.RTC_STATUSB]
ChipSet.CMOS_STATUSB.SET        = 0x80; // bit 7: 1 to set any/all of the 14 time-bytes
ChipSet.CMOS_STATUSB.PIE        = 0x40; // bit 6: 1 for Periodic Interrupt Enable
ChipSet.CMOS_STATUSB.AIE        = 0x20; // bit 5: 1 for Alarm Interrupt Enable
ChipSet.CMOS_STATUSB.UIE        = 0x10; // bit 4: 1 for Update-Ended Interrupt Enable
ChipSet.CMOS_STATUSB.SQWE       = 0x08; // bit 3: 1 for Square Wave Enabled (as set by the STATUSA rate selection bits)
ChipSet.CMOS_STATUSB.BINARY     = 0x04; // bit 2: 1 for binary Date Mode, 0 for BCD Date Mode
ChipSet.CMOS_STATUSB.HOUR24     = 0x02; // bit 1: 1 for 24-hour mode, 0 for 12-hour mode
ChipSet.CMOS_STATUSB.DST        = 0x01; // bit 0: 1 for Daylight Savings Time enabled

ChipSet.CMOS_STATUSC = {};              // abCMOSData[ChipSet.CMOS_ADDR.RTC_STATUSC] TODO: Does reading this register clear these interrupt conditions? (see F000:01C6 in the MODEL_5170 BIOS)
ChipSet.CMOS_STATUSC.IRQF       = 0x80; // bit 7
ChipSet.CMOS_STATUSC.PF         = 0x40; // bit 6: 1 indicates Periodic Interrupt
ChipSet.CMOS_STATUSC.AF         = 0x20; // bit 5: 1 indicates Alarm Interrupt
ChipSet.CMOS_STATUSC.UF         = 0x10; // bit 4: 1 indicates Update-Ended Interrupt
ChipSet.CMOS_STATUSC.RESERVED   = 0x0F;

ChipSet.CMOS_STATUSD = {};              // abCMOSData[ChipSet.CMOS_ADDR.RTC_STATUSD]
ChipSet.CMOS_STATUSD.VRB        = 0x80; // bit 7: 1 indicates Valid RAM Bit (0 implies power was and/or is lost)
ChipSet.CMOS_STATUSD.RESERVED   = 0x7F;

ChipSet.CMOS_DIAG = {};                 // abCMOSData[ChipSet.CMOS_ADDR.DIAG]
ChipSet.CMOS_DIAG.RTCFAIL       = 0x80; // bit 7: 1 indicates RTC lost power
ChipSet.CMOS_DIAG.CHKSUMFAIL    = 0x40; // bit 6: 1 indicates bad CMOS checksum
ChipSet.CMOS_DIAG.CONFIGFAIL    = 0x20; // bit 5: 1 indicates bad CMOS configuration info
ChipSet.CMOS_DIAG.MEMSIZEFAIL   = 0x10; // bit 4: 1 indicates memory size miscompare
ChipSet.CMOS_DIAG.HDRIVEFAIL    = 0x08; // bit 3: 1 indicates hard drive controller or drive init failure
ChipSet.CMOS_DIAG.TIMEFAIL      = 0x04; // bit 2: 1 indicates time failure
ChipSet.CMOS_DIAG.RESERVED      = 0x03;

ChipSet.CMOS_FDRIVE = {};               // abCMOSData[ChipSet.CMOS_ADDR.FDRIVE]
ChipSet.CMOS_FDRIVE.D0          = 0xF0;
ChipSet.CMOS_FDRIVE.D0_DS       = 0x10; // double-sided drive (48 TPI)
ChipSet.CMOS_FDRIVE.D0_HC       = 0x20; // high-capacity drive (96 TPI)
ChipSet.CMOS_FDRIVE.D1          = 0x0F;
ChipSet.CMOS_FDRIVE.D1_DS       = 0x01; // double-sided drive (48 TPI)
ChipSet.CMOS_FDRIVE.D1_HC       = 0x02; // high-capacity drive (96 TPI)

/*
 * The following HDRIVE types are supported by the MODEL_5170, where C is Cylinders, H is Heads,
 * WP is Write Pre-Comp, and LZ is Landing Zone.
 * 
 * Type    C    H   WP   LZ
 * ----  ---   --  ---  ---
 *   1   306    4  128  305
 *   2   615    4  300  615
 *   3   615    6  300  615
 *   4   940    8  512  940
 *   5   940    6  512  940
 *   6   615    4   no  615
 *   7   462    8  256  511
 *   8   733    5   no  733
 *   9   900   15  no8  901
 *  10   820    3   no  820
 *  11   855    5   no  855
 *  12   855    7   no  855
 *  13   306    8  128  319
 *  14   733    7   no  733
 *  15  (reserved--all zeros)
 */
ChipSet.CMOS_HDRIVE = {};               // abCMOSData[ChipSet.CMOS_ADDR.HDRIVE]
ChipSet.CMOS_HDRIVE.D0          = 0xF0;
ChipSet.CMOS_HDRIVE.D1          = 0x0F;

/*
 * The CMOS equipment flags use the same format as the older PPI equipment flags
 */
ChipSet.CMOS_EQUIP = {};                // abCMOSData[ChipSet.CMOS_ADDR.EQUIP]
ChipSet.CMOS_EQUIP.MONITOR      = ChipSet.PPI_SW.MONITOR;       // PPI_SW.MONITOR.MASK == 0x30
ChipSet.CMOS_EQUIP.COPROC       = ChipSet.PPI_SW.COPROC;        // PPI_SW.COPROC == 0x02
ChipSet.CMOS_EQUIP.FDRIVE       = ChipSet.PPI_SW.FDRIVE;        // PPI_SW.FDRIVE.IPL == 0x01 and PPI_SW.FDRIVE.MASK = 0xC0

/*
 * Manufacturing Test Ports (MODEL_5170)
 *
 * The MODEL_5170 TechRef lists 0x80-0x9F as the range for DMA page registers, but that seems a bit
 * overbroad; at one point, it says:
 * 
 *      "I/O address hex 080 is used as a diagnostic-checkpoint port or register.
 *      This port corresponds to a read/write register in the DMA page register (74LS6I2)."
 * 
 * 0x80 is the neighborhood, but that particular port is not documented as a DMA page register.
 * We'll refer to it as manufacturing port (see bMFGData).  Be aware that the MODEL_5170 BIOS is littered
 * with manufacturing test ("MFG_TST") code which, if enabled, writes to other DMA page registers,
 * perhaps treating them as scratch registers.
 */
ChipSet.MFG = {};                       // this.bMFGData
ChipSet.MFG.PORT                = 0x80;

/*
 * NMI Mask Register (MODEL_5150 and MODEL_5160 only)
 */
ChipSet.NMI = {};                       // this.bNMI
ChipSet.NMI.PORT                = 0xA0;
ChipSet.NMI.ENABLE              = 0x80;
ChipSet.NMI.DISABLE             = 0x00;

/*
 * Coprocessor Control Registers (MODEL_5170)
 */
ChipSet.COPROC = {};                    // TODO: Define a variable for this
ChipSet.COPROC.PORT_CLEAR       = 0xF0; // clear the coprocessor's "busy" state
ChipSet.COPROC.PORT_RESET       = 0xF1; // reset the coprocessor

/*
 * Ports used by MODEL_5170 BIOS for "Combo Hard File/Diskette Card" check (@F000:144C)
 * 
 * We're intercepting reads for this card's STATUS port simply to reduce boot time; otherwise,
 * our default unknown port response (0xFF) maximizes boot delay.  The STATUS port simply needs
 * to return a byte with bit 7 clear, so that the BIOS will then attempt to write/read the CTRL
 * port, which will immediately fail (since the write will be ignored).
 */
ChipSet.HFCOMBO = {};
ChipSet.HFCOMBO.CTRL    = {PORT: 0x1F4};
ChipSet.HFCOMBO.STATUS  = {PORT: 0x1F7};

/**
 * @this {ChipSet}
 * @param {string|null} sHTMLClass is the class of the HTML control (eg, "input", "output")
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "sw1")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
ChipSet.prototype.setBinding = function(sHTMLClass, sHTMLType, sBinding, control)
{
    switch (sBinding) {
        case "sw1":
            this.bindings[sBinding] = control;
            this.addSwitches(sBinding, control, 8, this.sw1Init, {
                0: (this.model == ChipSet.MODEL_5150? "Bootable Floppy Drive" : "Loop on POST"),
                1: (this.model == ChipSet.MODEL_5150? "Reserved" : "Coprocessor"),
                2: "Base Memory Size",          // up to 64Kb on a MODEL_5150, 256Kb on a MODEL_5160
                4: "Monitor Type",
                6: "Number of Floppy Drives"
            });
            return true;
        case "sw2":
            if (this.model == ChipSet.MODEL_5150) {
                this.bindings[sBinding] = control;
                this.addSwitches(sBinding, control, 8, this.sw2Init, {
                    0: "Expansion Memory Size", // up to 480Kb, which, when combined with 64Kb of MODEL_5150 base memory, gives a maximum of 544Kb
                    4: "Reserved"
                });
                return true;
            }
            break;
        case "swdesc":
            this.bindings[sBinding] = control;
            return true;
        default:
            break;
    }
    return false;
};

/**
 * initBus(cmp, bus, cpu, dbg)
 * 
 * @this {ChipSet}
 * @param {Computer} cmp
 * @param {Bus} bus
 * @param {X86CPU} cpu
 * @param {Debugger} dbg
 */
ChipSet.prototype.initBus = function(cmp, bus, cpu, dbg)
{
    this.bus = bus;
    this.cpu = cpu;
    this.dbg = dbg;
    this.cmp = cmp;
    this.kbd = cmp.getComponentByType("Keyboard");
    if (DEBUGGER && dbg) {
        var chipset = this;
        dbg.messageInit(ChipSet);
        dbg.messageDump(ChipSet.MESSAGE_PIC, function onDumpPIC() {
            chipset.dumpPIC();
        });
        dbg.messageDump(ChipSet.MESSAGE_TIMER, function onDumpTimer() {
            chipset.dumpTimer();
        });
    }
    bus.addPortInputTable(this, ChipSet.aPortInput);
    bus.addPortOutputTable(this, ChipSet.aPortOutput);
    if (this.model < ChipSet.MODEL_5170) {
        bus.addPortInputTable(this, ChipSet.aPortInput5150);
        bus.addPortOutputTable(this, ChipSet.aPortOutput5150);
    } else {
        bus.addPortInputTable(this, ChipSet.aPortInput5170);
        bus.addPortOutputTable(this, ChipSet.aPortOutput5170);
    }
    /*
     * This divisor is invariant, so we calculate it as soon as we're able to query the CPU's base speed.
     */
    this.nTicksDivisor = Math.round(cpu.getCyclesPerSecond() / ChipSet.TIMER_TICKS_PER_SEC);
};

/**
 * powerUp(data, fRepower)
 * 
 * @this {ChipSet}
 * @param {Object|null} data
 * @param {boolean} [fRepower]
 * @return {boolean} true if successful, false if failure
 */
ChipSet.prototype.powerUp = function(data, fRepower)
{
    if (!fRepower) {
        if (!data || !this.restore) {
            this.reset();
        } else {
            if (!this.restore(data)) return false;
        }
    }
    return true;
};

/**
 * powerDown(fSave)
 * 
 * @this {ChipSet}
 * @param {boolean} fSave
 * @return {Object|boolean}
 */
ChipSet.prototype.powerDown = function(fSave)
{
    return fSave && this.save? this.save() : true;
};

/**
 * reset()
 * 
 * @this {ChipSet}
 */
ChipSet.prototype.reset = function()
{
    /*
     * We propagate the sw?Init values to sw? at reset; the user only gets
     * to tweak sw?Init, which we don't want to take effect until the next reset.
     */
    var i;
    this.sw1 = this.sw1Init;
    this.sw2 = this.sw2Init;
    this.updateSwitchDesc();

    /*
     * DMA Controller initialization
     */
    this.aDMACs = new Array(this.cDMACs);
    for (i = 0; i < this.cDMACs; i++) this.initDMAController(i);

    /*
     * PIC initialization
     */
    this.aPICs = new Array(this.cPICs);
    this.initPIC(ChipSet.PIC0.INDEX, ChipSet.PIC0.PORT_LO);
    if (this.cPICs > 1) this.initPIC(ChipSet.PIC1.INDEX, ChipSet.PIC1.PORT_LO);

    /*
     * Timer initialization
     */
    this.bTimerCtrl = undefined;    // tracks writes to port 0x43
    this.aTimers = new Array(3);
    for (i = 0; i < this.aTimers.length; i++) {
        this.initTimer(i);
    }

    /*
     * PPI and other misc ports
     */
    this.bPPIA = undefined;         // tracks writes to port 0x60, in case PPI_CTRL.A_IN is not set
    this.bPPIB = undefined;         // tracks writes to port 0x61, in case PPI_CTRL.B_IN is not set
    this.bPPIC = undefined;         // tracks writes to port 0x62, in case PPI_CTRL.C_IN_LO or PPI_CTRL.C_IN_HI is not set
    this.bPPICtrl = undefined;      // tracks writes to port 0x63 (eg, 0x99); read-only
    this.bNMI = ChipSet.NMI.DISABLE;// tracks writes to the NMI Mask Register
    
    /*
     * State introduced by the MODEL_5170
     */
    if (this.model >= ChipSet.MODEL_5170) {
        /*
         * The 8042 input buffer is treated as a "command byte" when written via port 0x64 and as a "data byte"
         * when written via port 0x60.  So, whenever the KBD_CMD.WRITE_CMD "command byte" is written to the input
         * buffer, the subsequent command data byte is saved in b8042CmdData.  Similarly, for KBD_CMD.WRITE_OUTPORT,
         * the subsequent data byte is saved in b8042OutPort.
         *
         * TODO: Consider a UI for the Keyboard INHIBIT switch.  By default, our keyboard is never inhibited
         * (ie, locked).  Also, note that the hardware changes this bit only when new data is sent to b8042OutBuff. 
         */
        this.b8042Status = ChipSet.KBD_STATUS.NO_INHIBIT;
        this.b8042InBuff = 0;
        this.b8042CmdData = 0;
        this.b8042OutBuff = 0;
        
        /*
         * TODO: Provide more control over these 8042 "Input Port" bits (eg, the keyboard lock)
         */
        this.b8042InPort = ChipSet.KBD_DATA.INPORT.MFG_OFF | ChipSet.KBD_DATA.INPORT.KBD_ON;
        if (this.getSWMemorySize() >= 512) this.b8042InPort |= ChipSet.KBD_DATA.INPORT.EN256KB;
        if (this.getSW1VideoMonitor() == ChipSet.MONITOR.MONO) this.b8042InPort |= ChipSet.KBD_DATA.INPORT.MONO;

        this.b8042OutPort = ChipSet.KBD_DATA.OUTPORT.A20;
        this.bCMOSAddr = 0;         // NMI is enabled, since the ChipSet.CMOS_ADDR.NMI_DISABLE bit is not set in bCMOSAddr
        this.abCMOSData = new Array(ChipSet.CMOS_ADDR.TOTAL);
        this.initRTCDate(this.sRTCDate);
        this.initCMOSData();
        /*
         * TODO: Data below here has not yet been added to the save/restore state; when we're done adding new data,
         * make sure it all gets added.
         */
        this.bMFGData = 0;
        this.abDMAPageSpare = new Array(7);
    }

    if (DEBUGGER && MAXDEBUG) {
        /*
         * Arrays for interrupt counts (one count per IRQ) and timer data
         */
        this.acInterrupts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        this.acTimersFired = [0, 0, 0];
        this.acTimer0Counts = [];
    }
};

/**
 * initRTCDate(sDate)
 * 
 * Initialize the RTC portion of the CMOS registers to match the specified date/time (or if none is specified,
 * the current date/time).  The date/time should be expressed in the ISO 8601 format; eg: "2011-10-10T14:48:00".
 * 
 * NOTE: There are two approaches we could take here: always store the RTC bytes in binary, and convert them
 * to/from BCD on-demand (ie, as the simulation reads/writes the CMOS RTC registers); or init/update them in the
 * format specified by CMOS_STATUSB.BINARY (1 for binary, 0 for BCD).  Both approaches require BCD conversion
 * functions, but the former seems more efficient, in part because the periodic calls to updateRTCDate() won't
 * require any conversions.
 * 
 * We take the same approach with the CMOS_STATUSB.HOUR24 setting: internally, we always operate in 24-hour mode,
 * but externally, we convert the RTC hour values to the 12-hour format as needed.
 * 
 * Thus, all I/O to the RTC bytes must be routed through the getRTCByte() and setRTCByte() functions, to ensure
 * that all the necessary on-demand conversions occur.
 * 
 * @this {ChipSet}
 * @param {string} [sDate]
 */
ChipSet.prototype.initRTCDate = function(sDate)
{
    /*
     * NOTE: I've already been burned once by a JavaScript library function that did NOT treat an undefined
     * parameter the same as no parameter (eg, the async parameter in xmlHTTP.open() in IE), so I'm taking no
     * chances here: if sDate is undefined, then explicitly call Date() with no parameters. 
     */
    var date = sDate? new Date(sDate) : new Date();
    
    this.abCMOSData[ChipSet.CMOS_ADDR.RTC_SEC] = date.getSeconds();
    this.abCMOSData[ChipSet.CMOS_ADDR.RTC_SEC_ALRM] = 0;
    this.abCMOSData[ChipSet.CMOS_ADDR.RTC_MIN] = date.getMinutes();
    this.abCMOSData[ChipSet.CMOS_ADDR.RTC_MIN_ALRM] = 0;
    this.abCMOSData[ChipSet.CMOS_ADDR.RTC_HOUR] = date.getHours();
    this.abCMOSData[ChipSet.CMOS_ADDR.RTC_HOUR_ALRM] = 0;
    this.abCMOSData[ChipSet.CMOS_ADDR.RTC_WEEK_DAY] = date.getDay() + 1;
    this.abCMOSData[ChipSet.CMOS_ADDR.RTC_MONTH_DAY] = date.getDate();
    this.abCMOSData[ChipSet.CMOS_ADDR.RTC_MONTH] = date.getMonth() + 1;
    this.abCMOSData[ChipSet.CMOS_ADDR.RTC_YEAR] = date.getFullYear() % 100;
    
    this.nCyclesCMOSLastUpdate = -1;
    
    this.abCMOSData[ChipSet.CMOS_ADDR.RTC_STATUSA] = 0x26;                          // hard-coded default; refer to ChipSet.CMOS_STATUSA.DV and ChipSet.CMOS_STATUSA.RS
    this.abCMOSData[ChipSet.CMOS_ADDR.RTC_STATUSB] = ChipSet.CMOS_STATUSB.HOUR24;   // default to BCD mode (ChipSet.CMOS_STATUSB.BINARY not set)
    this.abCMOSData[ChipSet.CMOS_ADDR.RTC_STATUSC] = 0x00;
    this.abCMOSData[ChipSet.CMOS_ADDR.RTC_STATUSD] = ChipSet.CMOS_STATUSD.VRB;
};

/**
 * getRTCByte(iRTC)
 * 
 * @param {number} iRTC
 * @return {number} b
 */
ChipSet.prototype.getRTCByte = function(iRTC)
{
    Component.assert(iRTC >= 0 && iRTC <= ChipSet.CMOS_ADDR.RTC_STATUSD);
    
    var b = this.abCMOSData[iRTC];
    
    if (iRTC < ChipSet.CMOS_ADDR.RTC_STATUSA) {
        var f12HourValue = false;
        if (iRTC == ChipSet.CMOS_ADDR.RTC_HOUR || iRTC == ChipSet.CMOS_ADDR.RTC_HOUR_ALRM) {
            if (!(this.abCMOSData[ChipSet.CMOS_ADDR.RTC_STATUSB] & ChipSet.CMOS_STATUSB.HOUR24)) {
                if (b < 12) {
                    b = (!b? 12 : b);
                } else {
                    b -= 12;
                    b = (!b? 0x8c : b + 0x80);
                }
                f12HourValue = true;
            }
        }
        if (!(this.abCMOSData[ChipSet.CMOS_ADDR.RTC_STATUSB] & ChipSet.CMOS_STATUSB.BINARY)) {
            /*
             * We're in BCD mode, so we must convert b from BINARY to BCD.  But first:
             * 
             *      If b is a 12-hour value (ie, we're in 12-hour mode) AND the hour is a PM value
             *      (ie, in the range 0x81-0x8C), then it must be adjusted to yield 81-92 in BCD.
             * 
             *      AM hour values (0x01-0x0C) need no adjustment; they naturally convert to 01-12 in BCD.
             */
            if (f12HourValue && b > 0x80) {
                b -= (0x81 - 81);
            }
            b = (b % 10) | ((b / 10) << 4);
        }
    } else {
        if (iRTC == ChipSet.CMOS_ADDR.RTC_STATUSA) {
            /*
             * HACK: Perform a mindless toggling of the "Update-In-Progress" bit, so that it's flipped
             * on the next read; this makes the MODEL_5170 BIOS ("POST2_RTCUP") happy.
             */
            this.abCMOSData[iRTC] ^= ChipSet.CMOS_STATUSA.UIP;
        }
    }    
    return b;
};

/**
 * setRTCByte(iRTC, b)
 *
 * @param {number} iRTC
 * @param {number} b proposed byte to write
 * @return {number} actual byte to write
 */
ChipSet.prototype.setRTCByte = function(iRTC, b)
{
    Component.assert(iRTC >= 0 && iRTC <= ChipSet.CMOS_ADDR.RTC_STATUSD);

    if (iRTC < ChipSet.CMOS_ADDR.RTC_STATUSA) {
        var fBCD = false;
        if (!(this.abCMOSData[ChipSet.CMOS_ADDR.RTC_STATUSB] & ChipSet.CMOS_STATUSB.BINARY)) {
            /*
             * We're in BCD mode, so we must convert b from BCD to BINARY (we assume it's valid
             * BCD; ie, that both nibbles contain only 0-9, not A-F).
             */ 
            b = (b >> 4) * 10 + (b & 0xf);
            fBCD = true;
        }
        if (iRTC == ChipSet.CMOS_ADDR.RTC_HOUR || iRTC == ChipSet.CMOS_ADDR.RTC_HOUR_ALRM) {
            if (fBCD) {
                /*
                 * If the original BCD hour was 0x81-0x92, then the previous BINARY-to-BCD conversion
                 * transformed it to 0x51-0x5C, so we must add 0x30. 
                 */
                if (b > 12) {
                    Component.assert(b >= 0x51 && b <= 0x5c);
                    b += 0x30;
                }
            }
            if (!(this.abCMOSData[ChipSet.CMOS_ADDR.RTC_STATUSB] & ChipSet.CMOS_STATUSB.HOUR24)) {
                if (b <= 12) {
                    b = (b == 12? 0 : b);
                } else {
                    b -= (0x80 - 12);
                    b = (b == 24? 12 : b);
                }
            }
        }
    }
    return b;
};

/**
 * updateRTCDate()
 *
 * @this {ChipSet}
 */
ChipSet.prototype.updateRTCDate = function()
{
    var nCyclesDelta = 0;
    var nCyclesPerSecond = this.cpu.getCyclesPerSecond();
    var nCyclesUpdate = this.cpu.getCycles(this.fScaleTimers);
    
    /*
     * If nCyclesCMOSLastUpdate hasn't been properly set yet (ie, if this is our first updateRTCDate() call),
     * then do nothing except initialize nCyclesCMOSLastUpdate. 
     */
    if (this.nCyclesCMOSLastUpdate >= 0) {
        nCyclesDelta = nCyclesUpdate - this.nCyclesCMOSLastUpdate;
        Component.assert(nCyclesDelta >= 0);
        var nSecondsDelta = Math.floor(nCyclesDelta / nCyclesPerSecond);
        /*
         * We trust that updateRTCDate() is being called as part of updateAllTimers(), and is therefore
         * being called often enough to ensure that nSecondsDelta will never be greater than one.  In fact,
         * it would always be LESS than one if it weren't ALSO for the fact that we plow any "unused" cycles
         * (nCyclesDelta % nCyclesPerSecond) back into nCyclesCMOSLastUpdate, so that we will eventually
         * see a one-second delta.
         */
        Component.assert(nSecondsDelta <= 1);
        if (nSecondsDelta) {
            if (++this.abCMOSData[ChipSet.CMOS_ADDR.RTC_SEC] >= 60) {
                this.abCMOSData[ChipSet.CMOS_ADDR.RTC_SEC] = 0;
                if (++this.abCMOSData[ChipSet.CMOS_ADDR.RTC_MIN] >= 60) {
                    this.abCMOSData[ChipSet.CMOS_ADDR.RTC_MIN] = 0;
                    if (++this.abCMOSData[ChipSet.CMOS_ADDR.RTC_HOUR] >= 24) {
                        this.abCMOSData[ChipSet.CMOS_ADDR.RTC_HOUR] = 0;
                        this.abCMOSData[ChipSet.CMOS_ADDR.RTC_WEEK_DAY] = (this.abCMOSData[ChipSet.CMOS_ADDR.RTC_WEEK_DAY] % 7) + 1;
                        var nDayMax = usr.getMonthDays(this.abCMOSData[ChipSet.CMOS_ADDR.RTC_MONTH], this.abCMOSData[ChipSet.CMOS_ADDR.RTC_YEAR]);
                        if (++this.abCMOSData[ChipSet.CMOS_ADDR.RTC_MONTH_DAY] > nDayMax) {
                            this.abCMOSData[ChipSet.CMOS_ADDR.RTC_MONTH_DAY] = 1;
                            if (++this.abCMOSData[ChipSet.CMOS_ADDR.RTC_MONTH] > 12) {
                                this.abCMOSData[ChipSet.CMOS_ADDR.RTC_MONTH] = 1;
                                this.abCMOSData[ChipSet.CMOS_ADDR.RTC_YEAR] = (this.abCMOSData[ChipSet.CMOS_ADDR.RTC_YEAR] + 1) % 100;
                            }
                        }
                    }
                }
            }
        }
    }
    this.nCyclesCMOSLastUpdate = nCyclesUpdate - (nCyclesDelta % nCyclesPerSecond);
};

/**
 * initCMOSData()
 *
 * Initialize all the CMOS configuration bytes in the range 0x0E-0x2F (TODO: Decide what to do about 0x30-0x3F)
 *
 * Note that the MODEL_5170 "SETUP" utility is normally what sets all these bytes, including the checksum, and then
 * the BIOS verifies it, but since we want our machines to pass BIOS verification "out of the box", we go the extra
 * mile here, even though it's not really our responsibility.
 *
 * @this {ChipSet}
 */
ChipSet.prototype.initCMOSData = function()
{
    /*
     * Make sure all the "checksummed" CMOS bytes get initialized (not just the handful we set below) to ensure
     * that the checksum will be valid.
     */
    for (var iCMOS = ChipSet.CMOS_ADDR.DIAG; iCMOS < ChipSet.CMOS_ADDR.CHKSUM_HI; iCMOS++) {
        this.abCMOSData[iCMOS] = 0;
    }

    /*
     * We propagate all compatible "legacy" SW1 bits to the CMOS_EQUIP byte using the old SW masks, but any further
     * access to CMOS_ADDR.EQUIP should use the new CMOS_EQUIP flags (eg, CMOS_EQUIP.COPROC, CMOS_EQUIP.MONITOR.CGA80, etc).
     * 
     * TODO: Consider more generic ChipSet parameters to specify equipment settings, so that newer models like MODEL_5170
     * don't have to rely on these legacy switch settings.  In fact, switch settings should NEVER be required; we should be
     * setting defaults to automatically match the rest of the machine's hardware specification.  However, that's probably
     * incomplete; for example, does the FDC component have a way of specifying the number of drives, and do we honor that?
     * I think not....
     */
    this.abCMOSData[ChipSet.CMOS_ADDR.EQUIP] = this.sw1 & (ChipSet.PPI_SW.MONITOR.MASK | ChipSet.PPI_SW.COPROC | ChipSet.PPI_SW.FDRIVE.IPL | ChipSet.PPI_SW.FDRIVE.MASK);

    /*
     * TODO: We default all floppy diskette drives to non-High Capacity (double-density) drives, but this will have to change.
     */
    var bDisketteTypes = 0;
    var cDisketteDrives = this.getSW1FloppyDrives();
    if (cDisketteDrives > 0) bDisketteTypes |= ChipSet.CMOS_FDRIVE.D0_DS;
    if (cDisketteDrives > 1) bDisketteTypes |= ChipSet.CMOS_FDRIVE.D1_DS;
    this.abCMOSData[ChipSet.CMOS_ADDR.FDRIVE] = bDisketteTypes;

    var wBaseMemKb = this.getSWMemorySize();
    this.abCMOSData[ChipSet.CMOS_ADDR.BASEMEM_LO] = wBaseMemKb & 0xff;
    this.abCMOSData[ChipSet.CMOS_ADDR.BASEMEM_HI] = wBaseMemKb >> 8;
    
    /*
     * The final step is calculating the CMOS checksum, which we then store into the CMOS as a courtesy, so that the
     * user doesn't get unnecessary CMOS errors.
     */
    var wChecksum = this.getCMOSChecksum();
    this.abCMOSData[ChipSet.CMOS_ADDR.CHKSUM_LO] = wChecksum & 0xff;
    this.abCMOSData[ChipSet.CMOS_ADDR.CHKSUM_HI] = wChecksum >> 8;
};

/**
 * getCMOSChecksum()
 * 
 * This sums all the CMOS bytes from 0x10-0x2D, creating a 16-bit checksum.  That's a total of 30 (unsigned) 8-bit
 * values which could sum to at most 30*255 or 7650 (0x1DE2).  Since there's no way that can overflow 16 bits, we don't
 * worry about masking it with 0xffff.
 * 
 * WARNING: The IBM PC AT TechRef, p.1-53 (p.75) claims that the checksum is on bytes 0x10-0x20, but that's simply wrong.
 * 
 * @this {ChipSet}
 * @return {number} 16-bit checksum of CMOS bytes 0x10-0x2D
 */
ChipSet.prototype.getCMOSChecksum = function()
{
    var wChecksum = 0;
    for (var iCMOS = ChipSet.CMOS_ADDR.FDRIVE; iCMOS < ChipSet.CMOS_ADDR.CHKSUM_HI; iCMOS++) {
        wChecksum += this.abCMOSData[iCMOS];
    }
    return wChecksum;
};

/**
 * save()
 * 
 * @this {ChipSet}
 * @return {Object}
 *
 * This implements save support for the ChipSet component.
 */
ChipSet.prototype.save = function()
{
    var state = new State(this);
    state.set(0, [this.sw1Init, this.sw2Init, this.sw1, this.sw2]);
    state.set(1, [this.saveDMAControllers()]);
    state.set(2, [this.savePICs()]);
    state.set(3, [this.bTimerCtrl, this.saveTimers()]);
    state.set(4, [this.bPPIA, this.bPPIB, this.bPPIC, this.bPPICtrl, this.bNMI]);
    if (this.model >= ChipSet.MODEL_5170) {
        state.set(5, [this.b8042Status, this.b8042InBuff, this.b8042CmdData,
                      this.b8042OutBuff, this.b8042InPort, this.b8042OutPort]);
        state.set(6, [this.bCMOSAddr, this.abCMOSData, this.nCyclesCMOSLastUpdate]);
    }
    return state.data();
};

/**
 * restore(data)
 * 
 * @this {ChipSet}
 * @param {Object} data
 * @return {boolean} true if successful, false if failure
 *
 * This implements restore support for the ChipSet component.
 */
ChipSet.prototype.restore = function(data)
{
    var a, i;
    a = data[0];
    this.sw1Init = a[0];
    this.sw2Init = a[1];
    this.sw1 = a[2];
    this.sw2 = a[3];

    a = data[1];
    this.aDMACs = new Array(this.cDMACs);
    for (i = 0; i < this.cDMACs; i++) {
        this.initDMAController(i, a.length == 1? a[0][i] : a);
    }
    
    a = data[2];
    this.aPICs = new Array(this.cPICs);
    for (i = 0; i < this.cPICs; i++) {
        this.initPIC(i, i === 0? ChipSet.PIC0.PORT_LO : ChipSet.PIC1.PORT_LO, a[0][i]);
    }
    
    a = data[3];
    this.bTimerCtrl = a[0];
    this.aTimers = new Array(3);
    for (i = 0; i < this.aTimers.length; i++) {
        this.initTimer(i, a[1][i]);
    }
    
    a = data[4];
    this.bPPIA = a[0];
    this.bPPIB = a[1];
    this.bPPIC = a[2];
    this.bPPICtrl = a[3];
    this.bNMI  = a[4];
    
    a = data[5];
    if (a) {
        Component.assert(this.model >= ChipSet.MODEL_5170);
        this.b8042Status = a[0];
        this.b8042InBuff = a[1];
        this.b8042CmdData = a[2];
        this.b8042OutBuff = a[3];
        this.b8042InPort = a[4];
        this.b8042OutPort = a[5];
    }

    a = data[6];
    if (a) {
        Component.assert(this.model >= ChipSet.MODEL_5170);
        this.bCMOSAddr = a[0];
        this.abCMOSData = a[1];
        this.nCyclesCMOSLastUpdate = a[2];
    }
    return true;
};

/**
 * initDMAController(iDMAC, aState)
 *
 * @this {ChipSet}
 * @param {number} iDMAC
 * @param {Array} [aState]
 */
ChipSet.prototype.initDMAController = function(iDMAC, aState)
{
    var controller = this.aDMACs[iDMAC] = {};
    if (!aState || aState.length != 5) aState = [0, undefined, undefined, 0, []];
    controller.bStatus = aState[0];
    controller.bCmd = aState[1];
    controller.bReq = aState[2];
    controller.bIndex = aState[3];
    controller.nChannelBase = iDMAC << 2;
    controller.aChannels = new Array(4);
    for (var iChannel = 0; iChannel < controller.aChannels.length; iChannel++) {
        this.initDMAChannel(controller, iChannel, aState[4][iChannel]);
    }
};

/**
 * initDMAChannel(controller, iChannel, aState)
 * 
 * @this {ChipSet}
 * @param {Object} controller
 * @param {number} iChannel
 * @param {Array} [aState]
 */
ChipSet.prototype.initDMAChannel = function(controller, iChannel, aState)
{
    var channel = controller.aChannels[iChannel] = {};
    if (aState === undefined || aState.length != 8) {
        aState = [true, [], [], [], []];
    }
    channel.controller = controller;
    channel.iChannel = iChannel;
    channel.masked = aState[0];
    channel.addrInit = aState[1];
    channel.countInit = aState[2];
    channel.addrCurrent = aState[3];
    channel.countCurrent = aState[4];
    channel.mode = aState[5];
    channel.bPage = aState[6];
    // aState[7] is deprecated
    this.initDMAFunction(channel, aState[8], aState[9]);
};

/**
 * initDMAFunction(channel)
 * 
 * @param {Object} channel
 * @param {Component|string} component
 * @param {string} sFunction
 * @param {Object} [obj]
 * @return {*}
 */
ChipSet.prototype.initDMAFunction = function(channel, component, sFunction, obj)
{
    if (typeof component == "string") {
        component = Component.getComponentByID(component);
    }
    if (component) {
        channel.done = null;
        channel.sDevice = component.id;
        channel.sFunction = sFunction;
        channel.component = component;
        channel.fnTransfer = component[sFunction];
        channel.obj = obj;
    }
    return channel.fnTransfer;
};

/**
 * saveDMAControllers()
 * 
 * @this {ChipSet}
 * @return {Array}
 */
ChipSet.prototype.saveDMAControllers = function()
{
    var data = [];
    for (var iDMAC = 0; iDMAC < this.aDMACs; iDMAC++) {
        var a = [];
        var controller = this.aDMACs[iDMAC];
        a[0] = controller.bStatus;
        a[1] = controller.bCmd;
        a[2] = controller.bReq;
        a[3] = controller.bIndex;
        a[4] = this.saveDMAChannels(controller);
        data[iDMAC] = a;
    }
    return data;
};

/**
 * saveDMAChannels(controller)
 * 
 * @this {ChipSet}
 * @param {Object} controller
 * @return {Array}
 */
ChipSet.prototype.saveDMAChannels = function(controller)
{
    var data = [];
    for (var iChannel = 0; iChannel < controller.aChannels.length; iChannel++) {
        var a = [];
        var channel = controller.aChannels[iChannel];
        a[0] = channel.masked;
        a[1] = channel.addrInit;
        a[2] = channel.countInit;
        a[3] = channel.addrCurrent;
        a[4] = channel.countCurrent;
        a[5] = channel.mode;
        a[6] = channel.bPage;
        a[8] = channel.sDevice;
        a[9] = channel.sFunction;
        data[iChannel] = a;
    }
    return data;
};

/**
 * initPIC(iPIC, aState)
 * 
 * @this {ChipSet}
 * @param {number} iPIC
 * @param {number} port
 * @param {Array} [aState]
 */
ChipSet.prototype.initPIC = function(iPIC, port, aState)
{
    var pic = this.aPICs[iPIC] = {};
    if (!aState || aState.length != 8) aState = [0, [undefined, undefined, undefined, undefined]];
    pic.port = port;
    pic.nIRQBase = iPIC << 3;
    pic.nDelay = aState[0];
    pic.aICW = aState[1];
    pic.nICW = aState[2];
    pic.bIMR = aState[3];
    pic.bIRR = aState[4];
    pic.bISR = aState[5];
    pic.bIRLow = aState[6];
    pic.bOCW3 = aState[7];
};

/**
 * savePICs()
 * 
 * @this {ChipSet}
 * @return {Array}
 */
ChipSet.prototype.savePICs = function()
{
    var data = [];
    for (var iPIC = 0; iPIC < this.aPICs.length; iPIC++) {
        var a = [];
        var pic = this.aPICs[iPIC];
        a[0] = pic.nDelay;
        a[1] = pic.aICW;
        a[2] = pic.nICW;
        a[3] = pic.bIMR;
        a[4] = pic.bIRR;
        a[5] = pic.bISR;
        a[6] = pic.bIRLow;
        a[7] = pic.bOCW3;
        data[iPIC] = a;
    }
    return data;
};

/**
 * initTimer(iTimer, aState)
 * 
 * @this {ChipSet}
 * @param {number} iTimer
 * @param {Array} [aState]
 */
ChipSet.prototype.initTimer = function(iTimer, aState)
{
    var timer = this.aTimers[iTimer] = {};
    if (aState === undefined || aState.length != 13) {
        aState = [ [], [], [], [] ];
    }
    timer.countInit = aState[0];
    timer.countStart = aState[1];
    timer.countCurrent = aState[2];
    timer.countLatched = aState[3];
    timer.bcd = aState[4];
    timer.mode = aState[5];
    timer.rw = aState[6];
    timer.countIndex = aState[7];
    timer.countBytes = aState[8];
    timer.fOUT = aState[9];
    timer.fLatched = aState[10];
    timer.fCounting = aState[11];
    timer.nStartCycles = aState[12];
};

/**
 * saveTimers()
 * 
 * @this {ChipSet}
 * @return {Array}
 */
ChipSet.prototype.saveTimers = function()
{
    var data = [];
    for (var iTimer = 0; iTimer < this.aTimers.length; iTimer++) {
        var a = [];
        var timer = this.aTimers[iTimer];
        a[0] = timer.countInit;
        a[1] = timer.countStart;
        a[2] = timer.countCurrent;
        a[3] = timer.countLatched;
        a[4] = timer.bcd;
        a[5] = timer.mode;
        a[6] = timer.rw;
        a[7] = timer.countIndex;
        a[8] = timer.countBytes;
        a[9] = timer.fOUT;
        a[10] = timer.fLatched;
        a[11] = timer.fCounting;
        a[12] = timer.nStartCycles;
        data[iTimer] = a;
    }
    return data;
};

/**
 * getSWMemorySize(fInit)
 * 
 * @this {ChipSet}
 * @param {boolean|undefined} [fInit] is true for init switch value(s) only, current value(s) otherwise
 * @return {number} number of Kb of specified memory (NOT necessarily the same as installed memory; see RAM component)
 */
ChipSet.prototype.getSWMemorySize = function(fInit)
{
    var sw1 = (fInit? this.sw1Init : this.sw1);
    var sw2 = (fInit? this.sw2Init : this.sw2);
    return (((sw1 & ChipSet.PPI_SW.MEMORY.MASK) >> ChipSet.PPI_SW.MEMORY.SHIFT) + 1) * this.kbSW + (sw2 & ChipSet.PPI_C.SW) * 32;
};

/**
 * getSW1FloppyDrives(fInit)
 * 
 * @this {ChipSet}
 * @param {boolean|undefined} [fInit] is true for init switch value(s) only, current value(s) otherwise
 * @return {number} number of floppy drives specified by SW1 (range is 0 to 4)
 */
ChipSet.prototype.getSW1FloppyDrives = function(fInit)
{
    var sw1 = (fInit? this.sw1Init : this.sw1);
    return ((this.model != ChipSet.MODEL_5150) || (sw1 & ChipSet.PPI_SW.FDRIVE.IPL))? ((sw1 & ChipSet.PPI_SW.FDRIVE.MASK) >> ChipSet.PPI_SW.FDRIVE.SHIFT) + 1 : 0;
};

/**
 * getSW1VideoMonitor(fInit)
 * 
 * @this {ChipSet}
 * @param {boolean|undefined} [fInit] is true for init switch value(s) only, current value(s) otherwise
 * @return {number} one of ChipSet.MONITOR.*
 */
ChipSet.prototype.getSW1VideoMonitor = function(fInit)
{
    var sw1 = (fInit? this.sw1Init : this.sw1);
    return (sw1 & ChipSet.PPI_SW.MONITOR.MASK) >> ChipSet.PPI_SW.MONITOR.SHIFT;
};

/**
 * addSwitches(s, control, n, v, oTips)
 * 
 * @this {ChipSet}
 * @param {string} s is the name of the control
 * @param {Object} control is the HTML control DOM object
 * @param {number} n is the number of switches to add
 * @param {number} v contains the current value(s) of the switches
 * @param {Object} oTips contains tooltips for the various cells
 */
ChipSet.prototype.addSwitches = function(s, control, n, v, oTips)
{
    var sHTML = "";
    var sCellClass = PCJSCLASS + "-bitCell";
    for (var i = 1; i <= n; i++) {
        var sCellClasses = sCellClass;
        if (!i) sCellClasses += " " + PCJSCLASS + "-bitCellLeft";
        var sCellID = s + "-" + i;
        sHTML += "<div id=\"" + sCellID + "\" class=\"" + sCellClasses + "\" data-value=\"0\">" + i + "</div>\n";
    }
    control.innerHTML = sHTML;
    var aeCells = Component.getElementsByClass(control, sCellClass);
    var sTip = null;
    for (i = 0; i < aeCells.length; i++) {
        if (oTips !== undefined && oTips[i] !== undefined) {
            sTip = oTips[i];
        }
        if (sTip) aeCells[i].setAttribute("title", sTip);
        this.setSwitch(aeCells[i], (v & (0x1 << i))? false : true);
        aeCells[i].onclick = function(chipset, eSwitch) {
            /*
             *  If we defined the onclick handler below as "function(e)" instead of simply "function()", then we could
             *  also receive an event object (e); however, IE reportedly requires that we examine a global (window.event)
             *  instead.  If that's true, and if we ever care to get more details about the click event, then we might
             *  have to worry about that (eg, define a local var: "var event = window.event || e").
             */
            return function onClickSwitch() {
                chipset.toggleSwitch(eSwitch);
            };
        }(this, aeCells[i]);
    }
};

/**
 * getSwitch(control)
 * 
 * @this {ChipSet}
 * @param {Object} control is an HTML control DOM object
 * @return {boolean} true if the switch represented by e is "on", false if "off"
 */
ChipSet.prototype.getSwitch = function(control)
{
    return control.getAttribute("data-value") == "1";
};

/**
 * setSwitch(control, f)
 * 
 * @this {ChipSet}
 * @param {Object} control is an HTML control DOM object
 * @param {boolean} f is true if the switch represented by e should be "on", false if "off"
 */
ChipSet.prototype.setSwitch = function(control, f)
{
    control.setAttribute("data-value", f? "1" : "0");
    control.style.color = (f? "#ffffff" : "#000000");
    control.style.backgroundColor = (f? "#000000" : "#ffffff");
};

/**
 * toggleSwitch(control)
 * 
 * @this {ChipSet}
 * @param {Object} control is an HTML control DOM object
 */
ChipSet.prototype.toggleSwitch = function(control)
{
    var f = !this.getSwitch(control);
    this.setSwitch(control, f);
    var sID = control.getAttribute("id");
    var asParts = sID.split("-");
    var b = (0x1 << (parseInt(asParts[1], 10) - 1));
    switch (asParts[0]) {
    case "sw1":
        this.sw1Init = (this.sw1Init & ~b) | (f? 0 : b);
        break;
    case "sw2":
        this.sw2Init = (this.sw2Init & ~b) | (f? 0 : b);
        break;
    default:
        break;
    }
    this.updateSwitchDesc();
};

/**
 * updateSwitchDesc()
 * 
 * @this {ChipSet}
 */
ChipSet.prototype.updateSwitchDesc = function()
{
    var controlDesc = this.bindings["swdesc"];
    /*
     * TODO: Monitor type 0 used to be "No" (as in "No Monitor"), which was correct in the pre-EGA world,
     * but in the post-EGA world, it depends.  We could ask the Video component for a definitive answer, but
     * but what we print here isn't that critical.  Most people won't even bother with a Control Panel,
     * which is really the only beneficiary of this code.
     */
    var asMonitorTypes = {
        0: "Enhanced Color",
        1: "TV",
        2: "Color",
        3: "Monochrome"
    };
    if (controlDesc !== undefined) {
        var sHTML = "";
        sHTML += this.getSWMemorySize(true) + "Kb";
        sHTML += ", " + asMonitorTypes[this.getSW1VideoMonitor(true)] + " Monitor";
        sHTML += ", " + this.getSW1FloppyDrives(true) + " Floppy Drives";
        if (this.sw1 !== undefined && this.sw1 != this.sw1Init || this.sw2 !== undefined && this.sw2 != this.sw2Init)
            sHTML += " (Reset required)";
        controlDesc.innerHTML = sHTML;
    }
};

/**
 * dumpPIC()
 * 
 * @this {ChipSet}
 */
ChipSet.prototype.dumpPIC = function()
{
    if (DEBUGGER) {
        for (var iPIC = 0; iPIC < this.aPICs.length; iPIC++) {
            var pic = this.aPICs[iPIC];
            var sDump = "PIC" + iPIC + ":";
            for (var i = 0; i < pic.aICW.length; i++) {
                var b = pic.aICW[i];
                sDump += " IC" + (i + 1) + "=" + str.toHexByte(b);
            }
            sDump += " IMR=" + str.toHexByte(pic.bIMR) + " IRR=" + str.toHexByte(pic.bIRR) + " ISR=" + str.toHexByte(pic.bISR);
            this.dbg.message(sDump);
        }
    }
};

/**
 * dumpTimer()
 * 
 * @this {ChipSet}
 */
ChipSet.prototype.dumpTimer = function()
{
    if (DEBUGGER) {
        for (var iTimer = 0; iTimer < this.aTimers.length; iTimer++) {
            this.updateTimer(iTimer);
            var timer = this.aTimers[iTimer];
            var sDump = "TIMER" + iTimer + ":";
            var count = 0;
            if (timer.countBytes !== undefined) {
                for (var i = 0; i <= timer.countBytes; i++) {
                    count |= (timer.countCurrent[i] << (i * 8));
                }
            }
            sDump += " MODE" + timer.mode + " BYTES=" + timer.countBytes + " COUNT=" + str.toHexWord(count);
            this.dbg.message(sDump);
        }
    }
};

/**
 * inDMAChannelAddr(iDMAC, iChannel, port, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} iDMAC
 * @param {number} iChannel
 * @param {number} port
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inDMAChannelAddr = function(iDMAC, iChannel, port, addrFrom)
{
    var controller = this.aDMACs[iDMAC];
    var channel = controller.aChannels[iChannel];
    var b = channel.addrCurrent[controller.bIndex];
    controller.bIndex ^= 0x1;
    this.messagePort(port, null, addrFrom, "DMA" + iDMAC + ".CHANNEL" + iChannel + ".ADDR[" + controller.bIndex + "]", ChipSet.MESSAGE_DMA, b);
    return b;
};

/**
 * outDMAChannelAddr(iDMAC, iChannel, port, bOut, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} iDMAC
 * @param {number} iChannel
 * @param {number} port
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 */
ChipSet.prototype.outDMAChannelAddr = function outDMAChannelAddr(iDMAC, iChannel, port, bOut, addrFrom)
{
    var controller = this.aDMACs[iDMAC];
    this.messagePort(port, bOut, addrFrom, "DMA" + iDMAC + ".CHANNEL" + iChannel + ".ADDR[" + controller.bIndex + "]", ChipSet.MESSAGE_DMA);
    var channel = controller.aChannels[iChannel];
    channel.addrCurrent[controller.bIndex] = channel.addrInit[controller.bIndex] = bOut;
    controller.bIndex ^= 0x1;
};

/**
 * inDMAChannelCount(iDMAC, iChannel, port, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} iDMAC
 * @param {number} iChannel
 * @param {number} port
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inDMAChannelCount = function(iDMAC, iChannel, port, addrFrom)
{
    var controller = this.aDMACs[iDMAC];
    var channel = controller.aChannels[iChannel];
    var b = channel.countCurrent[controller.bIndex];
    controller.bIndex ^= 0x1;
    this.messagePort(port, null, addrFrom, "DMA" + iDMAC + ".CHANNEL" + iChannel + ".COUNT[" + controller.bIndex + "]", ChipSet.MESSAGE_DMA, b);
    return b;
};

/**
 * outDMAChannelCount(iDMAC, iChannel, port, bOut, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} iDMAC
 * @param {number} iChannel (ports 0x01, 0x03, 0x05, 0x07)
 * @param {number} port
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 */
ChipSet.prototype.outDMAChannelCount = function(iDMAC, iChannel, port, bOut, addrFrom)
{
    var controller = this.aDMACs[iDMAC];
    this.messagePort(port, bOut, addrFrom, "DMA" + iDMAC + ".CHANNEL" + iChannel + ".COUNT[" + controller.bIndex + "]", ChipSet.MESSAGE_DMA);
    var channel = controller.aChannels[iChannel];
    channel.countCurrent[controller.bIndex] = channel.countInit[controller.bIndex] = bOut;
    controller.bIndex ^= 0x1;
};

/**
 * inDMAStatus(iDMAC, port, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} iDMAC
 * @param {number} port
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 *
 * From the 8237A spec:
 *
 * "The Status register is available to be read out of the 8237A by the microprocessor.
 * It contains information about the status of the devices at this point. This information includes
 * which channels have reached a terminal count and which channels have pending DMA requests.
 *
 * Bits 0–3 are set every time a TC is reached by that channel or an external EOP is applied.
 * These bits are cleared upon Reset and on each Status Read.
 *
 * Bits 4–7 are set whenever their corresponding channel is requesting service."
 *
 * TRIVIA: This hook wasn't installed when I was testing with the MODEL_5150 ROM BIOS, and it
 * didn't matter, but the MODEL_5160 ROM BIOS checks it several times, including @F000:E156, where
 * it verifies that TIMER1 didn't request service on channel 0.
 */
ChipSet.prototype.inDMAStatus = function(iDMAC, port, addrFrom)
{
    /*
     * HACK: Unlike the MODEL_5150, the MODEL_5160 ROM BIOS checks DMA channel 0 for TC (@F000:E4DF)
     * after running a number of unrelated tests, since enough time would have passed for channel 0 to
     * have reached TC at least once.  So I simply OR in a hard-coded TC bit for channel 0 every time
     * status is read.  
     */
    var controller = this.aDMACs[iDMAC];
    var b = controller.bStatus | 0x1;
    controller.bStatus &= ~0xf;
    this.messagePort(port, null, addrFrom, "DMA" + iDMAC + ".STATUS", ChipSet.MESSAGE_DMA, b);
    return b;
};

/**
 * outDMACmd(iDMAC, port, bOut, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} iDMAC
 * @param {number} port
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 */
ChipSet.prototype.outDMACmd = function(iDMAC, port, bOut, addrFrom)
{
    this.messagePort(port, bOut, addrFrom, "DMA" + iDMAC + ".CMD", ChipSet.MESSAGE_DMA);
    this.aDMACs[iDMAC].bCmd = bOut;
};

/**
 * outDMAReq(iDMAC, port, bOut, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} iDMAC
 * @param {number} port
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 *
 * From the 8237A spec:
 *
 * "The 8237A can respond to requests for DMA service which are initiated by software as well as by a DREQ.
 * Each channel has a request bit associated with it in the 4-bit Request register. These are non-maskable and subject
 * to prioritization by the Priority Encoder network. Each register bit is set or reset separately under software
 * control or is cleared upon generation of a TC or external EOP. The entire register is cleared by a Reset.
 *
 * To set or reset a bit the software loads the proper form of the data word.... In order to make a software request,
 * the channel must be in Block Mode."
 */
ChipSet.prototype.outDMAReq = function(iDMAC, port, bOut, addrFrom)
{
    var controller = this.aDMACs[iDMAC];
    this.messagePort(port, bOut, addrFrom, "DMA" + iDMAC + ".REQ", ChipSet.MESSAGE_DMA);
    /*
     * Bits 0-1 contain the channel number
     */
    var iChannel = (bOut & 0x3);
    /*
     * Bit 2 is the request bit (0 to reset, 1 to set), which must be propagated to the corresponding bit (4-7) in the status register 
     */
    var iChannelBit = ((bOut & 0x4) << (iChannel + 2));
    controller.bStatus = (controller.bStatus & ~(0x10 << iChannel)) | iChannelBit;
    controller.bReq = bOut;
};

/**
 * outDMAMask(iDMAC, port, bOut, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} iDMAC
 * @param {number} port
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 */
ChipSet.prototype.outDMAMask = function(iDMAC, port, bOut, addrFrom)
{
    var controller = this.aDMACs[iDMAC];
    this.messagePort(port, bOut, addrFrom, "DMA" + iDMAC + ".MASK", ChipSet.MESSAGE_DMA);
    var iChannel = bOut & ChipSet.DMA_MASK.CHANNEL;
    var channel = controller.aChannels[iChannel];
    channel.masked = (bOut & ChipSet.DMA_MASK.CHANNEL_SET? true : false);
    if (!channel.masked) this.requestDMA(controller.nChannelBase + iChannel);
};

/**
 * outDMAMode(iDMAC, port, bOut, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} iDMAC
 * @param {number} port
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 */
ChipSet.prototype.outDMAMode = function(iDMAC, port, bOut, addrFrom)
{
    this.messagePort(port, bOut, addrFrom, "DMA" + iDMAC + ".MODE", ChipSet.MESSAGE_DMA);
    var iChannel = bOut & ChipSet.DMA_MODE.CHANNEL;
    this.aDMACs[iDMAC].aChannels[iChannel].mode = bOut;
};

/**
 * outDMAIndex(iDMAC, port, bOut, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} iDMAC
 * @param {number} port
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 *
 * Any write to this port simply resets the controller's "first/last flip-flop", which determines whether the even or odd byte
 * of a DMA address or count register will be accessed next.
 */
ChipSet.prototype.outDMAIndex = function(iDMAC, port, bOut, addrFrom)
{
    this.messagePort(port, bOut, addrFrom, "DMA" + iDMAC + ".INDEX", ChipSet.MESSAGE_DMA);
    this.aDMACs[iDMAC].bIndex = 0;
};

/**
 * outDMAClear(iDMAC, port, bOut, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} iDMAC
 * @param {number} port
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 */
ChipSet.prototype.outDMAClear = function(iDMAC, port, bOut, addrFrom)
{
    this.messagePort(port, bOut, addrFrom, "DMA" + iDMAC + ".CLEAR", ChipSet.MESSAGE_DMA);
    /*
     * The value written to this port doesn't matter; any write triggers a "master clear" operation
     */
    var controller = this.aDMACs[iDMAC];
    for (var i = 0; i < controller.aChannels.length; i++) {
        this.initDMAChannel(controller, i);
    }
};

/**
 * inDMAPageReg(iDMAC, iChannel, port, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} iDMAC
 * @param {number} iChannel
 * @param {number} port
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inDMAPageReg = function(iDMAC, iChannel, port, addrFrom)
{
    var bIn = this.aDMACs[iDMAC].aChannels[iChannel].bPage;
    this.messagePort(port, null, addrFrom, "DMA" + iDMAC + ".CHANNEL" + iChannel + ".PAGE", ChipSet.MESSAGE_DMA, bIn);
    return bIn;
};

/**
 * outDMAPageReg(iDMAC, iChannel, port, bOut, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} iDMAC
 * @param {number} iChannel
 * @param {number} port
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 */
ChipSet.prototype.outDMAPageReg = function(iDMAC, iChannel, port, bOut, addrFrom)
{
    this.messagePort(port, bOut, addrFrom, "DMA" + iDMAC + ".CHANNEL" + iChannel + ".PAGE", ChipSet.MESSAGE_DMA);
    this.aDMACs[iDMAC].aChannels[iChannel].bPage = bOut;
};

/**
 * inDMAPageSpare(iSpare, port, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} iSpare
 * @param {number} port
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inDMAPageSpare = function(iSpare, port, addrFrom)
{
    var bIn = this.abDMAPageSpare[iSpare];
    this.messagePort(port, null, addrFrom, "DMA.SPARE" + iSpare + ".PAGE", ChipSet.MESSAGE_DMA, bIn);
    return bIn;
};

/**
 * outDMAPageSpare(iSpare, port, bOut, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} iSpare
 * @param {number} port
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 */
ChipSet.prototype.outDMAPageSpare = function(iSpare, port, bOut, addrFrom)
{
    this.messagePort(port, bOut, addrFrom, "DMA.SPARE" + iSpare + ".PAGE", ChipSet.MESSAGE_DMA);
    this.abDMAPageSpare[iSpare] = bOut;
};

/**
 * checkDMA()
 *
 * Called by the CPU whenever INTR.DMA is set.
 * 
 * @return {boolean} true if one or more async DMA channels are still active (unmasked), false to reset INTR.DMA 
 */
ChipSet.prototype.checkDMA = function()
{
    var fActive = false;
    for (var iDMAC = 0; iDMAC < this.aDMACs; iDMAC++) {
        var controller = this.aDMACs[iDMAC];
        for (var iChannel = 0; iChannel < controller.aChannels.length; iChannel++) {
            var channel = controller.aChannels[iChannel];
            if (!channel.masked) {
                this.advanceDMA(channel);
                if (!channel.masked) fActive = true;
            }
        }
    }
    return fActive;
};

/**
 * connectDMA(iDMAChannel, component, sFunction, obj)
 *
 * @param {number} iDMAChannel
 * @param {Component|string} component
 * @param {string} sFunction
 * @param {Object} obj (eg, when the HDC connects, it passes a drive object)
 */
ChipSet.prototype.connectDMA = function(iDMAChannel, component, sFunction, obj)
{
    var iDMAC = iDMAChannel >> 2;
    var controller = this.aDMACs[iDMAC];

    var iChannel = iDMAChannel & 0x3;
    var channel = controller.aChannels[iChannel];

    this.initDMAFunction(channel, component, sFunction, obj);
};

/**
 * requestDMA(iDMAChannel, done)
 *
 * @this {ChipSet}
 * @param {number} iDMAChannel
 * @param {function(boolean)} [done]
 *
 * For DMA_MODE_XFER_WRITE transfers, fnTransfer(-1) must return bytes as long as we request them (although it may
 * return -1 if it runs out of bytes prematurely).
 *
 * Similarly, for DMA_MODE_XFER_READ transfers, fnTransfer(b) must accept bytes as long as we deliver them (although
 * it is certainly free to ignore bytes it no longer wants).
 */
ChipSet.prototype.requestDMA = function(iDMAChannel, done)
{
    var iDMAC = iDMAChannel >> 2;
    var controller = this.aDMACs[iDMAC];
    
    var iChannel = iDMAChannel & 0x3;
    var channel = controller.aChannels[iChannel];

    if (!channel.component || !channel.fnTransfer || !channel.obj) {
        if (DEBUG) this.messageDebugger("requestDMA(" + iDMAChannel + "): not connected to a component", ChipSet.MESSAGE_DMA);
        if (done) done(true);
        return;
    }

    /*
     * We can't simply slam done into channel.done; that would be fine if requestDMA() was called only by functions
     * like HDC.doRead() and HDC.doWrite(), but we're also called whenever a DMA channel is unmasked, and in those cases,
     * we need to preserve whatever handler may have been previously set.
     * 
     * However, in an effort to ensure we don't end up with stale done handlers, connectDMA() will reset channel.done.
     */
    if (done) channel.done = done;

    if (channel.masked) {
        if (DEBUG) this.messageDebugger("requestDMA(" + iDMAChannel + "): channel masked, request queued", ChipSet.MESSAGE_DMA);
        return;
    }

    /*
     * Let's try to do async DMA without asking the CPU for help...
     *
     *      this.cpu.setDMA(true);
     */
    this.advanceDMA(channel, true);
};

/**
 * advanceDMA(channel, fInit)
 * 
 * @param {Object} channel
 * @param {boolean} [fInit]
 */
ChipSet.prototype.advanceDMA = function(channel, fInit)
{
    if (fInit) {
        channel.count = (channel.countCurrent[1] << 8) | channel.countCurrent[0];
        channel.xfer = (channel.mode & ChipSet.DMA_MODE.XFER);
        channel.fWarning = channel.fError = false;
        if (DEBUG && DEBUGGER) {
            channel.cbDebug = channel.count + 1;
            channel.sAddrDebug = (DEBUG && DEBUGGER? null : undefined);
        }
    }
    /*
     * To support async DMA without requiring help from the CPU (ie, without relying upon cpu.setDMA()), we require that
     * the data transfer functions provide an fAsync parameter to their callbacks; fAsync must be true if the callback was
     * truly asynchronous (ie, it had to wait for a remote I/O request to finish), or false if the data was already available
     * and the callback was performed synchronously.
     * 
     * Whenever a callback is issued asynchronously, we will immediately daisy-chain another pair of updateDMA()/advanceDMA()
     * calls, which will either finish the DMA operation if no more remote I/O requests are required, or will queue up another
     * I/O request, which will in turn trigger another async callback.  Thus, the DMA request keeps itself going without
     * requiring any special assistance from the CPU via setDMA().
     */
    var obj = this;
    var fAsyncRequest = false;
    var controller = channel.controller;
    var iDMAChannel = controller.nChannelBase + channel.iChannel;

    while (true) {
        if (channel.count >= 0) {
            var b;
            var addr = (channel.bPage << 16) | (channel.addrCurrent[1] << 8) | channel.addrCurrent[0];
            if (DEBUG && DEBUGGER && channel.sAddrDebug === null) {
                channel.sAddrDebug = str.toHex(addr >> 4, 4) + ":" + str.toHex(addr & 0xf, 4);
                if (this.dbg && this.dbg.messageEnabled(this.dbg.MESSAGE_DMA | (iDMAChannel == ChipSet.DMA_FDC? this.dbg.MESSAGE_FDC : (iDMAChannel == ChipSet.DMA_HDC? this.dbg.MESSAGE_HDC : this.dbg.MESSAGE_LOG))) && channel.xfer != ChipSet.DMA_MODE.XFER_WRITE) {
                    this.dbg.message("advanceDMA(" + iDMAChannel + ") transferring " + channel.cbDebug + " bytes from " + channel.sAddrDebug);
                    this.dbg.doDump("db", channel.sAddrDebug, "l" + Math.floor((channel.cbDebug + 15) / 16));
                }
            }
            if (channel.xfer == ChipSet.DMA_MODE.XFER_WRITE) {
                fAsyncRequest = true;
                (function advanceDMAWrite(addrCur) {
                    channel.fnTransfer.call(channel.component, channel.obj, -1, function onTransferDMA(b, fAsync) {
                        if (b < 0) {
                            if (!channel.fWarning) {
                                if (DEBUG) obj.messageDebugger("advanceDMA(" + iDMAChannel + ") ran out of data, assuming 0xff", ChipSet.MESSAGE_DMA);
                                channel.fWarning = true;
                            }
                            b = 0xff;                           // TODO: Determine whether to abort, as we do for DMA_MODE_XFER_READ
                        }
                        if (!channel.masked) {
                            /*
                             * While it makes sense to call bus.setByteDirect(), since DMA deals with physical memory,
                             * we lose the ability to trap accesses with write breakpoints by not using obj.cpu.setByte().
                             * 
                             * TODO: Consider providing a Bus memory interface that honors write breakpoints.
                             */
                            obj.bus.setByteDirect(addrCur, b);
                        }
                        fAsyncRequest = fAsync;
                        if (fAsync) {
                            setTimeout(function() {
                                if (!obj.updateDMA(channel)) {
                                    obj.advanceDMA(channel);
                                }
                            }, 0);
                        }
                    });
                }(addr));
            }
            else if (channel.xfer == ChipSet.DMA_MODE.XFER_READ) {
                /*
                 * While it makes sense to call bus.getByteDirect(), since DMA deals with physical memory,
                 * we lose the ability to trap accesses with read breakpoints by not using obj.cpu.getByte().
                 * 
                 * TODO: Determine whether we should support async dmaWrite() functions (currently not required),
                 * and consider providing a Bus memory interface that honors read breakpoints.
                 */
                b = obj.bus.getByteDirect(addr);
                if (channel.fnTransfer.call(channel.component, channel.obj, b) < 0) {
                    /*
                     * In this case, I think I have no choice but to terminate the DMA operation in response to a failure,
                     * because the ROM BIOS FDC.REG_DATA.CMD.FORMAT_TRACK command specifies a count that is MUCH too large (a side-effect
                     * of the ROM BIOS using the same "DMA_SETUP" code for reads, writes AND formats). 
                     */
                    channel.fError = true;
                }
            }
            else {
                if (DEBUG) this.messageDebugger("advanceDMA(" + iDMAChannel + ") unsupported xfer mode: " + str.toHexWord(channel.xfer), ChipSet.MESSAGE_DMA);
                channel.fError = true;
            }
        }
        if (fAsyncRequest || this.updateDMA(channel)) break;
    }
};

/**
 * updateDMA(channel)
 *
 * @param {Object} channel
 * @return {boolean} true if DMA operation complete, false if not
 */
ChipSet.prototype.updateDMA = function(channel)
{
    if (!channel.fError && --channel.count >= 0) {
        if (channel.mode & ChipSet.DMA_MODE.DECREMENT) {
            channel.addrCurrent[0]--;
            if (channel.addrCurrent[0] < 0) {
                channel.addrCurrent[0] = 0xff;
                channel.addrCurrent[1]--;
                if (channel.addrCurrent[1] < 0) channel.addrCurrent[1] = 0xff;
            }
        } else {
            channel.addrCurrent[0]++;
            if (channel.addrCurrent[0] > 0xff) {
                channel.addrCurrent[0] = 0x00;
                channel.addrCurrent[1]++;
                if (channel.addrCurrent[1] > 0xff) channel.addrCurrent[1] = 0x00;
            }
        }
        /*
         * In situations where an HDC DMA operation took too long, the Fixed Disk BIOS would give up, but the DMA operation would continue.
         * 
         * TODO: Verify that the Fixed Disk BIOS shuts down (ie, re-masks) a DMA channel for failed requests, and that this handles those failures.
         */
        if (!channel.masked) return false;
    }

    var controller = channel.controller;
    var iDMAChannel = controller.nChannelBase + channel.iChannel;
    controller.bStatus = (controller.bStatus & ~(0x10 << channel.iChannel)) | (0x1 << channel.iChannel);

    /*
     * EOP is supposed to automatically (re)mask the channel, unless it's set for auto-initialize. 
     */
    if (!(channel.mode & ChipSet.DMA_MODE.AUTOINIT)) {
        channel.masked = true;
        channel.component = channel.obj = null;
    }

    if (DEBUG && DEBUGGER && this.dbg && this.dbg.messageEnabled(this.dbg.MESSAGE_DMA | (iDMAChannel == ChipSet.DMA_FDC? this.dbg.MESSAGE_FDC : (iDMAChannel == ChipSet.DMA_HDC? this.dbg.MESSAGE_HDC : this.dbg.MESSAGE_LOG))) && channel.xfer == ChipSet.DMA_MODE.XFER_WRITE && channel.sAddrDebug) {
        this.dbg.message("updateDMA(" + iDMAChannel + ") transferred " + channel.cbDebug + " bytes to " + channel.sAddrDebug);
        this.dbg.doDump("db", channel.sAddrDebug, "l" + Math.floor((channel.cbDebug + 15) / 16));
    }

    if (channel.done) {
        channel.done(!channel.fError);
        channel.done = null;
    }
    
    /*
     * While it might make sense to call cpu.setDMA() here, it's simpler to let the CPU issue one more call
     * to chipset.checkDMA() and let the CPU update INTR.DMA on its own, based on the return value from checkDMA().
     */
    return true;
};

/**
 * inPICL(iPIC, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} iPIC
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inPICL = function(iPIC, addrFrom)
{
    var b = 0;
    var pic = this.aPICs[iPIC];
    if (pic.bOCW3 !== undefined) {
        var bReadReg = pic.bOCW3 & ChipSet.PIC_LO.OCW3_READ_CMD;
        switch (bReadReg) {
            case ChipSet.PIC_LO.OCW3_READ_IRR:
                b = pic.bIRR;
                break;
            case ChipSet.PIC_LO.OCW3_READ_ISR:
                b = pic.bISR;
                break;
            default:
                break;
        }
    }
    this.messagePort(pic.port, null, addrFrom, "PIC" + iPIC, ChipSet.MESSAGE_PIC, b);
    return b;
};

/**
 * outPICL(iPIC, bOut, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} iPIC
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 */
ChipSet.prototype.outPICL = function(iPIC, bOut, addrFrom)
{
    var pic = this.aPICs[iPIC];
    this.messagePort(pic.port, bOut, addrFrom, "PIC" + iPIC, ChipSet.MESSAGE_PIC);
    if (bOut & ChipSet.PIC_LO.ICW1) {
        /*
         * This must be an ICW1...
         */
        pic.nICW = 0;
        pic.aICW[pic.nICW++] = bOut;
        /*
         * I used to do the rest of this initialization in outPICH(), once all the ICW commands had been received,
         * but a closer reading of the 8259A spec indicates that that should happen now, on receipt on ICW1.
         * 
         * Also, on p.10 of that spec, it says "The Interrupt Mask Register is cleared".  I originally took that to
         * mean that all interrupts were masked, but based on what MS-DOS 4.0M expects to happen after this code runs:
         * 
         *      0070:44C6 B013          MOV      AL,13
         *      0070:44C8 E620          OUT      20,AL
         *      0070:44CA B050          MOV      AL,50
         *      0070:44CC E621          OUT      21,AL
         *      0070:44CE B009          MOV      AL,09
         *      0070:44D0 E621          OUT      21,AL
         *
         * (ie, it expects its next call to INT 0x13 will still generate an interrupt), I've decided the spec
         * must be read literally, meaning that all IMR bits must be zeroed.  Unmasking all possible interrupts by
         * default seems unwise to me, but who am I to judge....
         */
        pic.bIMR = 0x00;
        pic.bIRLow = 7;
        /*
         * TODO: I'm also zeroing both IRR and ISR, even though that's not actually mentioned as part of the ICW
         * sequence, because they need to be (re)initialized at some point.  However, if some component is currently
         * requesting an interrupt, what should I do about that?  Originally, I had decided to clear them ONLY if they
         * were still undefined, but that change appeared to break the ROM BIOS handling of CTRL-ALT-DEL, so I'm back
         * to unconditionally zeroing them. 
         */
        pic.bIRR = pic.bISR = 0;
        /*
         * The spec also says that "Special Mask Mode is cleared and Status Read is set to IRR".  I attempt to insure
         * the latter, but as for special mask mode... well, that mode isn't supported yet. 
         */
        pic.bOCW3 = ChipSet.PIC_LO.OCW3 | ChipSet.PIC_LO.OCW3_READ_IRR;
    }
    else if (!(bOut & ChipSet.PIC_LO.OCW3)) {
        /*
         * This must be an OCW2...
         */
        var bOCW2 = bOut & ChipSet.PIC_LO.OCW2_OP_MASK;
        if (bOCW2 & ChipSet.PIC_LO.OCW2_EOI) {
            /*
             * This OCW2 must be an EOI command...
             */
            var nIRL, bIREnd = 0;
            if ((bOCW2 & ChipSet.PIC_LO.OCW2_EOI_SPEC) == ChipSet.PIC_LO.OCW2_EOI_SPEC) {
                /*
                 * More "specifically", a specific EOI command...
                 */
                nIRL = bOut & ChipSet.PIC_LO.OCW2_IR_LVL;
                bIREnd = 1 << nIRL;
            } else {
                /*
                 * Less "specifically", a non-specific EOI command.  The search for the highest priority in-service
                 * interrupt must start with whichever interrupt is opposite the lowest priority interrupt (normally 7,
                 * but technically whatever bIRLow is currently set to).  For example:
                 * 
                 *      If bIRLow is 7, then the priority order is: 0, 1, 2, 3, 4, 5, 6, 7.
                 *      If bIRLow is 6, then the priority order is: 7, 0, 1, 2, 3, 4, 5, 6.
                 *      If bIRLow is 5, then the priority order is: 6, 7, 0, 1, 2, 3, 4, 5.
                 *      etc.
                 */
                nIRL = pic.bIRLow + 1;
                while (true) {
                    nIRL &= 0x7;
                    var bIR = 1 << nIRL;
                    if (pic.bISR & bIR) {
                        bIREnd = bIR;
                        break;
                    }
                    if (nIRL++ == pic.bIRLow) break;
                }
                if (DEBUG && !bIREnd) nIRL = null;      // for unexpected non-specific EOI commands, there's no IRQ to report
            }
            var nIRQ = (nIRL == null? undefined : pic.nIRQBase + nIRL);
            if (pic.bISR & bIREnd) {
                if (DEBUG) this.messageDebugger("outPIC" + iPIC + "(" + str.toHexByte(pic.port) + "): IRQ " + nIRQ + " going out of service", ChipSet.MESSAGE_PIC, nIRQ);
                pic.bISR &= ~bIREnd;
                this.checkIRR(iPIC);
            } else {
                if (DEBUG) this.messageDebugger("outPIC" + iPIC + "(" + str.toHexByte(pic.port) + "): unexpected EOI command, IRQ " + nIRQ + " not in service", ChipSet.MESSAGE_PIC);
            }
            /*
             * TODO: Support EOI commands with automatic rotation (eg, ChipSet.PIC_LO.OCW2_EOI_ROT and ChipSet.PIC_LO.OCW2_EOI_ROTSPEC)
             */
        }
        else  if (bOCW2 == ChipSet.PIC_LO.OCW2_SET_PRI) {
            /*
             * This OCW2 changes the lowest priority interrupt to the specified level (the default is 7)
             */
            pic.bIRLow = bOut & ChipSet.PIC_LO.OCW2_IR_LVL;
        }
        else {
            /*
             * TODO: Remaining commands to support: ChipSet.PIC_LO.OCW2_SET_ROTAUTO and ChipSet.PIC_LO.OCW2_CLR_ROTAUTO
             */
            if (DEBUG) this.messageDebugger("outPIC" + iPIC + "(" + str.toHexByte(pic.port) + "): unsupported OCW2 command: " + str.toHexByte(bOut), ChipSet.MESSAGE_PIC);
        }
    } else {
        /*
         * This must be an OCW3 request. If it's a "Read Register" command (PIC_LO.OCW3_READ_CMD), inPICL() will take care it. 
         *
         * TODO: If OCW3 specified a "Poll" command (PIC_LO.OCW3_POLL_CMD) or a "Special Mask Mode" command (PIC_LO.OCW3_SMM_CMD),
         * that's unfortunate, because I don't support them yet.
         */
        if (bOut & (ChipSet.PIC_LO.OCW3_POLL_CMD | ChipSet.PIC_LO.OCW3_SMM_CMD)) {
            if (DEBUG) this.messageDebugger("outPIC" + iPIC + "(" + str.toHexByte(pic.port) + "): unsupported OCW3 command: " + str.toHexByte(bOut), ChipSet.MESSAGE_PIC);
        }
        pic.bOCW3 = bOut;
    }
};

/**
 * inPICH(iPIC, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} iPIC
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inPICH = function(iPIC, addrFrom)
{
    var pic = this.aPICs[iPIC];
    var b = pic.bIMR;
    this.messagePort(pic.port+1, null, addrFrom, "PIC" + iPIC, ChipSet.MESSAGE_PIC, b);
    return b;
};

/**
 * outPICH(iPIC, bOut, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} iPIC
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 */
ChipSet.prototype.outPICH = function(iPIC, bOut, addrFrom)
{
    var pic = this.aPICs[iPIC];
    this.messagePort(pic.port+1, bOut, addrFrom, "PIC" + iPIC, ChipSet.MESSAGE_PIC);
    if (pic.nICW < pic.aICW.length) {
        pic.aICW[pic.nICW++] = bOut;
        if (pic.nICW == 2 && (pic.aICW[0] & ChipSet.PIC_LO.ICW1_SNGL))
            pic.nICW++;
        if (pic.nICW == 3 && !(pic.aICW[0] & ChipSet.PIC_LO.ICW1_ICW4))
            pic.nICW++;
    }
    else {
        /*
         * We have all our ICW "words" (ie, bytes), so this must be an OCW1 write (which is simply an IMR write)
         */
        pic.bIMR = bOut;
        /*
         * See the CPU's delayINTR() function for an explanation of why this explicit delay is necessary.
         */
        this.cpu.delayINTR();
        /*
         * Alas, we need an even longer delay for the MODEL_5170's "KBD_RESET" function, which must drop
         * into a loop and decrement CX at least once after unmasking the KBD IRQ.  The "KBD_RESET" function on
         * previous models could be handled with a 4-instruction delay provided by the Keyboard.resetDevice() call
         * to setIRR(), but the MODEL_5170 needs a roughly 6-instruction delay after it unmasks the KBD IRQ.
         */
        this.checkIRR(iPIC, !iPIC && bOut == 0xFD? 6 : 0);
    }
};

/**
 * checkIRR(iPIC, nDelay)
 * 
 * @this {ChipSet}
 * @param {number} iPIC
 * @param {number} [nDelay] is an optional number of instructions to delay acknowledgment of the IRQ (see getIRRVector)
 */
ChipSet.prototype.checkIRR = function(iPIC, nDelay)
{
    /*
     * Look for any IRR bits that aren't masked and aren't already in service
     */
    var pic = this.aPICs[iPIC];
    var bIR = ((pic.bISR | pic.bIMR) ^ 0xff) & pic.bIRR;
    this.cpu.updateINTR(!!bIR);
    if (bIR && nDelay) pic.nDelay = nDelay;
};

/**
 * setIRR(nIRQ, nDelay)
 * 
 * @this {ChipSet}
 * @param {number} nIRQ (IRQ 0-7 implies iPIC 0, and IRQ 8-15 implies iPIC 1)
 * @param {number} [nDelay] is an optional number of instructions to delay acknowledgment of the IRQ (see getIRRVector)
 */
ChipSet.prototype.setIRR = function(nIRQ, nDelay)
{
    var iPIC = nIRQ >> 3;
    var nIRL = nIRQ & 0x7;
    var pic = this.aPICs[iPIC];
    pic.bIRR |= 1 << nIRL;
    if (DEBUG) this.messageDebugger("setIRR(" + nIRQ + ")", ChipSet.MESSAGE_PIC, nIRQ);
    pic.nDelay = nDelay || 0;
    /*
     * When any slave IRR goes high, I'm assuming that the master's slave IRR line should go high as well 
     */
    if (iPIC == 1) this.aPICs[0].bIRR |= 0x4;
    this.checkIRR(iPIC);
};

/**
 * clearIRR(nIRQ)
 * 
 * @this {ChipSet}
 * @param {number} nIRQ (IRQ 0-7 implies iPIC 0, which is all we currently support anyway)
 */
ChipSet.prototype.clearIRR = function(nIRQ)
{
    var iPIC = nIRQ >> 3;
    var nIRL = nIRQ & 0x7;
    var pic = this.aPICs[iPIC];
    var bIRR = (1 << nIRL);
    if (pic.bIRR & bIRR) {
        pic.bIRR &= ~bIRR;
        if (DEBUG) this.messageDebugger("clearIRR(" + nIRQ + ")", ChipSet.MESSAGE_PIC, nIRQ);
        /*
         * When all slave IRRs go low, I'm assuming that the master's slave IRR line should go low as well 
         */
        if (iPIC == 1 && !pic.bIRR) this.aPICs[0].bIRR &= ~0x4;
        /*
         * NOTE: I don't think calling checkIRR(), and by extension, cpu.updateINTR(false), is strictly necessary,
         * because when the CPU gets around to acknowledging the INTR signal, it still has to call getIRRVector(), which
         * will inform the CPU that there are no longer any requested interrupts.  However, some small efficiency may be
         * gained by clearing INTR sooner rather than later.  So that's what we'll do.
         */
        this.checkIRR(iPIC);
    }
};

/**
 * checkIMR(nIRQ)
 * 
 * @this {ChipSet}
 * @param {number} nIRQ
 * @return {boolean} true if the specified IRQ is masked, false if not
 */
ChipSet.prototype.checkIMR = function(nIRQ)
{
    var iPIC = nIRQ >> 3;
    var nIRL = nIRQ & 0x7;
    var pic = this.aPICs[iPIC];
    return (pic.bIMR & (0x1 << nIRL))? true : false;
};

/**
 * getIRRVector()
 * 
 * getIRRVector() is called by the CPU whenever PS_IF is set and OP_NOINTR is clear.  Ordinarily, an immediate response would
 * seem perfectly reasonable, but unfortunately, there are places in the ROM BIOS (eg, the "KBD_RESET" function @F000:E688)
 * that enable interrupts but still expect nothing to happen for several more instructions.
 *
 * So, in addition to the two normal responses (an IDT vector #, or -1 indicating no pending interrupts), we must support
 * a third response (-2) that basically means: don't change the CPU interrupt state, just keep calling until we return one
 * of the first two responses.  The number of times we delay our normal response is determined by the component that originally
 * called setIRR with an optional delay parameter.
 * 
 * @this {ChipSet}
 * @param {number} [iPIC]
 * @return {number} IDT vector # of the next highest-priority interrupt, -1 if none, or -2 for "please try your call again later"
 */
ChipSet.prototype.getIRRVector = function(iPIC)
{
    if (iPIC === undefined) iPIC = 0;

    /*
     * Look for any IRR bits that aren't masked and aren't already in service...
     */
    var nIDT = -1;
    var pic = this.aPICs[iPIC];
    if (!pic.nDelay) {
        var bIR = pic.bIRR & ((pic.bISR | pic.bIMR) ^ 0xff);
        /*
         * The search for the next highest priority requested interrupt (that's also not in-service and not masked) 
         * must start with whichever interrupt is opposite the lowest priority interrupt (normally 7, but technically
         * whatever bIRLow is currently set to).  For example:
         *
         *      If bIRLow is 7, then the priority order is: 0, 1, 2, 3, 4, 5, 6, 7.
         *      If bIRLow is 6, then the priority order is: 7, 0, 1, 2, 3, 4, 5, 6.
         *      If bIRLow is 5, then the priority order is: 6, 7, 0, 1, 2, 3, 4, 5.
         *      etc.
         *
         * This process is similar to the search performed by non-specific EOIs, except those apply only to a single
         * PIC (which is why a slave interrupt must be EOI'ed twice: once for the slave PIC and again for the master),
         * whereas here we must search across all PICS.
         */
        var nIRL = pic.bIRLow + 1;
        while (true) {
            nIRL &= 0x7;

            var bIRNext = 1 << nIRL;
            if (bIR & bIRNext) {
                
                if (!iPIC && nIRL == 2) {
                    /*
                     * Slave interrupts are tied to the master PIC on IRQ2; query the slave PIC for the vector #
                     */
                    nIDT = this.getIRRVector(1);
                } else {
                    /*
                     * Get the starting IDT vector # from ICW2 and add the IR level to obtain the target IDT vector #
                     */
                    nIDT = pic.aICW[1] + nIRL;
                }
                
                if (nIDT >= 0) {
                    pic.bISR |= bIRNext;
                    pic.bIRR &= ~bIRNext;
                }
                
                var nIRQ = pic.nIRQBase + nIRL;
                if (DEBUG) this.messageDebugger("getIRRVector(): IRQ " + nIRQ + " going into service", ChipSet.MESSAGE_PIC, nIRQ);
                if (MAXDEBUG && DEBUGGER) {
                    this.acInterrupts[nIRQ]++;
                }
                break;
            }
            
            if (nIRL++ == pic.bIRLow) break;
        }
    } else {
        nIDT = -2;
        pic.nDelay--;
    }
    return nIDT;
};

/**
 * inTimer(iTimer, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} iTimer (ports 0x40, 0x41, 0x42)
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inTimer = function(iTimer, addrFrom)
{
    var b;
    var timer = this.aTimers[iTimer];
    if (timer.countIndex == timer.countBytes) this.resetTimerIndex(iTimer);
    if (timer.fLatched) {
        return timer.countLatched[timer.countIndex++];
    }
    this.updateTimer(iTimer);
    b = timer.countCurrent[timer.countIndex++];
    this.messagePort(ChipSet.TIMER0.PORT + iTimer, null, addrFrom, "TIMER" + iTimer, ChipSet.MESSAGE_TIMER, b);
    return b;
};

/**
 * outTimer(iTimer, bOut, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} iTimer (ports 0x40, 0x41, 0x42)
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 */
ChipSet.prototype.outTimer = function(iTimer, bOut, addrFrom)
{
    this.messagePort(ChipSet.TIMER0.PORT + iTimer, bOut, addrFrom, "TIMER" + iTimer, ChipSet.MESSAGE_TIMER);
    
    var timer = this.aTimers[iTimer];
    if (timer.countIndex == timer.countBytes) this.resetTimerIndex(iTimer);
    timer.countInit[timer.countIndex++] = bOut;
    if (timer.countIndex == timer.countBytes) {
        /*
         * In general, writing a new count to a timer that's already counting isn't supposed to affect the current
         * count, with the notable exceptions of MODE0 and MODE4.
         */
        if (!timer.fCounting || timer.mode == ChipSet.TIMER_CTRL.MODE0 || timer.mode == ChipSet.TIMER_CTRL.MODE4) {
            timer.fLatched = false;
            timer.countCurrent[0] = timer.countStart[0] = timer.countInit[0];
            timer.countCurrent[1] = timer.countStart[1] = timer.countInit[1];
            timer.nStartCycles = this.cpu.getCycles(this.fScaleTimers);
            timer.fCounting = true;
            /*
             * I believe MODE0 is the only mode where "OUT" (fOUT) starts out "low" (false); for the rest of the modes,
             * "OUT" (fOUT) starts "high" (true).  It's also my understanding that the way edge-triggered interrupts work
             * on the original PC is that an interrupt is requested only when the corresponding "OUT" transitions from
             * "low" to "high".
             */
            timer.fOUT = (timer.mode != ChipSet.TIMER_CTRL.MODE0);
            /*
             * TODO: Determine if there are situations/modes where I should NOT automatically clear IRQ0 on behalf of TIMER0.
             */
            if (iTimer == ChipSet.TIMER0.INDEX) this.clearIRR(ChipSet.IRQ.TIMER0);
        }
        
        if (iTimer == ChipSet.TIMER2.INDEX) {
            this.setSpeaker();
        }
        
        /*
         * HACK to detect lower-than-normal initial timer counts and reduce the length of CPU bursts using
         * cpu.setBurstDivisor().  Alternatively, the CPU could ask us for a cycle limit, via getTimerCycleLimit(),
         * prior to starting a new burst, but for now, this hack actually performs better (see "BASICA DONKEY.BAS").
         */
        if (iTimer == ChipSet.TIMER0.INDEX) {
            var countInit = this.getTimerInit(ChipSet.TIMER0.INDEX);
            /*
             * Prevent the divisor from becoming too large (and we of course want to avoid a divide-by-zero);
             * we'll use the initial count that BASICA likes to program as a baseline.
             */
            if (countInit >= 0x800) {
                this.cpu.setBurstDivisor(Math.round(0x10000 / countInit));
            }
        }
        
        if (iTimer == ChipSet.TIMER0.INDEX && timer.mode == ChipSet.TIMER_CTRL.MODE0 && timer.rw == ChipSet.TIMER_CTRL.RW_LSB) {
            /*
             * HACK to satisfy the quick h/w interrupt turn-around expected by the ROM BIOS when it sets TIMER0 to a
             * low test count (0x16); since we typically don't update any of the timers until after we've finished a
             * burst of CPU cycles, we originally solved that particular problem by forcing a h/w interrupt to be
             * simulated immediately, by reducing the starting cycle count for TIMER0 to an earlier point in time and
             * then immediately calling updateTimer().
             * 
             *  if (bOut == 0x16) {
             *      timer.nStartCycles -= 4 * bOut;     // used a multiplier of 4 since there were always 4 cycles per tick
             *      this.updateTimer(iTimer);
             *  }
             *  
             * However, a cleaner solution is to reduce the current burst cycle count instead, so that a timer interrupt
             * will be simulated at the appropriate time, rather than immediately.  Note that in some cases, if the number
             * of cycles remaining in the current burst is less than the target, this will have the effect of *lengthening*
             * the current burst instead of shortening it, but stepCPU() should be OK with that.
             * 
             * Also notice how this complements the setBurstDivisor() HACK above: while that code is concerned with how
             * to deal with low timer counts prior to starting new bursts, here we're concerned with low timer counts
             * (in particular, single-byte LSB counts) programmed in the middle of a burst.
             * 
             * The MODEL_5170 BIOS performs a virtually identical test ("TEST.18"), although unsurprisingly, it uses an
             * initial timer count that is explicitly twice that other of earlier models (0x16 * 2 = 0x2C).  Fortunately,
             * it still uses an LSB-only count; however, the original hack calculated the burst-cycle threshold using a
             * hard-coded multiplier of 4, which is incorrect for MODEL_5170; the correct model-independent multiplier to
             * use is nTicksDivisor.
             */
            this.cpu.setBurstCycles(bOut * this.nTicksDivisor);
        }
    }
};

/**
 * inTimerCtrl(port, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} port (0x43)
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 * @return {number|null} simulated port value
 */
ChipSet.prototype.inTimerCtrl = function(port, addrFrom)
{
    this.messagePort(port, null, addrFrom, "TIMER_CTRL", ChipSet.MESSAGE_TIMER);
    if (DEBUG) this.messageDebugger("Timer[CTRL]: Read-Back command not supported (yet)", ChipSet.MESSAGE_TIMER);
    return null;
};

/**
 * outTimerCtrl(port, bOut, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} port (0x43)
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 */
ChipSet.prototype.outTimerCtrl = function(port, bOut, addrFrom)
{
    this.messagePort(port, bOut, addrFrom, "TIMER_CTRL", ChipSet.MESSAGE_TIMER);
    this.bTimerCtrl = bOut;
    /*
     * Extract the SC (Select Counter) bits
     */
    var iTimer = (bOut & ChipSet.TIMER_CTRL.SC) >> 6;
    if (iTimer == 0x3) {
        if (DEBUG) this.messageDebugger("TIMER_CTRL: Read-Back command not supported (yet)", ChipSet.MESSAGE_TIMER);
        return;
    }
    /*
     * Extract the BCD, MODE, and RW bits, which we simply store as-is (see setTimerMode)
     */
    var bcd = (bOut & ChipSet.TIMER_CTRL.BCD);
    var mode = (bOut & ChipSet.TIMER_CTRL.MODE);
    var rw = (bOut & ChipSet.TIMER_CTRL.RW);
    if (!rw) {
        this.latchTimer(iTimer);
    } else {
        this.setTimerMode(iTimer, bcd, mode, rw);
        
        /*
         * The 5150 ROM BIOS code @F000:E285 ("TEST.7") would fail after a warm boot (eg, after a CTRL-ALT-DEL) because
         * it assumed that no TIMER0 interrupt would occur between the point it unmasked the TIMER0 interrupt and the
         * point it started reprogramming TIMER0.
         * 
         * Similarly, the 5160 ROM BIOS @F000:E35D ("8253 TIMER CHECKOUT") would fail after initializing the EGA BIOS,
         * because the EGA BIOS uses TIMER0 during its diagnostics; as in the previous example, by the time the 8253
         * test code runs later, there's now a pending TIMER0 interrupt, which triggers an interrupt as soon as IRQ0 is
         * unmasked @F000:E364.
         * 
         * After looking at this problem at bit more closely the second time around (while debugging the EGA BIOS),
         * it turns out I missed an important 8253 feature: whenever a new MODE0 control word OR a new MODE0 count
         * is written, fOUT (which is what drives IRQ0) goes low.  So, by simply adding an appropriate clearIRR() call
         * both here and in outTimer(), this annoying problem seems to be gone.
         * 
         * TODO: Determine if there are situations/modes where I should NOT automatically clear IRQ0 on behalf of TIMER0.
         */
        if (iTimer == ChipSet.TIMER0.INDEX) this.clearIRR(ChipSet.IRQ.TIMER0);
        
        /*
         * Another TIMER0 HACK: The "CASSETTE DATA WRAP TEST" @F000:E51E occasionally reports an error when the second of
         * two TIMER0 counts it latches is greater than the first.  You would think the ROM BIOS would expect this, since
         * TIMER0 can reload its count at any time.  Is the ROM BIOS assuming that TIMER0 was initialized sufficiently
         * recently that this should never happen?  I'm not sure, but for now, let's try resetting TIMER0's count immediately
         * after TIMER2 has been reprogrammed for the test in question (ie, when interrupts are masked and PPIB is set as
         * shown below).
         * 
         * FWIW, I believe the cassette hardware was discontinued after MODEL_5150, and even if the test fails, it's non-fatal;
         * the ROM BIOS displays an error (131) and moves on.
         */
        if (iTimer == ChipSet.TIMER2.INDEX) {
            var pic = this.aPICs[0];
            if (pic.bIMR == 0xff && this.bPPIB == (ChipSet.PPI_B.CLK_TIMER2 | ChipSet.PPI_B.ENABLE_SW2 | ChipSet.PPI_B.CASS_MOTOR_OFF | ChipSet.PPI_B.CLK_KBD)) {
                var timer = this.aTimers[0];
                timer.countStart[0] = timer.countInit[0];
                timer.countStart[1] = timer.countInit[1];
                timer.nStartCycles = this.cpu.getCycles(this.fScaleTimers);
                if (DEBUG) this.messageDebugger("TIMER0 count reset @" + timer.nStartCycles + " cycles", ChipSet.MESSAGE_TIMER);
            }
        }
    }
};

/**
 * getTimerInit(iTimer)
 * 
 * @this {ChipSet}
 * @param {number} iTimer
 * @return {number} initial timer count
 */
ChipSet.prototype.getTimerInit = function(iTimer)
{
    var timer = this.aTimers[iTimer];
    var countInit = (timer.countInit[1] << 8) | timer.countInit[0];
    if (!countInit) countInit = (timer.countBytes == 1? 0x100 : 0x10000);
    return countInit;
};

/**
 * getTimerStart(iTimer)
 * 
 * @this {ChipSet}
 * @param {number} iTimer
 * @return {number} starting timer count (from the initial timer count for the current countdown)
 */
ChipSet.prototype.getTimerStart = function(iTimer)
{
    var timer = this.aTimers[iTimer];
    var countStart = (timer.countStart[1] << 8) | timer.countStart[0];
    if (!countStart) countStart = (timer.countBytes == 1? 0x100 : 0x10000);
    return countStart;
};

/**
 * getTimerCycleLimit(iTimer)
 *
 * @this {ChipSet}
 * @param {number} iTimer
 * @return {number} number of cycles remaining for the specified timer, zero if no limit (or timer inactive)
 *
ChipSet.prototype.getTimerCycleLimit = function(iTimer)
{
    var timer = this.aTimers[iTimer];
    return timer.fCounting? (this.getTimerStart(iTimer) * this.nTicksDivisor) : 0;
};
 */

/**
 * latchTimer(iTimer)
 * 
 * @this {ChipSet}
 * @param {number} iTimer
 */
ChipSet.prototype.latchTimer = function(iTimer)
{
    /*
     * Update the timer's current count
     */
    this.updateTimer(iTimer);
    
    /*
     * Now we can latch it
     */
    var timer = this.aTimers[iTimer];
    timer.countLatched[0] = timer.countCurrent[0];
    timer.countLatched[1] = timer.countCurrent[1];
    timer.fLatched = true;
    
    /*
     * VERIFY: That a latch request resets the timer index
     */
    this.resetTimerIndex(iTimer);
};

/**
 * setTimerMode(iTimer, bcd, mode, rw)
 *
 * FYI: After setting a timer's mode, the CPU must set the timer's count before it becomes operational;
 * ie, before fCounting becomes true.
 * 
 * @this {ChipSet}
 * @param {number} iTimer
 * @param {number} bcd
 * @param {number} mode
 * @param {number} rw
 */
ChipSet.prototype.setTimerMode = function(iTimer, bcd, mode, rw)
{
    var timer = this.aTimers[iTimer];
    timer.rw = rw;
    timer.mode = mode;
    timer.bcd = bcd;
    timer.countInit = [0, 0];
    timer.countCurrent = [0, 0];
    timer.countLatched = [0, 0];
    timer.fOUT = false;
    timer.fLatched = false;
    timer.fCounting = false;
    this.resetTimerIndex(iTimer);
};

/**
 * resetTimerIndex(iTimer)
 * 
 * @this {ChipSet}
 * @param {number} iTimer
 */
ChipSet.prototype.resetTimerIndex = function(iTimer)
{
    var timer = this.aTimers[iTimer];
    timer.countIndex = (timer.rw == ChipSet.TIMER_CTRL.RW_MSB? 1 : 0);
    timer.countBytes = (timer.rw == ChipSet.TIMER_CTRL.RW_BOTH? 2 : 1);
};

/**
 * updateTimer(iTimer, fCycleReset)
 * 
 * updateTimer() calculates and updates a timer's current count purely on an "on-demand" basis; we don't actually
 * adjust timer counters every 4 CPU cycles, since updating timers that frequently would be prohibitively slow.  If
 * you're single-stepping the CPU, then yes, updateTimer() will be called after every stepCPU(), via updateAllTimers(),
 * but if we're doing our job correctly here, the frequency of calls to updateTimer() should not affect timer counts
 * across otherwise identical runs.
 *
 * TODO: Implement support for all TIMER modes, and verify that all the modes currently implemented are "up to spec";
 * they're close enough to make the ROM BIOS happy, but beyond that, I've done very little.
 *
 * @this {ChipSet}
 * @param {number} iTimer
 *      0: Time-of-Day interrupt (~18.2 interrupts/second)
 *      1: DMA refresh
 *      2: Sound/Cassette
 * @param {boolean|undefined} [fCycleReset] is true if a cycle-count reset is about to occur
 * @return {Object} timer
 */
ChipSet.prototype.updateTimer = function(iTimer, fCycleReset)
{
    var timer = this.aTimers[iTimer];

    /*
     * Every timer's counting state is gated by its own fCounting flag; TIMER2 is further gated by PPI_B's
     * CLK_TIMER2 bit.
     */
    if (timer.fCounting && (iTimer != ChipSet.TIMER2.INDEX || (this.bPPIB & ChipSet.PPI_B.CLK_TIMER2))) {
        /*
         * We determine the current timer count based on how many instruction cycles have elapsed since we started
         * the timer.  Timers are supposed to be "ticking" at a rate of 1193181.8181 times per second, which is
         * the system clock of 14.31818Mhz, divided by 12.
         * 
         * Similarly, for an 8088, there are supposed to be 4.77Mhz instruction cycles per second, which comes from
         * the system clock of 14.31818Mhz, divided by 3.
         * 
         * If we divide 4,772,727 CPU cycles per second by 1,193,181 ticks per second, we get 4 cycles per tick,
         * which agrees with the ratio of the clock divisors: 12 / 3 == 4.
         *
         * However, if getCycles() is being called with fScaleTimers == true AND the CPU is running faster than its
         * base cycles-per-second setting, then getCycles() will divide the cycle count by the CPU's cycle multiplier,
         * so that the timers fire with the same real-world frequency that the user expects.  However, that will
         * break any code (eg, the ROM BIOS diagnostics) that assumes that the timers are ticking once every 4 cycles
         * (or more like every 5 cycles on a 6Mhz 80286).
         * 
         * So, when using a machine with the ChipSet "scaletimers" property set, make sure you reset the machine's
         * speed prior to rebooting, otherwise you're likely to see ROM BIOS errors.  Ditto for any application code
         * that makes similar assumptions about the relationship between CPU and timer speeds.
         * 
         * In general, you're probably better off NOT using the "scaletimers" property, and simply allowing the timers
         * to tick faster as you increase CPU speed (which is why fScaleTimers defaults to false).
         */
        var nCycles = this.cpu.getCycles(this.fScaleTimers);

        /*
         * Instead of maintaining partial tick counts, we calculate a fresh countCurrent from countStart every
         * time we're called, using the cycle count recorded when the timer was initialized.  countStart is set
         * to countInit when fCounting is first set, and then it is refreshed from countInit at the expiration of
         * every count, so that if someone loaded a new countInit in the meantime (eg, BASICA), we'll pick it up.
         * 
         * For the original MODEL_5170, the number of cycles per tick is approximately 6,000,000 / 1,193,181,
         * or 5.028575, so we can no longer always divide cycles by 4 with a simple right-shift by 2.  The proper
         * divisor (eg, 4 for MODEL_5150 and MODEL_5160, 5 for MODEL_5170, etc) is nTicksDivisor, which initBus()
         * calculates using on the base CPU speed returned by cpu.getCyclesPerSecond().
         */
        var ticks = ((nCycles - timer.nStartCycles) / this.nTicksDivisor) | 0;

        if (ticks < 0) {
            if (DEBUG) this.messageDebugger("updateTimer(" + iTimer + "): negative tick count (" + ticks + ")", ChipSet.MESSAGE_TIMER);
            timer.nStartCycles = nCycles;
            ticks = 0;
        }

        var countInit = this.getTimerInit(iTimer);
        var countStart = this.getTimerStart(iTimer);
        
        var fFired = false;
        var count = countStart - ticks;
        
        /*
         * NOTE: This mode is used by ROM BIOS test code that wants to verify timer interrupts are arriving
         * neither too slowly nor too quickly.  As a result, I've had to add some corresponding trickery
         * in outTimer() to force interrupt simulation immediately after a low initial count (0x16) has been set.
         */
        if (timer.mode == ChipSet.TIMER_CTRL.MODE0) {
            if (count <= 0) count = 0;
            if (DEBUG) this.messageDebugger("updateTimer(" + iTimer + "): MODE0 timer count=" + count, ChipSet.MESSAGE_TIMER);
            if (!count) {
                timer.fOUT = true;
                timer.fCounting = false;
                if (!iTimer) {
                    fFired = true;
                    this.setIRR(ChipSet.IRQ.TIMER0);
                    if (MAXDEBUG && DEBUGGER) this.acTimersFired[iTimer]++;
                }
            }
        }
        /*
         * Early implementation of this mode was minimal because when using this mode, the ROM BIOS simply wanted
         * to see the count changing; it wasn't looking for interrupts.  See ROM BIOS "TEST.03" code @F000:E0DE,
         * where TIMER1 is programmed for MODE2, LSB (the same settings, incidentally, used immediately afterward
         * for TIMER1 in conjunction with DMA channel 0 memory refreshes).
         * 
         * Now this mode generates interrupts.  Note that "OUT" goes "low" when the count reaches 1, then "high"
         * one tick later, at which point the count is reloaded and counting continues.
         * 
         * Chances are, we will often miss the exact point at which the count becomes 1 (or more importantly, one
         * tick later, when the count *would* become 0, since that's when "OUT" transitions from "low" to "high"),
         * but as with MODE3, hopefully no one will mind.
         * 
         * FYI, technically, it appears that the count is never supposed to reach 0, and that an initial count of 1
         * is "illegal", whatever that means.
         */
        else
        if (timer.mode == ChipSet.TIMER_CTRL.MODE2) {
            timer.fOUT = (count != 1);          // yes, this line does seem rather pointless.... 
            if (count <= 0) {
                count = countInit + count;
                if (count <= 0) {
                    // this.messageDebugger("updateTimer(" + iTimer + "): underflow=" + count, ChipSet.MESSAGE_TIMER);
                    count = countInit;
                }
                timer.countStart[0] = count & 0xff;
                timer.countStart[1] = count >> 8;
                timer.nStartCycles = nCycles;
                if (!iTimer && timer.fOUT) {
                    fFired = true;
                    this.setIRR(ChipSet.IRQ.TIMER0);
                    if (MAXDEBUG && DEBUGGER) this.acTimersFired[iTimer]++;
                }
            }
        }
        /*
         * NOTE: This is the normal mode for TIMER0, which the ROM BIOS uses to generate h/w interrupts roughly
         * 18.2 times per second.  In this mode, the count must be decremented twice as fast (hence the extra ticks
         * subtraction below, in addition to the subtraction above), but IRQ_TIMER0 is raised only on alternate
         * iterations; ie, only when fOUT transitions to true ("high").  The equal alternating fOUT states is why
         * this mode is referred to as "square wave" mode.
         *
         * TODO: Implement the correct behavior for this mode when the count is ODD.  In that case, fOUT is supposed
         * to be "high" for (N + 1) / 2 ticks and "low" for (N - 1) / 2 ticks.
         */
        else
        if (timer.mode == ChipSet.TIMER_CTRL.MODE3) {
            count -= ticks;
            if (count <= 0) {
                timer.fOUT = !timer.fOUT;
                count = countInit + count;
                if (count <= 0) {
                    // this.messageDebugger("updateTimer(" + iTimer + "): underflow=" + count, ChipSet.MESSAGE_TIMER);
                    count = countInit;
                }
                if (MAXDEBUG && DEBUGGER && !iTimer) {
                    var nCycleDelta = 0;
                    if (this.acTimer0Counts.length > 0)
                        nCycleDelta = nCycles - this.acTimer0Counts[0][1];
                    this.acTimer0Counts.push([count, nCycles, nCycleDelta]);
                }
                timer.countStart[0] = count & 0xff;
                timer.countStart[1] = count >> 8;
                timer.nStartCycles = nCycles;
                if (!iTimer && timer.fOUT) {
                    fFired = true;
                    this.setIRR(ChipSet.IRQ.TIMER0);
                    if (MAXDEBUG && DEBUGGER) this.acTimersFired[iTimer]++;
                }
            }
        }

        if (DEBUG && DEBUGGER && this.dbg && this.dbg.messageEnabled(this.dbg.MESSAGE_TIMER)) {
            this.log("TIMER" + iTimer + " count: " + count + ", ticks: " + ticks + ", fired: " + (fFired? "true" : "false"));
        }

        timer.countCurrent[0] = count & 0xff;
        timer.countCurrent[1] = count >> 8;
        if (fCycleReset) this.nStartCycles = 0;
    }
    return timer;
};

/**
 * updateAllTimers(fCycleReset)
 * 
 * @this {ChipSet}
 * @param {boolean|undefined} [fCycleReset] is true if a cycle-count reset is about to occur
 */
ChipSet.prototype.updateAllTimers = function(fCycleReset)
{
    for (var iTimer = 0; iTimer < this.aTimers.length; iTimer++) {
        this.updateTimer(iTimer, fCycleReset);
    }
    if (this.model >= ChipSet.MODEL_5170) this.updateRTCDate();
};

/**
 * inPPIA(port, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} port (0x60)
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inPPIA = function(port, addrFrom)
{
    var b = this.bPPIA;
    if (this.bPPICtrl & ChipSet.PPI_CTRL.A_IN) {
        if (this.bPPIB & ChipSet.PPI_B.CLEAR_KBD) {
            b = this.sw1;
        }
        else if (this.kbd) {
            b = this.kbd.readScanCode();
        }
    }
    this.messagePort(port, null, addrFrom, "PPI_A", ChipSet.MESSAGE_CHIPSET, b);
    return b;
};

/**
 * outPPIA(port, bOut, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} port (0x60)
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 */
ChipSet.prototype.outPPIA = function(port, bOut, addrFrom)
{
    this.messagePort(port, bOut, addrFrom, "PPI_A", ChipSet.MESSAGE_CHIPSET);
    this.bPPIA = bOut;
};

/**
 * inPPIB(port, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} port (0x61)
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inPPIB = function(port, addrFrom)
{
    var b = this.bPPIB;
    /*
     * "TEST.09" of the MODEL_5170 BIOS expects the following bit ("REFRESH_BIT") to alternate, so we oblige;
     * hopefully this won't affect MODEL_5150 or MODEL_5160, because we didn't used to do this.
     */
    this.bPPIB ^= ChipSet.PPI_B.DISABLE_RW_MEM;     
    this.messagePort(port, null, addrFrom, "PPI_B", ChipSet.MESSAGE_CHIPSET, b);
    return b;
};

/**
 * outPPIB(port, bOut, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} port (0x61)
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 */
ChipSet.prototype.outPPIB = function(port, bOut, addrFrom)
{
    this.messagePort(port, bOut, addrFrom, "PPI_B", ChipSet.MESSAGE_CHIPSET);
    var fNewSpeaker = !!(bOut & ChipSet.PPI_B.SPK_TIMER2);
    var fOldSpeaker = !!(this.bPPIB & ChipSet.PPI_B.SPK_TIMER2);
    this.bPPIB = bOut;
    if (fNewSpeaker != fOldSpeaker) {
        /*
         * Originally, this code didn't catch the "ERROR_BEEP" case @F000:EC34, which first turns both PPI_B_CLK_TIMER2 (0x01)
         * and PPI_B_SPK_TIMER2 (0x02) off, then turns on only PPI_B_SPK_TIMER2 (0x02), then restores the original port value.
         * 
         * So, when the ROM BIOS keyboard buffer got full, we didn't issue a BEEP alert.  I've fixed that by limiting the test
         * to PPI_B_SPK_TIMER2 and ignoring PPI_B_CLK_TIMER2.
         */
        this.setSpeaker(fNewSpeaker);
    }
    if (this.kbd) this.kbd.setEnable((bOut & ChipSet.PPI_B.CLEAR_KBD)? false : true, (bOut & ChipSet.PPI_B.CLK_KBD)? true : false);
};

/**
 * inPPIC(port, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} port (0x62)
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inPPIC = function(port, addrFrom)
{
    var b = 0;

    /*
     * If you ever wanted to simulate I/O channel errors or R/W memory parity errors, you could
     * add either PPI_C_IO_CHANNEL_CHK (0x40) or PPI_C_RW_PARITY_CHK (0x80) to the return value (b).
     */
    if (this.model == ChipSet.MODEL_5150) {
        if (this.bPPIB & ChipSet.PPI_B.ENABLE_SW2) {
            b |= this.sw2 & ChipSet.PPI_C.SW;
        } else {
            b |= (this.sw2 >> 4) & 0x1;     // QUESTION: Does any component actually care about SW2[5] on a MODEL_5150?
        }
    } else {
        if (this.bPPIB & ChipSet.PPI_B.ENABLE_SW_HI) {
            b |= this.sw1 >> 4;
        } else {
            b |= this.sw1 & 0xf;
        }
    }

    if (this.bPPIB & ChipSet.PPI_B.CLK_TIMER2) {
        var timer = this.updateTimer(ChipSet.TIMER2.INDEX);
        if (timer.fOUT) {
            if (this.bPPIB & ChipSet.PPI_B.SPK_TIMER2)
                b |= ChipSet.PPI_C.TIMER2_OUT;
            else
                b |= ChipSet.PPI_C.CASS_DATA_IN;
        }
    }

    /*
     * The ROM BIOS polls this port incessantly during its memory tests, checking for memory parity errors
     * (which of course we never report), so we further restrict these port messages to MESSAGE_MEM.
     */
    this.messagePort(port, null, addrFrom, "PPI_C", ChipSet.MESSAGE_MEM | ChipSet.MESSAGE_CHIPSET, b);
    return b;
};

/**
 * outPPIC(port, bOut, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} port (0x62)
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 */
ChipSet.prototype.outPPIC = function(port, bOut, addrFrom)
{
    this.messagePort(port, bOut, addrFrom, "PPI_C", ChipSet.MESSAGE_CHIPSET);
    this.bPPIC = bOut;
};

/**
 * inPPICtrl(port, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} port (0x63)
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inPPICtrl = function(port, addrFrom)
{
    var b = this.bPPICtrl;
    this.messagePort(port, null, addrFrom, "PPI_CTRL", ChipSet.MESSAGE_CHIPSET, b);
    return b;
};

/**
 * outPPICtrl(port, bOut, addrFrom)
 * 
 * @this {ChipSet}
 * @param {number} port (0x63)
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outPPICtrl = function(port, bOut, addrFrom)
{
    this.messagePort(port, bOut, addrFrom, "PPI_CTRL", ChipSet.MESSAGE_CHIPSET);
    this.bPPICtrl = bOut;
};

/**
 * in8042OutBuff(port, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x60)
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.in8042OutBuff = function(port, addrFrom)
{
    this.messagePort(port, null, addrFrom, "8042_OUTBUFF", ChipSet.MESSAGE_CHIPSET, this.b8042OutBuff);
    this.b8042Status &= ~ChipSet.KBD_STATUS.OUTBUFF_FULL;
    var b = this.b8042OutBuff;
    var bNext = this.kbd && this.kbd.readScanCode(true);
    if (bNext) {
        this.b8042OutBuff = bNext;
        /*
         * TODO: Determine why setting OUTBUFF_DELAY instead of OUTBUFF_FULL here causes "AA 301-Keyboard Error" during POST
         */
        this.b8042Status |= ChipSet.KBD_STATUS.OUTBUFF_FULL;
    }
    return b;
};

/**
 * out8042InBuffData(port, bOut, addrFrom)
 * 
 * This writes to the 8042's input buffer; using this port (ie, 0x60 instead of 0x64) designates the
 * the byte as a KBD_DATA.CMD "data byte".  Before clearing KBD_STATUS.CMD_FLAG, however, we see if it's set,
 * and then based on the previous KBD_CMD "command byte", we do whatever needs to be done with this "data byte".
 *
 * @this {ChipSet}
 * @param {number} port (0x60)
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.out8042InBuffData = function(port, bOut, addrFrom)
{
    this.messagePort(port, bOut, addrFrom, "8042_INBUF.DATA", ChipSet.MESSAGE_CHIPSET);
    
    if (this.b8042Status & ChipSet.KBD_STATUS.CMD_FLAG) {
        switch (this.b8042InBuff) {
        
        case ChipSet.KBD_CMD.WRITE_CMD:
            this.b8042CmdData = bOut;
            Component.assert(ChipSet.KBD_DATA.CMD.SYS_FLAG === ChipSet.KBD_STATUS.SYS_FLAG);
            this.b8042Status = (this.b8042Status & ~ChipSet.KBD_STATUS.SYS_FLAG) | (bOut & ChipSet.KBD_DATA.CMD.SYS_FLAG);
            break;

        case ChipSet.KBD_CMD.WRITE_OUTPORT:
            this.b8042OutPort = bOut;
            this.bus.setA20(!!(this.b8042OutPort & ChipSet.KBD_DATA.OUTPORT.A20));
            if (!(this.b8042OutPort & ChipSet.KBD_DATA.OUTPORT.RESET)) {
                /*
                 * Bit 0 of the 8042's output port is connected to RESET.  Normally, it's "pulsed" with the
                 * KBD_CMD.PULSE_OUTPORT command, so if a RESET is detected via this command, we should try to
                 * determine if that's what the caller intended.
                 */
                if (DEBUG) {
                    this.messageDebugger("unexpected 8042 output port reset: " + str.toHexByte(this.b8042OutPort));
                    this.cpu.haltCPU();
                }
                this.cpu.resetRegs();
            }
            break;
        
        /*
         * This case is reserved for command bytes that the 8042 is not expecting, which should therefore be passed on
         * to the Keyboard itself.
         * 
         * Here's some relevant MODEL_5170 ROM BIOS code, "XMIT_8042" (missing from the original MODEL_5170 ROM BIOS listing),
         * which sends a command code in AL to the Keyboard and waits for a response, returning it in AL.  Note that
         * the only "success" exit path from this function involves LOOPing 64K times before finally reading the Keyboard's
         * response; either the hardware and/or this code seems a bit brain-damaged if that's REALLY what you had to do to get
         * a valid response....
         * 
         *      F000:1B25 86E0          XCHG     AH,AL
         *      F000:1B27 2BC9          SUB      CX,CX
         *      F000:1B29 E464          IN       AL,64
         *      F000:1B2B A802          TEST     AL,02      ; WAIT FOR INBUFF_FULL TO BE CLEAR
         *      F000:1B2D E0FA          LOOPNZ   1B29
         *      F000:1B2F E334          JCXZ     1B65       ; EXIT WITH ERROR (CX == 0)
         *      F000:1B31 86E0          XCHG     AH,AL
         *      F000:1B33 E660          OUT      60,AL      ; SAFE TO WRITE KEYBOARD CMD TO INBUFF NOW
         *      F000:1B35 2BC9          SUB      CX,CX
         *      F000:1B37 E464          IN       AL,64
         *      F000:1B39 8AE0          MOV      AH,AL
         *      F000:1B3B A801          TEST     AL,01
         *      F000:1B3D 7402          JZ       1B41
         *      F000:1B3F E460          IN       AL,60      ; READ PORT 0x60 IF OUTBUFF_FULL SET ("FLUSH"?)
         *      F000:1B41 F6C402        TEST     AH,02
         *      F000:1B44 E0F1          LOOPNZ   1B37
         *      F000:1B46 751D          JNZ      1B65       ; EXIT WITH ERROR (CX == 0)
         *      F000:1B48 B306          MOV      BL,06
         *      F000:1B4A 2BC9          SUB      CX,CX
         *      F000:1B4C E464          IN       AL,64
         *      F000:1B4E A801          TEST     AL,01
         *      F000:1B50 E1FA          LOOPZ    1B4C
         *      F000:1B52 7508          JNZ      1B5C       ; PROCEED TO EXIT NOW THAT OUTBUFF_FULL IS SET
         *      F000:1B54 FECB          DEC      BL
         *      F000:1B56 75F4          JNZ      1B4C
         *      F000:1B58 FEC3          INC      BL
         *      F000:1B5A EB09          JMP      1B65       ; EXIT WITH ERROR (CX == 0)
         *      F000:1B5C 2BC9          SUB      CX,CX
         *      F000:1B5E E2FE          LOOP     1B5E       ; LOOOOOOPING....
         *      F000:1B60 E460          IN       AL,60
         *      F000:1B62 83E901        SUB      CX,0001    ; EXIT WITH SUCCESS (CX != 0)
         *      F000:1B65 C3            RET
         *      
         * But WAIT, the FUN doesn't end there.  After this function returns, KBD_RESET waits for a Keyboard interrupt
         * to occur, hoping for a 0xAA scan code as the Keyboard's final response.  KBD_RESET also returns CX to the caller,
         * and the caller ("TEST.21") assumes there was no interrupt if CX is zero.
         * 
         *              MOV     AL,0FDH
         *              OUT     INTA01,AL
         *              MOV     INTR_FLAG,0
         *              STI
         *              MOV     BL,10
         *              SUB     CX,CX
         *      G11:    TEST    [1NTR_FLAG],02H
         *              JNZ     G12
         *              LOOP    G11
         *              DEC     BL
         *              JNZ     G11
         *              ...
         *              
         * However, if [INTR_FLAG] is set immediately, the above code will exit immediately, without ever decrementing CX.
         * CX can be zero not only if the loop exhausted it, but also if no looping was required!
         */
        default:
            if (this.kbd) {
                var b  = this.kbd.sendCmd(bOut);
                if (b >= 0) {
                    this.b8042OutBuff = b;
                    this.b8042Status |= ChipSet.KBD_STATUS.OUTBUFF_DELAY;
                }
            }
            break;
        }
    }
    this.b8042InBuff = bOut;
    this.b8042Status &= ~ChipSet.KBD_STATUS.CMD_FLAG;
};

/**
 * in8042Status(port, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x64)
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.in8042Status = function(port, addrFrom)
{
    this.messagePort(port, null, addrFrom, "8042_STATUS", ChipSet.MESSAGE_CHIPSET, this.b8042Status);
    var b = this.b8042Status & 0xff;
    /*
     * There's code in the 5170 BIOS (F000:03BF) that writes an 8042 command (0xAA), waits for
     * KBD_STATUS.INBUFF_FULL to go clear (which it always is, because we always accept commands
     * immediately), then checks KBD_STATUS.OUTBUFF_FULL and performs a "flush" on port 0x60 if
     * it's set, then waits for KBD_STATUS.OUTBUFF_FULL *again*.  Unfortunately, the "flush" throws
     * away our response if we respond immediately.
     * 
     * So now when out8042InBuffCmd() has a response, it sets KBD_STATUS.OUTBUFF_DELAY instead
     * (which is outside the 0xff range of bits we return); when we see KBD_STATUS.OUTBUFF_DELAY,
     * we clear it and set KBD_STATUS.OUTBUFF_FULL, which will be returned on the next read.
     * 
     * This provides a single-poll delay, so that the aforementioned "flush" won't occur.  If longer
     * delays are needed down the road, we may need to set a delay count in the upper (hidden) bits
     * of b8042Status, instead of using a single "OUTBUFF_DELAY" bit.
     */
    if (this.b8042Status & ChipSet.KBD_STATUS.OUTBUFF_DELAY) {
        this.b8042Status |= ChipSet.KBD_STATUS.OUTBUFF_FULL;
        this.b8042Status &= ~ChipSet.KBD_STATUS.OUTBUFF_DELAY;
    }
    return b;
};

/**
 * out8042InBuffCmd(port, bOut, addrFrom)
 *
 * This writes to the 8042's input buffer; using this port (ie, 0x64 instead of 0x60) designates the
 * the byte as a "command byte".  We immediately set KBD_STATUS.CMD_FLAG, and then see if we can act upon
 * the command immediately (some commands requires us to wait for a "data byte").
 *
 * @this {ChipSet}
 * @param {number} port (0x64)
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.out8042InBuffCmd = function(port, bOut, addrFrom)
{
    this.messagePort(port, bOut, addrFrom, "8042_INBUFF.CMD", ChipSet.MESSAGE_CHIPSET);
    Component.assert(!(this.b8042Status & ChipSet.KBD_STATUS.INBUFF_FULL));
    this.b8042InBuff = bOut;
    
    this.b8042Status |= ChipSet.KBD_STATUS.CMD_FLAG;
    
    var bPulseBits = 0;
    if (this.b8042InBuff >= ChipSet.KBD_CMD.PULSE_OUTPORT) {
        bPulseBits = (this.b8042InBuff ^ 0xf);
        /*
         * Now that we have isolated the bit(s) to pulse, map all pulse commands to KBD_CMD.PULSE_OUTPORT 
         */
        this.b8042InBuff = ChipSet.KBD_CMD.PULSE_OUTPORT;
    }
    
    switch (this.b8042InBuff) {
    /*
     * No further action is required for this first group of commands; more data is expected via out8042InBuffData().
     */
    case ChipSet.KBD_CMD.WRITE_CMD:         // 0x60
    case ChipSet.KBD_CMD.WRITE_OUTPORT:     // 0xD1
        break;

    case ChipSet.KBD_CMD.READ_INPORT:       // 0xC0
        this.b8042OutBuff = this.b8042InPort;
        this.b8042Status |= ChipSet.KBD_STATUS.OUTBUFF_DELAY;
        break;
    
    case ChipSet.KBD_CMD.DISABLE_KBD:       // 0xAD
        this.b8042CmdData |= ChipSet.KBD_DATA.CMD.NO_CLOCK;
        break;

    case ChipSet.KBD_CMD.ENABLE_KBD:        // 0xAE
        this.b8042CmdData &= ~ChipSet.KBD_DATA.CMD.NO_CLOCK;
        break;

    case ChipSet.KBD_CMD.SELF_TEST:         // 0xAA
        this.b8042OutBuff = ChipSet.KBD_DATA.SELF_TEST.OK;
        this.b8042Status |= ChipSet.KBD_STATUS.OUTBUFF_DELAY;
        break;

    case ChipSet.KBD_CMD.READ_TEST:         // 0xE0
        /*
         * TODO: Do we need to "OR" anything here for KBD_DATA.TESTPORT.DATA?
         */
        this.b8042OutBuff = ((this.b8042CmdData & ChipSet.KBD_DATA.CMD.NO_CLOCK)? 0 : ChipSet.KBD_DATA.TESTPORT.CLOCK);
        this.b8042Status |= ChipSet.KBD_STATUS.OUTBUFF_DELAY;
        break;
        
    case ChipSet.KBD_CMD.PULSE_OUTPORT:     // 0xF0-0xFF
        if (bPulseBits & 0x1) {
            /*
             * Bit 0 of the 8042's output port is connected to RESET.  If it's pulsed, the processor resets.
             * We don't want to clear ALL our internal state (eg, cycle counts), so we call cpu.resetRegs() instead
             * of cpu.reset().
             */
            this.cpu.resetRegs();
        }
        break;
    
    default:
        this.messageDebugger("unrecognized 8042 command: " + str.toHexByte(this.b8042InBuff));
        this.cpu.haltCPU();
        break;
    }
};

/**
 * inCMOSAddr(port, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x70)
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inCMOSAddr = function(port, addrFrom)
{
    this.messagePort(port, null, addrFrom, "CMOS_ADDR", ChipSet.MESSAGE_CHIPSET, this.bCMOSAddr);
    return this.bCMOSAddr;
};

/**
 * outCMOSAddr(port, bOut, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x70)
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outCMOSAddr = function(port, bOut, addrFrom)
{
    this.messagePort(port, bOut, addrFrom, "CMOS_ADDR", ChipSet.MESSAGE_CHIPSET);
    this.bCMOSAddr = bOut;
    this.bNMI = (bOut & ChipSet.CMOS_ADDR.NMI_DISABLE)? ChipSet.NMI.DISABLE : ChipSet.NMI.ENABLE;
};

/**
 * inCMOSData(port, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x71)
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inCMOSData = function(port, addrFrom)
{
    var bAddr = this.bCMOSAddr & ChipSet.CMOS_ADDR.MASK;
    var bIn = (bAddr <= ChipSet.CMOS_ADDR.RTC_STATUSD? this.getRTCByte(bAddr) : this.abCMOSData[bAddr]);
    this.messagePort(port, null, addrFrom, "CMOS_DATA[" + str.toHexByte(bAddr) + "]", ChipSet.MESSAGE_CHIPSET, bIn);
    return bIn;
};

/**
 * outCMOSData(port, bOut, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x71)
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outCMOSData = function(port, bOut, addrFrom)
{
    var bAddr = this.bCMOSAddr & ChipSet.CMOS_ADDR.MASK;
    this.messagePort(port, bOut, addrFrom, "CMOS_DATA[" + str.toHexByte(bAddr) + "]", ChipSet.MESSAGE_CHIPSET);
    this.abCMOSData[bAddr] = (bAddr <= ChipSet.CMOS_ADDR.RTC_STATUSD? this.setRTCByte(bAddr, bOut) : bOut);
};

/**
 * inMFGData(port, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x80)
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to read the specified port)
 * @return {number} simulated port value
 */
ChipSet.prototype.inMFGData = function(port, addrFrom)
{
    this.messagePort(port, null, addrFrom, "MFG_DATA", ChipSet.MESSAGE_CHIPSET, this.bMFGData);
    return this.bMFGData;
};

/**
 * outMFGData(port, bOut, addrFrom)
 *
 * @this {ChipSet}
 * @param {number} port (0x80)
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outMFGData = function(port, bOut, addrFrom)
{
    this.messagePort(port, bOut, addrFrom, "MFG_DATA", ChipSet.MESSAGE_CHIPSET);
    this.bMFGData = bOut;
};

/**
 * outNMI(port, bOut, addrFrom)
 * 
 * This handler is installed only for models before MODEL_5170.
 * 
 * @this {ChipSet}
 * @param {number} port (0xA0)
 * @param {number} bOut
 * @param {number|undefined} addrFrom (not defined if the Debugger is trying to write the specified port)
 */
ChipSet.prototype.outNMI = function(port, bOut, addrFrom)
{
    this.messagePort(port, bOut, addrFrom, "NMI", ChipSet.MESSAGE_CHIPSET);
    this.bNMI = bOut;
};

/**
 * parseSwitches(s, def)
 * 
 * @this {ChipSet}
 * @param {string|undefined} s describing switch settings (can't simply use parseInt() with a base of 2, because the bit order is reversed, as well as the bit sense)
 * @param {number} def is a default value to use if s is undefined
 * @return {number} value representing the switch settings
 */
ChipSet.prototype.parseSwitches = function(s, def)
{
    if (s === undefined) return def;
    var b = 0, bit = 0x1;
    for (var i = 0; i < s.length; i++) {
        if (s.charAt(i) == "0") b |= bit;
        bit <<= 1;
    }
    return b;
};

/**
 * setSpeaker(fOn)
 * 
 * @this {ChipSet}
 * @param {boolean} [fOn] true to turn speaker on, false to turn off, otherwise update as appropriate
 */
ChipSet.prototype.setSpeaker = function(fOn)
{
    if (this.contextAudio) {
        if (fOn !== undefined) {
            this.fSpeaker = fOn;
        } else {
            fOn = this.fSpeaker && this.cpu && this.cpu.isRunning();
        }
        var freq = Math.round(ChipSet.TIMER_TICKS_PER_SEC / this.getTimerInit(ChipSet.TIMER2.INDEX));
        /*
         * Treat frequencies outside the normal hearing range (below 20hz or above 20Khz) as a clever attempt
         * to turn sound off; we have to explicitly turn the sound off in those cases, to prevent the Audio API
         * from "easing" the audio to the target frequency and creating odd sound effects.
         */
        if (freq < 20 || freq > 20000) fOn = false;
        if (fOn) {
            if (this.sourceAudio) {
                this.sourceAudio['frequency']['value'] = freq;
                this.messageDebugger("speaker set to " + freq + "hz", ChipSet.MESSAGE_SPEAKER);
            } else {
                this.sourceAudio = this.contextAudio['createOscillator']();
                this.sourceAudio['type'] = 1;       // 0: sine wave, 1: square wave, 2: sawtooth wave, 3: triangle wave
                this.sourceAudio['connect'](this.contextAudio['destination']);
                this.sourceAudio['frequency']['value'] = freq;
                this.messageDebugger("speaker on at  " + freq + "hz", ChipSet.MESSAGE_SPEAKER);
                this.sourceAudio['noteOn'](0);      // aka start()
            }
        } else {
            if (this.sourceAudio) {
                this.sourceAudio['noteOff'](0);     // aka stop()
                this.sourceAudio['disconnect']();   // QUESTION: is this automatic following a stop(), since this particular source cannot be started again?
                delete this.sourceAudio;            // QUESTION: ditto?
                this.messageDebugger("speaker off at " + freq + "hz", ChipSet.MESSAGE_SPEAKER);
            }
        }
    } else if (fOn) {
        this.messageDebugger("BEEP", ChipSet.MESSAGE_SPEAKER);
    }
};

/**
 * messageDebugger(sMessage, bitsMessage, nIRQ)
 * 
 * @this {ChipSet}
 * @param {string} sMessage is any caller-defined message string
 * @param {number} [bitsMessage] is one or more Debugger MESSAGE_* category flag(s)
 * @param {number|undefined} [nIRQ] if the message is associated with a particular IRQ #
 *
 * This is a combination of the Debugger's messageEnabled() and message() functions, for convenience.
 *
 * NOTE: If the caller specifies multiple MESSAGE category flags, then ALL the corresponding message
 * categories in the Debugger must be enabled as well, else the message will not be displayed.
 */
ChipSet.prototype.messageDebugger = function(sMessage, bitsMessage, nIRQ)
{
    if (DEBUGGER && this.dbg) {
        if (bitsMessage == null) {
            bitsMessage = ChipSet.MESSAGE_CHIPSET;
        }
        if (nIRQ !== undefined) {
            bitsMessage |= (nIRQ == ChipSet.IRQ.TIMER0? ChipSet.MESSAGE_TIMER : (nIRQ == ChipSet.IRQ.KBD? ChipSet.MESSAGE_KBD : (nIRQ == ChipSet.IRQ.FDC? ChipSet.MESSAGE_FDC : 0)));
        }
        if (this.dbg.messageEnabled(bitsMessage)) {
            this.dbg.message(sMessage);
        }
    }
};

/**
 * messagePort(port, bOut, addrFrom, name, bitsMessage, bIn)
 * 
 * @this {ChipSet}
 * @param {number} port
 * @param {number|null} bOut if an output operation
 * @param {number|null} [addrFrom]
 * @param {string|null} [name] of the port, if any
 * @param {number|null} [bitsMessage] is one or more a Debugger MESSAGE_* category flag(s)
 * @param {number} [bIn] is the input value, if known, on an input operation
 *
 * This is an internal version of the Debugger's messagePort() function, for convenience.
 *
 * NOTE: If the caller specifies multiple MESSAGE category flags, then ALL the corresponding message
 * categories in the Debugger must be enabled as well, else the message will not be displayed.
 */
ChipSet.prototype.messagePort = function(port, bOut, addrFrom, name, bitsMessage, bIn)
{
    if (DEBUGGER && this.dbg) {
        if (bitsMessage == null) {
            bitsMessage = ChipSet.MESSAGE_CHIPSET;
        }
        this.dbg.messagePort(this, port, bOut, addrFrom, name, bitsMessage, bIn);
    }
};

/*
 * Port input notification tables
 */
ChipSet.aPortInput = {
    0x00: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAChannelAddr(ChipSet.DMA0.INDEX, 0, port, addrFrom); },
    0x01: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAChannelCount(ChipSet.DMA0.INDEX, 0, port, addrFrom); },
    0x02: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAChannelAddr(ChipSet.DMA0.INDEX, 1, port, addrFrom); },
    0x03: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAChannelCount(ChipSet.DMA0.INDEX, 1, port, addrFrom); },
    0x04: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAChannelAddr(ChipSet.DMA0.INDEX, 2, port, addrFrom); },
    0x05: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAChannelCount(ChipSet.DMA0.INDEX, 2, port, addrFrom); },
    0x06: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAChannelAddr(ChipSet.DMA0.INDEX, 3, port, addrFrom); },
    0x07: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAChannelCount(ChipSet.DMA0.INDEX, 3, port, addrFrom); },
    0x08: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAStatus(ChipSet.DMA0.INDEX, port, addrFrom); },
    0x20: /** @this {ChipSet} */ function(port, addrFrom) { return this.inPICL(ChipSet.PIC0.INDEX, addrFrom); },
    0x21: /** @this {ChipSet} */ function(port, addrFrom) { return this.inPICH(ChipSet.PIC0.INDEX, addrFrom); },
    0x40: /** @this {ChipSet} */ function(port, addrFrom) { return this.inTimer(ChipSet.TIMER0.INDEX, addrFrom); },
    0x41: /** @this {ChipSet} */ function(port, addrFrom) { return this.inTimer(ChipSet.TIMER1.INDEX, addrFrom); },
    0x42: /** @this {ChipSet} */ function(port, addrFrom) { return this.inTimer(ChipSet.TIMER2.INDEX, addrFrom); },
    0x43: ChipSet.prototype.inTimerCtrl,
    0x81: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAPageReg(ChipSet.DMA0.INDEX, 2, port, addrFrom); },
    0x82: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAPageReg(ChipSet.DMA0.INDEX, 3, port, addrFrom); },
    0x83: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAPageReg(ChipSet.DMA0.INDEX, 1, port, addrFrom); },
    0x87: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAPageReg(ChipSet.DMA0.INDEX, 0, port, addrFrom); }
};

ChipSet.aPortInput5150 = {
    0x60: ChipSet.prototype.inPPIA,
    0x61: ChipSet.prototype.inPPIB,
    0x62: ChipSet.prototype.inPPIC,
    0x63: ChipSet.prototype.inPPICtrl   // technically, not actually readable, but I want the Debugger to be able to read this
};

ChipSet.aPortInput5170 = {
    0x60: ChipSet.prototype.in8042OutBuff,
    0x61: ChipSet.prototype.inPPIB,
    0x64: ChipSet.prototype.in8042Status,
    0x70: ChipSet.prototype.inCMOSAddr,
    0x71: ChipSet.prototype.inCMOSData,
    0x80: ChipSet.prototype.inMFGData,
    0x84: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAPageSpare(0, port, addrFrom); },
    0x85: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAPageSpare(1, port, addrFrom); },
    0x86: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAPageSpare(2, port, addrFrom); },
    0x88: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAPageSpare(3, port, addrFrom); },
    0x89: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAPageReg(ChipSet.DMA1.INDEX, 2, port, addrFrom); },
    0x8A: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAPageReg(ChipSet.DMA1.INDEX, 3, port, addrFrom); },
    0x8B: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAPageReg(ChipSet.DMA1.INDEX, 1, port, addrFrom); },
    0x8C: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAPageSpare(4, port, addrFrom); },
    0x8D: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAPageSpare(5, port, addrFrom); },
    0x8E: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAPageSpare(6, port, addrFrom); },
    0x8F: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAPageReg(ChipSet.DMA1.INDEX, 0, port, addrFrom); },
    0xA0: /** @this {ChipSet} */ function(port, addrFrom) { return this.inPICL(ChipSet.PIC1.INDEX, addrFrom); },
    0xA1: /** @this {ChipSet} */ function(port, addrFrom) { return this.inPICH(ChipSet.PIC1.INDEX, addrFrom); },
    0xC0: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAChannelAddr(ChipSet.DMA1.INDEX, 0, port, addrFrom); },
    0xC2: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAChannelCount(ChipSet.DMA1.INDEX, 0, port, addrFrom); },
    0xC4: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAChannelAddr(ChipSet.DMA1.INDEX, 1, port, addrFrom); },
    0xC6: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAChannelCount(ChipSet.DMA1.INDEX, 1, port, addrFrom); },
    0xC8: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAChannelAddr(ChipSet.DMA1.INDEX, 2, port, addrFrom); },
    0xCA: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAChannelCount(ChipSet.DMA1.INDEX, 2, port, addrFrom); },
    0xCC: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAChannelAddr(ChipSet.DMA1.INDEX, 3, port, addrFrom); },
    0xCE: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAChannelCount(ChipSet.DMA1.INDEX, 3, port, addrFrom); },
    0xD0: /** @this {ChipSet} */ function(port, addrFrom) { return this.inDMAStatus(ChipSet.DMA1.INDEX, port, addrFrom); },
   0x1F7: /** @this {ChipSet} */ function(port, addrFrom) { return 0x7F; }      // refer to comments regarding HFCOMBO.STATUS
};

/*
 * Port output notification tables
 */
ChipSet.aPortOutput = {
    0x00: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAChannelAddr(ChipSet.DMA0.INDEX, 0, port, bOut, addrFrom); },
    0x01: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAChannelCount(ChipSet.DMA0.INDEX, 0, port, bOut, addrFrom); },
    0x02: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAChannelAddr(ChipSet.DMA0.INDEX, 1, port, bOut, addrFrom); },
    0x03: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAChannelCount(ChipSet.DMA0.INDEX, 1, port, bOut, addrFrom); },
    0x04: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAChannelAddr(ChipSet.DMA0.INDEX, 2, port, bOut, addrFrom); },
    0x05: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAChannelCount(ChipSet.DMA0.INDEX, 2, port, bOut, addrFrom); },
    0x06: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAChannelAddr(ChipSet.DMA0.INDEX, 3, port, bOut, addrFrom); },
    0x07: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAChannelCount(ChipSet.DMA0.INDEX, 3, port, bOut, addrFrom); },
    0x08: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMACmd(ChipSet.DMA0.INDEX, port, bOut, addrFrom); },
    0x09: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAReq(ChipSet.DMA0.INDEX, port, bOut, addrFrom); },
    0x0A: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAMask(ChipSet.DMA0.INDEX, port, bOut, addrFrom); },
    0x0B: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAMode(ChipSet.DMA0.INDEX, port, bOut, addrFrom); },
    0x0C: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAIndex(ChipSet.DMA0.INDEX, port, bOut, addrFrom); },
    0x0D: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAClear(ChipSet.DMA0.INDEX, port, bOut, addrFrom); },
    0x20: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outPICL(ChipSet.PIC0.INDEX, bOut, addrFrom); },
    0x21: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outPICH(ChipSet.PIC0.INDEX, bOut, addrFrom); },
    0x40: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outTimer(ChipSet.TIMER0.INDEX, bOut, addrFrom); },
    0x41: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outTimer(ChipSet.TIMER1.INDEX, bOut, addrFrom); },
    0x42: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outTimer(ChipSet.TIMER2.INDEX, bOut, addrFrom); },
    0x43: ChipSet.prototype.outTimerCtrl,
    0x81: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAPageReg(ChipSet.DMA0.INDEX, 2, port, bOut, addrFrom); },
    0x82: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAPageReg(ChipSet.DMA0.INDEX, 3, port, bOut, addrFrom); },
    0x83: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAPageReg(ChipSet.DMA0.INDEX, 1, port, bOut, addrFrom); },
    0x87: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAPageReg(ChipSet.DMA0.INDEX, 0, port, bOut, addrFrom); }
};

ChipSet.aPortOutput5150 = {
    0x60: ChipSet.prototype.outPPIA,
    0x61: ChipSet.prototype.outPPIB,
    0x62: ChipSet.prototype.outPPIC,
    0x63: ChipSet.prototype.outPPICtrl,
    0xA0: ChipSet.prototype.outNMI
};

ChipSet.aPortOutput5170 = {
    0x60: ChipSet.prototype.out8042InBuffData,
    0x61: ChipSet.prototype.outPPIB,
    0x64: ChipSet.prototype.out8042InBuffCmd,
    0x70: ChipSet.prototype.outCMOSAddr,
    0x71: ChipSet.prototype.outCMOSData,
    0x80: ChipSet.prototype.outMFGData,
    0x84: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAPageSpare(0, port, bOut, addrFrom); },
    0x85: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAPageSpare(1, port, bOut, addrFrom); },
    0x86: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAPageSpare(2, port, bOut, addrFrom); },
    0x88: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAPageSpare(3, port, bOut, addrFrom); },
    0x89: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAPageReg(ChipSet.DMA1.INDEX, 2, port, bOut, addrFrom); },
    0x8A: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAPageReg(ChipSet.DMA1.INDEX, 3, port, bOut, addrFrom); },
    0x8B: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAPageReg(ChipSet.DMA1.INDEX, 1, port, bOut, addrFrom); },
    0x8C: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAPageSpare(4, port, bOut, addrFrom); },
    0x8D: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAPageSpare(5, port, bOut, addrFrom); },
    0x8E: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAPageSpare(6, port, bOut, addrFrom); },
    0x8F: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAPageReg(ChipSet.DMA1.INDEX, 0, port, bOut, addrFrom); },
    0xA0: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outPICL(ChipSet.PIC1.INDEX, bOut, addrFrom); },
    0xA1: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outPICH(ChipSet.PIC1.INDEX, bOut, addrFrom); },
    0xC0: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAChannelAddr(ChipSet.DMA1.INDEX, 0, port, bOut, addrFrom); },
    0xC2: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAChannelCount(ChipSet.DMA1.INDEX, 0, port, bOut, addrFrom); },
    0xC4: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAChannelAddr(ChipSet.DMA1.INDEX, 1, port, bOut, addrFrom); },
    0xC6: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAChannelCount(ChipSet.DMA1.INDEX, 1, port, bOut, addrFrom); },
    0xC8: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAChannelAddr(ChipSet.DMA1.INDEX, 2, port, bOut, addrFrom); },
    0xCA: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAChannelCount(ChipSet.DMA1.INDEX, 2, port, bOut, addrFrom); },
    0xCC: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAChannelAddr(ChipSet.DMA1.INDEX, 3, port, bOut, addrFrom); },
    0xCE: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAChannelCount(ChipSet.DMA1.INDEX, 3, port, bOut, addrFrom); },
    0xD0: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMACmd(ChipSet.DMA1.INDEX, port, bOut, addrFrom); },
    0xD2: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAReq(ChipSet.DMA1.INDEX, port, bOut, addrFrom); },
    0xD4: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAMask(ChipSet.DMA1.INDEX, port, bOut, addrFrom); },
    0xD6: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAMode(ChipSet.DMA1.INDEX, port, bOut, addrFrom); },
    0xD8: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAIndex(ChipSet.DMA1.INDEX, port, bOut, addrFrom); },
    0xDA: /** @this {ChipSet} */ function(port, bOut, addrFrom) { this.outDMAClear(ChipSet.DMA1.INDEX, port, bOut, addrFrom); }
};

/**
 *  ChipSet.init()
 *
 *  This function operates on every element (e) of class "chipset", and initializes
 *  all the necessary HTML to construct the ChipSet module(s) as spec'ed.
 *
 *  Note that each element (e) of class "chipset" is expected to have a "data-value"
 *  attribute containing the same JSON-encoded parameters that the ChipSet constructor
 *  expects.
 */
ChipSet.init = function()
{
    var aeChipSet = Component.getElementsByClass(window.document, PCJSCLASS, "chipset");
    for (var iChip = 0; iChip < aeChipSet.length; iChip++) {
        var eChipSet = aeChipSet[iChip];
        var parmsChipSet = Component.getComponentParms(eChipSet);
        var chipset = new ChipSet(parmsChipSet);
        Component.bindComponentControls(chipset, eChipSet, PCJSCLASS);
        chipset.updateSwitchDesc();
    }
};

/*
 * Initialize every ChipSet module on the page.
 */
web.onInit(ChipSet.init);

if (typeof APP_PCJS !== 'undefined') APP_PCJS.ChipSet = ChipSet;

if (typeof module !== 'undefined') module.exports = ChipSet;
