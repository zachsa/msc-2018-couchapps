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
            <table style="width:40%;margin:auto;">\
                <thead>\
                    <tr>\
                        <th style="width:50%;">Benchmark Measurement</th>\
                        <th style="width:25%;">Variance</th>\
                        <th style="width:25%;">Std Deviation</th>\
                    </tr>\
                </thead>\
                <tbody>';

        /* Add variance and Std Deviation to HTML */
        data.forEach(function(item, i, arr) {
            var header = headers[i];
            var sampleVariance = 0;
            var stdDev = 0;
            if (i >= 0) {
                var sum = item.sum;
                var count = item.count;
                var sumSqr = new Decimal(item.sumsqr);
                var mean = ((new Decimal(sum)).div((new Decimal(count))));
                var meanSqr = mean.pow(2);
                var sTemp = sumSqr.div(new Decimal(count - 1));
                sampleVariance = sTemp.minus(meanSqr);
                stdDev = sampleVariance.sqrt();
            };

            var row = '\
            <tr>\
                <td>' + header + '</td>\
                <td style="text-align:center;">' + ((sampleVariance === 0) ? '-' : sampleVariance.toFixed(1)) + '</td>\
                <td style="text-align:center;">' + ((stdDev === 0) ? '-' : stdDev.toFixed(1)) + '</td>\
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