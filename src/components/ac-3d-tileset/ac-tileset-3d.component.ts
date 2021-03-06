import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';
import { Checker } from '../../utils/checker';

/**
 *  This component is used for adding a 3d tileset layer to the map (ac-map).
 *  options according to `Cesium3DTileset` definition.
 *  check out: https://cesiumjs.org/Cesium/Build/Documentation/Cesium3DTileset.html
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-3d-tile-layer [options]="optionsObject">
 *    </ac-3d-tile-layer>
 *  ```
 */
@Component({
  selector : 'ac-3d-tile-layer',
  template : '',
})
export class AcTileset3dComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/Cesium3DTileset.html
   * @type {{Object}}
   */
  @Input()
  options: { url?: string } = {};

  /**
   * index (optional) - The index to add the layer at. If omitted, the layer will added on top of all existing layers.
   * @type {Number}
   */
  @Input()
  index: Number;

  /**
   * show (optional) - Determines if the map layer is shown.
   * @type {Boolean}
   */
  @Input()
  show = true;

  private _layerInstance: any = null;
  private _3dtilesCollection: any;

  constructor(private cesiumService: CesiumService) {
  }

  ngOnInit() {
    if (!Checker.present(this.options.url)) {
      throw new Error('Options must have a url');
    }

    this._3dtilesCollection = new Cesium.PrimitiveCollection();
    this.cesiumService.getScene().primitives.add(this._3dtilesCollection);

    if (this.show) {
      this._layerInstance = this._3dtilesCollection.add(new Cesium.Cesium3DTileset(this.options), this.index);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && !changes['show'].isFirstChange()) {
      const showValue = changes['show'].currentValue;

      if (showValue) {
        if (this._layerInstance) {
          this._3dtilesCollection.add(this._layerInstance, this.index);
        } else {
          this._layerInstance = this._3dtilesCollection.add(new Cesium.Cesium3DTileset(this.options), this.index);
        }
      }
      else if (this._layerInstance) {
        this._3dtilesCollection.remove(this._layerInstance, false);
      }
    }
  }

  ngOnDestroy(): void {
    if (this._layerInstance) {
      this._3dtilesCollection.remove(this._layerInstance, false);
    }
  }
}
