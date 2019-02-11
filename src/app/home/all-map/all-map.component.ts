import { AfterViewInit, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { MembersService } from '@app/service/members.service';
import { Member } from '@app/model/member';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-all-map',
  templateUrl: './all-map.component.html',
  styleUrls: ['./all-map.component.scss']
})
export class AllMapComponent implements OnInit, OnDestroy {
  memberLocations: { title: string; latitude: number; longitude: number }[] = [];
  imageSeries: am4maps.MapImageSeries;
  private chart: am4maps.MapChart;
  private targetSVG: string;
  private polygonSeries: am4maps.MapPolygonSeries;
  private polygonTemplate: any;
  private imageSeriesTemplate: am4maps.MapImage;
  private circle: any;

  constructor(private zone: NgZone, private membersService: MembersService) {}

  /**
   * Load members and make list of lat long titles to feed into map
   */
  ngOnInit(): void {
    this.membersService.getMembers().subscribe(members => {
      members.forEach((member: Member) => {
        const location = {
          title: member.name,
          latitude: member.lat_long[0],
          longitude: member.lat_long[1]
        };

        this.memberLocations.push(location);
      });

      this.initMap();
      this.imageSeries.data = this.memberLocations;
    });
  }

  /**
   * Initialize the map visual.
   */
  initMap() {
    // Create map instance
    this.targetSVG =
      'M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z';

    this.chart = am4core.create('chartdiv', am4maps.MapChart);
    // Set map definition
    this.chart.geodata = am4geodata_worldLow;

    // Set projection
    this.chart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    this.polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());

    // Exclude Antartica
    this.polygonSeries.exclude = ['AQ'];

    // Make map load polygon (like country names) data from GeoJSON
    this.polygonSeries.useGeodata = true;

    // Configure series
    this.polygonTemplate = this.polygonSeries.mapPolygons.template;
    this.polygonTemplate.fill = this.chart.colors
      .getIndex(0)
      .brighten(0.5)
      .saturate(0.2);
    this.polygonTemplate.strokeOpacity = 0.5;
    this.polygonTemplate.strokeWidth = 0.5;

    // create capital markers
    this.imageSeries = this.chart.series.push(new am4maps.MapImageSeries());

    // define template
    this.imageSeriesTemplate = this.imageSeries.mapImages.template;
    this.circle = this.imageSeriesTemplate.createChild(am4core.Sprite);
    this.circle.scale = 0.6;
    this.circle.fill = this.chart.colors
      .getIndex(3)
      .saturate(0.1)
      .lighten(-0.5);
    this.circle.path = this.targetSVG;
    // what about scale...

    // set propertyfields
    this.imageSeriesTemplate.propertyFields.latitude = 'latitude';
    this.imageSeriesTemplate.propertyFields.longitude = 'longitude';

    this.imageSeriesTemplate.horizontalCenter = 'middle';
    this.imageSeriesTemplate.verticalCenter = 'middle';
    this.imageSeriesTemplate.align = 'center';
    this.imageSeriesTemplate.valign = 'middle';
    this.imageSeriesTemplate.width = 8;
    this.imageSeriesTemplate.height = 8;
    this.imageSeriesTemplate.nonScaling = true;
    this.imageSeriesTemplate.tooltipText = '{title}';
    this.imageSeriesTemplate.fill = am4core.color('#000');
    this.imageSeriesTemplate.background.fillOpacity = 0;
    this.imageSeriesTemplate.background.fill = am4core.color('#fff');
    this.imageSeriesTemplate.setStateOnChildren = true;
    this.imageSeriesTemplate.states.create('hover');

    this.imageSeries.data = this.memberLocations;
  }

  /**
   * Delete map
   */
  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
