**Steps to install xrpl nfc PoS console.**

//TODO fix socketio, fix touch screen, change chromium to chrome as appears to slow, cant be raspberry pi zero as over lan its fine, must be pi browser Chrome not work on zero and firefox not open???.

//COMMENT Current files running on PM2 in libnfc/utils to stop run pm2 delete 0 then pm2 save, then run sudo nano /etc/xdg/lxsession/LXDE-pi/autostart
//COMMENT then comment this line ----- `@chromium-browser --noerrdialogs --incognito --autoplay-policy=no-user-gesture-required --check-for-update-interval=1 --simulate-critical-update --kiosk http://localhost:3000`

//FIXME chromium on the pi zero is very slow, but remote login form anther browser its fine, so its not th enode server!!!!!! 

//COMMENT Found a temp solution for socket

//FIXME NFC REader not funticioning now, was being picked up before, sugest running in normal mode on pi and check console logs.
//COMMENT Upgraded to libnfc1.7.1 and copied all files across from the original mac in stall and works on raspian buster.

# Items required
* RPI Zero W or V1 but requries WAN USB adapter
* PN532 Adafruit
* 5in LCD touchsceen
* Raspberry PI Image
* 32gb micro SDcard
* Batery Pack
* Micro USB adapter
* HDMI cable
* FTDI cable USB
* Micro USB cable x 2

# Step 1
Burn RPI Image to SD card

Add ssh file and config. (leave file type blank)

Ammend Config.txt file to allow LCD sceen to work.
add the follwoing to config file.

_Add Code to file_
display_rotate
Landscape = 0
Portrait = 1

#--- Start LCD setup  ---
`hdmi_force_hotplug=1`
`max_usb_current=1`
`hdmi_drive=1`
`hdmi_group=2`
`hdmi_mode=1`
`hdmi_mode=87`
`hdmi_cvt 800 480 60 6 0 0 0`
`dtoverlay=ads7846,cs=1,penirq=25,penirq_pull=2,speed=50000,keep_vref_on=0,swapxy=0,pmax=255,xohms=150,xmin=200,xmax=3900,ymin=200,ymax=3900`
`display_rotate=1`
#--- End LCD setup  ---

UPdate!!!!!!!!! now running in landscape mode, need to adapt the readme to suie, currently only changed it but not written the method
# Step 2
Power on RPI.

SSH in to RPI

install Git

`sudo apt-get install git`

then clone

`git clone https://github.com/goodtft/LCD-show.git`

next run

`chmod -R 755 LCD-show`
`cd LCD-show/`
`sudo ./LCD5-show`

are screen should work now.

now we calibrate it.

`sudo apt-get install -y xinput-calibrator`

if required
Click the Menu button on the task bar, choose Preference -> Calibrate Touchscreen.

copy output form calibration and run

`sudo nano /ect/X11/xorg.conf.d/99-calibration.conf`

it may say file not exist but it does, you will hae to CD to the folder and `sudo nano 99-calibration.conf`

do this before running kiosk mode

if no USB keyboard to hand then install touchkeyboard. (need to remeber how i did this)

# custom boot screen
pipe image to RPI zero
 `scp asplash.jpg pi@IP ADDRESS:/home/pi/`

open conifg.text

`sudo nano /boot/config.txt`

Then add below line at the end of the file.

`disable_splash=1`
**Remove text message under splash image:**
Open “/usr/share/plymouth/themes/pix/pix.script” as root.

`sudo nano /usr/share/plymouth/themes/pix/pix.script`

Then, remove (or comment out) four lines below:

`message_sprite = Sprite();`
`message_sprite.SetPosition(screen_width * 0.1, screen_height * 0.9, 10000);`
       `my_image = Image.Text(text, 1, 1, 1);`
       `message_sprite.SetImage(my_image);`

change image file name form splash.png to asplash.png

`sudo reboot`

**Remove Boot Messages**
Open “/boot/cmdline.txt” as root.

`sudo nano /boot/cmdline.txt`

Then, replace “console=tty1” with “console=tty3”. This redirects boot messages to tty3.

add below at the end of the line

`splash quiet plymouth.ignore-serial-consoles logo.nologo vt.global_cursor_default=0`

**Replace Splash Image**

sudo cp ~/asplash.png /usr/share/plymouth/themes/pix/splash.png

# install Node & NPM

`wget https://unofficial-builds.nodejs.org/download/release/v14.13.0/node-v14.13.0-linux-armv6l.tar.xz`

cd to directory

`tar xvfJ node-v14.13.0-linux-armv6l.tar.xz`

Extract to usr/local

`sudo cp -R node-v14.13.0-linux-armv6l/* /usr/local`

remove zip file

`rm -rf node-*`

reboot

`sudo reboot`

pipe XummPoSConsole to pi home screen and install

`scp XummPoSConsole.zip pi@IP ADDRESS:/home/pi/`

**_XummPoSConsole needs dropping in to Libnfc at somepoint_**

do this before running in kiosk mode

# install libnfc
**step 1**
`cd /home/pi`
`mkdir libnfc`
`cd libnfc`
`wget https://github.com/nfc-tools/libnfc/releases/download/libnfc-1.7.0/libnfc-1.7.0.tar.bz2`
`tar -xvjf libnfc-1.7.0.tar.bz2`

**step 2**
run `sudo nano /etc/nfc/devices.d/pn532_uart_on_rpi.conf` to add a small file change

add

`allow_intrusive_scan = true`

**step 3 run config**

`sudo apt-get install autoconf`
`sudo apt-get install libtool`
`sudo apt-get install libpcsclite-dev libusb-dev`
`autoreconf -vis`
`./configure --with-drivers=pn532_uart --sysconfdir=/etc --prefix=/usr`

then run 

`sudo make clean`
`sudo make install all`

# install PM2 globally

`npm insatll -g pm2`

go to the  app in libnfc/utils directory and type `pm2 start ./bin/www` . If you need to see if it’s running, `type pm2 ls` . If you need to stop it, type `pm2 delete 0` or whichever thread number you want to delete.

next if not stopped or deleted run 

`pm2 startup`
then run 

`PM2 save`


**copy outputted code and paste into console and run**


# run in kiosk mode

Now we’ll make a couple system configuration changes:

`sudo nano /boot/config.txt`

and add

** Display orientation. Landscape = 0, Portrait = 1**
we should have already set to 1
`display_rotate=1`

**force screen to stay on**
run

`sudo nano /etc/xdg/lxsession/LXDE-pi/autostart`

and add

`@xset s off`
`@xset -dpms`
`@xset s 0 0`
`@xset s noblank`
`@xset s noexpose`
`@xset dpms 0 0 0`
`@chromium-browser --noerrdialogs --incognito --autoplay-policy=no-user-gesture-required --check-for-update-interval=1 --simulate-critical-update --kiosk http://localhost:3000`


if above file does not open try `/home/pi/.config/lxsession/LXDE-pi/autostart`

then `sudo reboot`


