const teacherBar = {
  // title: {
  //   text: "开课统计"
  // },
  tooltip: {
    name: "开课统计",
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  legend: {
    orient: "horizontal",
    bottom: "0",
    data: ["停课", "开课"]
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "12%",
    containLabel: true
  },
  xAxis: [
    {
      type: "category",
      axisTick: {
        alignWithLabel: true,
        interval: 0
      },
      axisLabel: {
        interval: 0,
        // rotate: -45,
        color: "#9A9A9A"
      }
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: [
    {
      name: "停课",
      type: "bar",
      stack: "one",
      itemStyle: {
        color: "#3AA1FF"
      }
    },
    {
      name: "开课",
      type: "bar",
      stack: "one",
      itemStyle: {
        color: "#4ECB73"
      }
    }
  ]
};

const studentBar = {
  // title: {
  //   text: "开课统计"
  // },
  tooltip: {
    name: "到课统计",
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  legend: {
    orient: "horizontal",
    bottom: "0",
    data: ["缺课", "请假", "巡检异常", "上课时长不足"]
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "12%",
    containLabel: true
  },
  xAxis: [
    {
      type: "category",
      axisTick: {
        alignWithLabel: true,
        interval: 0
      },
      axisLabel: {
        interval: 0,
        // rotate: -45,
        color: "#9A9A9A"
      }
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: [
    {
      name: "缺课",
      type: "bar",
      stack: "one",
      itemStyle: {
        color: "#3AA0FF"
      }
    },
    {
      name: "请假",
      type: "bar",
      stack: "one",
      itemStyle: {
        color: "#4ECB73"
      }
    },
    {
      name: "巡检异常",
      type: "bar",
      stack: "one",
      itemStyle: {
        color: "#F8D237"
      }
    },
    {
      name: "上课时长不足",
      type: "bar",
      stack: "one",
      itemStyle: {
        color: "#435088"
      }
    }
  ]
};

const line = {
  // title: {
  //   text: "经营情况"
  // },
  tooltip: {
    trigger: "axis"
  },
  legend: {
    orient: "horizontal",
    bottom: "0",
    data: ["合计", "应收款", "退款"]
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: "value"
  },

  series: [
    {
      name: "合计",
      type: "line",
      symbol: "circle",
      lineStyle: {
        color: "#3AA1FF"
      },
      itemStyle: {
        borderWidth: 3,
        borderColor: "#3AA1FF",
        color: "#3AA1FF"
      }
    },
    {
      name: "应收款",
      type: "line",
      symbol: "circle",
      lineStyle: {
        color: "#4ECB73"
      },
      itemStyle: {
        borderWidth: 3,
        borderColor: "#4ECB73",
        color: "#4ECB73"
      }
    },
    {
      name: "退款",
      type: "line",
      symbol: "circle",
      lineStyle: {
        color: "#FBD437"
      },
      itemStyle: {
        borderWidth: 3,
        borderColor: "#FBD437",
        color: "#FBD437"
      }
    }
  ]
};

export { teacherBar, studentBar, line };
