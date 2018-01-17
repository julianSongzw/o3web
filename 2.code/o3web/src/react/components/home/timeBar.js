/* 
 * @Title: $时间轴 
 * @Description: Todo 
 * @Author: weijq@cychina.cn (韦继强) 
 * @Date: 2018-01-11 17:23:00 
 * @Last Modified by: weijq@cychina.cn (韦继强) 
 * @Last Modified time: 2018-01-11 17:23:00 
 * @Version:V1.0 
 * Company: 合肥安慧软件有限公司 
 * Copyright: Copyright (c) 2017' 
 */

import React from 'react';
import styles from './timeBar.css';
import moment from 'moment';
// import $ from 'jquery';

class TimeBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flidBarWidth: 0,
    };
    this.date;
  }

  componentDidMount() {
    let timestamp = Date.parse(new Date()) - 600000;
    //5min数据
    this.date = parseInt(timestamp / 300000) * 300000;
    // this.date = new Date();
    this.timer = setInterval(this.clock.bind(this), 300000);
    this.clock();
    //计算剩余时间倒计时
    // let initDate = parseInt(this.date / 3600000) * 3600000;
    // this.surplusTime = 1000 * 60 * 60 - (this.date - initDate);
    // this.timeOut = setTimeout(this.reloadTimeDate, this.surplusTime);

  }

  componentWillUnmount(){
    // 如果存在this.timer，则使用clearTimeout清空。
    // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
    // this.timeOut && clearTimeout(this.timeOut);
    this.timer && clearInterval(this.timer);
  }

  // reloadTimeDate() {
  //   let timestamp = Date.parse(new Date()) - 600000;
  //   //5min数据
  //   this.date = parseInt(timestamp / 300000) * 300000;
  //   this.surplusTime = 1000 * 60 * 60;
  //   this.forceUpdate();
  //   this.timeOut && clearTimeout(this.timeOut);
  //   this.timeOut = setTimeout(this.reloadTimeDate, this.surplusTime);
  // }



  clock() {
    debugger;
    let timeLineEle = document.getElementById('time_line');
    if (timeLineEle) {
      let timeLineEleWidth = timeLineEle.offsetWidth;
      console.log(timeLineEleWidth);

      //开始时间和当前时间差
      // //10min前
      let timestamp = Date.parse(new Date()) - 600000;
      //5min数据
      let currentDate = parseInt(timestamp / 300000) * 300000;
      // let currentDate = Date.parse(new Date());
      //初始时间
      let initDate = parseInt(this.date / 3600000) * 3600000;
      //时间进度条长度
      let flidBarWidth = parseInt(((currentDate - initDate) / 60000) * (timeLineEleWidth / 180));
      console.log(flidBarWidth);
      debugger;
      this.setState({
        flidBarWidth: flidBarWidth,
        timeBaseCurrentDate: currentDate
      });
      //调用父组件方法
      this.props.timeBaseUpdate(currentDate);
    }
  }


  render() {

    // let minFlagArr;
    let timestamp = Date.parse(new Date()) - 600000;
    //5min数据
    let dateTime = parseInt(timestamp / 300000) * 300000;
    // let dateTime = new Date();

    return (
      <div id="time_box" className={styles.timeBox}>
        <div id="time_line" className={styles.timeLine}>
          <div className={styles.flidBarWidth} style={{ width: `${this.state.flidBarWidth}px` }}>
            <div className={styles.timeTip}>{moment(dateTime).format('HH:mm')}</div>
          </div>
          <div className={styles.minFlag}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className={styles.timeDate}>
          <div className={styles.time1}>
            <div className={styles.timeNumber}>
              <span>0</span>
              <span>10</span>
              <span>20</span>
              <span>30</span>
              <span>40</span>
              <span>50</span>
              <span></span>
            </div>
            <span className={styles.timeHour}>{moment(this.date).format('MM/DD  HH')}时</span>
          </div>
          <div className={styles.deliver}></div>
          <div className={styles.time1}>
            <div className={styles.timeNumber}>
              <span>0</span>
              <span>10</span>
              <span>20</span>
              <span>30</span>
              <span>40</span>
              <span>50</span>
              <span></span>
            </div>
            <span className={styles.timeHour}>{parseInt(moment(this.date).format('HH')) + 1}时</span>
          </div>
          <div className={styles.deliver}></div>
          <div className={styles.time1}>
            <div className={styles.timeNumber}>
              <span>0</span>
              <span>10</span>
              <span>20</span>
              <span>30</span>
              <span>40</span>
              <span>50</span>
              <span></span>
            </div>
            <span className={styles.timeHour}>{parseInt(moment(this.date).format('HH')) + 2}时</span>
          </div>
        </div>
      </div>


    )
  }

}

export default TimeBar;
