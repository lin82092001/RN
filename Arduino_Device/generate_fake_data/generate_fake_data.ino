#include <SoftwareSerial.h>

#define HW_SERIAL_BAUD 9600
#define SW_SERIAL_BAUD 9600
#define PIN_RX 9
#define PIN_TX 8
#define MSG_HEADER  0xFE
#define MSG_REQUEST 0x01
#define MSG_END     0x0D
#define VALUE_PITCH_MIN 8
#define VALUE_PITCH_MAX 12

SoftwareSerial mySerial(PIN_RX, PIN_TX);

void setup() {
  Serial.begin(HW_SERIAL_BAUD);//for debug message
  mySerial.begin(SW_SERIAL_BAUD);//for bluetooth uart
  Serial.println("Ready");
}

void loop() {
  //wait user input
  if(mySerial.available()) {
    int inputByte = mySerial.read();
    Serial.print("receive data: ");
    Serial.println(inputByte);
    if(inputByte == MSG_REQUEST) {
      //is request, do response
      //1. init fake data
      int pitch_value = random(VALUE_PITCH_MIN, VALUE_PITCH_MAX);
    
      //2. send data (0xFE, data, ..., 0x0D)
      mySerial.print(MSG_HEADER);
      mySerial.print(pitch_value);
      mySerial.print(MSG_END);
      
      //3. print debug message
      Serial.print("pitch: ");
      Serial.println(pitch_value);
    }
  }
}
