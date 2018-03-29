function(head, req) {
    /* Load the Decimal library */
    var Decimal = require("views/lib/decimal");

    /**
     * x: grade
     * y: benchmark (8 of th)
     */
    var stats = {
        "n": new Decimal(0),

        /* Grade */
        "runningSum(x)": new Decimal(0),
        "runningSum(x^2)": new Decimal(0),

        /* Gr12 Eng */
        "runningSum(xy_0)": new Decimal(0),
        "runningSum(y_0)": new Decimal(0),
        "runningSum(y_0^2)": new Decimal(0),

        /* Gr12 Sci */
        "runningSum(xy_1)": new Decimal(0),
        "runningSum(y_1)": new Decimal(0),
        "runningSum(y_1^2)": new Decimal(0),

        /* Gr12 Mth */
        "runningSum(xy_2)": new Decimal(0),
        "runningSum(y_2)": new Decimal(0),
        "runningSum(y_2^2)": new Decimal(0),

        /* NBT AL */
        "runningSum(xy_3)": new Decimal(0),
        "runningSum(y_3)": new Decimal(0),
        "runningSum(y_3^2)": new Decimal(0),

        /* NBT QL */
        "runningSum(xy_4)": new Decimal(0),
        "runningSum(y_4)": new Decimal(0),
        "runningSum(y_4^2)": new Decimal(0),

        /* NBT Mth */
        "runningSum(xy_5)": new Decimal(0),
        "runningSum(y_5)": new Decimal(0),
        "runningSum(y_5^2)": new Decimal(0),
    };

    /* Helper function to update stats */
    function updateStats(obj) {
        /* Only take lines with benchmark and grade */
        if (obj.benchmark && obj.grade) {
            /* Only send rows with all benchmarks */
            if (
                obj["Course %"] !== 0 &&
                obj["Gr12 Eng %"] !== 0 &&
                obj["Gr12 Sci %"] !== 0 &&
                obj["Gr12 Mth %"] !== 0 &&
                obj["NBT AL %"] !== 0 &&
                obj["NBT QL %"] !== 0 &&
                obj["NBT Mth %"] !== 0
            ) {
                /* Increment count */
                stats.n = stats.n.plus(new Decimal(1));

                /* Grade */
                var x = new Decimal(obj["Course %"]);
                stats["runningSum(x)"] = stats["runningSum(x)"].plus(x);
                stats["runningSum(x^2)"] = stats["runningSum(x^2)"].plus(x.pow(2));

                /* Gr12 Eng */
                var y_0 = new Decimal(obj["Gr12 Eng %"]);
                stats["runningSum(xy_0)"] = stats["runningSum(xy_0)"].plus(x.times(y_0));
                stats["runningSum(y_0)"] = stats["runningSum(y_0)"].plus(y_0);
                stats["runningSum(y_0^2)"] = stats["runningSum(y_0^2)"].plus(y_0.pow(2));

                /* Gr12 Sci */
                var y_1 = new Decimal(obj["Gr12 Sci %"]);
                stats["runningSum(xy_1)"] = stats["runningSum(xy_1)"].plus(x.times(y_1));
                stats["runningSum(y_1)"] = stats["runningSum(y_1)"].plus(y_1);
                stats["runningSum(y_1^2)"] = stats["runningSum(y_1^2)"].plus(y_1.pow(2));

                /* Gr12 Mth */
                var y_2 = new Decimal(obj["Gr12 Mth %"]);
                stats["runningSum(xy_2)"] = stats["runningSum(xy_2)"].plus(x.times(y_2));
                stats["runningSum(y_2)"] = stats["runningSum(y_2)"].plus(y_2);
                stats["runningSum(y_2^2)"] = stats["runningSum(y_2^2)"].plus(y_2.pow(2));

                /* NBT AL */
                var y_3 = new Decimal(obj["NBT AL %"]);
                stats["runningSum(xy_3)"] = stats["runningSum(xy_3)"].plus(x.times(y_3));
                stats["runningSum(y_3)"] = stats["runningSum(y_3)"].plus(y_3);
                stats["runningSum(y_3^2)"] = stats["runningSum(y_3^2)"].plus(y_3.pow(2));

                /* NBT QL */
                var y_4 = new Decimal(obj["NBT QL %"]);
                stats["runningSum(xy_4)"] = stats["runningSum(xy_4)"].plus(x.times(y_4));
                stats["runningSum(y_4)"] = stats["runningSum(y_4)"].plus(y_4);
                stats["runningSum(y_4^2)"] = stats["runningSum(y_4^2)"].plus(y_4.pow(2));

                /* NBT Mth */
                var y_5 = new Decimal(obj["NBT Mth %"]);
                stats["runningSum(xy_5)"] = stats["runningSum(xy_5)"].plus(x.times(y_5));
                stats["runningSum(y_5)"] = stats["runningSum(y_5)"].plus(y_5);
                stats["runningSum(y_5^2)"] = stats["runningSum(y_5^2)"].plus(y_5.pow(2));
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

            /* Send previous line if it is a new student and then reset id */
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
                    currentLine["Gr12 Eng %"] = value[0];
                    currentLine["Gr12 Sci %"] = value[1];
                    currentLine["Gr12 Mth %"] = value[2];
                    currentLine["Gr12 Mth Lit %"] = value[3];
                    currentLine["Gr12 Mth Adv %"] = value[4];
                    currentLine["NBT AL %"] = value[5];
                    currentLine["NBT QL %"] = value[6];
                    currentLine["NBT Mth %"] = value[7];
                    break;

                case 'grade':

                    /* Send previous line if it is a new year */
                    if (currentYear !== year) {
                        updateStats(currentLine);
                        currentYear = year;
                    };

                    currentLine.grade = true;
                    currentLine.id = id; // In case no demographic doc exists
                    currentLine.year = year;
                    currentLine.course = course;
                    currentLine["Course %"] = value;
                    break;

                default:
                    continue;
            };
        };

        function getR(N, a, b, c, d, e) {
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
            return rXYnumerator.div(rXY_0_denominator).toFixed(2);
        }

        /* Update for last row in index */
        updateStats(currentLine);

        /* Work out correlation coefficients */
        var N = stats.n;

        /* Gr12 Eng */
        var rXY_0 = getR(
            N,
            stats["runningSum(xy_0)"],
            stats["runningSum(x)"],
            stats["runningSum(y_0)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_0^2)"]
        );

        /* Gr12 Sci */
        var rXY_1 = getR(
            N,
            stats["runningSum(xy_1)"],
            stats["runningSum(x)"],
            stats["runningSum(y_1)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_1^2)"]
        );

        /* Gr12 Mth */
        var rXY_2 = getR(
            N,
            stats["runningSum(xy_2)"],
            stats["runningSum(x)"],
            stats["runningSum(y_2)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_2^2)"]
        );

        /* NBT AL */
        var rXY_3 = getR(
            N,
            stats["runningSum(xy_3)"],
            stats["runningSum(x)"],
            stats["runningSum(y_3)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_3^2)"]
        );

        /* NBT QL */
        var rXY_4 = getR(
            N,
            stats["runningSum(xy_4)"],
            stats["runningSum(x)"],
            stats["runningSum(y_4)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_4^2)"]
        );

        /* NBT Mth */
        var rXY_5 = getR(
            N,
            stats["runningSum(xy_5)"],
            stats["runningSum(x)"],
            stats["runningSum(y_5)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_5^2)"]
        );

        /* Append to HTML */
        var row = '\
        <tr>\
            <td>Gr12 Eng %</td>\
            <td style="text-align:center;">' + rXY_0 + '</td>\
        </tr>\
        <tr>\
            <td>Gr12 Sci %</td>\
            <td style="text-align:center;">' + rXY_1 + '</td>\
        </tr>\
        <tr>\
            <td>Gr12 Mth %</td>\
            <td style="text-align:center;">' + rXY_2 + '</td>\
        </tr>\
        <tr>\
            <td>NBT AL %</td>\
            <td style="text-align:center;">' + rXY_3 + '</td>\
        </tr>\
        <tr>\
            <td>NBT QL %</td>\
            <td style="text-align:center;">' + rXY_4 + '</td>\
        </tr>\
        <tr>\
            <td>NBT Mth %</td>\
            <td style="text-align:center;">' + rXY_5 + '</td>\
        </tr>'
        html += row;

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