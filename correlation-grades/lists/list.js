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

    /* Open HTML */
    var html = '\
    <!DOCTYPE html>\
    <html>\
    <head>\
        <title>Variance &amp; Std Deviation Analysis</title>\
    </head>\
    <body>\
        <table style="width:40%;margin:auto;">\
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
     * x: grade
     * y: benchmark
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

    /* Helper function to update stats */
    function performJoin(obj) {
        if (obj.benchmark && obj.grade) {
            if (
                obj["Course %"] !== 0 &&
                obj[0] !== 0 &&
                obj[1] !== 0 &&
                obj[2] !== 0 &&
                obj[3] !== 0 &&
                obj[4] !== 0 &&
                obj[5] !== 0
            ) {
                /* Increment count */
                stats.n = stats.n.plus(new Decimal(1));

                /* Grade */
                var x = new Decimal(obj["Course %"]);
                stats["runningSum(x)"] = stats["runningSum(x)"].plus(x);
                stats["runningSum(x^2)"] = stats["runningSum(x^2)"].plus(x.pow(2));

                /* Benchmarks */
                (19).times(function(i) {
                    var current = new Decimal(obj[i]);
                    stats["runningSum(xy_" + i + ")"] = stats["runningSum(xy_" + i + ")"].plus(x.times(current));
                    stats["runningSum(y_" + i + ")"] = stats["runningSum(y_" + i + ")"].plus(current);
                    stats["runningSum(y_" + i + "^2)"] = stats["runningSum(y_" + i + "^2)"].plus(current.pow(2));
                });
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
            var type = (course === 0 && year === 0) ? 'benchmark' : 'grade';
            switch (type) {
                case 'benchmark':
                    currentStudentObj.benchmark = true;
                    currentStudentObj.id = id;
                    (19).times(function(i) {
                        currentStudentObj[i] = value[i];
                    });
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

        /* Create correlation values */
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
                    <td style="text-align:center;">' + stats["rXY_" + i] + '</td>\
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