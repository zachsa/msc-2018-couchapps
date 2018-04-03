function(doc) {
    /* Compound key */
    var id;
    var course;
    var year;

    /* Output */
    var output;

    /* Decision tree */
    var type = doc.type_;
    switch (type) {
        case 'grade':
            /* Key and other vars */
            var RegCareer = doc.RegCareer;
            id = doc.anonIDnew;
            course = doc.Course;
            year = doc.RegAcadYear;

            /* Value */
            output = doc.Percent || 0;

            /* Normalize the percent field to a number */
            if (typeof output !== 'number') {
                if (typeof output !== 'string') return;
                var percentCleaned = output.toUpperCase().trim();

                /* Return if percent is a disallowed symbol */
                if ([
                        'ATT',
                        'DE',
                        'GIP',
                        'LOA',
                        'OS',
                        'OSS',
                        'PA',
                        'SAT',
                        'UNS',
                        'AB',
                        ''
                    ].indexOf(percentCleaned) >= 0) return;

                /* Get the percentage */
                switch (percentCleaned) {
                    case 'F':
                        output = 40;
                        break;
                    case 'DPR':
                        output = 30;
                        break;
                    case 'INC':
                        output = 30;
                        break;
                    case 'UF':
                        output = 49;
                        break;
                    case 'UP':
                        output = 45;
                        break;
                    default:
                        /* Convert percent to number */
                        output = parseFloat(output.substring(0, output.length - 1));
                        if (isNaN(output)) return;
                        break;
                };
            };

            /* Output */
            emit([id, course, year], output);
            break;

        case 'benchmark':
            /* Load Decimal  */
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

            /* Assign output variables */
            id = doc.anonIDnew;
            course = 0;
            year = 0;
            output = [
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
            try {
                // i = 0
                var gEng12 = Number(getDemographicGrade(doc["Eng Grd12 Fin Rslt"] || null));
                if (!gEng12) throw new Error('Ignore 0 grades');
                output[0] = gEng12;
                // i = 1
                var gSci12 = Number(getDemographicGrade(doc["Phy Sci Grd12 Fin Rslt"] || null));
                if (!gSci12) throw new Error('Ignore 0 grades');
                output[1] = gSci12;
                // i = 2
                var gMth12 = Number(getDemographicGrade(doc["Math Grd12 Fin Rslt"] || null));
                if (!gMth12) throw new Error('Ignore 0 grades');
                output[2] = gMth12;
                // i = 3
                var gNbtAl = Number(getDemographicGrade(doc["NBT AL Score"] || null));
                if (!gNbtAl) throw new Error('Ignore 0 grades');
                output[3] = gNbtAl;
                // i = 4
                var gNbtQl = Number(getDemographicGrade(doc["NBT QL Score"] || null));
                if (!gNbtQl) throw new Error('Ignore 0 grades');
                output[4] = gNbtQl;
                // i = 5
                var gNbtMth = Number(getDemographicGrade(doc["NBT Math Score"] || null));
                if (!gNbtMth) throw new Error('Ignore 0 grades');
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

            } catch (error) {

                /* Swallow known errors without emitting (by re-throwing) */
                switch (error.message) {
                    case 'Ignore 0 grades':
                        throw error;
                        break;
                    case 'Divisor cannot be 0':
                        throw error;
                        break;
                    default:
                        output = error.message;
                        break;
                };
            };

            /* Output */
            emit([id, course, year], output);
            break;

        case 'event':
            /* Date required */
            var date = new Date(doc.event_date);

            /* Assign output variables */
            id = doc.uct_id;
            course = 0;
            year = date.getFullYear();
            output = [0, 0];

            /* Midpoint =  Sunday, July 17, 2016 10:00:00 PM */
            var epoch = date.getTime();
            var midDate = 1468792800000
            var semester = (epoch - midDate >= 0) ? 2 : 1;
            if (semester === 1) {
                output[0] = 1;
            } else {
                output[1] = 1;
            };

            /* Output */
            emit([id, course, year], output);
            break;

        default:
            break;
    };
};