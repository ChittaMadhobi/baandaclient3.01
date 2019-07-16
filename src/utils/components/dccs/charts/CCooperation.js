import React, { Component } from 'react';
import fusioncharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFusioncharts from 'react-fusioncharts';
import '../dccs.css';
// Resolves charts dependancy
charts(fusioncharts);

const dataSource = {
  chart: {
    caption: 'Your Top 5 Cooperation Dimensions',
    yaxisname: 'Reflection',
    showvalues: '1',
    numberprefix: '%',
    theme: 'fusion'
  },
  data: [
    {
      label: 'Collaboration',
      value: '80'
    },
    {
      label: 'Consensus',
      value: '54'
    },
    {
      label: 'Coordination',
      value: '67'
    },
    {
      label: 'Communication',
      value: '60'
    },
    {
      label: 'Coexistence',
      value: '75'
    }
  ]
};

class CCoperation extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="chart-sizeX">
              <ReactFusioncharts
                type="bar3d"
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

export default CCoperation;
