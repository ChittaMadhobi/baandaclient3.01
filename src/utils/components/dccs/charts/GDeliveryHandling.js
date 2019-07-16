import React, { Component } from 'react';

import fusioncharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFusioncharts from 'react-fusioncharts';
import '../dccs.css';
// Resolves charts dependancy
charts(fusioncharts);

const dataSource = {
  chart: {
    caption: 'Delivery Traits Emphasis per Clients',
    subcaption: 'A timeseries based average as of now',
    yaxisname: 'Percentage Satisfaction',
    decimals: '1',
    theme: 'fusion'
  },
  data: [
    {
      label: 'In-Time Delivery',
      value: '74'
    },
    {
      label: 'Expected Quality',
      value: '81'
    },
    {
      label: 'Fiscal Responsibility',
      value: '67'
    },
    {
      label: 'Overall Satisfaction',
      value: '75'
    }
  ]
};

class GDeliveryHandling extends Component {
  render() {
    return (
      <ReactFusioncharts
        type="column3d"
        width="100%"
        height="100%"
        dataFormat="JSON"
        dataSource={dataSource}
      />
    );
  }
}

export default GDeliveryHandling;
