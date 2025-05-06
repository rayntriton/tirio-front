# hacker-font

## Create a custom font for your daily hacks.
Things you gonna do:
- Edit a ``.svg``` for every char you need ( maybe ```inkscape``` ).
- Edit ```metadata.json```.
- Autogenerate your .ttf ( ```../bin/hacker-font```).
- Install it ( ```cp YourFont.ttf /usr/share/fonts/truetype/yourFont/```)
- Configure your ide/text editor to use it.

## Usage
Download and istall Font Forge ( https://fontforge.org/ ).
Make sure you have an alias ```fontforge``` working
```bash
ln -s ~/bin/FontForge-2022-03-08-582bd41-x86_64.AppImage ~/bin/fontforge
```
Install python. 
Clone this project.
Copy hacker-font-draft to your-font
```bash
cp hacker-font-draft your-font
cd your-font
```
Edit your chars in the folder svg.
Edit ```metadata.json``` acordingly.
Copy your base font into base.ttf ( optionally ).
Then you are ready to generate your font
```bash
../bin/hacker-font
```
This will generate YourFont.ttf.

## Test it works
Edit ```sample.html```. Then
python:
```bash
python3 -m http.server
# navigate to localhost:8000/sample.html
```
nodejs:
```bash
npx http-server
# navigate to localhost:8080/sample.html
```
## XCompose
Once you have your font. You can enter those characters not present in your keyboard by using XCompose. Edit the file acordingly and copy it to your home directory
```bash
cp XCompose ~/.XCompose 
```
