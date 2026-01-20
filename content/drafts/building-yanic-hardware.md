---
title: Building YANIC - Hardware
draft: true
---

YANIC (short for Yet Another NIxie Clock) is a clock based around Nixie tubes. As we will see, it's actually much more than a simple clock. YANIC features a clock, motion sensor, two loadspeakers, temperature and humidity sensor and a wake-up light light. It is also internet-connected, so it can stream music and be tied to a digital calendar. 

First I will give an overview of the final hardware and then discuss the design process. 

Features: 

* Capacitive touch buttons, [example](https://www.adafruit.com/product/1374) [AN](http://ww1.microchip.com/downloads/en/AppNotes/01298A.pdf)
* microcontroller: http://www.microchip.com/wwwproducts/en/ATXMEGA16A4U (why? 16 cap touch pins, low power, enough memory and EEPROM, USB and DMA, ADC/DAC, RTC!!
* A/B power amplifier for audio: [2 channel amp](http://www.st.com/content/ccc/resource/technical/document/datasheet/01/3e/00/03/cd/f5/4f/e7/CD00022675.pdf/files/CD00022675.pdf/jcr:content/translations/en.CD00022675.pdf)
* Humidity + Temperature sensor [HDC1080DMBR](http://www.mouser.be/ProductDetail/Texas-Instruments/HDC1080DMBR/?qs=sGAEpiMZZMvt1VFuCspEMoKaiDcGzdlwPI84WwsUYd8%3d)
* PIR motion sensor [EKMC1693111](http://www.mouser.be/ProductDetail/Panasonic/EKMC1693111/?qs=sGAEpiMZZMu5vlrqIFXt5c38yvySChho0EeJMJD6UDrY54FvoogvuQ%3d%3d)
* standalone temperature sensor [MCP9808](http://www.microchip.com/wwwproducts/en/MCP9808)
* wake-up RGBW LEDs: [SK6812](https://www.aliexpress.com/item/10-1000pcs-SK6812-RGBW-RGB-Warm-White-5050-SMD-similar-with-WS2812B-Individually-Addressable-Digital-LED/32549663471.html?spm=2114.01010208.3.34.IdWEnM&ws_ab_test=searchweb0_0,searchweb201602_4_10152_10065_10151_10068_10136_10137_10157_10060_10138_10155_10062_10156_437_10154_5010020_10056_10055_10054_10059_303_100031_10099_9912_10103_10102_10096_10147_10052_10053_10142_10107_10050_10051_10084_10083_10080_10082_10081_10177_10110_519_10111_10112_10113_10114_10037_10182_5020020_10185_10032_10078_10079_10077_10073_10123_142-9912,searchweb201603_9,ppcSwitch_5&btsid=eed93434-91a0-42f1-87b2-a77b5858c637&algo_expid=867d88ba-8b36-4e37-860e-6e8a93a2c664-4&algo_pvid=867d88ba-8b36-4e37-860e-6e8a93a2c664)
* Cheap audio DAC [UDA1334ATS](http://cache.nxp.com/documents/data_sheet/UDA1334ATS.pdf)
* Expansive audio DAC [AD1852](http://www.analog.com/en/products/audio-video/audio-da-converters/ad1852.html#product-overview)

* BJT high current transistor: [MMBTA42LT3G](http://www.mouser.be/ProductDetail/ON-Semiconductor/MMBTA42LT3G/?qs=sGAEpiMZZMshyDBzk1%2fWi%2fPUgtclNldlky%252bqBC8cNf8%3d)
* shift register [MC74HC595ADR2G](http://www.mouser.be/ProductDetail/ON-Semiconductor/MC74HC595ADR2G/?qs=sGAEpiMZZMtqO%252bWUGLBzeLXFnahsuUh5)
* switching controller (up-converter): [TPS40210DGQ](http://www.mouser.be/ProductDetail/Texas-Instruments/TPS40210DGQ/?qs=sGAEpiMZZMvFgFrcgbsedQWV2J5nQalo7IO%2f6gxQtSQ%3d)
* Switching Voltage Regulators 3V-17V 1A Step-Down Converter (step-down) [TPS62160DGKR](http://www.mouser.be/ProductDetail/Texas-Instruments/TPS62160DGKR/?qs=sGAEpiMZZMtitjHzVIkrqeIeT8EEVoubVLupbLHTH48%3d)
* special mosfet for power supply [IRFH5025TRPBF](http://www.mouser.be/Search/ProductDetail.aspx?qs=Z8%252beY1k3TIKGfIHHG3T1UA%3d%3d)
* LDO [LM1117IMPX-3.3/NOPB](http://www.mouser.be/ProductDetail/Texas-Instruments/LM1117IMPX-33-NOPB/?qs=sGAEpiMZZMvu8NZDyZ4K0YxjC1jVOToG)
* rectifier diode [ES2G](http://www.mouser.be/ProductDetail/Taiwan-Semiconductor/ES2G/?qs=sGAEpiMZZMvAvBNgSS9Lqk%252bYqdMtsIaa)