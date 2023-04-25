#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <Adafruit_SSD1306.h>

// Replace with your network credentials
const char* ssid = "Reload";
const char* password = "";

// Replace with the URL of your website
const char* serverName = "https://polle-pz2uos77k-rasben.vercel.app/api/vote";

#define OLED_RESET 0
Adafruit_SSD1306 display(OLED_RESET);

void setup() {
  display.begin(SSD1306_SWITCHCAPVCC, 128, 32);

  Serial.begin(9600);
  pinMode(1, INPUT_PULLUP);
  pinMode(2, INPUT_PULLUP);
  pinMode(3, INPUT_PULLUP);
  pinMode(4, INPUT_PULLUP);
  pinMode(5, INPUT_PULLUP);

  WiFi.begin(ssid, password);
  display.println("WiFi connect..");
  display.display();

  while (WiFi.status() != WL_CONNECTED) {
    display.clearDisplay();
    display.println("WiFi connect.. !");
    display.display();

    delay(1000);

    display.clearDisplay();
    display.println("WiFi connect.. _");
    display.display();
  }

  display.clearDisplay();
  display.println("WiFi OK");
  display.display();
}

void loop() {
  if (digitalRead(1) == LOW) {
    sendPostRequest(1);
  }
  if (digitalRead(2) == LOW) {
    sendPostRequest(2);
  }
  if (digitalRead(3) == LOW) {
    sendPostRequest(3);
  }
  if (digitalRead(4) == LOW) {
    sendPostRequest(4);
  }
  if (digitalRead(5) == LOW) {
    sendPostRequest(5);
  }
}

void sendPostRequest(int value) {
  display.clearDisplay();
  display.println("Voted:");
  display.println(String(value));
  display.display();

  WiFiClient client;
  HTTPClient http;

  // Add header content
  http.begin(client, serverName);
  http.addHeader("Content-Type", "application/json");

  // Add request body
  String requestBody = "{\"pollID\":\"lunch\", \"value\": " + String(value) + "}";
  int httpResponseCode = http.POST(requestBody);

  if (httpResponseCode > 0) {
    String response = http.getString();
    display.clearDisplay();
    display.println("HTTP Response:");
    display.println(String(httpResponseCode));
    display.display();
  } else {
    display.clearDisplay();
    display.println("HTTP FAIL");
    display.display();
  }

  http.end();
}
