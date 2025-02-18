declare module '@changey/react-leaflet-markercluster' {
    import { Component } from 'react';
    import { LayersControlProps } from 'react-leaflet';
  
    export interface MarkerClusterGroupProps extends LayersControlProps {
      chunkedLoading?: boolean;
      maxClusterRadius?: number;
      spiderfyOnMaxZoom?: boolean;
      showCoverageOnHover?: boolean;
      zoomToBoundsOnClick?: boolean;
      removeOutsideVisibleBounds?: boolean;
      animate?: boolean;
    }
  
    export default class MarkerClusterGroup extends Component<MarkerClusterGroupProps> {}
  }
  