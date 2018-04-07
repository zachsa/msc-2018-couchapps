function(head, req) {
    /* Load the Decimal library */
    var Decimal = require("views/lib/decimal");

    provides('html', function() {
        /* Send the headers */
        var headers = "Gr12 Eng %,Gr12 Sci %,Gr12 Mth %,NBT AL %,NBT QL %, NBT Mth %,Avg Gr12 %,Avg Gr12 % (Dbl Mth),Avg Gr12 % (Dbl Mth & Sci),Avg NBT %,Avg NBT % (Dbl AL),Avg NBT % (Dbl QL),Avg NBT % (Dbl Mth),Avg NBT % (Dbl AL/QL),Avg NBT % (Dbl AL/Mth),Avg NBT % (Dbl QL/Mth),Avg Gr12 & NBT,Avg Gr12 & NBT (Dbl Gr12 Mth),Avg Gr12 & NBT (Dbl Gr12 Mth & Sci)".split(',');

        // Get row value (key is not required)
        var result = getRow();
        var value = result.value;

        /* line indices correspond to headers */
        var data = [];
        data.push(value[0]);
        data.push(value[1]);
        data.push(value[2]);
        data.push(value[3]);
        data.push(value[4]);
        data.push(value[5]);
        data.push(value[6]);
        data.push(value[7]);
        data.push(value[8]);
        data.push(value[9]);
        data.push(value[10]);
        data.push(value[11]);
        data.push(value[12]);
        data.push(value[13]);
        data.push(value[14]);
        data.push(value[15]);
        data.push(value[16]);
        data.push(value[17]);
        data.push(value[18]);

        /* HTML start */
        var html = '\
        <!DOCTYPE html>\
        <html>\
        <head>\
            <title>Variance &amp; Std Deviation Analysis</title>\
        </head>\
        <body>\
            <table style="width:100%;margin:auto;">\
                <thead>\
                    <tr>\
                        <th style="width:50%;">Benchmark Measurement</th>\
                        <th style="width:10%;">Variance</th>\
                        <th style="width:10%;">Std Deviation</th>\
                        <th style="width:10%;">sum</th>\
                        <th style="width:10%;">count</th>\
                        <th style="width:10%;">sumsqr</th>\
                    </tr>\
                </thead>\
                <tbody>';

        /* Add variance and Std Deviation to HTML */
        data.forEach(function(item, i, arr) {
            var header = headers[i];
            var sum = new Decimal(item.sum);
            var count = new Decimal(item.count);
            var sumsqr = new Decimal(item.sumsqr);
            var sqrsum = new Decimal(sum.pow(2));
            var top = new Decimal(sqrsum.minus(new Decimal(sqrsum.div(count))));
            var sampleVariance = top.div(count - 1);
            var stdDev = new Decimal(sampleVariance).sqrt();

            // var sum = item.sum;
            // var count = item.count;
            // var sumsqr = item.sumsqr;
            // var sqrsum = Math.pow(sum, 2)
            // var top = sumsqr - (sqrsum / count);
            // var sampleVariance = top / (count - 1);
            // var stdDev = Math.sqrt(sampleVariance);

            var row = '\
            <tr>\
                <td>' + header + '</td>\
                <td style="text-align:center;">' + sampleVariance.toFixed(1) + '</td>\
                <td style="text-align:center;">' + stdDev.toFixed(1) + '</td>\
                <td style="text-align:center;">' + sum.toFixed(0) + '</td>\
                <td style="text-align:center;">' + count.toFixed(0) + '</td>\
                <td style="text-align:center;">' + sumsqr.toFixed(0) + '</td>\
            </tr>';
            html += row;
        });

        /* Close HTML */
        html += '\
                </tbody>\
                <tfoot></tfoot>\
            </table>\
        </body>\
        </html>';

        /* Send HTML */
        send(html);
    });
};