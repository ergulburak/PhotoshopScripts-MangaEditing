// Version: 0.5.0

// Requirements: Adobe Photoshop CC 2015, or higher

// Author: Burak Ergül (burakcan41@gmail.com)

// Website: ergulburak.github.io

// ============================================================================

// Kurulum:

// 1. Şunun içine atın:

// PC: C:\Program Files\Adobe\Adobe Photoshop CC#\Presets\Scripts\

// Mac: <hard drive>/Applications/Adobe Photoshop CC#/Presets/Scripts/

// 2. Photoshop'u yeniden başlatın

// 3. Choose File > Scripts > mangaSeridiOlustur

// ============================================================================

#target photoshop

app.bringToFront();

function cTID(s) { return app.charIDToTypeID(s); }

function sTID(s) { return app.stringIDToTypeID(s); }

function newArtboard(_name, _w, _h, _x, _y) {
   var desc6 = new ActionDescriptor();
   var ref1 = new ActionReference();
   ref1.putClass(sTID('artboardSection'));
   desc6.putReference(cTID('null'), ref1);
   var desc7 = new ActionDescriptor();
   desc7.putString(cTID('Nm  '), _name);
   desc6.putObject(cTID('Usng'), sTID('artboardSection'), desc7);
   var desc8 = new ActionDescriptor();
   desc8.putDouble(cTID('Top '), 0);
   desc8.putDouble(cTID('Left'), 0);
   desc8.putDouble(cTID('Btom'), _h);
   desc8.putDouble(cTID('Rght'), _w);
   //alert('Y: '+_y+'  X: '+_x+' H: '+_h+'  W: '+_w);
   desc6.putObject(sTID('artboardRect'), sTID('classFloatRect'), desc8);
   executeAction(cTID('Mk  '), desc6, DialogModes.NO);
}

function setPositions() {
   var doc = activeDocument,layers = doc.layers;
   var offsetY = 0,offsetX=0;
   for (var i = 0, l = layers.length; i < l; i++) {
      doc.activeLayer = layers[i];
      if (isArtBoard()) 
      {
         var abSize = getArtboardDimensions();
         var Position = doc.activeLayer.bounds;
         Position[0] = 0 - Position[0];
         Position[1] = offsetY;// - Position[1];
         doc.activeLayer.translate(-Position[0],-Position[1]);
         offsetY += abSize[1];
         offsetX += abSize[0];
      }
   }

   function isArtBoard() {
      var ref = new ActionReference();
      ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
      return executeActionGet(ref).getBoolean(stringIDToTypeID("artboardEnabled"));
   };

   function getArtboardDimensions() {
      var ref = new ActionReference();
      ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
      var desc = executeActionGet(ref).getObjectValue(stringIDToTypeID("artboard")).getObjectValue(stringIDToTypeID("artboardRect"));
      var w = desc.getDouble(stringIDToTypeID("right")) - desc.getDouble(stringIDToTypeID("left"));
      var h = desc.getDouble(stringIDToTypeID("bottom")) - desc.getDouble(stringIDToTypeID("top"));
      return [w, h]
   };
}
function buyukseBol(currentDocHeight,pageNumber,file,doc,expected){
   var expectedHeight=expected;
   
   while(currentDocHeight%expectedHeight<400)
   {
      expectedHeight-=50;
   }

   var temp=currentDocHeight,temp2=0;

   while(temp>expectedHeight){
      app.open(file);
      var startRulerUnits = app.preferences.rulerUnits;
      app.preferences.rulerUnits = Units.PIXELS;
      var canvasWidth = app.activeDocument.width.value;
      var bounds = [0, expectedHeight * temp2, canvasWidth, expectedHeight * (temp2 + 1)];
      app.activeDocument.crop(bounds);
      var str;
      if (imgNumber + pageNumber < 10) {
         str = '00' + (imgNumber + pageNumber);
      }
      else if (imgNumber + pageNumber >= 10 || i + pageNumber < 99) {
         str = '0' + (imgNumber + pageNumber);
      } else {
         str = (imgNumber + pageNumber);
      }
      newArtboard(str, app.activeDocument.width.value, expectedHeight);
      app.activeDocument.activeLayer.duplicate(doc, ElementPlacement.INSIDE);
      app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
      app.preferences.rulerUnits = startRulerUnits;
      temp2++;imgNumber++;temp-=expectedHeight;
   }
   app.open(file);
   var startRulerUnits = app.preferences.rulerUnits;
   app.preferences.rulerUnits = Units.PIXELS;
   var canvasWidth = app.activeDocument.width.value;
   var bounds = [0, expectedHeight * temp2, canvasWidth, (expectedHeight * temp2)+temp];
   app.activeDocument.crop(bounds);
   var str;
   if (imgNumber + pageNumber < 10) {
      str = '00' + (imgNumber + pageNumber);
   }
   else if (imgNumber + pageNumber > 10 || i + pageNumber < 100) {
      str = '0' + (imgNumber + pageNumber);
   } else {
      str = (imgNumber + pageNumber);
   }
   newArtboard(str, app.activeDocument.width.value, temp);
   app.activeDocument.activeLayer.duplicate(doc, ElementPlacement.INSIDE);
   app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
   app.preferences.rulerUnits = startRulerUnits;
   imgNumber++;
}
var  imgNumber=0;

function main() {

   var fileList = app.openDialog("Bütün manga resimlerini seçiniz.");
   // DIALOG
   // ======
   var dialog = new Window("dialog");
   dialog.text = "Başlangıç Ayarları";
   dialog.orientation = "row";
   dialog.alignChildren = ["center", "center"];
   dialog.spacing = 10;
   dialog.margins = 16;

   // PANEL1
   // ======
   var panel1 = dialog.add("panel", undefined, undefined, { name: "panel1" });
   panel1.text = "Sayfa başlangıç numarası";
   panel1.orientation = "column";
   panel1.alignChildren = ["left", "top"];
   panel1.spacing = 10;
   panel1.margins = 10;

   var edittext1 = panel1.add('edittext {properties: {name: "edittext1"}}');
   edittext1.preferredSize.width = 75;
   edittext1.text = "1";

   // PANEL2
   // ======
   var panel2 = dialog.add("panel", undefined, undefined, { name: "panel2" });
   panel2.text = "Sayfa Yüksekliği";
   panel2.orientation = "column";
   panel2.alignChildren = ["left", "top"];
   panel2.spacing = 10;
   panel2.margins = 10;

   var edittext2 = panel2.add('edittext {properties: {name: "edittext2"}}');
   edittext2.preferredSize.width = 75;
   edittext2.text = "1400";

   // PANEL3
   // ======
   var panel3 = dialog.add("panel", undefined, undefined, { name: "panel3" });
   panel3.text = "Hedeflenen Kesme Yüksekliği";
   panel3.orientation = "column";
   panel3.alignChildren = ["left", "top"];
   panel3.spacing = 10;
   panel3.margins = 10;

   var edittext3 = panel3.add('edittext {properties: {name: "edittext3"}}');
   edittext3.preferredSize.width = 75;
   edittext3.text = "1000";

   // DIALOG
   // ======
   var divider1 = dialog.add("panel", undefined, undefined, { name: "divider1" });
   divider1.alignment = "fill";

   // DIALOG
   // ======
   var button1 = dialog.add("button", undefined, undefined, { name: "button1" });
   button1.text = "OK";
   button1.preferredSize.width = 50;
   button1.preferredSize.height = 50;

   dialog.show();
   delta = 0;
   currentDocHeight = 0;
   if (fileList != null && fileList != "") {

      var doc = app.documents.add(400, 400, 72, "Manga");

      for (var i = 0; i < fileList.length; i++) {
         app.open(fileList[i]);
         currentDocHeight = app.activeDocument.height.value;
         if(currentDocHeight>Number(edittext2.text)){
            app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
            buyukseBol(currentDocHeight,Number(edittext1.text),fileList[i],doc,Number(edittext3.text));
         }
         else{
            var str;
            if (imgNumber + Number(edittext1.text) < 10) {
               str = '00' + (imgNumber + Number(edittext1.text));
            }
            else if (imgNumber + Number(edittext1.text) > 10 || i + Number(edittext1.text) < 100) {
               str = '0' + (imgNumber + Number(edittext1.text));
            } else {
               str = (imgNumber + Number(edittext1.text));
            }
         newArtboard(str, app.activeDocument.width.value, app.activeDocument.height.value, 0, delta);
         app.activeDocument.activeLayer.duplicate(doc, ElementPlacement.INSIDE);
         app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);imgNumber++;
         }
         
      }
      //doc.crop([0, 0, app.activeDocument.width, app.activeDocument.height + delta]);
      setPositions();
      app.runMenuItem(charIDToTypeID("FtOn"));
      alert('Tamamlandı!');
   }

}

main();