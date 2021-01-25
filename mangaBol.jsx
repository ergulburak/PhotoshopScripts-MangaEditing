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

// 3. Choose File > Scripts > mangaBöl

// ============================================================================

#target photoshop

app.bringToFront();

function cTID(s) { return app.charIDToTypeID(s); }

function sTID(s) { return app.stringIDToTypeID(s); }

function newArtboard(_name, _w, _h) {
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
   var doc = app.activeDocument, layers = doc.layers;
   var offsetY = 0;
   for (var i = 0, l = layers.length; i < l; i++) {
      doc.activeLayer = layers[i];
      if (isArtBoard()) {
         var abSize = getArtboardDimensions();
         var Position = doc.activeLayer.bounds;
         Position[0] = 0 - Position[0];
         Position[1] = offsetY;// - Position[1];
         doc.activeLayer.translate(-Position[0], -Position[1]);
         offsetY += abSize[1];
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
   var fileList = app.openDialog("Bölünmesini istediğiniz resmi seçiniz.");

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

   // DIALOG
   // ======
   var divider1 = dialog.add("panel", undefined, undefined, { name: "divider1" });
   divider1.alignment = "fill";

   // PANEL2
   // ======
   var panel2 = dialog.add("panel", undefined, undefined, { name: "panel2" });
   panel2.text = "Yükseklik";
   panel2.orientation = "column";
   panel2.alignChildren = ["left", "top"];
   panel2.spacing = 10;
   panel2.margins = 10;

   var edittext2 = panel2.add('edittext {properties: {name: "edittext2"}}');
   edittext2.preferredSize.width = 75;
   edittext2.text = "1000"

   // DIALOG
   // ======
   var button1 = dialog.add("button", undefined, undefined, { name: "button1" });
   button1.text = "OK";
   button1.preferredSize.width = 50;
   button1.preferredSize.height = 50;

   dialog.show();

   var temp = 0;
   if (fileList != null && fileList != "") {
      var doc = app.documents.add(400, 400, 72, "Manga");
      app.open(fileList[0]);
      var artanKisim = app.activeDocument.height.value % Number(edittext2.text);
      var kacSayfa = ((app.activeDocument.height.value - artanKisim) / Number(edittext2.text)) + 1;
      app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
      for (var i = 0; i < kacSayfa; i++) {
         var str;
         app.open(fileList[0]);
         if (i + Number(edittext1.text) < 10) {
            str = '00' + (i + Number(edittext1.text));
         }
         else if (i + Number(edittext1.text) > 10 || i + Number(edittext1.text) < 100) {
            str = '0' + (i + Number(edittext1.text));
         } else {
            str = (i + Number(edittext1.text));
         }
         if (i == kacSayfa - 1) {
            var startRulerUnits = app.preferences.rulerUnits;
            app.preferences.rulerUnits = Units.PIXELS;
            var canvasWidth = app.activeDocument.width.value;
            var bounds = [0, Number(edittext2.text) * i, canvasWidth, Number(edittext2.text) * (i + 1)];
            app.activeDocument.crop(bounds);
            newArtboard(str, app.activeDocument.width.value, artanKisim);
            app.activeDocument.activeLayer.duplicate(doc, ElementPlacement.INSIDE);
            app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
            app.preferences.rulerUnits = startRulerUnits;
         }
         else {
            var startRulerUnits = app.preferences.rulerUnits;
            app.preferences.rulerUnits = Units.PIXELS;
            var canvasWidth = app.activeDocument.width.value;
            var bounds = [0, Number(edittext2.text) * i, canvasWidth, Number(edittext2.text) * (i + 1)];
            app.activeDocument.crop(bounds);
            newArtboard(str, app.activeDocument.width.value, Number(edittext2.text));
            app.activeDocument.activeLayer.duplicate(doc, ElementPlacement.INSIDE);
            app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
            app.preferences.rulerUnits = startRulerUnits;
         }
      }
      setPositions();
      app.runMenuItem(charIDToTypeID("FtOn"));
      alert('Tamamlandı!');
   }

}

main();