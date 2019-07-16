import React, { Component } from 'react';
import fusioncharts from 'fusioncharts';
import charts from 'fusioncharts/fusioncharts.charts';
import ReactFusioncharts from 'react-fusioncharts';
import '../dccs.css';
// Resolves charts dependancy
charts(fusioncharts);

const dataSource = {
  chart: {
    caption: 'Your Cultural Impact',
    subcaption: 'As of Now',
    showplotborder: '1',
    plotfillalpha: '60',
    hoverfillcolor: '#CCCCCC',
    numberprefix: ':',
    plottooltext: 'Value impact of <b>$label</b> was <b>$$valueK</b>',
    theme: 'fusion'
  },
  category: [
    {
      label: 'Culture Influence',
      tooltext: 'Please hover over a sub-category to see details',
      color: '#ffffff',
      value: '150',
      category: [
        {
          label: 'Power Distance',
          color: '#f8bd19',
          value: '20',
          category: [
            {
              label: 'Class-factor',
              color: '#f8bd19',
              value: '3.4'
            },
            {
              label: 'flat-org',
              color: '#f8bd19',
              value: '16.6'
            }
          ]
        },
        {
          label: 'Unification',
          color: '#33ccff',
          value: '50',
          category: [
            {
              label: 'Individual',
              color: '#6fc1e8',
              value: '10'
            },
            {
              label: 'Collective',
              color: '#6fe5e8',
              value: '18'
            },
            {
              label: 'Collection-of-peers',
              color: '#adc0f4',
              value: '22'
            }
          ]
        },
        {
          label: 'Sexism',
          color: '#ffcccc',
          value: '15',
          category: [
            {
              label: 'Male',
              color: '#ccabea',
              value: '3'
            },
            {
              label: 'Female',
              color: '#eaabce',
              value: '2'
            },
            {
              label: 'Peers',
              color: '#eac9ab',
              value: '10'
            }
          ]
        },
        {
          label: 'Conformity',
          color: '#ccff66',
          value: '30',
          category: [
            {
              label: 'New-Idea',
              color: '#ccff66',
              value: '10'
            },
            {
              label: 'Tradition',
              color: '#ccff66',
              value: '5'
            },
            {
              label: 'Confusion',
              color: '#ccff66',
              value: '15'
            }
          ]
        },
        {
          label: 'Strategy',
          color: '#f4c9ad',
          value: '22',
          category: [
            {
              label: 'Longterm',
              color: '#c1a38f',
              value: '6'
            },
            {
              label: 'Shortterm',
              color: '#e2ab85',
              value: '16'
            }
          ]
        },
        {
          label: 'Gratification',
          color: '#88b265',
          value: '40',
          category: [
            {
              label: 'Indulgence',
              color: '#86937a',
              value: '15'
            },
            {
              label: 'Restrain',
              color: '#a3c485',
              value: '15'
            },
            {
              label: 'Bohemian',
              color: '#98d660',
              value: '10'
            }
          ]
        }
      ]
    }
  ]
};

class BCulture extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="chart-sizeX">
              <ReactFusioncharts
                type="multilevelpie"
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

export default BCulture;
