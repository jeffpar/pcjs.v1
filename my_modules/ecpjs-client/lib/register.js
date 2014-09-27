/*
 *  register.js
 *  by Jeff Parsons, May 7, 2012
 */

/*
 *  Creation of a Register object is controlled by the following properties of the
 *  parmsReg object:
 *
 *      nBits: number of bits
 *      signed: true if signed (default), false otherwise
 *      bit0Exp: the power-of-two for bit 0 (default is zero)
 *      labels: true for labels, false otherwise (default)
 *
 *  A Register object can be as small as a single bit, and in fact, a 1-bit Register
 *  is exactly how you would create the equivalent of a Bit object.  However, the more
 *  common use of this class is to create a bit array.
 *
 *  Internally, the bit indexes of a register correspond to the array indexes of aBits
 *  (ie, aBits[0] contains the value for bit 0, aBits[1] is bit 1, etc).  And the lowest
 *  bit index represents the lowest power-of-two of the value represented by the register.
 *
 *  The display of a Register object "cell" is handled by the given updateBit() function:
 *
 *      updateBit(iBit, f)
 *
 *  If f is undefined, the cell will be blanked; otherwise, either a "0" or a "1" will be
 *  displayed.  However, that's just the standard implementation; the caller is free to
 *  define any other behavior (Remember: a register shouldn't care what it looks like). 
 *
 *  Internally, there are also "helper" properties (eg, decimalValue) and methods
 *  (eg, writeValue()) used, for example, to help write data into the register.
 *  Here's a list of some of them (it's difficult to promise that this list will be kept
 *  up-to-date):
 *
 *      decimalValue: a decimal floating-point value being written to the register
 *      decimalPower: a power-of-two used to help convert decimalValue to binary
 *      decimalBit: a bit index used to help convert decimalValue to binary
 *      decimalSave: saves the initial decimal value, for visual comparison purposes
 */
var MAX_FRACTIONAL_DIGITS = 12;

function Register(parmsReg, updateBit) {
    Component.call(this, "Reg", parmsReg);
    if (parmsReg === undefined) {
        parmsReg = {nBits:40, signed:true, bit0Exp:0, labels:true};
    }
    this.aBits = new Array(parmsReg.nBits);
    this.signed = parmsReg.signed;
    this.bit0Exp = parmsReg.bit0Exp;
    this.labels = parmsReg.labels;
    /*
     * BUGBUG: Compute a reasonable value for this based on how many significant decimal digits
     * (ie, to the right of the decimal point) correspond to the smallest given negative power-of-two.
     */
    this.fixedDigits = (this.bit0Exp < 0? MAX_FRACTIONAL_DIGITS : 0);
    this.upperBound = Math.pow(2, this.bit0Exp + this.aBits.length - (this.signed? 1 : 0));
    this.lowerBound = (this.signed? -this.upperBound : 0);
    this.updateBit = (updateBit === undefined? function(iBit, f) {} : updateBit);
}

Component.subclass(Component, Register, {
    /*
     *  getBits() is used for "direct" access to the bits; use readBit() and writeBit() to
     *  access and change individual bits when speed isn't important.  Note that changing bits
     *  directly, as well as calling the write or copy functions, bypasses display updates, so
     *  use updateBit() or updateAll() to update the display of one bit or the entire register
     *  as needed.  Alternatively, use modifyBit() or modifyAll() to both change and display a
     *  single bit or the entire register.
     */
    count: function() {
        return this.aBits.length;
    },
    getBits: function() {
        return this.aBits;
    },
    readBit: function(iBit) {
        return this.aBits[iBit];
    },
    writeBit: function(iBit, b) {
        this.aBits[iBit] = b;
    },
    writeAll: function(b) {
        for (var iBit=0; iBit < this.aBits.length; iBit++)
            this.aBits[iBit] = b;
    },
    writeUndefined: function(b) {
        for (var iBit=0; iBit < this.aBits.length; iBit++)
            if (this.aBits[iBit] === undefined)
                this.aBits[iBit] = b;
    },
    notBit: function(iBit) {
        this.aBits[iBit] = !this.aBits[iBit];
    },
    notAll: function() {
        for (var iBit=0; iBit < this.aBits.length; iBit++)
            this.aBits[iBit] = !this.aBits[iBit];
    },
    copyAll: function(reg) {
        for (var iBit=0; iBit < this.aBits.length; iBit++)
            this.aBits[iBit] = reg.aBits[iBit];
    },
    updateAll: function() {
        for (var iBit=0; iBit < this.aBits.length; iBit++)
            this.updateBit(iBit, this.aBits[iBit]);
        this.refreshLiveValue();
    },
    modifyBit: function(iBit, b) {
        this.writeBit(iBit, b);
        this.updateBit(iBit, b);
        this.refreshLiveValue();
    },
    modifyAll: function(b) {
        this.writeAll(b);
        this.updateAll();
    },
    readValue: function() {
        this.stopSteps();
        this.printDecimal();
        this.writeUndefined(false);
        this.updateAll();
        this.fPostOp = 0;
        this.decimalSave = undefined;
        this.decimalValue = 0;
        this.decimalBit = this.aBits.length - 1;
        if (this.signed && this.aBits[this.decimalBit]) {
            this.fPostOp = -1;
        }
        this.decimalExp = this.bit0Exp + this.decimalBit;
        this.decimalPower = Math.pow(2, this.decimalExp);
        this.firstStep(this.stepCompareBitToPower);
        return this.decimalValue;       // NOTE: this return value is valid ONLY if single-stepping has been disabled
    },
    writeValue: function(v, fnNotify) {
        this.stopSteps();
        this.modifyAll(undefined);
        /*
         * There are two obvious ways to handle negative values: one is to negate at the beginning,
         * producing a positive value, and convert as we would any other positive value; when done,
         * flip all the bits and add a bit at index 0 (ie, a traditional two's-complement conversion).
         *
         * However, this variation is better: make the value positive, subtract a bit at index 0,
         * convert as before, and then flip all the bits.  It doesn't matter what order we perform the
         * two's-complement conversion steps, and performing a "pre-subtraction" against the input value
         * is cheaper for us than performing a "post-addition" on the output value (because we can
         * use internal math operations on the input value, whereas the output value is stored only as
         * an array of bits).
         *
         * One downside: when stepping through the conversion process, it may seem odd to see the
         * initial value modified ever so slightly (eg, -0.5 converted to 0.499999999998181).  We could
         * add an additional explicit step to clear up any potential confusion.
         */
        this.fPostOp = 0;
        this.decimalSave = v;
        if (v < 0) {
            v = -v;
            v -= Math.pow(2, this.bit0Exp);
            // BUGBUG: Assert that v is still positive (for tiny negative values of v, this will be a concern)
            this.fPostOp = 1;
        }
        this.decimalValue = v;
        this.decimalBit = this.aBits.length - 1;
        if (this.signed) {
            this.modifyBit(this.decimalBit, 0);
            this.decimalBit--;
        }
        this.decimalExp = this.bit0Exp + this.decimalBit;
        this.decimalPower = Math.pow(2, this.decimalExp);
        this.firstStep(this.stepCompareDecimalToPower, fnNotify);
    },
    getValue: function() {
        var decimalValue = 0;
        var decimalBit = this.aBits.length - 1;
        var fPostNegate = this.signed && this.aBits[decimalBit];
        var decimalExp = this.bit0Exp + decimalBit;
        var decimalPower = Math.pow(2, decimalExp);
        do {
            if (this.aBits[decimalBit])
                decimalValue += decimalPower;
            if (decimalBit == 0) break;
            decimalBit--;
            decimalPower /= 2;
        } while (true);
        if (fPostNegate) {
            decimalValue = -(Math.pow(2, this.bit0Exp + this.aBits.length) - decimalValue);
        }
        return decimalValue;
    },
    setLiveUpdate: function(updateLiveValue) {
        this.updateLiveValue = updateLiveValue;
        this.refreshLiveValue();
    },
    refreshLiveValue: function() {
        if (this.updateLiveValue) {
            this.updateLiveValue(this.getValue());
        }
    },
    printDecimal: function(v) {
        if (this.updateDecimal !== undefined) {
            /*
             * We allow v to be undefined, as way as signalling that we are beginning a fresh
             * conversion; we will be calling printDecimal() again at the completion of the conversion,
             * and v will be defined at that point.
             */
            this.updateDecimal(v);
            if (v !== undefined && this.log)
                console.log(this.toString() + ": updated decimal value to " + v.toFixed(this.fixedDigits));
        }
    },
    setDecimalUpdate: function(updateDecimal) {
        this.updateDecimal = updateDecimal;
    },
    /*
     *  The following "step" functions implement writeValue().
     *
     *  Once writeValue() has initialized all the internal decimal variables, it calls
     *  the first step indirectly, via firstStep(), which in turns invokes other
     *  steps, based on whether the current decimal power is greater than or equal to
     *  the current decimal value.
     */
    stepCompareDecimalToPower: function(n) {
        this.printStep(n, "Comparing decimal value (" + this.decimalValue + ") to 2<sup>" + this.decimalExp + "</sup> (" + this.decimalPower.toFixed(20) + ")");
        if (this.decimalValue >= this.decimalPower) {
            this.addStep(this.stepSetDecimalBit);
            this.addStep(this.stepReduceDecimalValue);
        }
        else {
            this.addStep(this.stepClearDecimalBit);
        }
        if (!this.addStep(this.stepReduceDecimalPower))
            return false;
        return true;
    },
    stepSetDecimalBit: function(n) {
        this.printStep(n, "Setting bit " + this.decimalBit);
        this.writeBit(this.decimalBit, true);
        if (n !== undefined) {
            this.updateBit(this.decimalBit, true);
            this.refreshLiveValue();
        }
        return true;
    },
    stepClearDecimalBit: function(n) {
        this.printStep(n, "Clearing bit " + this.decimalBit);
        this.writeBit(this.decimalBit, false);
        if (n !== undefined) {
            this.updateBit(this.decimalBit, false);
            this.refreshLiveValue();
        }
        return true;
    },
    stepReduceDecimalValue: function(n) {
        this.printStep(n, "Reducing decimal value by 2<sup>" + this.decimalExp + "</sup> (" + this.decimalPower.toFixed(20) + ")"); // this.decimalPower.toFixed(this.fixedDigits));
        this.decimalValue -= this.decimalPower;
        if (n !== undefined) this.printDecimal(this.decimalValue);
        return true;
    },
    stepReduceDecimalPower: function(n) {
        if (this.decimalBit == 0) {
            var sStep = "Processed bit 0";
            if (this.fPostOp > 0) {
                sStep = "Inverting all bits";
                this.notAll();
                this.updateAll();
            }
            else if (this.fPostOp < 0) {
                sStep = "Negating result";
                this.decimalValue =  -(Math.pow(2, this.bit0Exp + this.aBits.length) - this.decimalValue);
            }
            this.printStep(n, sStep + ", conversion" + (this.decimalSave !== undefined? " of " + this.decimalSave.toFixed(this.fixedDigits) : "") + " complete");
            if (n === undefined) {
                /*
                 *  Since the conversion was performed without single-stepping, we need to update the register via
                 *  updateAll() if this was a writeValue() operation (ie, decimalSave is defined); similarly, we need
                 *  to update the decimal value via printDecimal() if this was a readValue() operation.
                 */
                if (this.decimalSave !== undefined)
                    this.updateAll();
            }
            /*
             * printDecimal() may have never been called during the conversion, since we only call it when the value has been
             * reduced.  So we always print at the end.
             */
            this.printDecimal(this.decimalValue);
            return false;
        }
        this.printStep(n, "Reducing power-of-two");
        this.decimalBit--;
        this.decimalExp--;
        this.decimalPower /= 2;
        return true;
    },
    /*
     *  The following "step" functions implement readValue().
     *
     *  Because we take the same "top-down" approach that writeValue() took (ie, from highest power/left-most bit down to
     *  lowest power/right-most bit), we can use the same stepReduceDecimalPower step function that writeValue() used; both
     *  procedures stop after they've processed bit 0.
     */
    stepCompareBitToPower: function(n) {
        this.printStep(n, "Testing bit " + this.decimalBit);
        if (this.aBits[this.decimalBit])
            this.addStep(this.stepIncreaseDecimalValue);
        if (!this.addStep(this.stepReduceDecimalPower))
            return false;
        return true;
    },
    stepIncreaseDecimalValue: function(n) {
        this.printStep(n, "Increasing decimal value by 2<sup>" + this.decimalExp + "</sup> (" + this.decimalPower.toFixed(20) + ")");   // this.decimalPower.toFixed(this.fixedDigits));
        this.decimalValue += this.decimalPower;
        if (n !== undefined) this.printDecimal(this.decimalValue);
        return true;
    }
});

/*
 *  initRegisters()
 *
 *  Initializes all the necessary HTML to construct every register as spec'ed.
 *
 *  This function operates on every element (e) of class "register" and inserts
 *  the appropriate HTML child elements of class "bitCell".
 *
 *  Note that each element (e) of class "register" is expected to have a "data-value"
 *  attribute containing the same JSON-encoded parameters that the Register constructor
 *  expects.
 */
function initRegisters()
{
    var aeRegs = Component.getElementsByClass(window.document, "register");
    for (var iReg=0; iReg < aeRegs.length; iReg++) {
        var eReg = aeRegs[iReg];
        var parmsReg = Component.getComponentParms(eReg);
        var sHTML = "";
        var nExp = parmsReg.bit0Exp + parmsReg.nBits - 1;
        for (var iCell=0; iCell < parmsReg.nBits; iCell++,nExp--) {
            var sLabel = "";
            sBitClass = "bitCell";
            if (iCell == 0) {
                sBitClass += " bitCellLeft";
                if (parmsReg.signed) sLabel = "+/-";
            }
            var sCellID = "r" + iReg + "c" + iCell;
            var sCell = "<div id=\"" + sCellID + "\" class=\"" + sBitClass + "\"></div>\n";
            if (!parmsReg.labels) {
                sHTML += sCell;
            }
            else {
                if (!sLabel) sLabel = "2<sup>" + nExp + "</sup>";
                sHTML += "<div class=\"bitBucket\">\n" + sCell + "<div class=\"bitLabel\">" + sLabel + "</div>\n</div>\n";
            }
        }
        eReg.innerHTML = sHTML;
        if (parmsReg.id) {
            eReg.setAttribute("id", "reg" + parmsReg.id);
        }

        //
        //  Now that all the document elements have been defined, create an array that refers
        //  to all "bitCell" elements in bit index order (ie, reverse of display order).
        //
        var aeBits = [];
        var aeCells = Component.getElementsByClass(eReg, "bitCell");
        for (var i=aeCells.length-1; i >= 0; i--) {
            aeBits.push(aeCells[i]);
        }

        //
        //  Now we can create the Register object, record it, and wire it up to the associated document elements.
        //
        var reg = new Register(parmsReg, function(aeBitsParm) {
            return function(iBit, f) {
                var s = (f===undefined? " " : (f? "1":"0"));
                aeBitsParm[iBit].innerHTML = s;
            };
            }(aeBits)
        );

        for (var i=0; i < aeBits.length; i++) {
            aeBits[i].onclick = function(regParm, iParm) {
                //
                //  If we defined the onclick handler below as "function(e)" instead of simply "function()", then we could
                //  also receive an event object (e); however, IE reportedly requires that we examine a global (window.event)
                //  instead.  If that's true, and if we ever care to get more details about the click event, then we might
                //  have to worry about that (eg, define a local var: "var event = window.event || e").
                //
                return function() {
                    toggleRegisterBit(regParm, iParm);
                };
            }(reg, i);
        }

        initRegisterControls(reg, eReg);

        //
        //  For testing purposes, we could tweak a few of the bits, just to see if all the "wiring" works.
        //
        //      reg.modifyBit(7, true);
        //      reg.modifyBit(9, false);
        //
    }
}

/*
 *  initRegisterControls(reg, eReg)
 *
 *  For each Register object created by initRegisters(), this function looks for any controls that have been defined
 *  along with the register element in the current document, and "wires" them as needed.
 *
 *  The following controls are supported:
 *
 *      One optional 'input' control of class "value"
 *      One optional 'output' control of class "value"
 *      One optional 'output' control of class "status"
 *      One optional 'button' control of class "random"
 *      One optional 'button' control of class "write"
 *      One optional 'button' control of class "read"
 *      One optional 'button' control of class "clear"
 *      One optional 'button' control of class "step" (if this exists, it will override any "step" setting above)
 */
function initRegisterControls(reg, eReg)
{
    var aeControls = Component.getElementsByClass(eReg.parentNode, "controls");
    for (var iControl = 0; iControl < aeControls.length; iControl++) {
        var aeChildren = aeControls[iControl].childNodes;
        var eDecimal = null, eRandom = null, eWrite = null, eRead = null;
        for (var i=0; i < aeChildren.length; i++) {
            var e = aeChildren[i];
            if (e.nodeType != document.ELEMENT_NODE)
                continue;
            var sClass = e.getAttribute("class");
            if (e.nodeName == "INPUT" && sClass == "value") {
                eDecimal = e;
                reg.setDecimalUpdate(
                    function(e) {
                        return function(v) {
                            e.value = (v !== undefined? v.toFixed(reg.fixedDigits) : "");
                        };
                    }(e)
                );
                continue;
            }
            if (e.nodeName == "DIV" && sClass == "value") {
                reg.setLiveUpdate(
                    function(e) {
                        return function(v) {
                            e.innerHTML = (v !== undefined? "<span>Live value: " + v.toFixed(reg.fixedDigits) + "</span>" : "");
                        };
                    }(e)
                );
                continue;
            }
            if (e.nodeName == "DIV" && sClass == "status") {
                reg.setStatusUpdate(
                    function(e) {
                        return function(s) {
                            e.innerHTML = (s? "<span>" + s + "</span>" : "");
                        };
                    }(e)
                );
                continue;
            }
            if (e.nodeName == "BUTTON" && sClass == "random") {
                eRandom = e;
                continue;
            }
            if (e.nodeName == "BUTTON" && sClass == "write") {
                eWrite = e;
                continue;
            }
            if (e.nodeName == "BUTTON" && sClass == "read") {
                eRead = e;
                continue;
            }
            if (e.nodeName == "BUTTON" && sClass == "clear") {
                e.onclick = function() { clearRegisterValue(reg); };
                continue;
            }
            if (e.nodeName == "BUTTON" && sClass == "step") {
                reg.setStep(e);
                continue;
            }
        }
        if (eRandom && eDecimal) {
            eRandom.onclick = function(eDecimal) {
                return function() { randomizeRegisterValue(reg, eDecimal); };
            }(eDecimal);
        }
        if (eWrite && eDecimal) {
            eWrite.onclick = function(eDecimal) {
                return function() { writeRegisterValue(reg, eDecimal); };
            }(eDecimal);
        }
        if (eRead) {
            eRead.onclick = function(eDecimal) {
                return function() { readRegisterValue(reg, eDecimal); };
            }(eDecimal);
        }
    }
}

/*
 *  Function called by the anonymous click handler for all of the individual register "bitCell" elements.
 */
function toggleRegisterBit(reg, iBit)
{
    reg.modifyBit(iBit, reg.readBit(iBit) === false);
}

/*
 * Function called by the anonymous click handler for the "Random" button.
 *
 * It calls reg.stopSteps() to stop any internal operation currently in progress (eg,
 * a previous writeValue() or readValue() operation), but it doesn't attempt to write the new value into
 * the register; that's the "Write" button's job, once the user chooses to accept the new value.
 */
function randomizeRegisterValue(reg, eDecimal)
{
    /*
     * NOTE: eDecimal is an <input> element, so set the "value" property rather than the "innerHTML" property.
     */
    reg.stopSteps();
    eDecimal.value = Math.random().toFixed(reg.fixedDigits);
}

/*
 * Function called by the anonymous click handler for the "Write" button.
 *
 * This takes whatever input value the user has entered (either manually or by clicking the "Random" button)
 * and calls reg.writeValue() to begin the process of converting the decimal floating-point value to binary and
 * writing the result to the register.
 *
 * If we ever add a user control (eg, a drop-down list) to select a step delay, then we can call setStep()
 * to change the delay from whatever default delay was selected.  Note that a setStep() delay of 0 disables all
 * single-step output, allowing the operation to run at full speed.
 */
function writeRegisterValue(reg, eDecimal)
{
    reg.stopSteps();
    var v = parseFloat(eDecimal.value);
    if (isNaN(v))
        v = 0;
    if (v >= reg.lowerBound && v < reg.upperBound) {
        reg.writeValue(v);
    }
    else {
        reg.printStatus("Error: decimal value " + v + " out of bounds (" + reg.lowerBound + " <= v < " + reg.upperBound + ")");
    }
}

/*
 * Function called by the anonymous click handler for the "Read" button.
 *
 * This starts the reg.readValue() procedure, which does return a value, but it's meaningful only if
 * single-stepping has been disabled.  It doesn't matter, because either way, reg.readValue() insures that
 * that the decimal field is zeroed at the beginning of the procedure and updated at the end (not to mention
 * intermediate intervals if single-stepping is enabled), so there's no need to update the field here. 
 *
 * If we ever add a user control (eg, a drop-down list) to select a step delay, then we can call setStep()
 * to change the delay from whatever default delay was selected.  Note that a setStep() delay of 0 disables all
 * single-step output, allowing the operation to run at full speed.
 */
function readRegisterValue(reg, eDecimal)
{
    reg.stopSteps();
    reg.readValue();
}

/*
 * Function called by the anonymous click handler for the "Clear" button.
 */
function clearRegisterValue(reg)
{
    reg.stopSteps();
    reg.modifyAll(false);
    reg.printDecimal();
    reg.printStatus();
}

/*
 * Initialize all the registers on the page.
 */
web.onInit(initRegisters);
