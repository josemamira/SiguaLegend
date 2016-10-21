function geo2utm(lon,lat)
{

// http://www.orchids.de/kthilf/javascripts.html

/* Copyright (c) 2006, HELMUT H. HEIMEIER
   Permission is hereby granted, free of charge, to any person obtaining a
   copy of this software and associated documentation files (the "Software"),
   to deal in the Software without restriction, including without limitation
   the rights to use, copy, modify, merge, publish, distribute, sublicense,
   and/or sell copies of the Software, and to permit persons to whom the
   Software is furnished to do so, subject to the following conditions:
   The above copyright notice and this permission notice shall be included
   in all copies or substantial portions of the Software.*/

/* Die Funktion wandelt geographische Koordinaten in UTM Koordinaten
   um. Geographische Länge lon und Breite lat müssen im WGS84 Datum
   gegeben sein. Berechnet werden UTM Zone, Ostwert coorx und Nordwert coory.*/

// Geographische Länge lon und Breite lat im WGS84 Datum
   if (lon =="" || lat == "")
   {
   zone = "";
   coorx = "";
   coory = "";
  
   return;
   }
   if (lon <= -180 || lon > 180 || lat <= -80 || lat >= 84)
   {
   alert("Werte nicht im Bereich des UTM Systems\n"+
   "-180° <= lon < +180°, -80° < lat < 84° N");
   zone = "";
   coorx = "";
   coory = "";
   return;
   }
   lon = parseFloat(lon);
   lat = parseFloat(lat);

// WGS84 Datum
// Große Halbachse a und Abplattung f
   a = 6378137.000;
   f = 3.35281068e-3;
   pi = Math.PI;
   b_sel = 'CDEFGHJKLMNPQRSTUVWXX';

// Polkrümmungshalbmesser c
   c = a/(1-f);

// Quadrat der zweiten numerischen Exzentrizität
   ex2 = (2*f-f*f)/((1-f)*(1-f));
   ex4 = ex2*ex2;
   ex6 = ex4*ex2;
   ex8 = ex4*ex4;

// Koeffizienten zur Berechnung der Meridianbogenlänge
   e0 = c*(pi/180)*(1 - 3*ex2/4 + 45*ex4/64 - 175*ex6/256 + 11025*ex8/16384);
   e2 = c*( - 3*ex2/8 + 15*ex4/32 - 525*ex6/1024 +  2205*ex8/4096);
   e4 = c*(15*ex4/256 - 105*ex6/1024 + 2205*ex8/16384);
   e6 = c*( - 35*ex6/3072 + 315*ex8/12288);

// Längenzone lz und Breitenzone (Band) bz
   lzn = parseInt((lon+180)/6) + 1;
   lz = lzn;
   if (lzn < 10) lz = "0" + lzn;
   bd = parseInt(1 + (lat + 80)/8);
   bz = b_sel.substr(bd-1,1);

// Geographische Breite in Radianten br
   br = lat * pi/180;

   tan1 = Math.tan(br);
   tan2 = tan1*tan1;
   tan4 = tan2*tan2;

   cos1 = Math.cos(br);
   cos2 = cos1*cos1;
   cos4 = cos2*cos2;
   cos3 = cos2*cos1;
   cos5 = cos4*cos1;

   etasq = ex2*cos2;

// Querkrümmungshalbmesser nd
   nd = c/Math.sqrt(1 + etasq);

// Meridianbogenlänge g aus gegebener geographischer Breite lat
   g = (e0*lat) + (e2*Math.sin(2*br)) + (e4*Math.sin(4*br)) + (e6*Math.sin(6*br));

// Längendifferenz dl zum Bezugsmeridian lh
   lh = (lzn - 30)*6 - 3;
   dl = (lon - lh)*pi/180;
   dl2 = dl*dl;
   dl4 = dl2*dl2;
   dl3 = dl2*dl;
   dl5 = dl4*dl;

// Maßstabsfaktor auf dem Bezugsmeridian bei UTM Koordinaten m = 0.9996
// Nordwert coory und Ostwert coorx als Funktion von geographischer Breite und Länge

   if ( lat < 0 ) {
      coory = 10e6 + 0.9996*(g + nd*cos2*tan1*dl2/2 + nd*cos4*tan1*(5-tan2+9*etasq)
           *dl4/24);
   }
   else {
      coory = 0.9996*(g + nd*cos2*tan1*dl2/2 + nd*cos4*tan1*(5-tan2+9*etasq)
           *dl4/24);
   }
   coorx = 0.9996*( nd*cos1*dl + nd*cos3*(1-tan2+etasq)*dl3/6 + nd*cos5
        *(5-18*tan2+tan4)*dl5/120) + 500000;

   //alert(coory);
   zone = lz+bz;
   //alert(zone);

   nk = coory - parseInt(coory);
   if (nk < 0.5) coory = "" + parseInt(coory)
   else coory = "" + (parseInt(coory) + 1);

   while (coory.length < 7)
   {
      coory = "0" + coory;
   }

   nk = coorx - parseInt(coorx);
   if (nk < 0.5) coorx = "0" + parseInt(coorx)
   else coorx = "0" + parseInt(coorx+1);
   //alert ("zona: " + zone + " longitud: "+ Number(coorx) + " latitud: "+ Number(coory) );
   //return;
   var xy=[Number(coorx),Number(coory)];
   return xy;
   
}
