import React, { Component } from 'react';
import fusioncharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFusioncharts from 'react-fusioncharts';
import '../dccs.css';
// Resolves charts dependancy
charts(fusioncharts);

const dataSource = {
  chart: {
    caption: 'Your four SX-drivers per your Peers',
    subcaption: 'Time-series Average based on feedbacks',
    enablesmartlabels: '1',
    showlabels: '1',
    numbersuffix: ' %effect',
    usedataplotcolorforlabels: '1',
    plottooltext: '$label, <b>$value</b> MMbbl',
    theme: 'fusion'
  },
  data: [
    {
      label: 'Hands-on-skill',
      value: '45'
    },
    {
      label: 'Theoretical KB',
      value: '15'
    },
    {
      label: 'Intelligence',
      value: '25'
    },
    {
      label: 'Imagination',
      value: '15'
    }
  ]
};

class DDrivers extends Component {
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

export default DDrivers;
