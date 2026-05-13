import { Component, NgZone, ElementRef, ViewChild, Input } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5geodata_worldIndiaLow from "@amcharts/amcharts5-geodata/worldIndiaLow";
import am5geodata_india2020Low from "@amcharts/amcharts5-geodata/india2020Low"; //

@Component({
  selector: 'app-country-map',
  template: `<div #chartdiv style="width: 100%; height: 500px; border-radius: 1rem;"></div>`,
})
export class CountryMapComponent {
  @ViewChild('chartdiv', { static: true }) chartdiv!: ElementRef;
  root!: am5.Root;

  constructor(private zone: NgZone) { }
@Input() locations:any[]=[];
  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.root = am5.Root.new(this.chartdiv.nativeElement);

      let chart = this.root.container.children.push(
        am5map.MapChart.new(this.root, {
          // panX: "none",
          // panY: "none",
          // wheelX: "none",
          // wheelY: "none",
          // projection: am5map.geoMercator(),
          panX: "translateX",
          panY: "translateY",
          wheelX: "none",
          wheelY: "none",
          projection: am5map.geoMercator(),
        })
      );
      const zoomControl = chart.set("zoomControl", am5map.ZoomControl.new(this.root, {}));
      zoomControl.setAll({
  centerX: am5.p100,
  centerY: am5.p100,
  x: am5.p100,
  y: am5.p100
});
     // chart.geodata = am4geodata_worldIndiaLow;
      let polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(this.root, {
          geoJSON: am5geodata_india2020Low,//am5geodata_worldIndiaLow,
          exclude: ["AQ"],
        })
      );

      polygonSeries.mapPolygons.template.setAll({
        tooltipText: "{name}",
        interactive: true,
        fill: am5.color(0xE5EAF2),
        stroke: am5.color(0xD0D5DD),
      });

      

      polygonSeries.mapPolygons.template.states.create("hover", {
        fill: am5.color(0x465FFF),
      });
      // Select India
          // Get dataItem by country code "IN"
        // let dataItem = polygonSeries.getDataItemById("IN");
        // if (dataItem) {
        //  // let polygon = dataItem.get("mapPolygon");
        //  // polygon.isActive = true;  // Select/highlight
        //   polygonSeries.zoomToDataItem(dataItem);  // Zoom to India
        // }

      // Add blue dot markers
      let pointSeries = chart.series.push(
        am5map.MapPointSeries.new(this.root, {})
      );

      let markers = [
        // { lat: 37.2580397, lon: -104.657039, name: "United States" },
        { lat: 28.5687084, lon: 77.1914615, name: "Delhione" },
        { lat: 28.5687316, lon: 77.1914531, name: "Delhitwo" },
        { lat: 28.5686997, lon: 77.1915233, name: "Delhithree" },
        // { lat: 53.613, lon: -11.6368, name: "United Kingdom" },
        // { lat: -25.0304388, lon: 115.2092761, name: "Sweden" },
      ];

      if(this.locations.length){
        markers=this.locations.map(l => ({lat:l.venueLat,lon:l.venueLong,name:l.venueName}));
        console.log({'markers':markers});
      }

      markers.forEach(m => {
        let point = pointSeries.pushDataItem({
          latitude: m.lat,
          longitude: m.lon,
        });

        let circle = am5.Circle.new(this.root, {
          radius: 6,
          fill: am5.color(0x465FFF),
          stroke: am5.color(0xffffff),
          strokeWidth: 2,
        });
        circle.set("tooltipText", m.name);

        pointSeries.bullets.push(() =>
          am5.Bullet.new(this.root, {
            sprite: am5.Circle.new(this.root, {
              radius: 6,
              fill: am5.color(0x465FFF),
              stroke: am5.color(0xffffff),
              strokeWidth: 2,
              tooltipText: m.name
            })
          })
        );
      });
    });

    console.log({'location':this.locations});
  }

  ngOnDestroy() {
    this.root?.dispose();
  }
}