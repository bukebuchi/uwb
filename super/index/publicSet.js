var publicSet={
    title:{
        text:null,
    },
    paneStyle:{
        center: ['50%', '80%'],
        size: '120%',
        startAngle: -90,
        endAngle: 90,
        background:[
            {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                        [0, '#FFF'],
                        [1, '#333']
                ],
                backgroundColor:'#dde8ed',
                innerRadius: '80%',
                outerRadius: '100%',
                shape: 'arc'
            },
        ],
    },
    linearStyle:{
        linearGradient: { 
            x1: 0, 
            y1: 1, 
            x2: 0, 
            y2: 0 
        },
        stops: [
            [0, '#efdc76'],
            [1, '#42adfc']
        ]
          
    },

    gaugeLinearStyle:{
        linearGradient: { 
            x1: 0, 
            y1: 1, 
            x2: 1, 
            y2: 1 
        },
        stops: [
            [0, '#efdc76'],
            [1, '#42adfc']
        ]
          
    },
    activeAxisLabelStyle:{
        color:'#48576a',
        // textDecoration:null,
        fontWeight:400
    },
    tipStyle:{
        backgroundColor:'#798697',
        borderColor:'#798697',
        borderRadius:0,
        style:{
            color:'#fff',
            // fontSize:14
        }
    },
    credits:{
        enabled:false,
    },
    legend:{
        enabled: false
    },
    chart:{
        style:{
            backgroundColor:'#fff',
            fontSize:'12px',
            color:'#48576a',
            spacingTop:'45px',
        },
        events:{
            drilldown:function(e){
                if(this.series[0].data.length <= 8){
                    this.options.plotOptions.column.pointWidth=20;
                }else {
                    this.options.plotOptions.column.pointWidth=Math.floor(this.chartWidth/this.series[0].data.length);
                    // this.options.plotOptions.column.pointPadding=1;
                }
            },
        }
    },
    plotOptions: {
        series: {
            borderWidth: 0,
        },
        bar: {
            dataLabels: {
                enabled: true,
                allowOverlap: true // 允许数据标签重叠
            }
        },
        column:{
            pointWidth: 30,
            // maxPointWidth:3
        },
        solidgauge: {
            dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
            },
          innerRadius:'80%'
        },
        gauge:{
          dial:{
              backgroundColor:'#48576a',
              borderColor: '#48576a',
              radius:'100%',
              borderWidth:1,
              topWidth:0
              // baseLength:'120%',
              
          },
        }
    },
}