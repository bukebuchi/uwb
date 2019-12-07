var allChart={
    chartTag:{
        itemTitle:'标签统计',
        title: Object.assign({},publicSet.title),
        credits:publicSet.credits,
        tooltip: Object.assign({},publicSet.tipStyle,{
          valueSuffix: '个'
        }),
        pane:Object.assign({},publicSet.paneStyle),
        chart:Object.assign({},publicSet.chart,{
            height:215
          }),
        plotOptions:publicSet.plotOptions,

        yAxis: {
          stops:[
            [1, publicSet.gaugeLinearStyle],
          ],
          lineWidth: 0,
          tickInterval:0,
          minorTickInterval: null,
          tickPixelInterval: 400,
          tickWidth: 0,
          title: {
              y: -70
          },
          labels: {
              x:0,
              y:16
          },
          min: 0,
          max: 200,
      },
      
      series: [
          {
          name:'在线',
          borderColor:'yellow',
          type:'solidgauge',
          data:[80],
          },
          {
              name:'在线',
              borderColor:'yellow',
              type:'gauge',
              data:[80],
              },
      ]

      },
      chartAnchor:{
          itemTitle:'基站统计',
          title: Object.assign({},publicSet.title),
          credits:publicSet.credits,
          tooltip: Object.assign({},publicSet.tipStyle,{
              valueSuffix: '个'
          }),
          pane:Object.assign({},publicSet.paneStyle),
          chart:Object.assign({},publicSet.chart,{
            height:215
          }),

          yAxis: {
            stops:[
            [1, publicSet.gaugeLinearStyle],

          ],
            lineWidth: 0,
            tickInterval:0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 16,
            },
            min: 0,
            max: 200,
            // title: {
                // text: '速度'
            // }
        },
        plotOptions:publicSet.plotOptions,
        series: [
            {
            name:'在线',
            type:'solidgauge',
            data:[160],
        },
        {
          name:'在线',
          type:'gauge',
          data:[160],
      },
      ]

      },

      //心率异常报警
      heartRate:{
          itemTitle:'心率异常统计报警(近一个月)',
          title:Object.assign({},publicSet.title),
          credits:publicSet.credits,
          tooltip:Object.assign({},publicSet.tipStyle,{
            pointFormat: '<span style="display:block;padding:0 5px;background:#798697;">报警次数:{point.y}</span>',
          }),
          legend:Object.assign({},publicSet.legend),
          chart:Object.assign({},publicSet.chart,{
                type:'column',
                // spacingTop:'45px',
          }),
          plotOptions: publicSet.plotOptions,
          xAxis: {
              type: 'category',
          },
          yAxis: {
              title: {
                  text: '报警次数'
              }
          },  
          series: [{
              name: '地图列表',
              colorByPoint: true,
              data: [{
                  name: 'M1',
                  y: 186,
                  drilldown: 'M1'
              }, {
                  name: 'M2',
                  y: 24,
                  drilldown: 'M2'
              }, {
                  name: 'M3',
                  y: 10,
                  drilldown: 'M3'
              }, {
                  name: 'M4',
                  y: 77,
                  drilldown: 'M4'
              }, {
                  name: 'M5',
                  y: 91,
                  drilldown: 'M5'
              // }, {
              //     name: 'Proprietary or Undetectable',
              //     y: 0.2,
              //     drilldown: null
              },
              {
                  name: 'M7',
                  y: 68,
                  drilldown: null
              },
              {
                  name: 'M8',
                  y: 88,
                  drilldown: null
              },
              {
                  name: 'M9',
                  y: 20,
                  drilldown: null
              },
              {
                  name: 'M10',
                  y: 16,
                  drilldown: null
              },
          ]
          }],
          drilldown: {
              // 可钻取数据列样式
              activeAxisLabelStyle:publicSet.activeAxisLabelStyle,
              series: [{
                  name: 'M1',
                  id: 'M1', //MUST
                  data: [
                      {name:'T0001',y:24},
                      {name:'T0002',y:25},
                      {name:'T0003',y:26},
                      {name:'T0004',y:27},
                      {name:'T0005',y:28},
                  ]
              }, {
                  name: 'M2',
                  id: 'M2',
                  data: [
                      [
                          'T0007',
                          5
                      ],
                      [
                          'T0008',
                          4
                      ],
                      [
                          'T0009',
                          8
                      ],
                      [
                          'T0010',
                          9
                      ],
                      [
                          'T0011',
                          5
                      ],
                      [
                          'T0012',
                          12
                      ],
                      [
                          'T0013',
                          24
                      ],
                      [
                          'T0014',
                          1
                      ],
                      [
                          'T0015',
                          6
                      ],
                      [
                          'T0016',
                          55
                      ],
                      [
                          'T0017',
                          38
                      ],
                      [
                          'T0018',
                          19
                      ],
                      [
                          'T0010',
                          19
                      ],
                      [
                          'T0010',
                          16
                      ]
                  ]
              }, {
                  name: 'M3',
                  id: 'M3',
                  data: [
                      [
                          'T0001',
                          2
                      ],
                      [
                          'T0002',
                          32
                      ],
                      [
                          'T0003',
                          31
                      ],
                      [
                          'T0004',
                          27
                      ],
                      [
                          'T0005',
                          102
                      ],
                      [
                          'T0006',
                          33
                      ],
                      [
                          'T0007',
                          22
                      ],
                      [
                          'T0008',
                          15
                      ]
                  ]
              }, {
                  name: 'M4',
                  id: 'M4',
                  data: [
                      [
                          'T0001',
                          56
                      ],
                      [
                          'T0002',
                          77
                      ],
                      [
                          'T0001',
                          42
                      ],
                      [
                          'T0003',
                          3
                      ],
                      [
                          'T0004',
                          29
                      ],
                      [
                          'T0005',
                          26
                      ],
                      [
                          'T0006',
                          17
                      ]
                  ]
              }, {
                  name: 'M5',
                  id: 'M5',
                  data: [
                      [
                          'T0001',
                          34
                      ],
                      [
                          'T0001',
                          24
                      ],
                      [
                          'T0001',
                          17
                      ],
                      [
                          'T0001',
                          16
                      ]
                  ]
              }]
          }
      },
      // 聚集异常统计
      aggregateAbnormal:{
          itemTitle:'聚集异常统计报警(近一个月)',
          title:Object.assign({},publicSet.title),
          credits:publicSet.credits,
          tooltip: Object.assign({},publicSet.tipStyle,{
            pointFormat: '<span style="display:block;padding:0 5px;background:#798697;">报警次数:{point.y}</span>',
          }),
          legend:Object.assign({},publicSet.legend),
          chart:Object.assign({},publicSet.chart,{
            type:'column',
            // margin:0,
            height:365,
          }),
          plotOptions:publicSet.plotOptions,
          xAxis: {
              type: 'category'
          },
          yAxis: {
              title: {
                  text: '报警次数'
              }
          },
          series: [{
              name: '地图列表',
              colorByPoint: true,
              data: [{
                  name: 'M1',
                  y: 186,
                  drilldown: 'M1'
              }, {
                  name: 'M2',
                  y: 24,
                  drilldown: 'M2'
              }, {
                  name: 'M3',
                  y: 10,
                  drilldown: 'M3'
              }, {
                  name: 'M4',
                  y: 77,
                  drilldown: 'M4'
              }, {
                  name: 'M5',
                  y: 91,
                  drilldown: 'M5'
              },
              {
                  name: 'M7',
                  y: 68,
                  drilldown: null
              },
              {
                  name: 'M8',
                  y: 88,
                  drilldown: null
              },
              {
                  name: 'M9',
                  y: 20,
                  drilldown: null
              },
              {
                  name: 'M10',
                  y: 16,
                  drilldown: null
              },
          ]
          }],
          drilldown: {
      // 可钻取数据列样式
              activeAxisLabelStyle:publicSet.activeAxisLabelStyle,
              series: [
                  {
                  name: 'M1',
                  id: 'M1', //MUST
                  data: [
                      {
                          name:'T0001',
                          y:100,
                          drilldown:'T0001'
                      },
                      {
                          name:'T0002',
                          y:80,
                          drilldown:'T0002'
                      },
                      {
                          name:'T0003',
                          y:66,
                          drilldown:'T0003'
                      },
                      {
                          name:'T0004',
                          y:50,
                          drilldown:'T0004'
                      },
                      {
                          name:'T0005',
                          y:80,
                          drilldown:'T0005'
                      },
                      {
                          name:'T0006',
                          y:66,
                          drilldown:'T0006'
                      }
                  ]
              },
              {
                  name: 'M2',
                  id: 'M2', //MUST
                  data: [
                      {
                          name:'T0001',
                          y:100,
                          drilldown:'T0001'
                      },
                      {
                          name:'T0002',
                          y:80,
                          drilldown:'T0002'
                      },
                      {
                          name:'T0003',
                          y:66,
                          drilldown:'T0003'
                      },
                      {
                          name:'T0004',
                          y:50,
                          drilldown:'T0004'
                      },
                      {
                          name:'T0005',
                          y:80,
                          drilldown:'T0005'
                      },
                      {
                          name:'T0006',
                          y:66,
                          drilldown:'T0006'
                      }
                  ]
              },
              {
                  name: 'M3',
                  id: 'M3', //MUST
                  data: [
                      {
                          name:'T0001',
                          y:100,
                          drilldown:'T0001'
                      },
                      {
                          name:'T0002',
                          y:80,
                          drilldown:'T0002'
                      },
                      {
                          name:'T0003',
                          y:66,
                          drilldown:'T0003'
                      },
                      {
                          name:'T0004',
                          y:50,
                          drilldown:'T0004'
                      },
                      {
                          name:'T0005',
                          y:80,
                          drilldown:'T0005'
                      },
                      {
                          name:'T0006',
                          y:66,
                          drilldown:'T0006'
                      }
                  ]
              },
              {
                  name: 'M4',
                  id: 'M4', //MUST
                  data: [
                      {
                          name:'T0001',
                          y:100,
                          drilldown:'T0001'
                      },
                      {
                          name:'T0002',
                          y:80,
                          drilldown:'T0002'
                      },
                      {
                          name:'T0003',
                          y:66,
                          drilldown:'T0003'
                      },
                      {
                          name:'T0004',
                          y:50,
                          drilldown:'T0004'
                      },
                      {
                          name:'T0005',
                          y:80,
                          drilldown:'T0005'
                      },
                      {
                          name:'T0006',
                          y:66,
                          drilldown:'T0006'
                      }
                  ]
              },
              {
                  name: 'M5',
                  id: 'M5', //MUST
                  data: [
                      {
                          name:'T0001',
                          y:100,
                          drilldown:'T0001'
                      },
                      {
                          name:'T0002',
                          y:80,
                          drilldown:'T0002'
                      },
                      {
                          name:'T0003',
                          y:66,
                          drilldown:'T0003'
                      },
                      {
                          name:'T0004',
                          y:50,
                          drilldown:'T0004'
                      },
                      {
                          name:'T0005',
                          y:80,
                          drilldown:'T0005'
                      },
                      {
                          name:'T0006',
                          y:66,
                          drilldown:'T0006'
                      }
                  ]
              },
              {
                  name: 'M6',
                  id: 'M6', //MUST
                  data: [
                      {
                          name:'T0001',
                          y:100,
                          drilldown:'T0001'
                      },
                      {
                          name:'T0002',
                          y:80,
                          drilldown:'T0002'
                      },
                      {
                          name:'T0003',
                          y:66,
                          drilldown:'T0003'
                      },
                      {
                          name:'T0004',
                          y:50,
                          drilldown:'T0004'
                      },
                      {
                          name:'T0005',
                          y:80,
                          drilldown:'T0005'
                      },
                      {
                          name:'T0006',
                          y:66,
                          drilldown:'T0006'
                      }
                  ]
              },
                  ]
          }
      },

      stillnessAbnormal:{
        itemTitle:'静止异常统计报表',
        title:Object.assign({},publicSet.title),
        credits:publicSet.credits,
        legend:Object.assign({},publicSet.legend),
        tooltip:Object.assign({},publicSet.tipStyle,{
          pointFormat: '<span style="display:block;padding:0 5px;background:#798697;">报警次数:{point.y}</span>'
        }),

        chart:Object.assign({},publicSet.chart,{
          type:'column',
          // margin:0,
          height:365,
        }),
        plotOptions:publicSet.plotOptions,
        
        xAxis: {
            type: 'category',
            labels:{
                style:{
                    color:'#000',
                }
            }
        },
        yAxis: {
            title: {
                text: '报警次数'
            }
        },
        series: [{
            name: '地图列表',
            colorByPoint: true,
            data: [{
                name: 'M1',
                y: 86,
                drilldown: 'M1'
            }, {
                name: 'M2',
                y: 28,
                drilldown: 'M2'
            }, {
                name: 'M3',
                y: 30,
                drilldown: 'M3'
            }, {
                name: 'M4',
                y: 60,
                drilldown: 'M4'
            }, {
                name: 'M5',
                y: 1,
                drilldown: 'M5'
            // }, {
            //     name: 'Proprietary or Undetectable',
            //     y: 0.2,
            //     drilldown: null
            },
            {
                name: 'M7',
                y: 18,
                drilldown: null
            },
            {
                name: 'M8',
                y: 38,
                drilldown: null
            },
            {
                name: 'M9',
                y: 26,
                drilldown: null
            },
       
        ]
        }],
        drilldown: {
            activeAxisLabelStyle:publicSet.activeAxisLabelStyle,
            series: [
                {
                name: 'M1',
                id: 'M1', //MUST
                data: [
                    {
                        name:'T0001',
                        y:100,
                        drilldown:'T0001'
                    },
                    {
                        name:'T0002',
                        y:80,
                        drilldown:'T0002'
                    },
                    {
                        name:'T0003',
                        y:66,
                        drilldown:'T0003'
                    },
                    {
                        name:'T0004',
                        y:50,
                        drilldown:'T0004'
                    },
                    {
                        name:'T0005',
                        y:80,
                        drilldown:'T0005'
                    },
                    {
                        name:'T0006',
                        y:66,
                        drilldown:'T0006'
                    }
                ]
            },
            {
                name: 'M2',
                id: 'M2', //MUST
                data: [
                    {
                        name:'T0001',
                        y:100,
                        drilldown:'T0001'
                    },
                    {
                        name:'T0002',
                        y:80,
                        drilldown:'T0002'
                    },
                    {
                        name:'T0003',
                        y:66,
                        drilldown:'T0003'
                    },
                    {
                        name:'T0004',
                        y:50,
                        drilldown:'T0004'
                    },
                    {
                        name:'T0005',
                        y:80,
                        drilldown:'T0005'
                    },
                    {
                        name:'T0006',
                        y:66,
                        drilldown:'T0006'
                    }
                ]
            },
            {
                name: 'M3',
                id: 'M3', //MUST
                data: [
                    {
                        name:'T0001',
                        y:100,
                        drilldown:'T0001'
                    },
                    {
                        name:'T0002',
                        y:80,
                        drilldown:'T0002'
                    },
                    {
                        name:'T0003',
                        y:66,
                        drilldown:'T0003'
                    },
                    {
                        name:'T0004',
                        y:50,
                        drilldown:'T0004'
                    },
                    {
                        name:'T0005',
                        y:80,
                        drilldown:'T0005'
                    },
                    {
                        name:'T0006',
                        y:66,
                        drilldown:'T0006'
                    }
                ]
            },
            {
                name: 'M4',
                id: 'M4', //MUST
                data: [
                    {
                        name:'T0001',
                        y:100,
                        drilldown:'T0001'
                    },
                    {
                        name:'T0002',
                        y:80,
                        drilldown:'T0002'
                    },
                    {
                        name:'T0003',
                        y:66,
                        drilldown:'T0003'
                    },
                    {
                        name:'T0004',
                        y:50,
                        drilldown:'T0004'
                    },
                    {
                        name:'T0005',
                        y:80,
                        drilldown:'T0005'
                    },
                    {
                        name:'T0006',
                        y:66,
                        drilldown:'T0006'
                    }
                ]
            },
            {
                name: 'M5',
                id: 'M5', //MUST
                data: [
                    {
                        name:'T0001',
                        y:100,
                        drilldown:'T0001'
                    },
                    {
                        name:'T0002',
                        y:80,
                        drilldown:'T0002'
                    },
                    {
                        name:'T0003',
                        y:66,
                        drilldown:'T0003'
                    },
                    {
                        name:'T0004',
                        y:50,
                        drilldown:'T0004'
                    },
                    {
                        name:'T0005',
                        y:80,
                        drilldown:'T0005'
                    },
                    {
                        name:'T0006',
                        y:66,
                        drilldown:'T0006'
                    }
                ]
            },
            {
                name: 'M6',
                id: 'M6', //MUST
                data: [
                    {
                        name:'T0001',
                        y:100,
                        drilldown:'T0001'
                    },
                    {
                        name:'T0002',
                        y:80,
                        drilldown:'T0002'
                    },
                    {
                        name:'T0003',
                        y:66,
                        drilldown:'T0003'
                    },
                    {
                        name:'T0004',
                        y:50,
                        drilldown:'T0004'
                    },
                    {
                        name:'T0005',
                        y:80,
                        drilldown:'T0005'
                    },
                    {
                        name:'T0006',
                        y:66,
                        drilldown:'T0006'
                    }
                ]
            },
        ]
        }
},

      //离群统计报表
      outlier:{
              itemTitle:'离群统计报表',
              title:Object.assign({},publicSet.title),
              credits:publicSet.credits,
              legend:Object.assign({},publicSet.legend),
              tooltip:Object.assign({},publicSet.tipStyle,{
                pointFormat: '<span style="display:block;padding:0 5px;background:#798697;">报警次数:{point.y}</span>'
              }),

              chart:Object.assign({},publicSet.chart,{
                type:'column',
                // margin:0,
                height:365,
              }),
              plotOptions:publicSet.plotOptions,
              
              xAxis: {
                  type: 'category',
                  labels:{
                      style:{
                          color:'#000',
                      }
                  }
              },
              yAxis: {
                  title: {
                      text: '报警次数'
                  }
              },
              series: [{
                  name: '群组列表',
                  colorByPoint: true,
                  data: [{
                      name: 'M1',
                      y: 86,
                      drilldown: 'M1'
                  }, {
                      name: 'M2',
                      y: 28,
                      drilldown: 'M2'
                  }, {
                      name: 'M3',
                      y: 30,
                      drilldown: 'M3'
                  }, {
                      name: 'M4',
                      y: 60,
                      drilldown: 'M4'
                  }, {
                      name: 'M5',
                      y: 1,
                      drilldown: 'M5'
                  // }, {
                  //     name: 'Proprietary or Undetectable',
                  //     y: 0.2,
                  //     drilldown: null
                  },
                  {
                      name: 'M7',
                      y: 18,
                      drilldown: null
                  },
                  {
                      name: 'M8',
                      y: 38,
                      drilldown: null
                  },
                  {
                      name: 'M9',
                      y: 26,
                      drilldown: null
                  },
             
              ]
              }],
              drilldown: {
                  activeAxisLabelStyle:publicSet.activeAxisLabelStyle,
                  series: [
                      {
                      name: 'M1',
                      id: 'M1', //MUST
                      data: [
                          {
                              name:'T0001',
                              y:100,
                              drilldown:'T0001'
                          },
                          {
                              name:'T0002',
                              y:80,
                              drilldown:'T0002'
                          },
                          {
                              name:'T0003',
                              y:66,
                              drilldown:'T0003'
                          },
                          {
                              name:'T0004',
                              y:50,
                              drilldown:'T0004'
                          },
                          {
                              name:'T0005',
                              y:80,
                              drilldown:'T0005'
                          },
                          {
                              name:'T0006',
                              y:66,
                              drilldown:'T0006'
                          }
                      ]
                  },
                  {
                      name: 'M2',
                      id: 'M2', //MUST
                      data: [
                          {
                              name:'T0001',
                              y:100,
                              drilldown:'T0001'
                          },
                          {
                              name:'T0002',
                              y:80,
                              drilldown:'T0002'
                          },
                          {
                              name:'T0003',
                              y:66,
                              drilldown:'T0003'
                          },
                          {
                              name:'T0004',
                              y:50,
                              drilldown:'T0004'
                          },
                          {
                              name:'T0005',
                              y:80,
                              drilldown:'T0005'
                          },
                          {
                              name:'T0006',
                              y:66,
                              drilldown:'T0006'
                          }
                      ]
                  },
                  {
                      name: 'M3',
                      id: 'M3', //MUST
                      data: [
                          {
                              name:'T0001',
                              y:100,
                              drilldown:'T0001'
                          },
                          {
                              name:'T0002',
                              y:80,
                              drilldown:'T0002'
                          },
                          {
                              name:'T0003',
                              y:66,
                              drilldown:'T0003'
                          },
                          {
                              name:'T0004',
                              y:50,
                              drilldown:'T0004'
                          },
                          {
                              name:'T0005',
                              y:80,
                              drilldown:'T0005'
                          },
                          {
                              name:'T0006',
                              y:66,
                              drilldown:'T0006'
                          }
                      ]
                  },
                  {
                      name: 'M4',
                      id: 'M4', //MUST
                      data: [
                          {
                              name:'T0001',
                              y:100,
                              drilldown:'T0001'
                          },
                          {
                              name:'T0002',
                              y:80,
                              drilldown:'T0002'
                          },
                          {
                              name:'T0003',
                              y:66,
                              drilldown:'T0003'
                          },
                          {
                              name:'T0004',
                              y:50,
                              drilldown:'T0004'
                          },
                          {
                              name:'T0005',
                              y:80,
                              drilldown:'T0005'
                          },
                          {
                              name:'T0006',
                              y:66,
                              drilldown:'T0006'
                          }
                      ]
                  },
                  {
                      name: 'M5',
                      id: 'M5', //MUST
                      data: [
                          {
                              name:'T0001',
                              y:100,
                              drilldown:'T0001'
                          },
                          {
                              name:'T0002',
                              y:80,
                              drilldown:'T0002'
                          },
                          {
                              name:'T0003',
                              y:66,
                              drilldown:'T0003'
                          },
                          {
                              name:'T0004',
                              y:50,
                              drilldown:'T0004'
                          },
                          {
                              name:'T0005',
                              y:80,
                              drilldown:'T0005'
                          },
                          {
                              name:'T0006',
                              y:66,
                              drilldown:'T0006'
                          }
                      ]
                  },
                  {
                      name: 'M6',
                      id: 'M6', //MUST
                      data: [
                          {
                              name:'T0001',
                              y:100,
                              drilldown:'T0001'
                          },
                          {
                              name:'T0002',
                              y:80,
                              drilldown:'T0002'
                          },
                          {
                              name:'T0003',
                              y:66,
                              drilldown:'T0003'
                          },
                          {
                              name:'T0004',
                              y:50,
                              drilldown:'T0004'
                          },
                          {
                              name:'T0005',
                              y:80,
                              drilldown:'T0005'
                          },
                          {
                              name:'T0006',
                              y:66,
                              drilldown:'T0006'
                          }
                      ]
                  },
              ]
              }
      },
      //统计异常报警
      chartAlert:{
      itemTitle:'报警统计(近一个月)',
      title:Object.assign({},publicSet.title),
      credits:publicSet.credits,
      tooltip:Object.assign({},publicSet.tipStyle,{
        valueSuffix: ' 次'
      }),
      legend:Object.assign({},publicSet.legend),
      plotOptions: publicSet.plotOptions,

      chart:Object.assign({},publicSet.chart, {
        type: 'bar',
        height:164
     }),
     colors:[
        publicSet.linearStyle
     ],
     xAxis: {
        categories: ['围栏', '求救', '强拆'],
        title: {
            text: null
        }
     },
     yAxis: {
        min: 0,
        title: {
            text: '报警次数 (次)',
            // align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
     },
     series: [
        {
            name: '报警',
            data: [107,68,168]
        },
     ]
   },
    attendance_chart:{},
}