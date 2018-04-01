function(head, req) {
    /* Load the Decimal library */
    var Decimal = require("views/lib/decimal");

    Number.prototype.from0 = function(cb) {
        for (var i = 0; i <= this; i++) {
            cb(i);
        };
    };

    /**
     * x: grade
     * y: benchmark
     */
    var stats = {
        "n": new Decimal(0),
        "runningSum(x)": new Decimal(0),
        "runningSum(x^2)": new Decimal(0)
    };
    (18).from0(function(i) {
        stats["runningSum(xy_" + i + ")"] = new Decimal(0);
        stats["runningSum(y_" + i + ")"] = new Decimal(0);
        stats["runningSum(y_" + i + "^2)"] = new Decimal(0);
    });

    /* Helper function to update stats */
    function updateStats(obj) {
        /* Only take lines with benchmark and grade */
        if (obj.benchmark && obj.grade) {
            /* Only send rows with all benchmarks */
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

                /* i */
                (18).from0(function(i) {
                    stats["y_" + i] = new Decimal(obj[i]);
                    stats["runningSum(xy_" + i + ")"] = stats["runningSum(xy_" + i + ")"].plus(x.times(stats["y_" + i]));
                    stats["runningSum(y_" + i + ")"] = stats["runningSum(y_" + i + ")"].plus(stats["y_" + i]);
                    stats["runningSum(y_" + i + "^2)"] = stats["runningSum(y_" + i + "^2)"].plus(stats["y_" + i].pow(2));
                });
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
            <table style="width:30%;margin:auto;">\
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
                updateStats(currentLine);
                currentLine = {};
                currentStudent = id;
            };

            /* Append to/adjust current line */
            var type = (course === 0 && year === 0) ? 'benchmark' : 'grade';
            switch (type) {
                case 'benchmark':
                    currentLine.benchmark = true;
                    currentLine.id = id;
                    for (var i = 0; i <= 18; i++) {
                        currentLine[i] = value[i];
                    };
                    break;

                case 'grade':
                    /* Send previous line if it is a new year */
                    if (currentYear !== year) {
                        updateStats(currentLine);
                        currentYear = year;
                    };

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

        /* Update for last row in index */
        updateStats(currentLine);

        /* Function to calculate correlation */
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
        }

        /* Work out correlation coefficients */
        var N = stats.n;

        /* i */
        (18).from0(function(i) {
            stats["rXY_" + i] = correlate(
                N,
                stats["runningSum(xy_" + i + ")"],
                stats["runningSum(x)"],
                stats["runningSum(y_" + i + ")"],
                stats["runningSum(x^2)"],
                stats["runningSum(y_" + i + "^2)"]
            );
        });

        /* Append to HTML */
        (18).from0(function(i) {
            html += '\
            <tr>\
                <td>rXY_' + i + '</td>\
                <td style="text-align:center;">' + stats["rXY_" + i] + '</td>\
            </tr>';
        });

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