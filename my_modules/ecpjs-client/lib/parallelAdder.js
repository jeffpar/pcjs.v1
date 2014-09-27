/*
 *  parallelAdder.js
 *  by Jeff Parsons, May 11, 2012
 */

/*
 *  Creation of a ParallelAdder object is controlled by the following properties of the
 *  parmsAdder object:
 *
 *      idResident: ID of the resident register
 *      idIncident: ID of the incident register
 *      idCarries: ID of the carries register
 *
 *  However, by the time we're called, initParallelAdders() has already looked up the 
 *  corresponding Register components by the above IDs (so that we don't have to be 
 *  involved in the "wiring" process) and passes them to us as:
 *
 *      regResident
 *      regIncident
 *      regCarries
 *
 *  Our constructor also creates an internal Register object (regScratch) that's used
 *  to make a copy of the carry bits in the "carries" register after each internal add cycle.
 */
function ParallelAdder(parmsAdder, regResident, regIncident, regCarries)
{
    Component.call(this, "ParallelAdder", parmsAdder);
    this.regResident = regResident;
    this.regIncident = regIncident;
    this.regCarries = regCarries;
    this.aBitsResident = regResident.getBits();
    this.aBitsIncident = regIncident.getBits();
    this.aBitsCarries = regCarries.getBits();
    this.regScratch = new Register({nBits:regCarries.count()});
    this.aBitsScratch = this.regScratch.getBits();
}

Component.subclass(Component, ParallelAdder, {
    /*
     * These functions implement the necessary Register interfaces that other components,
     * like the Selector, expect us to support.
     */
    count: function() {
        return this.regResident.count();
    },
    readBit: function(iBit) {
        return this.regResident.readBit(iBit);
    },
    writeBit: function(iBit, b) {
        this.regResident.writeBit(iBit, b);
    },
    /*
     * These are the functions unique to ParallelAdder.
     */
    add: function(fnNotify) {
        this.stopSteps();
        this.cCarryCycles = 0;
        this.regResident.writeUndefined(false);
        this.regResident.updateAll();
        this.regIncident.writeUndefined(false);
        this.regIncident.updateAll();
        this.firstStep(this.stepAddRegisters, fnNotify);
    },
    stop: function() {
        this.stopSteps();
        this.regResident.stopSteps();
        this.regIncident.stopSteps();
    },
    stepAddRegisters: function(n) {
        this.cCarryCycles++;
        /*
         * We call the next step directly, to give this step something concrete to do;
         * we could have incorporated that code into this step, but it seems cleaner this way.
         */
        this.stepClearCarries(n);
        if (this.cCarryCycles == 1)
            this.addStep(this.stepAddIncidentBits);
        else
            this.addStep(this.stepAddScratchBits);
        this.addStep(this.stepCheckCarries);
        return true;
    },
    stepClearCarries: function(n) {
        this.printStep(n, "Clearing carry bits");
        this.regCarries.writeAll(false);
        if (n !== undefined)
            this.regCarries.updateAll();
        return true;
    },
    stepCheckCarries: function(n) {
        if (!this.cCarries) {
            this.printStep(n, "No carries, addition complete");
            return false;
        }
        this.printStep(n, "Copying carry bits to scratch");
        this.regScratch.copyAll(this.regCarries);
        return true;
    },
    stepAddIncidentBits: function(n) {
        this.cCarries = 0;
        /*
         * The following table describes the 4 possible cases of resident(i) and incident(i) bits,
         * and what result(i) and carry(i+1) bits must be generated in each of those cases to simulate
         * the addition of a resident and incident bit:
         *
         *      case    resident(i)         incident(i)         result(i)   carry(i+1)
         *      ----    -----------         -----------         ---------   ----------
         *      1       false       "+"     false       "="     false       false
         *      2       false       "+"     true        "="     true        false
         *      3       true        "+"     false       "="     true        false
         *      4       true        "+"     true        "="     false       true
         *
         *  Prior to adding the incident bits, we cleared all the carry bits, so we only have to *set* carry bits,
         *  never *clear* them.  As for the result bits, they must be written back to the resident bits register,
         *  so we must always write the resident result bit -- which you can tell from the table above is equivalent
         *  to an XOR operation (ie, true if only ONE of either the resident or incident bits is true, false if BOTH
         *  are false or true).
         */
        this.printStep(n, "Adding incident bits");
        for (var i=0; i < this.aBitsIncident.length; i++) {
            bIncident = this.aBitsIncident[i];
            bResident = this.aBitsResident[i];
            if (bResident && bIncident) {
                if (i+1 < this.aBitsCarries.length) {
                    this.aBitsCarries[i+1] = true;
                    this.cCarries++;
                }
            }
            this.aBitsResident[i] = (bResident? !bIncident : bIncident);        // the closest thing we have to a logical XOR operation
        }
        if (n !== undefined) {
            this.regResident.updateAll();
            this.regCarries.updateAll();
        }
        return true;
    },
    stepAddScratchBits: function(n) {
        this.cCarries = 0;
        /*
         *  We take advantage of the fact that on iteration i, all scratch bits below bit index i must be zero,
         *  so we can start checking scratch bits (ie, the carry bits from the previous iteration) at bit index "cCarryCycles".
         *
         *  NOTE: We should assert that all bits below that index are indeed zero, and that we never end up here when
         *  cCarryCycles == aBitsScratch.length (because there shouldn't have been any saved carries from the length-1 iteration).  
         */
        this.printStep(n, "Adding previous carry bits");
        for (var i=this.cCarryCycles; i < this.aBitsScratch.length; i++) {
            bScratch = this.aBitsScratch[i];
            bResident = this.aBitsResident[i];
            if (bResident && bScratch) {
                if (i+1 < this.aBitsCarries.length) {
                    this.aBitsCarries[i+1] = true;
                    this.cCarries++;
                }
            }
            this.aBitsResident[i] = (bResident? !bScratch : bScratch);          // the closest thing we have to a logical XOR operation
        }
        if (n !== undefined) {
            this.regResident.updateAll();
            this.regCarries.updateAll();
        }
        return true;
    }
});

/*
 * initParallelAdders()
 *
 *  Initializes all the necessary HTML to construct the component as spec'ed.
 *
 *  Note that each element (e) of class "parallelAdder" is expected to have a "data-value"
 *  attribute containing the same JSON-encoded parameters that the ParallelAdder constructor
 *  expects; specifically:
 *
 *      idResident: ID of register containing "resident" binary digits
 *      idIncident: ID of register containing "incident" binary digits
 *      idCarries:  ID of register used for recording resulting carries
 */
function initParallelAdders()
{
    var aeAdders = Component.getElementsByClass(window.document, "parallelAdder");
    for (var iAdder=0; iAdder < aeAdders.length; iAdder++) {
        var eAdder = aeAdders[iAdder];
        var parmsAdder = Component.getComponentParms(eAdder);
        //
        //  Let's find all the prerequisite register components next....
        //
        var regResident = Component.getComponentByID(parmsAdder.idResident);
        var regIncident = Component.getComponentByID(parmsAdder.idIncident);
        var regCarries = Component.getComponentByID(parmsAdder.idCarries);

        if (!regResident) regResident = new Register();
        if (!regIncident) regIncident = new Register();
        if (!regCarries) regCarries = new Register();

        //
        //  Now we can create the ParallelAdder object, record it, and wire it up to the associated document elements.
        //
        var adder = new ParallelAdder(parmsAdder, regResident, regIncident, regCarries);
        initParallelAdderControls(adder, eAdder);
    }
}

/*
 *  initParallelAdderControls(reg, eReg)
 *
 *  For each Adder object created by initParallelAdders(), this function looks for any controls that have been defined
 *  along with the adder element in the current document, and "wires" them as needed.
 *
 *  The following controls are supported:
 *
 *      One optional 'output' control of class "status"
 *      One optional 'button' control of class "add"
 *      One optional 'button' control of class "test"
 *      One optional 'button' control of class "step" (if this exists, it will override any "step" setting above)
 */
function initParallelAdderControls(adder, eAdder)
{
    adder.eAdder = eAdder;
    var aeControls = Component.getElementsByClass(eAdder.parentNode, "controls");
    for (var iControl = 0; iControl < aeControls.length; iControl++) {
        var aeChildren = aeControls[iControl].childNodes;
        for (var i=0; i < aeChildren.length; i++) {
            var e = aeChildren[i];
            if (e.nodeType != document.ELEMENT_NODE)
                continue;
            var sClass = e.getAttribute("class");
            if (e.nodeName == "BUTTON" && sClass == "add") {
                e.onclick = function() {
                    adder.stop();
                    addParallelValues(adder);
                };
                continue;
            }
            if (e.nodeName == "BUTTON" && sClass == "test") {
                adder.eTest = e;
                e.onclick = function() {addStartParallelTest(adder);};
                continue;
            }
            if (e.nodeName == "BUTTON" && sClass == "step") {
                adder.setStep(e);
                continue;
            }
            if (e.nodeName == "DIV" && sClass == "status") {
                adder.setStatusUpdate(
                    function(e) {
                        return function(s) {
                            e.innerHTML = (s? "<span>"+s+"</span>" : "");
                        };
                    }(e)
                );
                continue;
            }
        }
    }
}

/*
 * Function called by the anonymous click handler for the "Add" button.
 */
function addParallelValues(adder)
{
    adder.stop();
    var vResident = adder.regResident.getValue();
    // adder.printStatus("Resident register loaded: " + vResident);
    var vIncident = adder.regIncident.getValue();
    // adder.printStatus("Incident register loaded: " + vIncident);
    adder.add(function() {
        var s1 = "Success", s2 = "==";
        var vResult = adder.regResident.getValue();
        if (vResult != vResident + vIncident) {s1 = "Error"; s2 = "!=";}
        adder.printStatus(s1 + ": result (" + vResult + ") " + s2 + " resident (" + vResident + ") + incident (" + vIncident + ")");
    });
}

/*
 * Function called by the anonymous click handler for the "Test" button.
 */
function addParallelTestValues(adder)
{
    adder.cTests++;
    var vResident = Math.random() * 0.5;
    var vIncident = Math.random() * 0.5;
    adder.regResident.writeValue(vResident, function() {
        vResident = adder.regResident.getValue();
        // adder.printStatus("Resident register loaded: " + vResident);
        adder.regIncident.writeValue(vIncident, function() {
            vIncident = adder.regIncident.getValue();
            // adder.printStatus("Incident register loaded: " + vIncident);
            adder.add(function() {
                var vResult = adder.regResident.getValue();
                adder.cTotalCycles += adder.cCarryCycles - 1;   // we don't want to count the initial addition, just the addition of carries
                adder.printStatus("Addition complete: " + vResult + " (" + adder.cCarryCycles + " carry cycles, " + (adder.cTotalCycles/adder.cTests) + " average)");
                if (vResult != vResident + vIncident)
                    adder.printStatus("Error: result (" + vResult + ") != resident (" + vResident + ") + incident (" + vIncident + "): " + (vResident + vIncident));
                else
                if (adder.cTests < 1000) {
                    addParallelTestValues(adder);
                    return;
                }
                addStopParallelTest(adder);
            });
        });
    });
}

function addStartParallelTest(adder)
{
    adder.stop();
    adder.eTest.innerHTML = "Stop";
    adder.eTest.onclick = function() {addStopParallelTest(adder);};
    adder.cTests = 0;
    adder.cTotalCycles = 0;
    addParallelTestValues(adder);
}

function addStopParallelTest(adder)
{
    adder.stop();
    adder.eTest.innerHTML = "Test";
    adder.eTest.onclick = function() {addStartParallelTest(adder);};
}

/*
 * Initialize all the components on the page.
 */
web.onInit(initParallelAdders);
