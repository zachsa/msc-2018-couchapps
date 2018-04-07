/**
 * Demographics are emitted in the following form:
 *   key: doc.anonIDnew
 *   value: [
 *         Gr12 Eng %, // i = 0
 *         Gr12 Sci %, // i = 1
 *         Gr12 Mth %, // i = 2
 *         NBT AL %, // i = 3
 *         NBT QL %, // i = 4
 *         NBT Mth %, // i = 5
 *         Avg Gr12 %, // i = 6
 *         Avg Gr12 % (Dbl Mth), // i = 7
 *         Avg Gr12 % (Dbl Mth & Sci), // i = 8
 *         Avg NBT %, // i = 9
 *         Avg NBT % (Dbl AL), // i = 10
 *         Avg NBT % (Dbl QL), // i = 11
 *         Avg NBT % (Dbl Mth), // i = 12
 *         Avg NBT % (Dbl AL/QL), // i = 13
 *         Avg NBT % (Dbl AL/Mth), // i = 14
 *         Avg NBT % (Dbl QL/Mth), // i = 15
 *         AVG Gr12 & NBT, // i = 16
 *         AVG Gr12 & NBT (Dbl Gr12 Mth), // i = 17
 *         AVG Gr12 & NBT (Dbl Gr12 Mth & Sci) // i = 18
 *   ]
 * 
 * @param {Object} doc 
 */
function(doc) {
    var allowedCareers = ["UGRD", "First Year", "Second Year", "Third Year"];
    var allowedResidence = ["SA Citizen", "Permanent Resident", "C", "P"];
    var type = doc.type_ || null;
    var residency = doc["Citizenship Residency"];

    /* Load Decimal library */
    var Decimal = require("views/lib/decimal");

    /**
     * Reduce array to avg (all elements must be numbers)
     * @param {boolean} ignoreNonNumeric Don't include 0s and nulls in average
     */
    Array.prototype.avg = function(ignoreNonNumeric) {
        ignoreNonNumeric = ignoreNonNumeric || false;
        var nonNumbers = 0;

        /* Get summed array */
        var sum = new Decimal(this.reduce(function(a, b) {
            /* Only use non-0 numbers */
            b = b || 0;
            if (ignoreNonNumeric) {
                /* (0 == false) = true in JavaScript */
                if (!b) {
                    nonNumbers++;
                };
            };
            return a + b;
        }, 0));

        /* Return average or 0 */
        var x = this.length - nonNumbers;
        if (x <= 0) {
            throw new Error('Divisor cannot be 0');
        } else {
            var divisor = new Decimal(x);
            return sum.dividedBy(divisor).toFixed(2);
        };
    };

    /* Key - the Student ID */
    var id = doc.anonIDnew;

    /* Value (each index corresponds to a benchmark) */
    var output = [
        null, null, null, null, null, null,
        null, null, null, null, null, null,
        null, null, null, null, null, null,
        null
    ];

    /* Normalize symbols to numbers */
    var fuDictionary = {
        "A*": 90,
        "A": 80,
        "B": 70,
        "C": 60,
        "D": 55,
        "E": 50
    };

    function getDemographicGrade(gr) {
        var result;
        try {
            var g = parseFloat(gr).toFixed(2);
            if (isNaN(g)) { // True for symbols, false for numbers
                if (typeof gr !== 'string') throw new Error("Can't convert symbol to grade");
                result = fuDictionary[gr.toUpperCase().trim()] || 0;
            } else {
                result = g;
            };
        } catch (e) {
            result = 0;
        };
        return result;
    };

    /* Create all benchmarks */

    // i = 0
    var gEng12 = Number(getDemographicGrade(doc["Eng Grd12 Fin Rslt"] || null));
    if (!gEng12) return;
    output[0] = gEng12;
    // i = 1
    var gSci12 = Number(getDemographicGrade(doc["Phy Sci Grd12 Fin Rslt"] || null));
    if (!gSci12) return;
    output[1] = gSci12;
    // i = 2
    var gMth12 = Number(getDemographicGrade(doc["Math Grd12 Fin Rslt"] || null));
    if (!gMth12) return;
    output[2] = gMth12;
    // i = 3
    var gNbtAl = Number(getDemographicGrade(doc["NBT AL Score"] || null));
    if (!gNbtAl) return;
    output[3] = gNbtAl;
    // i = 4
    var gNbtQl = Number(getDemographicGrade(doc["NBT QL Score"] || null));
    if (!gNbtQl) return;
    output[4] = gNbtQl;
    // i = 5
    var gNbtMth = Number(getDemographicGrade(doc["NBT Math Score"] || null));
    if (!gNbtMth) return;
    output[5] = gNbtMth;
    // i = 6
    var g12Avg = Number([gEng12, gSci12, gMth12].avg(true));
    output[6] = g12Avg;
    // i = 7
    var g12AvgMth = Number([gEng12, gSci12, gMth12, gMth12].avg(true));
    output[7] = g12AvgMth;
    // i = 8
    var g12AvgMthSci = Number([gEng12, gSci12, gMth12, gMth12, gSci12].avg(true));
    output[8] = g12AvgMthSci;
    // i = 9
    var gNbtAvg = Number([gNbtAl, gNbtQl, gNbtMth].avg(true));
    output[9] = gNbtAvg;
    // i = 10
    var gNbtAvgAl = Number([gNbtAl, gNbtQl, gNbtMth, gNbtAl].avg(true));
    output[10] = gNbtAvgAl;
    // i = 11
    var gNbtAvgQl = Number([gNbtAl, gNbtQl, gNbtMth, gNbtQl].avg(true));
    output[11] = gNbtAvgQl;
    // i = 12
    var gNbtAvgMth = Number([gNbtAl, gNbtQl, gNbtMth, gNbtMth].avg(true));
    output[12] = gNbtAvgMth;
    // i = 13
    var gNbtAvgAlQl = Number([gNbtAl, gNbtQl, gNbtMth, gNbtAl, gNbtQl].avg(true));
    output[13] = gNbtAvgAlQl;
    // i = 14
    var gNbtAvgAlMth = Number([gNbtAl, gNbtQl, gNbtMth, gNbtAl, gNbtAvgMth].avg(true));
    output[14] = gNbtAvgAlMth;
    // i = 15
    var gNbtAvgQlMth = Number([gNbtAl, gNbtQl, gNbtMth, gNbtQl, gNbtMth].avg(true));
    output[15] = gNbtAvgQlMth;
    // i = 16
    var gGr12NbtAvg = Number([g12Avg, gNbtAvg].avg(true));
    output[16] = gGr12NbtAvg;
    // i = 17
    var gGr12NbtAvgGr12Mth = Number([g12Avg, gNbtAvg, gMth12].avg(true));
    output[17] = gGr12NbtAvgGr12Mth;
    // i = 18
    var gGr12NbtAvgGr12MthSci = Number([g12Avg, gNbtAvg, gMth12, gSci12].avg(true));
    output[18] = gGr12NbtAvgGr12MthSci;

    /* Output */
    emit(id, output);
};