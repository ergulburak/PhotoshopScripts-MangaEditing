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


function main() {

   var fileList = app.openDialog("Bütün manga resimlerini seçiniz."),

      delta = 0,

      currentDocHeight = 0;

   if (fileList != null && fileList != "") {

      var doc = app.documents.add(400, 400, 72, "Manga");

      for (var i = 0; i < fileList.length; i++) {
         app.open(fileList[i]);
         currentDocHeight = app.activeDocument.height.value;
         newArtboard(app.activeDocument.name, app.activeDocument.width.value, app.activeDocument.height.value, 0, delta);
         app.activeDocument.activeLayer.duplicate(doc, ElementPlacement.INSIDE);
         app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
         //app.activeDocument.activeLayer.translate(0, delta);
         delta = delta + currentDocHeight;
      }
      doc.crop([0, 0, app.activeDocument.width, app.activeDocument.height + delta]);
      app.runMenuItem(charIDToTypeID("FtOn"));
      setPositions();
      alert('Tamamlandı!');
   }

}

main();