import React, { Component } from 'react';
import fusioncharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFusioncharts from 'react-fusioncharts';
import '../dccs.css';
// Resolves charts dependancy
charts(fusioncharts);

const dataSource = {
  chart: {
    caption: 'Management Stype Preference per your Peers',
    subcaption: 'Time-series Average based on feedbacks',
    enablesmartlabels: '1',
    showlabels: '1',
    numbersuffix: ' %effect',
    usedataplotcolorforlabels: '1',
    plottooltext: '$label, <b>$value</b> %',
    theme: 'fusion'
  },
  data: [
    {
      label: 'Analytical',
      value: '35'
    },
    {
      label: 'Driver',
      value: '13'
    },
    {
      label: 'Amiable',
      value: '35'
    },
    {
      label: 'Expressive',
      value: '17'
    }
  ]
};

class EMgmtStyle extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="chart-sizeX">
              <ReactFusioncharts
                type="doughnut3d"
                width="100%"
                height="100%"
                dataFormat="JSON"
                dataSource={dataSource}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EMgmtStyle;
