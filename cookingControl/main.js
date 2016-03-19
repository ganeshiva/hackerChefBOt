var mraa = require('mraa'); //require mraa
console.log('MRAA Version: ' + mraa.getVersion()); //write the mraa version to the console
console.log("Code deployed.. HackerChefBot Activated");
// change this to false to use the hand rolled version
var useUpmVersion = true;

//GROVE Kit A0 Connector --> Aio(0)
var myAnalogPin = new mraa.Aio(0);
var B = 3975;

var lcd = require('jsupm_i2clcd');
var display = new lcd.Jhd1313m1(0, 0x3E, 0x62);
var LCD_DISPLAY_INTERVAL    = 2000;
var PUSH_BUTTON_INTERVAL    = 200; // ms
var sleepInterval = 5000; // 5 seconds

var LOAD_ROTATION_INTERVAL      = 1000; //ms
var UNLOAD_ROTATION_INTERVAL    = 1200; //ms
var OIL_PUMP_INTERVAL           = 5*1000;
var FLOUR_PUMP_INTERVAL         = 6*1000;
var FLOUR_MOTOR_INTERVAL        = 10*1000;
var DELIVERY_MOTOR_INTERVAL     = 2*1000;
var COOKING_INTERVAL            = 10 * 1000; //50 Seconds


// Declare Array 
var displayColor                = [];
var digitalPins                 = [];


var INCREASE_TEMP_BUTTON        = 1;

// PIN Connection Mapping
var POWER_BUTTON    = 0;
var INCREASE_TEMP   = 7;
var DECREASE_TEMP   = 2;
var FLOUR_PUMP      = 3;
var OIL_PUMP        = 4;
var APPLICATOR_MOTOR =1;
var BUZZER          = 6;
var DELIVERY_MOTOR  = 9;
var MOTOR_DIRECTION = 5;
var FLAVOUR_PUMP    = 8;


var MANUAL_OVERRIDE = 12;

var INDUCTION_CURRENT_STATE         = 0;
var DECREASE_TEMP_STATE             = 0;
var INCREASE_TEMP_STATE             = 0;
var APPLICATOR_CURRENT_STATE        = 0;
var OIL_PUMP_CURRENT_STATE          = 0;
var FLOUR_PUMP_CURRENT_STATE        = 0;
var DELIVERY_MOTOR_CURRENT_STATE    = 0;
var MOTOR_DIRECTION_CURRENT_STATE   = 0;
var FLAVOUR_PUMP_CURRENT_STATE      = 0;


// Initialing GPIO pins to OUTPUT
for(var i = 0; i <= 13 ; i++) {
    digitalPins[i] = new mraa.Gpio(i);
    digitalPins[i].dir(mraa.DIR_OUT); //set the gpio direction to OUTPUT
}

function resetDisplay() {
display.setColor(0,0,0)
display.setCursor(0,0);
display.write('<Refreshing..!!>');
display.setCursor(1,0);
display.write('*****************');
sleep(500)
display.setCursor(0,0);
display.write("                ");
display.setCursor(1,0);
display.write("                ");
}

function printToLcd(line1,line2, displayColor) {

if (displayColor=="RED") {
display.setColor(255,0,0);
} 
if (displayColor=="GREEN") {
display.setColor(0,255,0);
}
if (displayColor=="BLUE") {
display.setColor(0,0,255);
}
if (displayColor=="YELLOW") {
display.setColor(255,255,0);
}
if (displayColor=="BLACK") {
display.setColor(0,0,255);
}
if (displayColor=="MAGENTA") {
display.setColor(255,0,255);
}
if (displayColor=="TEAL") {
display.setColor(0,128,128);
}
if (displayColor=="OLIVE") {
display.setColor(128,128,0);
}
if (displayColor=="INDIAN_RED") {
display.setColor(205,92,92);
}
if (displayColor=="SILVER") {
display.setColor(192,192,192);
}
if (displayColor=="AQUA") {
display.setColor(0,255,255);
}
if (displayColor=="CHOCOLATE") {
display.setColor(210,105,30);
}
if (displayColor=="ORANGE") {
display.setColor(255,165,0);
}
if (displayColor=="PINK") {
display.setColor(255,105,180);
}
if (displayColor=="PINK") {
display.setColor(255,105,180);
}
    
display.setCursor(0,0);
display.write("                ");
display.setCursor(1,0);
display.write("                ");
display.setCursor(0,0);
display.write(line1);
display.setCursor(1,0);
display.write(line2);
}


function switchONPin(pinId) {
    digitalPins[pinId].write(1);
}

function switchOFFPin(pinId) {
    digitalPins[pinId].write(0);
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function resetAllPins() {
    for(var pinId = 0; pinId <= 13 ; pinId++) {
    digitalPins[pinId].write(0);
    }
}

function pushButton(BUTTON) {
    switchONPin(BUTTON);    // PUSH $BUTTON to ON STATE
    sleep(PUSH_BUTTON_INTERVAL);
    switchOFFPin(BUTTON);   // PUSH $BUTTON to OFF STATE
}

function inductionOff() {
    if (INDUCTION_CURRENT_STATE!=0) {
        pushButton(POWER_BUTTON);
        INDUCTION_CURRENT_STATE = 0;
        console.log("InductionOff: Current State "+INDUCTION_CURRENT_STATE);
    }
}

function inductionOn() {
    if (INDUCTION_CURRENT_STATE!=1) {
        pushButton(POWER_BUTTON);
        INDUCTION_CURRENT_STATE = 1;
         console.log("InductionOn: Current State "+INDUCTION_CURRENT_STATE);
    }
}

function decreaseTemp() {
    if (DECREASE_TEMP_STATE!=1) {
        pushButton(DECREASE_TEMP);
        DECREASE_TEMP_STATE = 1;
         console.log("decreaseTemp: Current State "+DECREASE_TEMP_STATE);
    }
}

function increaseTemp() {
    if (INCREASE_TEMP_STATE!=1) {
        pushButton(INCREASE_TEMP);
        INCREASE_TEMP_STATE = 1;
         console.log("increaseTemp: Current State "+INCREASE_TEMP_STATE);
    }
}

function startApplicatorRotation() {
     if (APPLICATOR_CURRENT_STATE!=1) {
          switchONPin(APPLICATOR_MOTOR);    // PUSH $BUTTON to ON STATE
          console.log("startApplicatorRotation: Current State "+APPLICATOR_CURRENT_STATE);
         APPLICATOR_CURRENT_STATE = 1;
     }
}

function stopApplicatorRotation() {
     if (APPLICATOR_CURRENT_STATE!=0) {
          switchOFFPin(APPLICATOR_MOTOR);    // PUSH $BUTTON to OFF STATE
          console.log("startApplicatorRotation: Current State "+APPLICATOR_CURRENT_STATE);
          APPLICATOR_CURRENT_STATE = 0;
     }
}

function startFlourPump() {
     if (FLOUR_PUMP_CURRENT_STATE!=1) {
          switchONPin(FLOUR_PUMP);    // PUSH $BUTTON to ON STATE
          console.log("startFlourPump: Current State "+FLOUR_PUMP_CURRENT_STATE);
         FLOUR_PUMP_CURRENT_STATE = 1;
     }
}

function stopFlourPump() {
     if (FLOUR_PUMP_CURRENT_STATE!=0) {
          switchOFFPin(FLOUR_PUMP);    // PUSH $BUTTON to OFF STATE
          console.log("stopFlourPump: Current State "+FLOUR_PUMP_CURRENT_STATE);
         FLOUR_PUMP_CURRENT_STATE =0;
     }
}

function startOilPump() {
     if (OIL_PUMP_CURRENT_STATE!=1) {
          switchONPin(OIL_PUMP);    // PUSH $BUTTON to ON STATE
          console.log("startOilPump: Current State "+OIL_PUMP_CURRENT_STATE);
          OIL_PUMP_CURRENT_STATE = 1;
     }
}

function stopOilPump() {
     if (OIL_PUMP_CURRENT_STATE!=0) {
          switchOFFPin(OIL_PUMP);    // PUSH $BUTTON to OFF STATE
          console.log("startOilPump: Current State "+OIL_PUMP_CURRENT_STATE);
          OIL_PUMP_CURRENT_STATE = 0;
     }
}

function forwardDeliveryMotor() {
     if (DELIVERY_MOTOR_CURRENT_STATE!=1) {
          switchONPin(DELIVERY_MOTOR);    // PUSH $BUTTON to OFF STATE
          console.log("forwardDeliveryMotor: Delivery Motor Current State "+DELIVERY_MOTOR_CURRENT_STATE);
         DELIVERY_MOTOR_CURRENT_STATE = 1;
     }
    if (MOTOR_DIRECTION_CURRENT_STATE!=0) {
            switchOFFPin(MOTOR_DIRECTION);    // PUSH $BUTTON to OFF STATE
            console.log("forwardDeliveryMotor: MotoDirection Current State "+MOTOR_DIRECTION_CURRENT_STATE);
            MOTOR_DIRECTION_CURRENT_STATE = 0;
    }
    // direction 0, deliverymotor 1
}

function reverseDeliveryMotor() {
     if (DELIVERY_MOTOR_CURRENT_STATE!=1) {
          switchONPin(DELIVERY_MOTOR);    // PUSH $BUTTON to OFF STATE
          console.log("forwardDeliveryMotor: Delivery Motor Current State "+DELIVERY_MOTOR_CURRENT_STATE);
         
     }
    if (MOTOR_DIRECTION_CURRENT_STATE!=1) {
            switchONPin(MOTOR_DIRECTION);    // PUSH $BUTTON to OFF STATE
            console.log("forwardDeliveryMotor: MotoDirection Current State "+MOTOR_DIRECTION_CURRENT_STATE);
         }
    // direction 1, deliverymotor 1
}

function stopDeliveryMotor() {
     if (DELIVERY_MOTOR_CURRENT_STATE!=0) {
          switchOFFPin(DELIVERY_MOTOR);    // PUSH $BUTTON to OFF STATE
          console.log("stopDeliveryMotor: Delivery Motor Current State "+DELIVERY_MOTOR_CURRENT_STATE);
         
     }
    if (MOTOR_DIRECTION_CURRENT_STATE!=0) {
            switchOFFPin(MOTOR_DIRECTION);    // PUSH $BUTTON to OFF STATE
            console.log("stopDeliveryMotor: MotoDirection Current State "+MOTOR_DIRECTION_CURRENT_STATE);
    }
    // direction 0, deliverymotor 0
}

function readTemperature() {
var a = myAnalogPin.read();
console.log("Analog Pin (A0) Output: " + a);
var resistance = (1023 - a) * 10000 / a; //get the resistance of the sensor;
//console.log("Resistance: "+resistance);
var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15;//convert to temperature via datasheet ;
console.log("Celsius Temperature "+celsius_temperature); 
printToLcd("Temparature: ","------->>> "+Math.floor(celsius_temperature)+ "*C" , "OLIVE")
//return $celsius_temperature
}

function beep(interval) {
for(var i = 1000; i <= interval ; i=i+1000) {
    pushButton(BUZZER);
    sleep(1000);
}

}


// Start of the Program.

//Create Socket.io server
var http = require('http');
var app = http.createServer(function (req, res) {
    'use strict';
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('<h1>Hello world from Intel IoT platform!</h1>');
}).listen(1337);
var io = require('socket.io')(app);

//Attach a 'connection' event handler to the server
io.on('connection', function (socket) {
    'use strict';
    console.log('a user connected');
    //Emits an event along with a message
    socket.emit('connected', 'Welcome');
    
    // Invoke Cooking
    cook();
    
    socket.emit("message", 200);
    //Attach a 'disconnect' event handler to the socket
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});


function test() {
    resetDisplay();
    printToLcd("Welcome","to H@ckerChefBOt!!","GREEN");
    sleep(3000);
    
  

    // Resetting all Ports
    resetAllPins();
    resetDisplay();
    
}











function cook() {
beep(1000);
resetDisplay();
printToLcd("Welcome","to H@ckerChefBOt!!","TEAL");
sleep(2000);
resetDisplay();
printToLcd("Here we >>>","     Go...!!","GREEN");
sleep(2000);
//Initalise, RESET all PINs to Zero
resetAllPins();
console.log("/**************  Reset All Ports  **************/");
resetDisplay();
printToLcd("Resetting","   All Ports!!","BLUE");
sleep(LCD_DISPLAY_INTERVAL);

//Start Induction
inductionOn();
startApplicatorRotation();
console.log("/**************  Start Induction and Applicator Rotation  **************/");
resetDisplay();
printToLcd("Started","Induction,Applicator","AQUA");
sleep(LCD_DISPLAY_INTERVAL);
    
//Pour Oil
startOilPump();
console.log("/**************  Pouring Oil **************/");
resetDisplay();
printToLcd("Pouring....","        Oil","YELLOW");
sleep(OIL_PUMP_INTERVAL);
stopOilPump();
console.log("/**************  Stopping Oil **************/");
sleep(2000);


//Pour Flour
startFlourPump();
console.log("/**************  Pouring Flour **************/");
resetDisplay();
printToLcd("Pouring....","       Flour","ORANGE");
sleep(FLOUR_PUMP_INTERVAL);
stopFlourPump();
console.log("/**************  Stopping Flour **************/");



// Stop Applicator Motor
stopApplicatorRotation();
console.log("/**************  Stop Applicator Rotation **************/");
resetDisplay();
printToLcd("Stopping...","    Applicator","INDIAN_RED");
sleep(LCD_DISPLAY_INTERVAL);


console.log("/**************  Waiting for Cooking to Complete "+ COOKING_INTERVAL +"(s) **************/");
// Wait for the Cooking to Complete
resetDisplay();
printToLcd("Cooking..... ","Est Time: " + COOKING_INTERVAL/1000 +" sec" ,"SILVER");

intervalCount = COOKING_INTERVAL /5000 ;
for(var i = 1000; i <= COOKING_INTERVAL ; i=i+1000) {
readTemperature();
    sleep(1000);
//    if (currentTemp >= SET_MAX_TEMP) {
//        count = count + 1;
//        if (count>=intervalCount){
//        decreaseTemp();
//            printToLcd("Increasing... ", currentTemp,"YELLOW")
//        } else {
//        increaseTemp();
//        }
//    }
    
}

//Pour Oil
resetDisplay();
printToLcd("Sprinking.... ","        Oil...","PINK");
startOilPump();
console.log("/**************  Pouring Oil **************/");
sleep(OIL_PUMP_INTERVAL);
stopOilPump();
console.log("/**************  Stopping Oil **************/");
sleep(2000);

resetDisplay();
printToLcd("Preparing...","   to Deliver","OLIVE");
    
// Deliver Food Forward
forwardDeliveryMotor();
console.log("/**************  Delivery Food Forward **************/");
sleep(DELIVERY_MOTOR_INTERVAL);


// Deliver Food Reverse
reverseDeliveryMotor();
console.log("/**************  Delivery Food Reverse **************/");
sleep(DELIVERY_MOTOR_INTERVAL);

console.log("/**************  Stop Delivery **************/");
resetDisplay();
printToLcd("Enjoy...","   your Meal:-)","GREEN");
stopDeliveryMotor();
beep(3000);
sleep(5000);
    
 // Resetting all Ports
    resetAllPins();
    resetDisplay();
}







//function beepOnce() {
//switchONPin(0);
//sleep(1000);
//switchOFFPin(0);
//sleep(500);
//}

function beepOnce() {
// Drive the Grive RGB LCD (a JHD1313m1)
// We can do this in either of two ways
//
// The bext way is to use the upm library. which
// contains support for this device
//
// The alternative way is to drive the LCD directly from
// Javascript code using the i2c interface directly
// This approach is useful for learning about using
// the i2c bus. The lcd file is an implementation
// in Javascript for some of the common LCD functions

// configure jshint
/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */


var version = mraa.getVersion();

if (version >= 'v0.6.1') {
    console.log('mraa version (' + version + ') ok');
}
else {
    console.log('meaa version(' + version + ') is old - this code may not work');
}

if (useUpmVersion) {
    useUpm();
}
else {
    useLcd();
}

/**
 * Rotate through a color pallette and display the
 * color of the background as text
 */
function rotateColors(display) {
    var red = 0;
    var green = 0;
    var blue = 0;
    display.setColor(red, green, blue);
    setInterval(function() {
        blue += 64;
        if (blue > 255) {
            blue = 0;
            green += 64;
            if (green > 255) {
                green = 0;
                red += 64;
                if (red > 255) {
                    red = 0;
                }
            }
        }
        display.setColor(red, green, blue);
        display.setCursor(0,0);
        display.write('red=' + red + ' grn=' + green + '  ');
        display.setCursor(1,0);
        display.write('blue=' + blue + '   ');  // extra padding clears out previous text
    }, 1000);
}

/**
 * Use the upm library to drive the two line display
 *
 * Note that this does not use the "lcd.js" code at all
 */
function useUpm() {
    var lcd = require('jsupm_i2clcd');
    var display = new lcd.Jhd1313m1(0, 0x3E, 0x62);
    display.setCursor(0, 0);
    display.write('Let GO!!');
    switchONPin(0);
    sleep(1000);
    //setInterval(function () {
        var a = myAnalogPin.read();
        console.log("Analog Pin (A0) Output: " + a);
        //console.log("Checking....");
        
        var resistance = (1023 - a) * 10000 / a; //get the resistance of the sensor;
        //console.log("Resistance: "+resistance);
        var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15;//convert to temperature via datasheet ;
        console.log("Celsius Temperature "+celsius_temperature); 
        var fahrenheit_temperature = (celsius_temperature * (9 / 5)) + 32;
        console.log("Fahrenheit Temperature: " + fahrenheit_temperature);
        display.setCursor(0, 0);
        display.write('Temp:'+ fahrenheit_temperature + '*F');
        //socket.emit("message", fahrenheit_temperature);
        sleep(2000);
        display.setCursor(0, 0);
         display.write("                ");
        display.setCursor(1, 0);
          display.write("                ");
    
    //}, 4000);
    switchOFFPin(0);
    sleep(500);
    display.setCursor(1,0);
    display.setColor(0,255,0)
    display.write('Happy Cooking');
    //rotateColors(display);
    sleep(2000);
        display.setCursor(0, 0);
         display.write("                ");
        display.setCursor(1, 0);
          display.write("                ");
}

/**
 * Use the hand rolled lcd.js code to do the
 * same thing as the previous code without the
 * upm library
 */
function useLcd() {
    var lcd = require('./lcd');
    var display = new lcd.LCD(0);

    display.setColor(0, 60, 255);
    display.setCursor(1, 1);
    display.write('hi there');
    display.setCursor(0,0);  
    display.write('more text');
    display.waitForQuiescent()
    .then(function() {
        rotateColors(display);
    })
    .fail(function(err) {
        console.log(err);
        display.clearError();
        rotateColors(display);
    });
}




}