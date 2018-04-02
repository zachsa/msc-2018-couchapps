function(head, req) {
    /* Load the Decimal library */
    var Decimal = require("views/lib/decimal");
    var bKey = {
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

    /* Shorthand loop creation */
    Number.prototype.times = function(cb) {
        for (var i = 0; i < this; i++) {
            cb.call(this, i);
        };
    };

    var deltaRank = {};
    var RANKS = { grades: [] };
    (19).times(function(i) {
        RANKS['benchmark_' + i] = [];
    });

    function correlate() {};

    /**
     * x: S1 event count
     * y: change in ranking (grade - benchmark)
     */
    var stats = {
        "n": new Decimal(0),
        "runningSum(x)": new Decimal(0),
        "runningSum(x^2)": new Decimal(0)
    };
    (19).times(function(i) {
        stats["runningSum(xy_" + i + ")"] = new Decimal(0);
        stats["runningSum(y_" + i + ")"] = new Decimal(0);
        stats["runningSum(y_" + i + "^2)"] = new Decimal(0);
    });

    function findCorrelations() {
        // todo;
    };

    /* Correlate gradeDeltaBenchmark */
    function updateStats() {

        /* For each student */
        Object.keys(deltaRank).forEach(function(id) {

            /* There are 19 delta values */
            (19).times(function(i) {

                /* Update running stats for each delta */
                // todo
            });
        });
        return deltaRank;
    };

    /* Populate deltaRank object */
    function findRankings() {
        var c = RANKS.grades.length;
        for (var j = 0; j < c; j++) {
            var tuple = RANKS.grades[j];
            var grade = tuple[0];
            var id = tuple[1];
            deltaRank[id] = {};
            deltaRank[id].gradeRank = RANKS.grades.findIndex(function(el) {
                return (el[1] === id);
            }) + 1;

            for (var i = 0; i <= 18; i++) {
                var b = 'benchmark_' + i;
                deltaRank[id][b] = RANKS[b].findIndex(function(el) {
                    return (el[1] === id);
                }) + 1;
                deltaRank[id]['delta_' + i] = deltaRank[id].gradeRank - deltaRank[id][b];
            };
        };
    };

    /* ES6 polyfill (but counts down instead of up) */
    Array.prototype.findIndex = Array.prototype.findIndex || function(callback) {
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

    /* A horrible way to insert and sort */
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

    /* Process current student */
    function processStudent(obj) {

        /* Students must have all three entities */
        if (obj.benchmark && obj.grade && obj.event) {

            /* Students must have a score for the benchmark */
            if (
                obj["Course %"] !== 0 &&
                obj[0] !== 0 &&
                obj[1] !== 0 &&
                obj[2] !== 0 &&
                obj[3] !== 0 &&
                obj[4] !== 0 &&
                obj[5] !== 0
            ) {
                /* Get grade rank */
                RANKS.grades.insertAndSort([obj["Course %"], obj.id]);

                /* Get benchmark ranks */
                (19).times(function(i) {
                    RANKS['benchmark_' + i].insertAndSort([obj[i], obj.id]);
                });

                /* Update stats */
                stats.n = stats.n.plus(new Decimal(1));
                var x = new Decimal(obj.S1);
                stats["runningSum(x)"] = stats["runningSum(x)"].plus(x);
                stats["runningSum(x^2)"] = stats["runningSum(x^2)"].plus(x.pow(2));
            };
        };
    };

    provides('html', function() {
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

        /* Current function scope variables */
        var currentStudent = null;
        var currentYear = null;
        var currentLine = {};
        var key;
        var id;
        var course;
        var year;
        var value;

        /* Iterate through view results */
        var row;
        while (row = getRow()) {

            /* Key */
            key = row.key;
            id = key[0];
            course = key[1];
            year = key[2];

            /* Value */
            value = row.value;

            /* 
             * Send previous line if it is a new student
             * Then reset id
             */
            if (currentStudent !== id) {
                processStudent(currentLine);
                currentLine = {};
                currentStudent = id;
            };

            /* Append to/adjust current line */
            var type = (course === 0 && year === 0) ?
                'benchmark' : ((course === 0) ?
                    'event' : 'grade');

            switch (type) {
                case 'benchmark':
                    currentLine.benchmark = true;
                    currentLine.id = id;
                    currentLine[0] = value[0];
                    currentLine[1] = value[1];
                    currentLine[2] = value[2];
                    currentLine[3] = value[3];
                    currentLine[4] = value[4];
                    currentLine[5] = value[5];
                    currentLine[6] = value[6];
                    currentLine[7] = value[7];
                    currentLine[8] = value[8];
                    currentLine[9] = value[9];
                    currentLine[10] = value[10];
                    currentLine[11] = value[11];
                    currentLine[12] = value[12];
                    currentLine[13] = value[13];
                    currentLine[14] = value[14];
                    currentLine[15] = value[15];
                    currentLine[16] = value[16];
                    currentLine[17] = value[17];
                    currentLine[18] = value[18];
                    break;

                case 'event':
                    currentLine.event = true;
                    currentLine.id = id;
                    currentLine.year = year;
                    currentLine.S1 = value[0];
                    currentLine.S2 = value[1];
                    break;

                case 'grade':
                    currentLine.grade = true;
                    currentLine.id = id;
                    currentLine.year = year;
                    currentLine.course = course;
                    currentLine["Course %"] = value;
                    break;

                default:
                    break;
            };
        };

        /* process last CSV line if required */
        processStudent(currentLine);

        /* Work out rank change */
        findRankings();

        /* Cycle through deltaRanks and create correlation vars */
        updateStats();

        /* Work out the correlation coefficients */
        findCorrelations();

        /* Append to table */
        (function() {
            (1).times(function(i) {
                html += '<tr>\
                            <td>' + bKey['rXY_' + i] + '</td>\
                            <td style="text-align:center;">' + 'hi' + '</td>\
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