function(head, req) {
    var Decimal = require("views/lib/decimal");

    /**
     * Provide a shorthand way of writing a for loop
     * @param {Function} callback
     */
    Number.prototype.times = function(callback) {
        for (var i = 0; i < this; i++) {
            callback.call(this, i);
        };
    };

    /**
     * A polyfill for the ES6 method
     * But optimized here to count down instead of up
     * When repeated values are found, the highest index is returned
     * @param {Function} callback 
     */
    Array.prototype.findIndex = function(callback) {
        if (this === null) return null;
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        for (var i = length - 1; i >= 0; i--) {
            if (callback.call(thisArg, list[i], i, list)) {
                return i;
            };
        };
        return -1;
    };

    /**
     * A means of inserting a tuple into an array
     * And then sorting that array
     * @param {Object} val An array with 2 items
     */
    Array.prototype.insertAndSort = function(val) {
        this.push(val);
        this.sort(function(a, b) {
            if (a[0] === b[0]) {
                return (a[1] <= b[1]) ? 0 : 1;
            } else {
                return (a[0] <= b[0]) ? 0 : 1;
            }
        })
    };

    /* Open HTML */
    var html = '\
    <!DOCTYPE html>\
    <html>\
    <head>\
        <title>Variance &amp; Std Deviation Analysis</title>\
    </head>\
    <body>\
        <table style="width:50%;margin:auto;">\
            <thead>\
                <tr>\
                    <th style="width:50%;">Benchmarking method</th>\
                    <th style="width:50%;">Correlation coefficient</th>\
                </tr>\
            </thead>\
            <tbody>';

    /**
     * rXY_? allows for greatly reducing LOC
     * This maps back to useful text descriptions
     * For HTML output
     */
    var keyMap = {
        rXY_0: 'Gr12 Eng',
        rXY_1: 'Gr12 Sci',
        rXY_2: 'Gr12 Mth',
        rXY_3: 'NBT AL',
        rXY_4: 'NBT QL',
        rXY_5: 'NBT Mth',
        rXY_6: 'Gr12 Results Avg',
        rXY_7: 'Double Mth weight',
        rXY_8: 'Double Mth & Sci weight',
        rXY_9: 'NBT Results Avg',
        rXY_10: 'Double NBT AL',
        rXY_11: 'Double NBT QL',
        rXY_12: 'Double NBT Mth',
        rXY_13: 'Double NBT AL/QL',
        rXY_14: 'Double NBT AL/Mth',
        rXY_15: 'Double NBT QL/Mth',
        rXY_16: 'Avg of NBT & Gr12',
        rXY_17: 'Double Gr 12 Mth weight',
        rXY_18: 'Double Gr12 Mth & Sci weight'
    };

    /**
     * Return correlation coefficient
     */
    function correlate(N, a, b, c, d, e) {
        var nxy = new Decimal(N.times(a));
        var xy = new Decimal(b.times(c));
        var rXYnumerator = new Decimal(nxy.minus(xy));
        var nx2 = new Decimal(N.times(d));
        var x_2 = new Decimal(b.pow(2));
        var ny_2 = new Decimal(N.times(e));
        var y_2 = new Decimal(c.pow(2));
        var rXY_0_denominatorLeft = new Decimal(nx2.minus(x_2));
        var rXY_0_denominatorRight = new Decimal(ny_2.minus(y_2));
        var rXY_0_denominator = new Decimal(Decimal.sqrt(rXY_0_denominatorLeft.times(rXY_0_denominatorRight)));
        return rXYnumerator.div(rXY_0_denominator).toFixed(3);
    };

    /**
     * As index is processed, RANKS are built up
     *   => for grades
     *   => for each student
     * Each list contains tuples: [%, Id]
     * Each list is then sorted by i = 0;
     */
    var RANKS;
    (function() {
        RANKS = { grades: [] };
        (19).times(function(i) {
            RANKS['benchmark_' + i] = [];
        });
    })();

    /**
     * All ranks for a course need to be worked out before rank change
     * After all values for CSC1015F retrieved from index
     * deltaRank is built: { "id": {S1: x, delta: x, ...} }
     */
    var deltaRank = {};

    /**
     * x: S1 event count
     * y: Change in ranking (grade - benchmark)
     */
    var stats;
    (function() {
        stats = {
            "n": new Decimal(0),
            "runningSum(x)": new Decimal(0),
            "runningSum(x^2)": new Decimal(0)
        };
        (19).times(function(i) {
            stats["runningSum(xy_" + i + ")"] = new Decimal(0);
            stats["runningSum(y_" + i + ")"] = new Decimal(0);
            stats["runningSum(y_" + i + "^2)"] = new Decimal(0);
        });
    })();

    /* Process current student */
    function performJoin(obj) {
        if (obj.benchmark && obj.grade && obj.event) {
            if (
                obj["Course %"] !== 0 &&
                obj[0] !== 0 &&
                obj[1] !== 0 &&
                obj[2] !== 0 &&
                obj[3] !== 0 &&
                obj[4] !== 0 &&
                obj[5] !== 0 &&
                obj.S1 !== 0
            ) {
                /* Insert grade (and sort) */
                RANKS.grades.insertAndSort([obj["Course %"], obj.id]);

                /* Insert benchmarks (and sort) */
                (19).times(function(i) {
                    RANKS['benchmark_' + i].insertAndSort([obj[i], obj.id]);
                });

                /* Initialize deltaRank for each student */
                deltaRank[obj.id] = {};

                /* Keep count of S1 for student */
                deltaRank[obj.id].S1 = obj.S1;
            };
        };
    };

    provides('html', function() {

        /* Iterate through view results */
        var row;
        var currentStudent = null;
        var currentYear = null;
        var currentStudentObj = {};
        var key;
        var id;
        var course;
        var year;
        var value;
        while (row = getRow()) {
            key = row.key;
            id = key[0];
            course = key[1];
            year = key[2];
            value = row.value;

            /* 
             * Process previous line if it is a new student
             * Then reset id
             */
            if (currentStudent !== id) {
                performJoin(currentStudentObj);
                currentStudentObj = {};
                currentStudent = id;
            };

            /* Append to/adjust current line */
            var type = (course === 0 && year === 0) ?
                'benchmark' : ((course === 0) ?
                    'event' : 'grade');

            switch (type) {
                case 'benchmark':
                    currentStudentObj.benchmark = true;
                    currentStudentObj.id = id;
                    (19).times(function(i) {
                        currentStudentObj[i] = value[i];
                    });
                    break;

                case 'event':
                    currentStudentObj.event = true;
                    currentStudentObj.id = id;
                    currentStudentObj.year = year;
                    currentStudentObj.S1 = value[0];
                    currentStudentObj.S2 = value[1];
                    break;

                case 'grade':
                    /* Send previous line if it is a new year */
                    if (currentYear !== year) {
                        performJoin(currentStudentObj);
                        currentYear = year;
                    };
                    currentStudentObj.grade = true;
                    currentStudentObj.id = id;
                    currentStudentObj.year = year;
                    currentStudentObj.course = course;
                    currentStudentObj["Course %"] = value;
                    break;

                default:
                    break;
            };

        }; /* close while */

        /* process last CSV line */
        performJoin(currentStudentObj);

        /**
         * Now that there is a list of benchmarks and grades ordered by %
         * Get delta rank for each benchmark
         * Each student has 19 delta values
         */
        (function() {
            var studentCount = Object.keys(deltaRank).length;
            for (var j = 0; j < studentCount; j++) {

                /* Find each student's position RANKS.grades */
                var tuple = RANKS.grades[j];
                var grade = tuple[0];
                var id = tuple[1];
                deltaRank[id].gradeRank = RANKS.grades.findIndex(function(el) {
                    return (el[1] === id);
                }) + 1; // Rank starts at 1, not 0

                /* Find each student's position in RANKS.benchmarks */
                (19).times(function(i) {
                    var benchmark = 'benchmark_' + i;
                    deltaRank[id][benchmark] = RANKS[benchmark].findIndex(function(el) {
                        return (el[1] === id);
                    }) + 1; // Rank starts at 1, not 0

                    /* Change in class rank */
                    deltaRank[id]['delta_' + i] = deltaRank[id].gradeRank - deltaRank[id][benchmark];
                });
            };
        })();

        /**
         * Now that each student has delta class rank for each benchmark
         * Cycle through the students to build up the stats object
         */
        (function() {
            var studentNumbers = Object.keys(deltaRank);

            /* Update N for stats calcs later */
            stats.n = new Decimal(studentNumbers.length);

            /* For each student */
            studentNumbers.forEach(function(id) {
                var student = deltaRank[id];

                /* Update x (S1 Count) */
                var x = new Decimal(student.S1);
                stats["runningSum(x)"] = stats["runningSum(x)"].plus(x);
                stats["runningSum(x^2)"] = stats["runningSum(x^2)"].plus(x.pow(2));

                /* Update running stats for each benchmark delta */
                (19).times(function(i) {
                    var currentDelta = new Decimal(student['delta_' + i]);
                    stats["runningSum(xy_" + i + ")"] = stats["runningSum(xy_" + i + ")"].plus(x.times(currentDelta));
                    stats["runningSum(y_" + i + ")"] = stats["runningSum(y_" + i + ")"].plus(currentDelta);
                    stats["runningSum(y_" + i + "^2)"] = stats["runningSum(y_" + i + "^2)"].plus(currentDelta.pow(2));
                });
            });
            return deltaRank;
        })();

        /* Work out r values */
        (function() {
            var N = stats.n;
            (19).times(function(i) {
                stats["rXY_" + i] = correlate(
                    N,
                    stats["runningSum(xy_" + i + ")"],
                    stats["runningSum(x)"],
                    stats["runningSum(y_" + i + ")"],
                    stats["runningSum(x^2)"],
                    stats["runningSum(y_" + i + "^2)"]
                );
            });
        })();

        /* Build HTML output */
        (function() {
            (19).times(function(i) {
                html += '\
                    <tr>\
                        <td>' + keyMap['rXY_' + i] + '</td>\
                        <td style="text-align:center;">' + stats['rXY_' + i] + '</td>\
                    </tr>';
            });
        })();

        /* Close HTML */
        html += '\
                </tbody>\
                <tfoot></tfoot>\
            </table>\
        </body>\
        </html>';

        /* Send the HTML */
        send(html)
    });
};