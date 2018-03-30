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

        /* i = 0 */
        "runningSum(xy_0)": new Decimal(0),
        "runningSum(y_0)": new Decimal(0),
        "runningSum(y_0^2)": new Decimal(0),

        /* i = 1 */
        "runningSum(xy_1)": new Decimal(0),
        "runningSum(y_1)": new Decimal(0),
        "runningSum(y_1^2)": new Decimal(0),

        /* i = 2 */
        "runningSum(xy_2)": new Decimal(0),
        "runningSum(y_2)": new Decimal(0),
        "runningSum(y_2^2)": new Decimal(0),

        /* i = 3 */
        "runningSum(xy_3)": new Decimal(0),
        "runningSum(y_3)": new Decimal(0),
        "runningSum(y_3^2)": new Decimal(0),

        /* i = 4 */
        "runningSum(xy_4)": new Decimal(0),
        "runningSum(y_4)": new Decimal(0),
        "runningSum(y_4^2)": new Decimal(0),

        /* i = 5 */
        "runningSum(xy_5)": new Decimal(0),
        "runningSum(y_5)": new Decimal(0),
        "runningSum(y_5^2)": new Decimal(0),

        /* i = 6 */
        "runningSum(xy_6)": new Decimal(0),
        "runningSum(y_6)": new Decimal(0),
        "runningSum(y_6^2)": new Decimal(0),

        /* i = 7 */
        "runningSum(xy_7)": new Decimal(0),
        "runningSum(y_7)": new Decimal(0),
        "runningSum(y_7^2)": new Decimal(0),

        /* i = 8 */
        "runningSum(xy_8)": new Decimal(0),
        "runningSum(y_8)": new Decimal(0),
        "runningSum(y_8^2)": new Decimal(0),

        /* i = 9 */
        "runningSum(xy_9)": new Decimal(0),
        "runningSum(y_9)": new Decimal(0),
        "runningSum(y_9^2)": new Decimal(0),

        /* i = 10 */
        "runningSum(xy_10)": new Decimal(0),
        "runningSum(y_10)": new Decimal(0),
        "runningSum(y_10^2)": new Decimal(0),

        /* i = 11 */
        "runningSum(xy_11)": new Decimal(0),
        "runningSum(y_11)": new Decimal(0),
        "runningSum(y_11^2)": new Decimal(0),

        /* i = 12 */
        "runningSum(xy_12)": new Decimal(0),
        "runningSum(y_12)": new Decimal(0),
        "runningSum(y_12^2)": new Decimal(0),

        /* i = 13 */
        "runningSum(xy_13)": new Decimal(0),
        "runningSum(y_13)": new Decimal(0),
        "runningSum(y_13^2)": new Decimal(0),

        /* i = 14 */
        "runningSum(xy_14)": new Decimal(0),
        "runningSum(y_14)": new Decimal(0),
        "runningSum(y_14^2)": new Decimal(0),

        /* i = 15 */
        "runningSum(xy_15)": new Decimal(0),
        "runningSum(y_15)": new Decimal(0),
        "runningSum(y_15^2)": new Decimal(0),

        /* i = 16 */
        "runningSum(xy_16)": new Decimal(0),
        "runningSum(y_16)": new Decimal(0),
        "runningSum(y_16^2)": new Decimal(0),

        /* i = 17 */
        "runningSum(xy_17)": new Decimal(0),
        "runningSum(y_17)": new Decimal(0),
        "runningSum(y_17^2)": new Decimal(0),

        /* i = 18 */
        "runningSum(xy_18)": new Decimal(0),
        "runningSum(y_18)": new Decimal(0),
        "runningSum(y_18^2)": new Decimal(0),
    };

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

                /* i = 0 */
                var y_0 = new Decimal(obj[0]);
                stats["runningSum(xy_0)"] = stats["runningSum(xy_0)"].plus(x.times(y_0));
                stats["runningSum(y_0)"] = stats["runningSum(y_0)"].plus(y_0);
                stats["runningSum(y_0^2)"] = stats["runningSum(y_0^2)"].plus(y_0.pow(2));

                /* i = 1 */
                var y_1 = new Decimal(obj[1]);
                stats["runningSum(xy_1)"] = stats["runningSum(xy_1)"].plus(x.times(y_1));
                stats["runningSum(y_1)"] = stats["runningSum(y_1)"].plus(y_1);
                stats["runningSum(y_1^2)"] = stats["runningSum(y_1^2)"].plus(y_1.pow(2));

                /* i = 2 */
                var y_2 = new Decimal(obj[2]);
                stats["runningSum(xy_2)"] = stats["runningSum(xy_2)"].plus(x.times(y_2));
                stats["runningSum(y_2)"] = stats["runningSum(y_2)"].plus(y_2);
                stats["runningSum(y_2^2)"] = stats["runningSum(y_2^2)"].plus(y_2.pow(2));

                /* i = 3 */
                var y_3 = new Decimal(obj[3]);
                stats["runningSum(xy_3)"] = stats["runningSum(xy_3)"].plus(x.times(y_3));
                stats["runningSum(y_3)"] = stats["runningSum(y_3)"].plus(y_3);
                stats["runningSum(y_3^2)"] = stats["runningSum(y_3^2)"].plus(y_3.pow(2));

                /* i = 4 */
                var y_4 = new Decimal(obj[4]);
                stats["runningSum(xy_4)"] = stats["runningSum(xy_4)"].plus(x.times(y_4));
                stats["runningSum(y_4)"] = stats["runningSum(y_4)"].plus(y_4);
                stats["runningSum(y_4^2)"] = stats["runningSum(y_4^2)"].plus(y_4.pow(2));

                /* i = 5 */
                var y_5 = new Decimal(obj[5]);
                stats["runningSum(xy_5)"] = stats["runningSum(xy_5)"].plus(x.times(y_5));
                stats["runningSum(y_5)"] = stats["runningSum(y_5)"].plus(y_5);
                stats["runningSum(y_5^2)"] = stats["runningSum(y_5^2)"].plus(y_5.pow(2));

                /* i = 6 */
                var y_6 = new Decimal(obj[6]);
                stats["runningSum(xy_6)"] = stats["runningSum(xy_6)"].plus(x.times(y_6));
                stats["runningSum(y_6)"] = stats["runningSum(y_6)"].plus(y_6);
                stats["runningSum(y_6^2)"] = stats["runningSum(y_6^2)"].plus(y_6.pow(2));

                /* i = 7 */
                var y_7 = new Decimal(obj[7]);
                stats["runningSum(xy_7)"] = stats["runningSum(xy_7)"].plus(x.times(y_7));
                stats["runningSum(y_7)"] = stats["runningSum(y_7)"].plus(y_7);
                stats["runningSum(y_7^2)"] = stats["runningSum(y_7^2)"].plus(y_7.pow(2));

                /* i = 8 */
                var y_8 = new Decimal(obj[8]);
                stats["runningSum(xy_8)"] = stats["runningSum(xy_8)"].plus(x.times(y_8));
                stats["runningSum(y_8)"] = stats["runningSum(y_8)"].plus(y_8);
                stats["runningSum(y_8^2)"] = stats["runningSum(y_8^2)"].plus(y_8.pow(2));

                /* i = 9 */
                var y_9 = new Decimal(obj[9]);
                stats["runningSum(xy_9)"] = stats["runningSum(xy_9)"].plus(x.times(y_9));
                stats["runningSum(y_9)"] = stats["runningSum(y_9)"].plus(y_9);
                stats["runningSum(y_9^2)"] = stats["runningSum(y_9^2)"].plus(y_9.pow(2));

                /* i = 10 */
                var y_10 = new Decimal(obj[10]);
                stats["runningSum(xy_10)"] = stats["runningSum(xy_10)"].plus(x.times(y_10));
                stats["runningSum(y_10)"] = stats["runningSum(y_10)"].plus(y_10);
                stats["runningSum(y_10^2)"] = stats["runningSum(y_10^2)"].plus(y_10.pow(2));

                /* i = 11 */
                var y_11 = new Decimal(obj[11]);
                stats["runningSum(xy_11)"] = stats["runningSum(xy_11)"].plus(x.times(y_11));
                stats["runningSum(y_11)"] = stats["runningSum(y_11)"].plus(y_11);
                stats["runningSum(y_11^2)"] = stats["runningSum(y_11^2)"].plus(y_11.pow(2));

                /* i = 12 */
                var y_12 = new Decimal(obj[12]);
                stats["runningSum(xy_12)"] = stats["runningSum(xy_12)"].plus(x.times(y_12));
                stats["runningSum(y_12)"] = stats["runningSum(y_12)"].plus(y_12);
                stats["runningSum(y_12^2)"] = stats["runningSum(y_12^2)"].plus(y_12.pow(2));

                /* i = 13 */
                var y_13 = new Decimal(obj[13]);
                stats["runningSum(xy_13)"] = stats["runningSum(xy_13)"].plus(x.times(y_13));
                stats["runningSum(y_13)"] = stats["runningSum(y_13)"].plus(y_13);
                stats["runningSum(y_13^2)"] = stats["runningSum(y_13^2)"].plus(y_13.pow(2));

                /* i = 14 */
                var y_14 = new Decimal(obj[14]);
                stats["runningSum(xy_14)"] = stats["runningSum(xy_14)"].plus(x.times(y_14));
                stats["runningSum(y_14)"] = stats["runningSum(y_14)"].plus(y_14);
                stats["runningSum(y_14^2)"] = stats["runningSum(y_14^2)"].plus(y_14.pow(2));

                /* i = 15 */
                var y_15 = new Decimal(obj[15]);
                stats["runningSum(xy_15)"] = stats["runningSum(xy_15)"].plus(x.times(y_15));
                stats["runningSum(y_15)"] = stats["runningSum(y_15)"].plus(y_15);
                stats["runningSum(y_15^2)"] = stats["runningSum(y_15^2)"].plus(y_15.pow(2));

                /* i = 16 */
                var y_16 = new Decimal(obj[16]);
                stats["runningSum(xy_16)"] = stats["runningSum(xy_16)"].plus(x.times(y_16));
                stats["runningSum(y_16)"] = stats["runningSum(y_16)"].plus(y_16);
                stats["runningSum(y_16^2)"] = stats["runningSum(y_16^2)"].plus(y_16.pow(2));

                /* i = 17 */
                var y_17 = new Decimal(obj[17]);
                stats["runningSum(xy_17)"] = stats["runningSum(xy_17)"].plus(x.times(y_17));
                stats["runningSum(y_17)"] = stats["runningSum(y_17)"].plus(y_17);
                stats["runningSum(y_17^2)"] = stats["runningSum(y_17^2)"].plus(y_17.pow(2));

                /* i = 18 */
                var y_18 = new Decimal(obj[18]);
                stats["runningSum(xy_18)"] = stats["runningSum(xy_18)"].plus(x.times(y_18));
                stats["runningSum(y_18)"] = stats["runningSum(y_18)"].plus(y_18);
                stats["runningSum(y_18^2)"] = stats["runningSum(y_18^2)"].plus(y_18.pow(2));
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
            return rXYnumerator.div(rXY_0_denominator).toFixed(3);
        }

        /* Update for last row in index */
        updateStats(currentLine);

        /* Work out correlation coefficients */
        var N = stats.n;

        /* i = 0 */
        var rXY_0 = getR(
            N,
            stats["runningSum(xy_0)"],
            stats["runningSum(x)"],
            stats["runningSum(y_0)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_0^2)"]
        );

        /* i = 1 */
        var rXY_1 = getR(
            N,
            stats["runningSum(xy_1)"],
            stats["runningSum(x)"],
            stats["runningSum(y_1)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_1^2)"]
        );

        /* i = 2 */
        var rXY_2 = getR(
            N,
            stats["runningSum(xy_2)"],
            stats["runningSum(x)"],
            stats["runningSum(y_2)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_2^2)"]
        );

        /* i = 3 */
        var rXY_3 = getR(
            N,
            stats["runningSum(xy_3)"],
            stats["runningSum(x)"],
            stats["runningSum(y_3)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_3^2)"]
        );

        /* i = 4 */
        var rXY_4 = getR(
            N,
            stats["runningSum(xy_4)"],
            stats["runningSum(x)"],
            stats["runningSum(y_4)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_4^2)"]
        );

        /* i = 5 */
        var rXY_5 = getR(
            N,
            stats["runningSum(xy_5)"],
            stats["runningSum(x)"],
            stats["runningSum(y_5)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_5^2)"]
        );

        /* i = 6 */
        var rXY_6 = getR(
            N,
            stats["runningSum(xy_6)"],
            stats["runningSum(x)"],
            stats["runningSum(y_6)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_6^2)"]
        );

        /* i = 7 */
        var rXY_7 = getR(
            N,
            stats["runningSum(xy_7)"],
            stats["runningSum(x)"],
            stats["runningSum(y_7)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_7^2)"]
        );

        /* i = 8 */
        var rXY_8 = getR(
            N,
            stats["runningSum(xy_8)"],
            stats["runningSum(x)"],
            stats["runningSum(y_8)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_8^2)"]
        );

        /* i = 9 */
        var rXY_9 = getR(
            N,
            stats["runningSum(xy_9)"],
            stats["runningSum(x)"],
            stats["runningSum(y_9)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_9^2)"]
        );

        /* i = 10 */
        var rXY_10 = getR(
            N,
            stats["runningSum(xy_10)"],
            stats["runningSum(x)"],
            stats["runningSum(y_10)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_10^2)"]
        );

        /* i = 11 */
        var rXY_11 = getR(
            N,
            stats["runningSum(xy_11)"],
            stats["runningSum(x)"],
            stats["runningSum(y_11)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_11^2)"]
        );

        /* i = 12 */
        var rXY_12 = getR(
            N,
            stats["runningSum(xy_12)"],
            stats["runningSum(x)"],
            stats["runningSum(y_12)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_12^2)"]
        );

        /* i = 13 */
        var rXY_13 = getR(
            N,
            stats["runningSum(xy_13)"],
            stats["runningSum(x)"],
            stats["runningSum(y_13)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_13^2)"]
        );

        /* i = 14 */
        var rXY_14 = getR(
            N,
            stats["runningSum(xy_14)"],
            stats["runningSum(x)"],
            stats["runningSum(y_14)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_14^2)"]
        );

        /* i = 15 */
        var rXY_15 = getR(
            N,
            stats["runningSum(xy_15)"],
            stats["runningSum(x)"],
            stats["runningSum(y_15)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_15^2)"]
        );

        /* i = 16 */
        var rXY_16 = getR(
            N,
            stats["runningSum(xy_16)"],
            stats["runningSum(x)"],
            stats["runningSum(y_16)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_16^2)"]
        );

        /* i = 17 */
        var rXY_17 = getR(
            N,
            stats["runningSum(xy_17)"],
            stats["runningSum(x)"],
            stats["runningSum(y_17)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_17^2)"]
        );

        /* i = 18 */
        var rXY_18 = getR(
            N,
            stats["runningSum(xy_18)"],
            stats["runningSum(x)"],
            stats["runningSum(y_18)"],
            stats["runningSum(x^2)"],
            stats["runningSum(y_18^2)"]
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
        </tr>\
        <tr>\
            <td>Avg Gr12 %</td>\
            <td style="text-align:center;">' + rXY_6 + '</td>\
        </tr>\
        <tr>\
            <td>Avg Gr12 % (Dbl Mth)</td>\
            <td style="text-align:center;">' + rXY_7 + '</td>\
        </tr>\
        <tr>\
            <td>Avg Gr12 % (Dbl Mth & Sci)</td>\
            <td style="text-align:center;">' + rXY_8 + '</td>\
        </tr>\
        <tr>\
            <td>Avg NBT %</td>\
            <td style="text-align:center;">' + rXY_9 + '</td>\
        </tr>\
        <tr>\
            <td>Avg NBT % (Dbl AL)</td>\
            <td style="text-align:center;">' + rXY_10 + '</td>\
        </tr>\
        <tr>\
            <td>Avg NBT % (Dbl QL)</td>\
            <td style="text-align:center;">' + rXY_11 + '</td>\
        </tr>\
        <tr>\
            <td>Avg NBT % (Dbl Mth)</td>\
            <td style="text-align:center;">' + rXY_12 + '</td>\
        </tr>\
        <tr>\
            <td>Avg NBT % (Dbl AL/QL)</td>\
            <td style="text-align:center;">' + rXY_13 + '</td>\
        </tr>\
        <tr>\
            <td>Avg NBT % (Dbl AL/Mth)</td>\
            <td style="text-align:center;">' + rXY_14 + '</td>\
        </tr>\
        <tr>\
            <td>Avg NBT % (Dbl QL/Mth)</td>\
            <td style="text-align:center;">' + rXY_15 + '</td>\
        </tr>\
        <tr>\
            <td>Avg Gr12 & NBT</td>\
            <td style="text-align:center;">' + rXY_16 + '</td>\
        </tr>\
        <tr>\
            <td>Avg Gr12 & NBT (Dbl Gr12 Mth)</td>\
            <td style="text-align:center;">' + rXY_17 + '</td>\
        </tr>\
        <tr>\
            <td>Avg Gr12 & NBT (Dbl Gr12 Mth & Sci)</td>\
            <td style="text-align:center;">' + rXY_18 + '</td>\
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