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
    var career = doc.Career;
    var residency = doc["Citizenship Residency"];

    /* Filters */
    if (!type === 'benchmark') return;
    if (allowedCareers.indexOf(career) < 0) return;
    if (allowedResidence.indexOf(residency) < 0) return;

    /* Load Decimal library */
    var Decimal = require("views/lib/decimal");

    /**
     * Reduce array to avg (all elements must be numbers)
     * @param {boolean} ignoreZero 
     */
    Array.prototype.avg = function(ignoreZero) {
        ignoreZero = ignoreZero || false;
        var zeros = 0;
        var sum = new Decimal(this.reduce(function(a, b) {
            if (ignoreZero) {
                if (b === 0) {
                    zeros++;
                };
            };
            return a + b;
        }));
        var divisor = new Decimal(this.length - zeros);
        return sum.dividedBy(divisor).toFixed(2);
    };

    /* Key - the Student ID */
    var id = doc.anonIDnew;

    /* Value (each index corresponds to a benchmark) */
    var benchmarks = [
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
        var g = parseFloat(gr).toFixed(2);
        var retG;
        if (isNaN(g)) { // True for symbols, false for numbers
            if (typeof gr !== 'string') return 0;
            retG = fuDictionary[gr.toUpperCase().trim()] || 0;
        } else {
            retG = g;
        };
        return retG;
    };

    // i = 0
    var gEng12 = Number(getDemographicGrade(doc["Eng Grd12 Fin Rslt"] || ""));
    benchmarks[0] = gEng12;
    // i = 1
    var gSci12 = Number(getDemographicGrade(doc["Phy Sci Grd12 Fin Rslt"] || ""));
    benchmarks[1] = gSci12;
    // i = 2
    var gMth12 = Number(getDemographicGrade(doc["Math Grd12 Fin Rslt"] || ""));
    benchmarks[2] = gMth12;
    // i = 3
    var gNbtAl = Number(getDemographicGrade(doc["NBT AL Score"] || ""));
    benchmarks[3] = gNbtAl;
    // i = 4
    var gNbtQl = Number(getDemographicGrade(doc["NBT QL Score"] || ""));
    benchmarks[4] = gNbtQl;
    // i = 5
    var gNbtMth = Number(getDemographicGrade(doc["NBT Math Score"] || ""));
    benchmarks[5] = gNbtMth;
    // i = 6
    var g12Avg = Number([gEng12, gSci12, gMth12].avg(true));
    benchmarks[6] = g12Avg;
    // i = 7
    var g12AvgMth = Number([gEng12, gSci12, gMth12, gMth12].avg(true));
    benchmarks[7] = g12AvgMth;
    // i = 8
    var g12AvgMthSci = Number([gEng12, gSci12, gMth12, gMth12, gSci12].avg(true));
    benchmarks[8] = g12AvgMthSci;
    // i = 9
    var gNbtAvg = Number([gNbtAl, gNbtQl, gNbtMth].avg(true));
    benchmarks[9] = gNbtAvg;
    // i = 10
    var gNbtAvgAl = Number([gNbtAl, gNbtQl, gNbtMth, gNbtAl].avg(true));
    benchmarks[10] = gNbtAvgAl;
    // i = 11
    var gNbtAvgQl = Number([gNbtAl, gNbtQl, gNbtMth, gNbtQl].avg(true));
    benchmarks[11] = gNbtAvgQl;
    // i = 12
    var gNbtAvgMth = Number([gNbtAl, gNbtQl, gNbtMth, gNbtMth].avg(true));
    benchmarks[12] = gNbtAvgMth;
    // i = 13
    var gNbtAvgAlQl = Number([gNbtAl, gNbtQl, gNbtMth, gNbtAl, gNbtQl].avg(true));
    benchmarks[13] = gNbtAvgAlQl;
    // i = 14
    var gNbtAvgAlMth = Number([gNbtAl, gNbtQl, gNbtMth, gNbtAl, gNbtAvgMth].avg(true));
    benchmarks[14] = gNbtAvgAlMth;
    // i = 15
    var gNbtAvgQlMth = Number([gNbtAl, gNbtQl, gNbtMth, gNbtQl, gNbtMth].avg(true));
    benchmarks[15] = gNbtAvgQlMth;
    // i = 16
    var gGr12NbtAvg = Number([g12Avg, gNbtAvg].avg(true));
    benchmarks[16] = gGr12NbtAvg;
    // i = 17
    var gGr12NbtAvgGr12Mth = Number([g12Avg, gNbtAvg, gMth12].avg(true));
    benchmarks[17] = gGr12NbtAvgGr12Mth;
    // i = 18
    var gGr12NbtAvgGr12MthSci = Number([g12Avg, gNbtAvg, gMth12, gSci12].avg(true));
    benchmarks[18] = gGr12NbtAvgGr12MthSci;

    /* Output */
    emit(id, benchmarks);
};