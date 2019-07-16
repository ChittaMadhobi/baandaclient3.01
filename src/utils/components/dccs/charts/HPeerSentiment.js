import React, { Component } from 'react';

import fusioncharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFusioncharts from 'react-fusioncharts';
import '../dccs.css';
// Resolves charts dependancy
charts(fusioncharts);

const dataSource = {
  chart: {
    caption: 'Peer Sentiments at the Work environments',
    subcaption: 'A timeseries based average as of now',
    yaxisname: 'Positive Feedback Average',
    decimals: '1',
    theme: 'fusion'
  },
  data: [
    {
      label: 'Mood',
      value: '60'
    },
    {
      label: 'Energy',
      value: '65'
    },
    {
      label: 'Humility',
      value: '80'
    },
    {
      label: 'Ethical',
      value: '85'
    },
    {
      label: 'Integrity',
      value: '88'
    }
  ]
};

class HPeerSentiment extends Component {
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

export default HPeerSentiment;
