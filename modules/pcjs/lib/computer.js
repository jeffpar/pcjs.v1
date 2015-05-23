/**
 * @fileoverview Implements the PCjs Computer component.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2012-Jun-15
 *
 * Copyright © 2012-2015 Jeff Parsons <Jeff@pcjs.org>
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

/*
 * BUILD INSTRUCTIONS
 *
 * To build PCjs (pc.js), run Google's Closure Compiler, replacing "*.js" with
 * the input file sequence defined by the "pcJSFiles" property in package.json:
 *
 *      java -jar compiler.jar
 *          --compilation_level ADVANCED_OPTIMIZATIONS
 *          --define='DEBUG=false'
 *          --warning_level=VERBOSE
 *          --js *.js
 *          --js_output_file pc.js
 *
 * Google's Closure Compiler (compiler.jar) is documented at
 * https://developers.google.com/closure/compiler/ and is available
 * for download here:
 *
 *      http://closure-compiler.googlecode.com/files/compiler-latest.zip
 *
 * The PCjs JavaScript files do have some initialization-order dependencies.
 * If you load the files individually, it's recommended that you load them in
 * the same order that they're compiled.
 *
 * Generally speaking, component.js should be first, computer.js should be
 * last (of the files based on component.js), and panel.js should be listed
 * early so that the Control Panel is ready as soon as possible.
 *
 * Another recent ordering requirement is that rom.js must be loaded before
 * ram.js; this was true before, but now it's required, because I'm starting
 * to add ROM BIOS Data Area definitions to rom.js, and since the data area
 * is in RAM, ram.js may want access to some of those definitions.
 */

"use strict";

if (typeof module !== 'undefined') {
    var str         = require("../../shared/lib/strlib");
    var usr         = require("../../shared/lib/usrlib");
    var web         = require("../../shared/lib/weblib");
    var UserAPI     = require("../../shared/lib/userapi");
    var ReportAPI   = require("../../shared/lib/reportapi");
    var Component   = require("../../shared/lib/component");
    var Messages    = require("./messages");
    var Bus         = require("./bus");
    var State       = require("./state");
}

/**
 * Computer(parmsComputer, parmsMachine, fSuspended)
 *
 * @constructor
 * @extends Component
 * @param {Object} parmsComputer
 * @param {Object} [parmsMachine]
 * @param {boolean} [fSuspended]
 *
 * The Computer component has no required (parmsComputer) properties, but does
 * support the following:
 *
 *      busWidth: number of memory address lines (address bits) on the computer's "bus";
 *      20 is the minimum (and the default), which implies 8086/8088 real-mode addressing,
 *      while 24 is required for 80286 protected-mode addressing.  This value is passed
 *      directly through to the Bus component; see that component for more details.
 *
 *      resume: one of the Computer.RESUME constants, which are as follows:
 *          '0' if resume disabled (default)
 *          '1' if enabled without prompting
 *          '2' if enabled with prompting
 *          '3' if enabled with prompting and auto-delete
 *          or a string containing the path of a predefined JSON-encoded state
 *
 *      state: the path to JSON-encoded state file (see details regarding 'state' below)
 *
 * If a predefined state is supplied AND it's successfully loaded, then resume behavior
 * defaults to '1' (ie, resume enabled without prompting).
 *
 * This component insures that all components are ready before "powering" them.
 *
 * Different components become ready at different times, and initialization order (ie,
 * the order the scripts are combined on the page) only partially determines readiness.
 * This is because components like ROM and Video must finish loading their resource files
 * before they are ready.  Other components become ready after we call their initBus()
 * function, because they have a Bus or CPU dependency, such as access to memory management
 * functions.  And other components, like CPU and Panel, are ready as soon as their
 * constructor finishes.
 *
 * Once a component has indicated it's ready, we call its powerUp() notification
 * function (if it has one--it's optional).  We call the CPU's powerUp() function last,
 * so that the CPU is assured that all other components are ready and "powered".
 */
function Computer(parmsComputer, parmsMachine, fSuspended) {

    Component.call(this, "Computer", parmsComputer, Computer, Messages.COMPUTER);

    this.aFlags.fPowered = false;
    /*
     * TODO: Deprecate 'buswidth' (it should have always used camelCase)
     */
    this.nBusWidth = parmsComputer['busWidth'] || parmsComputer['buswidth'];
    this.resume = Computer.RESUME_NONE;
    this.sStateData = null;
    this.fServerState = false;
    this.url = parmsMachine? parmsMachine['url'] : null;

    /*
     * Generate a random number x (where 0 <= x < 1), add 0.1 so that it's guaranteed to be
     * non-zero, convert to base 36, and chop off the leading digit and "decimal" point.
     */
    this.sMachineID = (Math.random() + 0.1).toString(36).substr(2,12);
    this.sUserID = this.queryUserID();

    /*
     * Find the appropriate CPU (and Debugger and Control Panel, if any)
     *
     * CLOSURE COMPILER TIP: To override the type of a right-hand expression (as we need to do here,
     * where we know getComponentByType() will only return an X86CPU object or null), wrap the expression
     * in parentheses.  I never knew this until I stumbled across it in "Closure: The Definitive Guide".
     */
    this.cpu = /** @type {X86CPU} */ (Component.getComponentByType("CPU", this.id));
    if (!this.cpu) {
        Component.error("Unable to find CPU component");
        return;
    }
    this.dbg = /** @type {Debugger} */ (Component.getComponentByType("Debugger", this.id));

    /*
     * Initialize the Bus component
     */
    this.bus = new Bus({'id': this.idMachine + '.bus', 'buswidth': this.nBusWidth}, this.cpu, this.dbg);

    /*
     * Iterate through all the components and connect them to the Control Panel, if any
     */
    var iComponent, component;
    var aComponents = Component.getComponents(this.id);
    this.panel = Component.getComponentByType("Panel", this.id);

    if (this.panel && this.panel.controlPrint) {
        for (iComponent = 0; iComponent < aComponents.length; iComponent++) {
            component = aComponents[iComponent];
            /*
             * I can think of many "cleaner" ways for the Control Panel component to pass its
             * notice(), println(), etc, overrides on to all the other components, but it's just
             * too darn convenient to slam those overrides into the components directly.
             */
            component.notice = this.panel.notice;
            component.println = this.panel.println;
            component.controlPrint = this.panel.controlPrint;
        }
    }

    if (DEBUG && this.messageEnabled()) this.printMessage("PREFETCH: " + PREFETCH + ", TYPEDARRAYS: " + TYPEDARRAYS);

    /*
     * Iterate through all the components again and call their initBus() handler, if any
     */
    for (iComponent = 0; iComponent < aComponents.length; iComponent++) {
        component = aComponents[iComponent];
        if (component.initBus) component.initBus(this, this.bus, this.cpu, this.dbg);
    }

    var sStatePath = null;
    var sResume = parmsComputer['resume'];
    if (sResume !== undefined) {
        /*
         * DEPRECATE: This goofiness is a holdover from when the 'resume' property was a string (either a
         * single-digit string or a path); now it's always a number, so it never has a 'length' property and
         * the call to parseInt() is unnecessary.
         */
        if (sResume.length > 1) {
            sStatePath = this.sResumePath = sResume;
        } else {
            this.resume = parseInt(sResume, 10);
        }
    }

    /*
     * The Computer 'state' property allows a state file to be specified independent of the 'resume' feature;
     * previously, you could only use 'resume' to load a state file -- which we still support, but loading a state
     * file that way prevents the machine's state from being saved, since we always resume from the 'resume' file.
     *
     * The other wrinkle is on the restore side: we need to IGNORE the 'state' property if a saved state now exists.
     * So we have to peek at localStorage, and unfortunately, the only way to "peek" is to actually load the data,
     * but we're not ready to use it yet, so powerUp() has been changed to use any existing stateComputer that we've
     * already loaded.
     *
     * However, there's now a wrinkle to the wrinkle: if a 'state' parameter has been passed via the URL, then that
     * OVERRIDES everything; it overrides any 'state' Computer parameter AND it disables resume of any saved state in
     * localStorage (in other words, it prevents fAllowResume from being true, and forcing resume off).
     */
    var fAllowResume;
    var sState = Component.parmsURL && Component.parmsURL['state'] || (fAllowResume = true) && parmsComputer['state'];

    if (sState) {
        sStatePath = this.sStatePath = sState;
        if (!fAllowResume) {
            this.fServerState = true;
            this.resume = Computer.RESUME_NONE;
        }
        if (this.resume) {
            this.stateComputer = new State(this, Computer.sAppVer);
            if (this.stateComputer.load()) {
                sStatePath = null;
            } else {
                delete this.stateComputer;
            }
        }
    }

    /*
     * If sStatePath is set, we must use it.  But if there's no sStatePath AND resume is set,
     * then we have the option of resuming from a server-side state, assuming a valid USERID.
     */
    if (!sStatePath && this.resume) {
        sStatePath = this.getServerStatePath();
        if (sStatePath) this.fServerState = true;
    }

    if (!sStatePath) {
        this.setReady();
    } else {
        web.loadResource(sStatePath, true, null, this, this.onLoadSetReady);
    }

    if (!fSuspended) {
        /*
         * Power "up" the computer, giving every component the opportunity to reset or restore itself.
         */
        this.wait(this.powerOn);
    }
}

Component.subclass(Computer);

/*
 * NOTE: 1.01 is the first version to provide limited save/restore support using localStorage.
 * From this point on, care must be taken to insure that any new version that's incompatible with
 * previous localStorage data be released with a version number that is at least 1 greater,
 * since we're tagging the localStorage data with the integer portion of the version string.
 */
Computer.sAppName = APPNAME || "PCjs";
Computer.sAppVer = APPVERSION;
Computer.sCopyright = "Copyright © 2012-2015 Jeff Parsons <Jeff@pcjs.org>";

/*
 * I think it's a good idea to also display a GPL notice, putting people on notice that even
 * the "compiled" source code has all the same GPL requirements as the uncompiled source code.
 */
Computer.LICENSE = "License: GPL version 3 or later <http://gnu.org/licenses/gpl.html>";

Computer.STATE_FAILSAFE  = "failsafe";
Computer.STATE_VALIDATE  = "validate";
Computer.STATE_TIMESTAMP = "timestamp";
Computer.STATE_VERSION   = "version";
Computer.STATE_HOSTURL   = "url";
Computer.STATE_BROWSER   = "browser";
Computer.STATE_USERID    = "user";

/*
 * The following constants define all the resume options.  Negative values (eg, RESUME_REPOWER) are for
 * internal use only, and RESUME_DELETE is not documented (it provides a way of deleting ALL saved states
 * whenever a resume is declined).  As a result, the only "end-user" values are 0, 1 and 2.
 */
Computer.RESUME_REPOWER = -1;   // resume without changing any state (for internal use only)
Computer.RESUME_NONE    = 0;    // default (no resume)
Computer.RESUME_AUTO    = 1;    // automatically save/restore state
Computer.RESUME_PROMPT  = 2;    // automatically save but conditionally restore (WARNING: if restore is declined, any state is discarded)
Computer.RESUME_DELETE  = 3;    // same as RESUME_PROMPT but discards ALL machines states whenever ANY machine restore is declined (undocumented)

/**
 * getMachineID()
 *
 * @return {string}
 */
Computer.prototype.getMachineID = function()
{
    return this.sMachineID;
};

/**
 * getUserID()
 *
 * @return {string}
 */
Computer.prototype.getUserID = function()
{
    return this.sUserID? this.sUserID : "";
};

/**
 * onLoadSetReady(sStateFile, sStateData, nErrorCode)
 *
 * @this {Computer}
 * @param {string} sStateFile
 * @param {string} sStateData
 * @param {number} nErrorCode
 */
Computer.prototype.onLoadSetReady = function(sStateFile, sStateData, nErrorCode)
{
    if (!nErrorCode) {
        this.sStateData = sStateData;
        if (DEBUG && this.messageEnabled()) {
            this.printMessage("loaded state file " + sStateFile.replace(this.sUserID || "xxx", "xxx"));
        }
    } else {
        this.sResumePath = null;
        this.fServerState = false;
        this.notice('Unable to load machine state from server (error ' + nErrorCode + (sStateData? ': ' + str.trim(sStateData) : '') + ')');
    }
    this.setReady();
};

/**
 * wait(fn, parms)
 *
 * wait() waits until every component is ready (including ourselves, the last component we check),
 * then calls the specified Computer method.
 *
 * TODO: As with web.loadResource(), the Closure Compiler makes it difficult for us to define
 * a function type for "fn" that works in all cases; sometimes we want to pass a function that takes
 * only a "number", and other times we want to pass a function that takes only an "Array" (the type
 * will mirror that of the "parms" parameter). However, the Closure Compiler insists that both functions
 * must be declared as accepting both types of parameters. So once again, we must use an untyped function
 * declaration, instead of something stricter like:
 *
 *      param {function(this:Computer, (number|Array|undefined)): undefined} fn
 *
 * @this {Computer}
 * @param {function(...)} fn
 * @param {number|Array} [parms] optional parameters
 */
Computer.prototype.wait = function(fn, parms)
{
    var computer = this;
    var aComponents = Component.getComponents(this.id);
    for (var iComponent = 0; iComponent <= aComponents.length; iComponent++) {
        var component = (iComponent < aComponents.length ? aComponents[iComponent] : this);
        if (!component.isReady()) {
            component.isReady(function onComponentReady() {
                computer.wait(fn, parms);
            });
            return;
        }
    }
    if (DEBUG && this.messageEnabled()) this.printMessage("Computer.wait(ready)");
    fn.call(this, parms);
};

/**
 * validateState(stateComputer)
 *
 * NOTE: We clear() stateValidate only when there's no stateComputer.
 *
 * @this {Computer}
 * @param {State|null} [stateComputer]
 * @return {boolean} true if state passes validation, false if not
 */
Computer.prototype.validateState = function(stateComputer)
{
    var fValid = true;
    var stateValidate = new State(this, Computer.sAppVer, Computer.STATE_VALIDATE);
    if (stateValidate.load() && stateValidate.parse()) {
        var sTimestampValidate = stateValidate.get(Computer.STATE_TIMESTAMP);
        var sTimestampComputer = stateComputer ? stateComputer.get(Computer.STATE_TIMESTAMP) : "unknown";
        if (sTimestampValidate != sTimestampComputer) {
            this.notice("Machine state may be out-of-date\n(" + sTimestampValidate + " vs. " + sTimestampComputer + ")\nCheck your browser's local storage limits");
            fValid = false;
            if (!stateComputer) stateValidate.clear();
        } else {
            if (DEBUG && this.messageEnabled()) {
                this.printMessage("Last state: " + sTimestampComputer + " (validate: " + sTimestampValidate + ")");
            }
        }
    }
    return fValid;
};

/**
 * powerOn(resume)
 *
 * Power every component "up", applying any previously available state information.
 *
 * @this {Computer}
 * @param {number} [resume] is a valid RESUME value; default is this.resume
 */
Computer.prototype.powerOn = function(resume)
{
    if (resume === undefined) {
        resume = this.resume || (this.sStateData? Computer.RESUME_AUTO : Computer.RESUME_NONE);
    }

    if (DEBUG && this.messageEnabled()) {
        this.printMessage("Computer.powerOn(" + (resume == Computer.RESUME_REPOWER ? "repower" : (resume ? "resume" : "")) + ")");
    }

    var fRepower = false;
    var fRestore = false;
    this.fRestoreError = false;
    var stateComputer = this.stateComputer || new State(this, Computer.sAppVer);

    if (resume == Computer.RESUME_REPOWER) {
        fRepower = true;
    }
    else if (resume > Computer.RESUME_NONE) {
        if (stateComputer.load(this.sStateData)) {
            /*
             * Since we're resuming something (either a predefined state or a state from localStorage), let's
             * create a "failsafe" checkpoint in localStorage, and destroy it at the end of a successful powerOn().
             * Which means, of course, that if a previous "failsafe" checkpoint already exists, something bad
             * may have happened the last time around.
             */
            this.stateFailSafe = new State(this, Computer.sAppVer, Computer.STATE_FAILSAFE);
            if (this.stateFailSafe.load()) {
                this.powerReport(stateComputer);
                /*
                 * We already know resume is something other than RESUME_NONE, so we'll go ahead and bump it
                 * all the way to RESUME_PROMPT, so that the user will be prompted, and if the user declines to
                 * restore, the state will be removed.
                 */
                resume = Computer.RESUME_PROMPT;
                /*
                 * To ensure that the set() below succeeds, we need to call unload(), otherwise it may fail
                 * with a "read only" error (eg, "TypeError: Cannot assign to read only property 'timestamp'").
                 */
                this.stateFailSafe.unload();
            }

            this.stateFailSafe.set(Computer.STATE_TIMESTAMP, usr.getTimestamp());
            this.stateFailSafe.store();

            var fValidate = this.resume && !this.fServerState;
            if (resume == Computer.RESUME_AUTO || web.confirmUser("Click OK to restore the previous " + Computer.sAppName + " machine state, or CANCEL to reset the machine.")) {
                fRestore = stateComputer.parse();
                if (fRestore) {
                    var sCode = stateComputer.get(UserAPI.RES.CODE);
                    var sData = stateComputer.get(UserAPI.RES.DATA);
                    if (sCode) {
                        if (sCode == UserAPI.CODE.OK) {
                            stateComputer.load(sData);
                        } else {
                            /*
                             * A missing (or not yet created) state file is no cause for alarm, but other errors might be
                             */
                            if (sCode == UserAPI.CODE.FAIL && sData != UserAPI.FAIL.NOSTATE) {
                                this.notice("Error: " + sData);
                                if (sData == UserAPI.FAIL.VERIFY) this.resetUserID();
                            } else {
                                this.println(sCode + ": " + sData);
                            }
                            /*
                             * Try falling back to the state that we should have saved in localStorage, as a backup to the
                             * server-side state.
                             */
                            stateComputer.unload();     // discard the invalid server-side state first
                            if (stateComputer.load()) {
                                fRestore = stateComputer.parse();
                                fValidate = true;
                            } else {
                                fRestore = false;       // hmmm, there was nothing in localStorage either
                            }
                        }
                    }
                }
                /*
                 * If the load/parse was successful, and it was from localStorage (not sStateData),
                 * then we should to try verify that localStorage snapshot is current.  One reason it may
                 * NOT be current is if localStorage was full and we got a quota error during the last
                 * powerOff().
                 */
                if (fValidate) this.validateState(fRestore? stateComputer : null);
            } else {
                /*
                 * RESUME_PROMPT indicates we should delete the state if they clicked Cancel to confirm() above.
                 */
                if (resume == Computer.RESUME_PROMPT) stateComputer.clear();
            }
        } else {
            /*
             * If there's no state, then there should also be no validation timestamp; if there is, then once again,
             * we're probably dealing with a quota error.
             */
            this.validateState();
        }
        delete this.sStateData;
        delete this.stateComputer;
    }

    /*
     * Start powering all components, including any data they may need to restore their state;
     * we restore power to the CPU last.
     */
    var aComponents = Component.getComponents(this.id);
    for (var iComponent = 0; iComponent < aComponents.length; iComponent++) {
        var component = aComponents[iComponent];
        if (component !== this && component != this.cpu) {
            fRestore = this.powerRestore(component, stateComputer, fRepower, fRestore);
        }
    }

    /*
     * Assuming this is not a repower, we must perform another wait, because some components may
     * have marked themselves as "not ready" again (eg, the FDC component, if the restore forced it
     * to mount one or more additional disk images).
     */
    var aParms = [stateComputer, resume, fRestore];

    if (resume != Computer.RESUME_REPOWER) {
        this.wait(this.donePowerOn, aParms);
        return;
    }
    this.donePowerOn(aParms);
};

/**
 * powerRestore(component, stateComputer, fRepower, fRestore)
 *
 * @this {Computer}
 * @param {Component} component
 * @param {State} stateComputer
 * @param {boolean} fRepower
 * @param {boolean} fRestore
 * @return {boolean} true if restore should continue, false if not
 */
Computer.prototype.powerRestore = function(component, stateComputer, fRepower, fRestore)
{
    if (!component.aFlags.fPowered) {

        component.aFlags.fPowered = true;

        if (component.powerUp) {

            var data = null;
            if (fRestore) {
                data = stateComputer.get(component.id);
                if (!data) {
                    /*
                     * This is a hack that makes it possible for a machine whose ID has been
                     * supplemented with a suffix (a single letter or digit) to find object IDs
                     * in states created from a machine without the suffix.
                     *
                     * For example, if a state file was created from a machine with ID "ibm5160"
                     * but the current machine is "ibm5160a", this attempts a second lookup with
                     * "ibm5160", enabling us to find objects that match the original machine ID
                     * (eg, "ibm5160.romEGA").
                     */
                    data = stateComputer.get(component.id.replace(/[a-z0-9]\./i, '.'));
                }
            }

            /*
             * State.get() will return whatever was originally passed to State.set() (eg, an
             * Object or a string), but components are supposed to store only Objects, so if a
             * string comes back, something went wrong.  By explicitly eliminating "string" data,
             * the Closure Compiler stops complaining that we might be passing strings to our
             * powerUp() functions (even though we know we're not).
             *
             * TODO: Determine if there's some way to coerce the Closure Compiler into treating
             * data as Object or null, without having to include this runtime check.  An assert
             * would be a good idea, but this is overkill.
             */
            if (typeof data === "string") data = null;

            /*
             * If computer is null, this is simply a repower notification, which most components
             * don't do anything with.  Exceptions include: CPU (since it may be halted) and Video
             * (since its screen may be "turned off").
             */
            if (!component.powerUp(data, fRepower) && data) {

                Component.error("Unable to restore state for " + component.type);
                /*
                 * If this is a resume error for a machine that also has a predefined state
                 * AND we're not restoring from that state, then throw away the current state,
                 * prevent any new state from being created, and then force a reload, which will
                 * hopefully restore us to the functioning predefined state.
                 *
                 * TODO: Considering doing this in ALL cases, not just in situations where a
                 * 'state' exists but we're not actually resuming from it.
                 */
                if (this.sStatePath && !this.sStateData) {
                    stateComputer.clear();
                    this.resume = Computer.RESUME_NONE;
                    web.reloadPage();
                } else {
                    /*
                     * In all other cases, we set fRestoreError, which should trigger a call to
                     * powerReport() and then delete the offending state.
                     */
                    this.fRestoreError = true;
                }
                /*
                 * Any failure triggers an automatic to call powerUp() again, without any state,
                 * in the hopes that the component can recover by performing a reset.
                 */
                component.powerUp(null);
                /*
                 * We also disable the rest of the restore operation, because it's not clear
                 * the remaining state information can be trusted;  the machine is already in an
                 * inconsistent state, so we're not likely to make things worse, and the only
                 * alternative (starting over and performing a state-less reset) isn't likely to make
                 * the user any happier.  But, we'll see... we need some experience with the code.
                 */
                fRestore = false;
            }
        }

        if (!fRepower && component.comment) {
            var asComments = component.comment.split("|");
            for (var i = 0; i < asComments.length; i++) {
                component.status(asComments[i]);
            }
        }
    }
    return fRestore;
};

/**
 * donePowerOn(aParms)
 *
 * This is nothing more than a continuation of powerOn(), giving us the option of calling wait() one more time.
 *
 * @this {Computer}
 * @param {Array} aParms containing [stateComputer, resume, fRestore]
 */
Computer.prototype.donePowerOn = function(aParms)
{
    var stateComputer = aParms[0];
    var fRepower = (aParms[1] < 0);
    var fRestore = aParms[2];

    if (DEBUG && this.aFlags.fPowered && this.messageEnabled()) {
        this.printMessage("Computer.donePowerOn(): redundant");
    }

    this.aFlags.fPowered = true;

    if (!this.fInitialized) {
        this.println(Computer.sAppName + " v" + Computer.sAppVer + "\n" + Computer.sCopyright + "\n" + Computer.LICENSE);
        this.fInitialized = true;
    }

    /*
     * Once we get to this point, we're guaranteed that all components are ready, so it's safe to power the CPU;
     * the CPU should begin executing immediately, unless a debugger is attached.
     */
    if (this.cpu) {
        /*
         * TODO: Do we not care about the return value here? (ie, is checking fRestoreError sufficient)?
         */
        this.powerRestore(this.cpu, stateComputer, fRepower, fRestore);
        this.cpu.autoStart();
    }

    /*
     * If the state was bad, offer to report it and then delete it.  Deleting may be moot, since invariably a new
     * state will be created on powerOff() before the next powerOn(), but it seems like good paranoia all the same.
     */
    if (this.fRestoreError) {
        this.powerReport(stateComputer);
        stateComputer.clear();
    }

    if (!fRepower && this.stateFailSafe) {
        this.stateFailSafe.clear();
        delete this.stateFailSafe;
    }
};

/**
 * checkPower()
 *
 * @this {Computer}
 * @return {boolean} true if the computer is fully powered, false otherwise
 */
Computer.prototype.checkPower = function()
{
    if (this.aFlags.fPowered) return true;

    var component = null, iComponent;
    var aComponents = Component.getComponents(this.id);
    for (iComponent = 0; iComponent < aComponents.length; iComponent++) {
        component = aComponents[iComponent];
        if (component !== this && !component.aFlags.fReady) break;
    }
    if (iComponent == aComponents.length) {
        for (iComponent = 0; iComponent < aComponents.length; iComponent++) {
            component = aComponents[iComponent];
            if (component !== this && !component.aFlags.fPowered) break;
        }
    }
    if (iComponent == aComponents.length) component = this;
    var s = "The " + component.type + " component (" + component.id + ") is not " + (!component.aFlags.fReady? "ready yet" + (component.fnReady? " (waiting for notification)" : "") : "powered yet") + ".";
    web.alertUser(s);
    return false;
};

/**
 * powerReport(stateComputer)
 *
 * @this {Computer}
 * @param {State} stateComputer
 */
Computer.prototype.powerReport = function(stateComputer)
{
    if (web.confirmUser("There may be a problem with your " + Computer.sAppName + " machine.\n\nTo help us diagnose it, click OK to send this " + Computer.sAppName + " machine state to http://" + SITEHOST + ".")) {
        web.sendReport(Computer.sAppName, Computer.sAppVer, this.url, this.getUserID(), ReportAPI.TYPE.BUG, stateComputer.toString());
    }
};

/**
 * powerOff(fSave, fShutdown)
 *
 * Power every component "down" and optionally save the machine state.
 *
 * There's one scenario that powerOff() isn't currently able to deal with very effectively: what to do when
 * the user switches away while it's still being restored, causing Disk loadResource() calls to fail.  The
 * Disk component calls notify() when that happens -- see Disk.mount() -- but the FDC and HDC controllers don't
 * notify *us* of those problems, so Computer assumes that the restore was completely successful, when in fact
 * it was only partially successful.
 *
 * Then we immediately arrive here to perform a save, following that incomplete restore.  It would be wrong to
 * deal with that incomplete restore by setting fRestoreError, because we don't want to trigger a powerReport()
 * and the deletion of the previous state, because the state itself was presumably OK.  Unfortunately, the new
 * state we now save will no longer include manually mounted disk images whose remounts were interrupted, so future
 * restores won't remount them either.
 *
 * We could perhaps solve this by having the Disk component notify us in those situations, set a new flag
 * (fRestoreIncomplete?), and set fSave to false if that's ever set.  Be careful though: when fSave is false,
 * that means MORE than not saving; it also means deleting any previous state, which is NOT what you'd want to
 * do in a "fRestoreIncomplete" situation.  Also, we have to worry about Disk operations that fail for other reasons,
 * making sure those failures don't interfere with the save process in the same way.
 *
 * As it stands, the worst that happens is any manually mounted disk images might have to be manually remounted,
 * which doesn't seem like a huge problem.
 *
 * @this {Computer}
 * @param {boolean} fSave
 * @param {boolean} [fShutdown] is true if the machine is being shut down
 * @return {string|null} string representing the captured state (or null if error)
 */
Computer.prototype.powerOff = function(fSave, fShutdown)
{
    var data;
    var sState = "none";

    if (DEBUG && this.messageEnabled()) {
        this.printMessage("Computer.powerOff(" + (fSave ? "save" : "nosave") + (fShutdown ? ",shutdown" : "") + ")");
    }

    var stateComputer = new State(this, Computer.sAppVer);
    var stateValidate = new State(this, Computer.sAppVer, Computer.STATE_VALIDATE);

    var sTimestamp = usr.getTimestamp();
    stateValidate.set(Computer.STATE_TIMESTAMP, sTimestamp);
    stateComputer.set(Computer.STATE_TIMESTAMP, sTimestamp);
    stateComputer.set(Computer.STATE_VERSION, APPVERSION);
    stateComputer.set(Computer.STATE_HOSTURL, web.getHostURL());
    stateComputer.set(Computer.STATE_BROWSER, web.getUserAgent());

    /*
     * Always power the CPU "down" first, just to insure it doesn't ask other
     * components to do anything after they're no longer ready.
     */
    if (this.cpu && this.cpu.powerDown) {
        if (fShutdown) this.cpu.stopCPU();
        data = this.cpu.powerDown(fSave, fShutdown);
        if (typeof data === "object") stateComputer.set(this.cpu.id, data);
        if (fShutdown) {
            this.cpu.aFlags.fPowered = false;
            if (data === false) sState = null;
        }
    }

    var aComponents = Component.getComponents(this.id);
    for (var iComponent = 0; iComponent < aComponents.length; iComponent++) {
        var component = aComponents[iComponent];
        if (component.aFlags.fPowered) {
            if (component.powerDown) {
                data = component.powerDown(fSave, fShutdown);
                if (typeof data === "object") stateComputer.set(component.id, data);
            }
            if (fShutdown) {
                component.aFlags.fPowered = false;
                if (data === false) sState = null;
            }
        }
    }

    if (sState) {
        if (fShutdown) {
            var fClear = false;
            var fClearAll = false;
            if (fSave) {
                if (this.sUserID) {
                    this.saveServerState(this.sUserID, stateComputer.toString());
                }
                if (!stateValidate.store() || !stateComputer.store()) {
                    sState = null;
                    /*
                     * New behavior as of v1.13.2:  if it appears that localStorage is full, we blow it ALL away.
                     * Dedicated server-side storage is the only way we'll ever be able to reliably preserve a
                     * particular machine's state.  Historically, attempting to limp along with whatever localStorage
                     * is left just generates the same useless and annoying warnings over and over.
                     */
                    fClear = fClearAll = true;
                }
            }
            else {
                /*
                 * I used to ALWAYS clear (ie, delete) any associated computer state, but now I do this only if the
                 * current machine is "resumable", because there are situations where I have two configurations
                 * for the same machine -- one resumable and one not -- and I don't want the latter throwing away the
                 * state of the former.
                 *
                 * So this code is here now strictly for callers to delete the state of a "resumable" machine, not as
                 * some paranoid clean-up operation.
                 *
                 * An undocumented feature of this operation is that if your configuration uses the special 'resume="3"'
                 * value, and you click the "Reset" button, and then you click OK to reset the everything, this will
                 * actually reset EVERYTHING (ie, all localStorage for ALL configs will be reclaimed).
                 */
                if (this.resume) {
                    fClear = true;
                    fClearAll = (this.resume == Computer.RESUME_DELETE);
                }
            }
            if (fClear) {
                stateComputer.clear(fClearAll);
            }
        } else {
            sState = stateComputer.toString();
        }
    }

    if (fShutdown) this.aFlags.fPowered = false;

    return sState;
};

/**
 * reset()
 *
 * Notify all (other) components with a reset() method that the Computer is being reset.
 *
 * NOTE: We'd like to reset the Bus first (due to the importance of the A20 line), but since we
 * allocated the Bus object ourselves, after all the other components were allocated, it ends
 * up near the end of Component's list of components.  Hence the special case for this.bus below.
 *
 * @this {Computer}
 */
Computer.prototype.reset = function()
{
    if (this.bus && this.bus.reset) {
        /*
         * TODO: Why does WebStorm think that this.bus.type is undefined? The base class (Component)
         * constructor defines it.
         */
        this.printMessage("Resetting " + this.bus.type);
        this.bus.reset();
    }
    var aComponents = Component.getComponents(this.id);
    for (var iComponent = 0; iComponent < aComponents.length; iComponent++) {
        var component = aComponents[iComponent];
        if (component !== this && component !== this.bus && component.reset) {
            this.printMessage("Resetting " + component.type);
            component.reset();
        }
    }
};

/**
 * start(ms, nCycles)
 *
 * Notify all (other) components with a start() method that the CPU has started.
 *
 * Note that we're called by runCPU(), which is why we exclude the CPU component,
 * as well as ourselves.
 *
 * @this {Computer}
 * @param {number} ms
 * @param {number} nCycles
 */
Computer.prototype.start = function(ms, nCycles)
{
    var aComponents = Component.getComponents(this.id);
    for (var iComponent = 0; iComponent < aComponents.length; iComponent++) {
        var component = aComponents[iComponent];
        if (component.type == "CPU" || component === this) continue;
        if (component.start) {
            component.start(ms, nCycles);
        }
    }
};

/**
 * stop(ms, nCycles)
 *
 * Notify all (other) components with a stop() method that the CPU has stopped.
 *
 * Note that we're called by runCPU(), which is why we exclude the CPU component,
 * as well as ourselves.
 *
 * @this {Computer}
 * @param {number} ms
 * @param {number} nCycles
 */
Computer.prototype.stop = function(ms, nCycles)
{
    var aComponents = Component.getComponents(this.id);
    for (var iComponent = 0; iComponent < aComponents.length; iComponent++) {
        var component = aComponents[iComponent];
        if (component.type == "CPU" || component === this) continue;
        if (component.stop) {
            component.stop(ms, nCycles);
        }
    }
};

/**
 * setBinding(sHTMLType, sBinding, control)
 *
 * @this {Computer}
 * @param {string|null} sHTMLType is the type of the HTML control (eg, "button", "list", "text", "submit", "textarea", "canvas")
 * @param {string} sBinding is the value of the 'binding' parameter stored in the HTML control's "data-value" attribute (eg, "reset")
 * @param {Object} control is the HTML control DOM object (eg, HTMLButtonElement)
 * @return {boolean} true if binding was successful, false if unrecognized binding request
 */
Computer.prototype.setBinding = function(sHTMLType, sBinding, control)
{
    var computer = this;
    switch (sBinding) {
        case "save":
            this.bindings[sBinding] = control;
            control.onclick = function onClickSave() {
                var sUserID = computer.queryUserID(true);
                if (sUserID) {
                    var fSave = !!(computer.resume && !computer.sResumePath);
                    var sState = computer.powerOff(fSave);
                    if (fSave) {
                        computer.saveServerState(sUserID, sState);
                    } else {
                        computer.notice("Resume disabled, machine state not saved");
                    }
                }
            };
            return true;
        case "reset":
            this.bindings[sBinding] = control;
            control.onclick = function onClickReset() {
                computer.onReset();
            };
            return true;
        default:
            break;
    }
    return false;
};

/**
 * resetUserID()
 */
Computer.prototype.resetUserID = function()
{
    web.setLocalStorageItem(Computer.STATE_USERID, "");
    this.sUserID = null;
};

/**
 * queryUserID(fPrompt)
 *
 * @param {boolean} [fPrompt]
 * @returns {string|null|undefined}
 */
Computer.prototype.queryUserID = function(fPrompt)
{
    var sUserID = this.sUserID;
    if (!sUserID) {
        sUserID = web.getLocalStorageItem(Computer.STATE_USERID);
        if (sUserID !== undefined) {
            if (!sUserID && fPrompt) {
                sUserID = web.promptUser("To save machine states on the pcjs.org server, you need a user ID (email support@pcjs.org).\n\nOnce you have an ID, enter it below.");
                if (sUserID) {
                    sUserID = this.verifyUserID(sUserID);
                    if (!sUserID) this.notice("Your user ID has not been approved.");
                }
            }
        } else if (fPrompt) {
            this.notice("Browser local storage is not available");
        }
    }
    return sUserID;
};

/**
 * verifyUserID(sUserID)
 *
 * @this {Computer}
 * @param {string} sUserID
 * @return {string} validated user ID, or null if error
 */
Computer.prototype.verifyUserID = function(sUserID)
{
    this.sUserID = null;
    var fMessages = DEBUG && this.messageEnabled();
    if (fMessages) this.printMessage("verifyUserID(" + sUserID + ")");
    var sRequest = web.getHost() + UserAPI.ENDPOINT + '?' + UserAPI.QUERY.REQ + '=' + UserAPI.REQ.VERIFY + '&' + UserAPI.QUERY.USER + '=' + sUserID;
    var response = web.loadResource(sRequest);
    var nErrorCode = response[0];
    var sResponse = response[1];
    if (!nErrorCode && sResponse) {
        try {
            response = eval("(" + sResponse + ")");
            if (response.code && response.code == UserAPI.CODE.OK) {
                web.setLocalStorageItem(Computer.STATE_USERID, response.data);
                if (fMessages) this.printMessage(Computer.STATE_USERID + " updated: " + response.data);
                this.sUserID = response.data;
            } else {
                if (fMessages) this.printMessage(response.code + ": " + response.data);
            }
        } catch (e) {
            Component.error(e.message + " (" + sResponse + ")");
        }
    } else {
        if (fMessages) this.printMessage("invalid response (error " + nErrorCode + ")");
    }
    return this.sUserID;
};

/**
 * getServerStatePath()
 *
 * @this {Computer}
 * @return {string|null} sStatePath (null if no localStorage or no USERID stored in localStorage)
 */
Computer.prototype.getServerStatePath = function()
{
    var sStatePath = null;
    if (this.sUserID) {
        if (DEBUG && this.messageEnabled()) {
            this.printMessage(Computer.STATE_USERID + " for load: " + this.sUserID);
        }
        sStatePath = web.getHost() + UserAPI.ENDPOINT + '?' + UserAPI.QUERY.REQ + '=' + UserAPI.REQ.LOAD + '&' + UserAPI.QUERY.USER + '=' + this.sUserID + '&' + UserAPI.QUERY.STATE + '=' + State.key(this, Computer.sAppVer);
    } else {
        if (DEBUG && this.messageEnabled()) {
            this.printMessage(Computer.STATE_USERID + " unavailable");
        }
    }
    return sStatePath;
};

/**
 * saveServerState(sUserID, sState)
 *
 * @param {string} sUserID
 * @param {string|null} sState
 */
Computer.prototype.saveServerState = function(sUserID, sState)
{
    /*
     * We must pass fSync == true, because (as I understand it) browsers will blow off any async
     * requests when a page is being closed.  Since our request is synchronous, storeServerState()
     * should also return a result, but there's not much we can do with it, since browsers ALSO
     * tend to blow off alerts() and the like when closing down.
     */
    if (sState) {
        if (DEBUG && this.messageEnabled()) {
            this.printMessage("size of server state: " + sState.length + " bytes");
        }
        var response = this.storeServerState(sUserID, sState, true);
        if (response && response[UserAPI.RES.CODE] == UserAPI.CODE.OK) {
            this.notice("Machine state saved to server");
        } else if (sState) {
            var sError = (response && response[UserAPI.RES.DATA]) || UserAPI.FAIL.BADSTORE;
            if (response[UserAPI.RES.CODE] == UserAPI.CODE.FAIL) {
                sError = "Error: " + sError;
            } else {
                sError = "Error " + response[UserAPI.RES.CODE] + ": " + sError;
            }
            this.notice(sError);
            this.resetUserID();
        }
    } else {
        if (DEBUG && this.messageEnabled()) {
            this.printMessage("no state to store");
        }
    }
};

/**
 * storeServerState(sUserID, sState, fSync)
 *
 * @this {Computer}
 * @param {string} sUserID
 * @param {string} sState
 * @param {boolean} [fSync] is true if we're powering down and should perform a synchronous request (default is async)
 * @return {*} server response if fSync is true and a response was received; otherwise null
 */
Computer.prototype.storeServerState = function(sUserID, sState, fSync)
{
    if (DEBUG && this.messageEnabled()) {
        this.printMessage(Computer.STATE_USERID + " for store: " + sUserID);
    }
    /*
     * TODO: Determine whether or not any browsers cancel our request if we're called during a browser "shutdown" event,
     * and whether or not it matters if we do an async request (currently, we're not, to try to ensure the request goes through).
     */
    var data = {};
    data[UserAPI.QUERY.REQ] = UserAPI.REQ.STORE;
    data[UserAPI.QUERY.USER] = sUserID;
    data[UserAPI.QUERY.STATE] = State.key(this, Computer.sAppVer);
    data[UserAPI.QUERY.DATA] = sState;
    var sRequest = web.getHost() + UserAPI.ENDPOINT;
    if (!fSync) {
        web.loadResource(sRequest, true, data);
    } else {
        var response = web.loadResource(sRequest, false, data);
        var sResponse = response[1];
        if (response[0]) {
            if (sResponse) {
                var i = sResponse.indexOf('\n');
                if (i > 0) sResponse = sResponse.substr(0, i);
                if (!sResponse.indexOf("Error: ")) sResponse = sResponse.substr(7);
            }
            sResponse = '{"' + UserAPI.RES.CODE + '":' + response[0] + ',"' + UserAPI.RES.DATA + '":"' + sResponse + '"}';
        }
        if (DEBUG && this.messageEnabled()) this.printMessage(sResponse);
        return JSON.parse(sResponse);
    }
    return null;
};

/**
 * onReset()
 *
 * @this {Computer}
 */
Computer.prototype.onReset = function()
{
    /*
     * If this is a "resumable" machine (and it's not using a predefined state), then we overload the reset
     * operation to offer an explicit "save or discard" option first.  This is currently the only UI we offer to
     * discard a machine's state, including any disk changes.  The traditional "reset" operation is still available
     * for non-resumable machines.
     *
     * TODO: Break this behavior out into a separate "discard" operation, in case the designer of the machine really
     * wants to clutter the UI with confusing options. ;-)
     */
    if (this.resume && !this.sResumePath) {
        /*
         * I used to bypass the prompt if this.resume == Computer.RESUME_AUTO, setting fSave to true automatically,
         * but that gives the user no means of resetting a resumable machine that contains errors in its resume state.
         */
        var fSave = (/* this.resume == Computer.RESUME_AUTO || */ web.confirmUser("Click OK to save changes to this " + Computer.sAppName + " machine.\n\nWARNING: If you CANCEL, all disk changes will be discarded."));
        this.powerOff(fSave, true);
        /*
         * Forcing the page to reload is an expedient option, but ugly. It's preferable to call powerOn()
         * and rely on all the components to reset themselves to their default state.  The components with
         * the greatest burden here are FDC and HDC, which must rely on the fReload flag to determine whether
         * or not to unload/reload all their original auto-mounted disk images.
         *
         * However, if we started with a predefined state (ie, sStatePath is set), we take this shortcut, because
         * we don't (yet) have code in place to gracefully reload the initial state (requires calling loadResource()
         * again); alternatively, we could avoid throwing that state away, but it seems better to save the memory.
         *
         * TODO: Make this more graceful, so that we can stop using the reloadPage() sledgehammer.
         */
        if (!fSave && this.sStatePath) {
            web.reloadPage();
            return;
        }
        if (!fSave) this.fReload = true;
        this.powerOn(Computer.RESUME_NONE);
        this.fReload = false;
    } else {
        this.reset();
        if (this.cpu) this.cpu.autoStart();
    }
};

/**
 * getComponentByType(sType, componentPrev)
 *
 * @this {Computer}
 * @param {string} sType
 * @param {Component|null} [componentPrev] of previously returned component, if any
 * @return {Component|null}
 */
Computer.prototype.getComponentByType = function(sType, componentPrev)
{
    var aComponents = Component.getComponents(this.id);
    for (var iComponent = 0; iComponent < aComponents.length; iComponent++) {
        var component = aComponents[iComponent];
        if (componentPrev) {
            if (componentPrev == component) componentPrev = null;
            continue;
        }
        if (component.type == sType) return component;
    }
    return null;
};

/**
 * Computer.init()
 *
 * For every machine represented by an HTML element of class "pcjs-machine", this function
 * locates the HTML element of class "computer", extracting the JSON-encoded parameters for the
 * Computer constructor from the element's "data-value" attribute, invoking the constructor to
 * create a Computer component, and then binding any associated HTML controls to the new component.
 */
Computer.init = function()
{
    var aeMachines = Component.getElementsByClass(window.document, PCJSCLASS + "-machine");

    for (var iMachine = 0; iMachine < aeMachines.length; iMachine++) {

        var eMachine = aeMachines[iMachine];
        var parmsMachine = Component.getComponentParms(eMachine);

        var aeComputers = Component.getElementsByClass(eMachine, PCJSCLASS, "computer");

        for (var iComputer = 0; iComputer < aeComputers.length; iComputer++) {

            var eComputer = aeComputers[iComputer];
            var parmsComputer = Component.getComponentParms(eComputer);

            /*
             * We set fSuspended in the Computer constructor because we want to "power up" the
             * computer ourselves, after any/all bindings are in place.
             */
            var computer = new Computer(parmsComputer, parmsMachine, true);

            if (DEBUG && computer.messageEnabled()) {
                computer.printMessage("onInit(" + computer.aFlags.fPowered + ")");
            }

            /*
             * For now, all we support are "reset" and "save" buttons. We may eventually add a "power"
             * button to manually suspend/resume the machine.  An "erase" button was also considered, but
             * "reset" now provides a way to force the machine to start from scratch again, so "erase"
             * might be redundant now.
             */
            Component.bindComponentControls(computer, eComputer, PCJSCLASS);

            /*
             * Power "up" the computer, giving every component the opportunity to reset or restore itself.
             */
            computer.wait(computer.powerOn);
        }
    }
};

/**
 * Computer.show()
 *
 * When exit() is using an "onbeforeunload" handler, this "onpageshow" handler allows us to repower everything,
 * without either resetting or restoring.  We call powerOn() with a special resume value (RESUME_REPOWER) if the
 * computer is already marked as "ready", meaning the browser didn't change anything.  This "repower" process
 * should be very quick, essentially just marking all components as powered again (so that, for example, the Video
 * component will start drawing again) and firing the CPU up again.
 */
Computer.show = function()
{
    var aeComputers = Component.getElementsByClass(window.document, PCJSCLASS, "computer");
    for (var iComputer = 0; iComputer < aeComputers.length; iComputer++) {
        var eComputer = aeComputers[iComputer];
        var parmsComputer = Component.getComponentParms(eComputer);
        var computer = Component.getComponentByType("Computer", parmsComputer['id']);
        if (computer) {

            if (DEBUG && computer.messageEnabled()) {
                computer.printMessage("onShow(" + computer.fInitialized + "," + computer.aFlags.fPowered + ")");
            }

            if (computer.fInitialized && !computer.aFlags.fPowered) {
                /**
                 * Repower the computer, notifying every component to continue running as-is.
                 */
                computer.powerOn(Computer.RESUME_REPOWER);
            }
        }
    }
};

/**
 * Computer.exit()
 *
 * The Computer is currently the only component that uses an "exit" handler, which web.onExit() defines as
 * either an "unload" or "onbeforeunload" handler.  This gives us the opportunity to save the machine state,
 * using our powerOff() function, before the page goes away.
 *
 * It's worth noting that "onbeforeunload" offers one nice feature when used instead of "onload": the entire
 * page (and therefore this entire application) is retained in its current state by the browser (well, some
 * browsers), so that if you go to a new URL, either by entering a new URL in the same window/tab, or by pressing
 * the FORWARD button, and then you press the BACK button, the page is immediately restored to its previous state.
 *
 * In fact, that's how some browsers operate whether you have an "onbeforeunload" handler or not; in other words,
 * an "onbeforeunload" handler doesn't change the page retention behavior of the browser.  By contrast, the mere
 * presence of an "onunload" handler generally causes a browser to throw the page away once the handler returns.
 *
 * However, in order to safely use "onbeforeunload", we must add yet another handler ("onpageshow") to repower
 * everything, without either resetting or restoring.  Hence, the Computer.show() function, which calls powerOn()
 * with a special resume value (RESUME_REPOWER) if the computer is already marked as "ready", meaning the browser
 * didn't change anything.  This "repower" process should be very quick, essentially just marking all components as
 * powered again (so that, for example, the Video component will start drawing again) and firing the CPU up again.
 *
 * Reportedly, some browsers (eg, Opera) don't support "onbeforeunload", in which case Component will have to use
 * "unload" instead.  But even when the page must be rebuilt from scratch, the combination of browser cache and
 * localStorage means the simulation should be restored and become operational almost immediately.
 */
Computer.exit = function()
{
    var aeComputers = Component.getElementsByClass(window.document, PCJSCLASS, "computer");
    for (var iComputer = 0; iComputer < aeComputers.length; iComputer++) {
        var eComputer = aeComputers[iComputer];
        var parmsComputer = Component.getComponentParms(eComputer);
        var computer = Component.getComponentByType("Computer", parmsComputer['id']);
        if (computer) {

            if (DEBUG && computer.messageEnabled()) {
                computer.printMessage("onExit(" + computer.aFlags.fPowered + ")");
            }

            if (computer.aFlags.fPowered) {
                /**
                 * Power "down" the computer, giving every component an opportunity to save its state,
                 * but only if 'resume' has been set AND there is no valid resume path (because if a valid resume
                 * path exists, we'll always load our state from there, and not from whatever we save here).
                 */
                computer.powerOff(!!(computer.resume && !computer.sResumePath), true);
            }
        }
    }
};

/*
 * Initialize every Computer on the page.
 */
web.onInit(Computer.init);
web.onShow(Computer.show);
web.onExit(Computer.exit);

if (typeof module !== 'undefined') module.exports = Computer;
