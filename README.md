# TeamSpeak 5 Channel Image Generator
**Simple tool 🔨 for generating TeamSpeak 5 channel images 🖼️**

## ✨ Try it out 

You can make your TeamSpeak server more cool right now!
Just click [here to use the app](https://pitkes22.github.io/ts5-channel-image-generator/)! 👈👈

![App Preview](https://i.imgur.com/yBZgjlC.gif)

## 🚀 How to use

1. Upload your image or load it using public URL
2. Adjust options to fit the image to the rooms you see in the preview
3. Export your images and download ZIP file (you can specify file name prefix for your images)
5. Upload your images to the internet (You can use your web server or service such Imgur.com)
4. Go to your TeamSpeak server and set Image URL of individual rooms **(You have to have TeamSpeak 5 Beta Client for this)** 

## ⚙️ How it works

*TS5 Channel Image Generator* is fully client-side application built using React (Next.js). It uses Canvas API to work 
with images and 3rd party libraries to create ZIP files. Thanks to that no server is needed so **no images are 
uploaded/stored on the server**. App works in all modern browsers and support for image file formats is also 
dependent on supported file formats of given browser.

## 📅 Planned Features 

- [ ] Basic image manipulation (Flip, Offset, Scale)
- [ ] Rooms Structure serialization and persistence in local storage
- [ ] Drag support for nested channels
- [ ] Create a new logo (**Help wanted!**) and manifest file to make the app PWA 
- [X] Make an uploaded image saved in local storage
- [ ] Support for animated banners (GIFs)
- [ ] Option to fit image vertically to current count of the channels
- [X] Support for spacers
- [X] Support for nested channels
- [X] Support for specifying background color for transparent banners
- [X] Add "Cover" mode (stretch image over nested rooms)

## 🍰 Contributing

Any contribution is welcomed. 
Feel free to create an issue if you found a bug, or you have an idea how to improve the app! 
