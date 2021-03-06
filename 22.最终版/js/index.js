window.addEventListener('DOMContentLoaded',function () {
  //获取元素
  var header = document.getElementById('header');
  var mask = document.getElementById('mask');
  var maskUp = document.querySelector('#mask .maskUp');
  var maskDown = document.querySelector('#mask .maskDown');
  var maskLine = document.querySelector('#mask .maskLine');
  var myAudio = document.querySelector('#header .headerMain .music>audio');
  var myMusic = document.querySelector('#header .headerMain .music');
  var content = document.getElementById('content');
  var contentItems = document.querySelectorAll('#content .contentItem');
  var contentList = document.querySelector('#content .contentList')
  var arrow = document.querySelector('#header .headerMain .arrow');
  var navUps = document.querySelectorAll('#header .headerMain .nav .navList .navItem .up');
  var navItems = document.querySelectorAll('#header .headerMain .nav .navList .navItem');
  var homeIcons = document.querySelectorAll('#content .contentList .home .homeNav .homeIcon')
  var homeItems = document.querySelectorAll('#content .contentList .home .homeList .homeItem')
  var menuItems = document.querySelectorAll('#content .menuList .menuItem');
  var team3Items = document.querySelectorAll('#content .contentList .team .team3 .team3List .team3Item')
  var team3 = document.querySelector('#content .contentList .team .team3');
  var index = 0;//定义主体内容区的索引，（鼠标滚轮的部分）
  var oldIndex = 0//轮播图部分的索引
  var timeId = null;//鼠标滚轮的id
  var autoTimeId = null;//自动轮播部分的id
  var isAnimation = false;//标识轮播图是否正在进行切换
  var myCanvas = null;
  var time1 = null;
  var time2 = null;

  //响应缩放逻辑
  window.onresize = function () {
    contentBind()
    contentMove(index)
  }

  //头部交互
  headerBind()
  function headerBind() {
    //初始化第一个up元素高亮
    navUps[index].style.width = '100%'
    //初始化三角的位置
    arrow.style.left = navItems[index].getBoundingClientRect().left + navItems[index].offsetWidth/2 + 'px';
    for (var i=0; i<navItems.length; i++ ){
      var item = navItems[i];
      item.index = i
      //给每一个导航的li加点击事件
      item.onclick = function () {
        animationArr[index].outAnimation()
        animationArr[this.index].inAnimation()
        index = this.index
        contentMove(this.index)
      }
    }
  }

  //内容区逻辑
  contentBind()
  function contentBind() {
    //设置承接内容盒子的高度
    content.style.height = document.documentElement.clientHeight - header.offsetHeight + 'px';
    //给每一屏设置高度
    for (var i=0; i<contentItems.length; i++ ){
      contentItems[i].style.height = document.documentElement.clientHeight - header.offsetHeight + 'px';
    }
  }

  //屏幕切换逻辑
  function contentMove(index) {
    //1.清除导航区所有高亮效果
    for (var j=0; j<navUps.length; j++ ){
      navUps[j].style.width = ''
    }
    //2.给当前点击的导航加上高亮
    navUps[index].style.width = '100%'
    //3.重置所有侧边栏按钮高亮
    for (var j=0; j<menuItems.length; j++ ){
      menuItems[j].className = 'menuItem';
    }
    //4.给当前的加上高亮
    menuItems[index].className = 'menuItem active'
    //5.移动三角到当前位置
    arrow.style.left = navItems[index].getBoundingClientRect().left + navItems[index].offsetWidth/2 + 'px';
    //6.移动内容区
    contentList.style.top = -(index)*(document.documentElement.clientHeight - header.offsetHeight) +'px'
  }

  //鼠标滚轮逻辑
  mouseScroll()
  function mouseScroll() {
    //鼠标滚轮逻辑
    //ie/chrome
    document.onmousewheel = function (event) {
      //如果之前有定时器，清除之前的定时器
      clearTimeout(timeId)
      timeId = setTimeout(function () {
        scrollMove(event)
      },200)
    }
    //firefox
    if(document.addEventListener){
      document.addEventListener('DOMMouseScroll',function () {
        //如果之前有定时器，清除之前的定时器
        clearTimeout(timeId)
        timeId = setTimeout(function () {
          scrollMove(event)
        },200)
      });
    }
    function scrollMove(event) {
      event = event || window.event;
      var flag = '';
      if(event.wheelDelta){
        //ie/chrome
        if(event.wheelDelta > 0){
          //上
          flag = 'up';
        }else {
          //下
          flag = 'down'
        }
      }
      else if(event.detail){
        //firefox
        if(event.detail < 0){
          //上
          flag = 'up';
        }else {
          //下
          flag = 'down'
        }
      }
      //最终判断滚轮的方向
      switch (flag){
        case 'up':
          //滚轮向上滚动
          if(index>0){
            animationArr[index].outAnimation()
            index--
            animationArr[index].inAnimation()
            contentMove(index)
          }
          break;
        case 'down':
          //滚轮向下滚动
          if(index < navItems.length-1){
            animationArr[index].outAnimation()
            index++
            animationArr[index].inAnimation()
            contentMove(index)
          }
          break;
      }

      //取消默认行为
      event.preventDefault && event.preventDefault();
      return false;
    }
  }

  //第一屏点击切换轮播图
  home3D()
  function home3D() {
    for (var i=0; i<homeIcons.length; i++ ){
      var item = homeIcons[i];
      item.index = i
      item.onclick = function () {
        //判断是否正在进行动画切换
        if(isAnimation){
          return
        }
        //标识动画正在进行
        isAnimation = true
        //动画结束后，重置状态
        setTimeout(function () {
          isAnimation = false
        },2000)
        clearInterval(autoTimeId)
        //1.重置所有小圆点的样式
        for (var j=0; j<homeIcons.length; j++ ){
          homeIcons[j].className = 'homeIcon'
        }
        //2.给当前点击的加高亮
        this.className = 'homeIcon active'
        //3.判断当前点击的和之前的比较，（是上一张，还是下一张）
        if(oldIndex < this.index){
          //用户点击的是后面的（右面的）某一张
          homeItems[oldIndex].className = 'homeItem leftHide';//之前的一张隐藏
          homeItems[this.index].className = 'homeItem rightShow'//当前这一张显示
        }
        else if(oldIndex > this.index){
          //如果用户点击的是之前的某一张
          homeItems[oldIndex].className = 'homeItem rightHide';//之前的一张隐藏
          homeItems[this.index].className = 'homeItem leftShow'//当前这一张显示
        }
        oldIndex = this.index
        autoPlay()
      }
    }
  }

  //自动轮播
  autoPlay()
  function autoPlay() {
    autoTimeId = setInterval(function () {
      //判断是否正在进行动画切换
      if(isAnimation){
        return
      }
      //标识动画正在进行
      isAnimation = true
      //动画结束后，重置状态
      setTimeout(function () {
        isAnimation = false
      },2000)
      //1.重置所有的小圆点
      for (var i=0; i<homeIcons.length; i++ ){
        homeIcons[i].className = 'homeIcon'
      }
      //2.给当前切换到的这一个，加高亮
      homeIcons[oldIndex+1>3?0:oldIndex+1].className = 'homeIcon active'
      //3.控制上一屏和下一屏的动画
      homeItems[oldIndex].className = 'homeItem leftHide';
      homeItems[oldIndex+1>3?0:oldIndex+1].className = 'homeItem rightShow';


      if(oldIndex<homeItems.length-1){
        oldIndex++
      }else{
        oldIndex = 0
      }
    },3000)
  }

  //第五屏鼠标悬浮逻辑
  team()
  function team() {
    team3.onmouseleave =  function () {
      //鼠标移除整个team3容器，重置透明度
      for (var j=0; j<team3Items.length; j++ ){
        team3Items[j].style.opacity = '0.5'
      }
      myCanvas.remove();
      myCanvas = null;
      clearInterval(time1)
      clearInterval(time2)
    }
    for (var i=0; i<team3Items.length; i++ ){
      var item = team3Items[i];
      //当鼠标移入老师所在图层触发的逻辑
      item.onmouseenter = function () {
        //重置所有图层为半透明
        for (var j=0; j<team3Items.length; j++ ){
          team3Items[j].style.opacity = '0.5';
        }
        //给当前鼠标所在的透明度为1
        this.style.opacity = '1';
        //如果全局没有myCanvas层，新建
        if(!myCanvas){
          myCanvas = document.createElement('canvas');
          myCanvas.width = this.offsetWidth;
          myCanvas.height = this.offsetHeight;
          team3.appendChild(myCanvas);
          addAnimation();
        }
        myCanvas.style.left = this.offsetLeft + 'px';
      }
    }
  }

  //给canvas层增加动画
  function addAnimation() {
    var painting = myCanvas.getContext('2d');
    //承装圆的“容器”
    var arr = []

    //每隔一段时间，把容器中的圆，放到页面上
    time1 = setInterval(function () {
      //清空画布
      painting.clearRect(0,0,myCanvas.width,myCanvas.height)

      //加工圆
      for (var j=0; j<arr.length; j++ ){
        var item = arr[j];
        item.deg++;
        item.x = item.startX + Math.sin(item.deg*Math.PI/180)*item.pathScale*0.4
        item.y = item.startY - (item.deg*Math.PI/180)*item.pathScale*2;
        if(item.y+item.r<0){
          arr.splice(j,1)
        }
      }

      //使用圆（向页面上输出）
      for (var i=0; i<arr.length; i++ ){
        var item = arr[i]
        //用画笔画一个圆
        painting.beginPath();
        painting.arc(item.x,item.y,item.r,0,2*Math.PI);
        painting.fillStyle = 'rgba('+item.red+','+item.green+','+item.blue+','+item.a+')';
        painting.fill();
      }
    },16)

    //创造圆的工厂
    time2 = setInterval(function () {
      var obj = {}
      obj.r = Math.floor(Math.random()*8+2)
      obj.x = Math.floor(Math.random()*myCanvas.width);
      obj.y = myCanvas.height + obj.r
      obj.red = Math.floor(Math.random()*255);
      obj.green = Math.floor(Math.random()*255);
      obj.blue = Math.floor(Math.random()*255);
      obj.a = 1;
      arr.push(obj);

      //做曲线运动需要的属性
      obj.startX = obj.x;
      obj.startY = obj.y;
      obj.deg = 0;
      obj.pathScale = Math.floor(Math.random()*80 + 20)
    },17)
  }

  //侧边栏加点击事件
  menuList()
  function menuList() {
    for (var i=0; i<menuItems.length; i++ ){
      var item = menuItems[i];
      item.index = i;
      item.onclick = function () {
        //1.切换到点击的那一屏
        contentMove(this.index)
        animationArr[index].outAnimation()
        animationArr[this.index].inAnimation()
        //2.维护鼠标滚轮计数器
        index = this.index;
      }
    }
  }

  //音乐
  music()
  function music() {
    myMusic.onclick = function () {
      if(myAudio.paused){
        myAudio.play();
        myMusic.style.backgroundImage = 'url("./img/musicon.gif")';
      }else{
        myAudio.pause();
        myMusic.style.backgroundImage = 'url("./img/musicoff.gif")'
      }
    }
  }

  //出入场动画的容器
  var animationArr = [
    {
      inAnimation:function () {
        var homeList = document.querySelector('#content .contentList .home .homeList');
        var homeNav = document.querySelector('#content .contentList .home .homeNav');
        homeList.style.transform = 'translate(0,0)';
        homeList.style.opacity = '1'
        homeNav.style.transform = 'translate(0,0)';
        homeNav.style.opacity = '1'
      },
      outAnimation:function () {
        var homeList = document.querySelector('#content .contentList .home .homeList');
        var homeNav = document.querySelector('#content .contentList .home .homeNav');

        homeList.style.transform = 'translate(0,-200px)';
        homeList.style.opacity = '0.5'
        homeNav.style.transform = 'translate(0,200px)';
        homeNav.style.opacity = '0.5'

      }
    },
    {
      inAnimation:function () {
        var plane1 = document.querySelector('#content .contentList .course .plane1')
        var plane2 = document.querySelector('#content .contentList .course .plane2')
        var plane3 = document.querySelector('#content .contentList .course .plane3')
        plane1.style.transform = 'translate(0,0)';
        plane2.style.transform = 'translate(0,0)';
        plane3.style.transform = 'translate(0,0)';
      },
      outAnimation:function () {
        var plane1 = document.querySelector('#content .contentList .course .plane1')
        var plane2 = document.querySelector('#content .contentList .course .plane2')
        var plane3 = document.querySelector('#content .contentList .course .plane3')

        plane1.style.transform = 'translate(-200px,-200px)';
        plane2.style.transform = 'translate(-200px,200px)';
        plane3.style.transform = 'translate(200px,-200px)';
      }
    },
    {
      inAnimation:function () {
        var pencel1 = document.querySelector('#content .contentList .works .pencel1')
        var pencel2 = document.querySelector('#content .contentList .works .pencel2')
        var pencel3 = document.querySelector('#content .contentList .works .pencel3')
        pencel1.style.transform = 'translate(0,0)';
        pencel2.style.transform = 'translate(0,0)';
        pencel3.style.transform = 'translate(0,0)';
      },
      outAnimation:function () {
        var pencel1 = document.querySelector('#content .contentList .works .pencel1')
        var pencel2 = document.querySelector('#content .contentList .works .pencel2')
        var pencel3 = document.querySelector('#content .contentList .works .pencel3')

        pencel1.style.transform = 'translate(0,-40px)';
        pencel2.style.transform = 'translate(0,200px)';
        pencel3.style.transform = 'translate(200px,200px)';
      }
    },
    {
      inAnimation:function () {
        var box1 = document.querySelector('#content .contentList .about .about3 .about3Item:nth-child(1)')
        var box2 = document.querySelector('#content .contentList .about .about3 .about3Item:nth-child(2)')
        box1.style.transform = 'rotate(0)';
        box2.style.transform = 'rotate(0)';
      },
      outAnimation:function () {
        var box1 = document.querySelector('#content .contentList .about .about3 .about3Item:nth-child(1)')
        var box2 = document.querySelector('#content .contentList .about .about3 .about3Item:nth-child(2)')

        box1.style.transform = 'rotate(-30deg)';
        box2.style.transform = 'rotate(30deg)';
      }
    },
    {
      inAnimation:function () {
        var team1 = document.querySelector('#content .contentList .team .team1')
        var team2 = document.querySelector('#content .contentList .team .team2')
        team1.style.transform = 'translate(0,0)';
        team2.style.transform = 'translate(0,0)';

      },
      outAnimation:function () {
        var team1 = document.querySelector('#content .contentList .team .team1')
        var team2 = document.querySelector('#content .contentList .team .team2')
        team1.style.transform = 'translate(-200px,0)';
        team2.style.transform = 'translate(200px,0)';
      }
    }
  ]

  //让所有屏都出去出场效果
  for (var i=0; i<animationArr.length; i++ ){
    animationArr[i].outAnimation()
  }

  //开机动画
  var arr = ['bg1.jpg','bg2.jpg','bg3.jpg','bg4.jpg','bg5.jpg','about1.jpg','about2.jpg','about3.jpg','about4.jpg','worksimg1.jpg','worksimg2.jpg','worksimg3.jpg','worksimg4.jpg','team.png','greenLine.png'];
  var loaded = 0
  for (var j=0; j<arr.length; j++ ){
    var myImage = new Image();
    myImage.src = './img/'+arr[j];
    myImage.onload = function () {
      loaded++;
      maskLine.style.width = (loaded/arr.length)*100 + '%'
    }
  }

  maskLine.addEventListener('transitionend',function () {
    maskDown.style.height = '0'
    maskUp.style.height = '0'
    maskLine.remove()
    animationArr[0].inAnimation()
  })

  maskUp.addEventListener('transitionend',function () {
    mask.remove()
  })


})