/*
 *  selector.js
 *  by Jeff Parsons, May 24, 2012
 */

/*
 *  Creation of a Selector object is controlled by the following properties of the
 *  parmsSel object:
 *
 *      nGates: number of gates
 *      color: color of the gate(s)
 *      single: true if single gate image to be used, false otherwise (default)
 *      idSource: ID of the source (eg, component with matching number of bits)
 *      idTarget: ID of the target (eg, component with matching number of bits)
 *      sourceStart: starting bit index of source corresponding to gate index 0
 *      targetStart: starting bit index of target corresponding to gate index 0
 *
 *  However, by the time we're called, initSelectors() has already looked up the 
 *  corresponding source and target components by the above IDs (so that we don't
 *  have to be involved in the "wiring" process) and passes them to us as:
 *
 *      regSource
 *      regTarget
 *
 *  A Selector object can be a single gate or an array of gates.  The behavior of
 *  these gates is extensible, but by default, gates do nothing more than propagate
 *  bits from a "source" input to a "target" output whenever they are "selected".
 *
 *  Internally, the gate indexes of a Selector correspond to the array indexes of
 *  aGates (ie, aGates[0] contains the [source, target, selected] triplet for gate
 *  index 0).  The source, target and selected values for each gate triplet are stored
 *  at positions GATE_SOURCE, GATE_TARGET, and GATE_SELECTED.
 *
 *  The display of individual gates is handled by the given updateGate() function:
 *
 *      updateGate(iGate, f)
 *
 *  If f is true, the gate should be displayed in an "selected" state, otherwise it
 *  should be displayed in a "deselected" state.
 */
function Selector(parmsSel, regSource, regTarget, updateGate) {
    Component.call(this, "Sel", parmsSel);
    this.aGates = new Array(parmsSel.nGates);
    this.selected = false;          // the selected state of the entire selector
    this.single = (parmsSel.single === true);
    this.source = regSource;
    this.target = regTarget;
    var sourceIndex = (parmsSel.sourceStart? parmsSel.sourceStart : 0);
    var targetIndex = (parmsSel.targetStart? parmsSel.targetStart : 0);
    var sourceCount = (this.source? this.source.count() : -1);      // bit index limit for the given source
    var targetCount = (this.target? this.target.count() : -1);      // bit index limit for the given target
    for (var iGate=0; iGate < this.aGates.length; iGate++) {
        var s = sourceIndex;
        var t = targetIndex;
        if (sourceIndex < 0 || sourceIndex >= sourceCount) s = -1;
        if (targetIndex < 0 || targetIndex >= targetCount) t = -1;
        this.aGates[iGate] = [s, t, false];
        sourceIndex++;
        targetIndex++;
    }
    this.updateGate = (updateGate === undefined? function(iGate, f) {} : updateGate);
    this.updateAll();
}

var GATE_SOURCE = 0;
var GATE_TARGET = 1;
var GATE_SELECTED = 2;

Component.subclass(Component, Selector, {
    count: function() {
        return this.aGates.length;
    },
    selectGate: function(iGate, f) {
        this.aGates[iGate][GATE_SELECTED] = f;
        if (f) {
            var sourceIndex = this.aGates[iGate][GATE_SOURCE];
            var targetIndex = this.aGates[iGate][GATE_TARGET];
            if (sourceIndex >= 0 && targetIndex >= 0)
                this.target.writeBit(targetIndex, this.source.readBit(sourceIndex));
        }
    },
    selectAll: function(f) {
        this.selected = f;
        for (var iGate=0; iGate < this.aGates.length; iGate++) {
            this.selectGate(iGate, f);
        }
    },
    updateAll: function() {
        for (var iGate=0; iGate < this.aGates.length; iGate++)
            this.updateGate(iGate, this.aGates[iGate][GATE_SELECTED]);
        this.target.updateAll();
    }
});

/*
 *  initSelectors()
 *
 *  Initializes all the necessary HTML to construct every Selector gate or
 *  gate-array as spec'ed.
 *
 *  This function operates on every element (e) of class "selector" and inserts
 *  the appropriate HTML child elements of class "gate".
 *
 *  Note that each element (e) of class "selector" is expected to have a "data-value"
 *  attribute containing the same JSON-encoded parameters that the Selector constructor
 *  expects.
 */
function initSelectors()
{
    var aeSels = Component.getElementsByClass(window.document, "selector");
    for (var iSel=0; iSel < aeSels.length; iSel++) {
        var eSel = aeSels[iSel];
        var parmsSel = Component.getComponentParms(eSel);

        //
        //  Let's find the specified source/target components next, because if nGates isn't defined,
        //  then we will set a default value equal to the number of bits in the source component, if any.
        //
        var regSource = Component.getComponentByID(parmsSel.idSource);
        var regTarget = Component.getComponentByID(parmsSel.idTarget);
        if (parmsSel.nGates === undefined) {
            parmsSel.nGates = (regSource? regSource.count() : 1);
        }

        var nGate = 1;
        var sHTML = "";
        if (parmsSel.single) {
            sHTML += "<div class=\"gate gateLarge\"><img src=\"/my_modules/shared/images/selector.png\"/></div>\n";
        }
        else {
            for (var iGate=0; iGate < parmsSel.nGates; iGate++,nGate++) {
                sHTML += "<div class=\"gate gateSmall\"><img src=\"/my_modules/shared/images/selector.png\"/></div>\n";
            }
        }
        eSel.innerHTML = sHTML;
        if (parmsSel.id) {
            eSel.setAttribute("id", "sel" + parmsSel.id);
        }

        //
        //  Now that all the document elements have been defined, we can
        //  create an array that refers to all "gate" elements in bit index order
        //  (ie, reverse of display order).
        //
        var aeGates = [];
        var aeCells = Component.getElementsByClass(eSel, "gate");
        for (var i=aeCells.length-1; i >= 0; i--) {
            aeGates.push(aeCells[i]);
        }

        //
        //  Now we can create the Selector object, record it, and wire it up to the associated document elements.
        //
        var sel = new Selector(parmsSel, regSource, regTarget, function(ae, color, single) {
            return function(iGate, f) {
                var s = (f===true? "white": color);
                ae[single?0:iGate].style.backgroundColor = s;
            };
            }(aeGates, parmsSel.color, parmsSel.single)
        );

        for (var i=0; i < aeGates.length; i++) {
            aeGates[i].onclick = function (selParm) {
                return function() {
                    selectSelector(selParm);
                };
            }(sel);
        }

        initSelectorControls(sel, eSel);

        //
        //  For testing purposes, we could tweak a few of the gates, just to see if all the "wiring" works.
        //
        //      sel.selectGate(7, true);
        //      sel.selectGate(9, false);
        //
    }
    if (aeSels.length == 0)
        console.log("warning: no selectors on page");
}

/*
 *  initSelectorControls(sel, eSel)
 *
 *  For each Selector object created by initSelectors(), this function looks for any controls that have been defined
 *  along with the selector element in the current document, and "wires" them as needed.
 *
 *  The following controls are supported:
 *
 *      One optional 'button' control of class "select"
 */
function initSelectorControls(sel, eSel)
{
    var aeControls = Component.getElementsByClass(eSel.parentNode, "controls");
    for (var iControl = 0; iControl < aeControls.length; iControl++) {
        var aeChildren = aeControls[iControl].childNodes;
        for (var i=0; i < aeChildren.length; i++) {
            var e = aeChildren[i];
            if (e.nodeType != document.ELEMENT_NODE)
                continue;
            var sClass = e.getAttribute("class");
            if (e.nodeName == "BUTTON" && sClass == "select") {
                e.onclick = function(e) {
                    return function() { selectSelector(sel, e); };
                }(e);
                continue;
            }
        }
    }
}

/*
 * Function called by the anonymous click handlers for the "Select" button.
 */
function selectSelector(sel, e)
{
    sel.selectAll(!sel.selected);
    sel.updateAll();
    if (e !== undefined) {
        e.innerHTML = (f? "Deselect" : "Select");
    }
}

/*
 * Initialize all the selectors on the page.
 */
web.onInit(initSelectors);
