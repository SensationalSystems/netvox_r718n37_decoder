/* 
 * Decoder function for The Things Network to unpack the payload of the Netvox 3-phase current monitor
 *
 * This function was created by Cameron Sharp at Sensational Systems - cameron@sensational.systems
 */

var bcd2number = function(bcd) {
    var n = 0;
    var m = 1;
    for(var i = 0; i<bcd.length; i+=1) {
        n += (bcd[bcd.length-1-i] & 0x0F) * m;
        n += ((bcd[bcd.length-1-i]>>4) & 0x0F) * m * 10;
        m *= 100;
    }
    return n;
}

function Decoder(bytes, port) {

    var params = {
        "bytes": bytes
    }

    // Handle current measurement
    if (bytes[2] === 0x01) {
        params.protocol_version = bytes[0]
        params.report_type = bytes[2]
        params.battery = bytes[3] / 10
        params.current1 = (bytes[4] << 8 | bytes[5])
        params.current2 = (bytes[6] << 8 | bytes[7])
        params.current3 = (bytes[8] << 8 | bytes[9])
    }

    // Handle startup message
    if (bytes[2] === 0x00) {
        params.protocol_version = bytes[0]
        params.report_type = bytes[2]
        params.software_version = bytes[3]
        params.hardware_version = bytes[4]
        params.firmware_date = bcd2number(bytes.slice(5,9))
    }

    return params

}
