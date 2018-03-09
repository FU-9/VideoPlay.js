function VideoPlay(obj){
      this.el = document.querySelector(obj.el);
      this.poster = obj.poster || "";
      this.onload = obj.onload
      this.is_play = false;
      this.is_mute = false;
      this.__init__()
    }
    VideoPlay.prototype.__init__ = function(){
      this.set_poster(this.poster)
      this.onload()
    }
    /**
     * 设置播放速度
     * @return {[type]} [description]
     */
    VideoPlay.prototype.set_speed = function(speed){
      if(speed > 10){
        speed = 10;
      }else if(speed < 0){
        speed = 0;
      }
      this.el.playbackRate = Math.ceil(speed)
    }
    /**
     * 播放
     * @return {[type]} [description]
     */
    VideoPlay.prototype.play = function(){
      this.el.play();
    }
    /**
     * 暂停
     * @return {[type]} [description]
     */
    VideoPlay.prototype.pause = function(){
      this.el.pause();
    }
    /**
     * 获取视频总时长
     * @return {[type]} [description]
     */
    VideoPlay.prototype.duration = function(){
      return this.el.duration;
    }
    /**
     * 获取当前播放的时间
     * @return {[type]} [description]
     */
    VideoPlay.prototype.currentTime = function(){
      return this.el.currentTime
    }
    /**
     * 设置封面图
     * @return {[type]} [description]
     */
    VideoPlay.prototype.set_poster = function(url){
      this.el.setAttribute('poster',url)
    }
    /**
     * 开启／关闭 声音
     * @return {[type]} [description]
     */
    VideoPlay.prototype.switch_sound = function(obj,open_callback,close_callback){
      var switch_sound = document.querySelector(obj.el);
      switch_sound.onclick = function(){
        this.is_mute = !this.is_mute;
        if(this.is_mute){
          close_callback(switch_sound);
          this.el.muted = this.is_mute;
        }else{
          open_callback(switch_sound);
          this.el.muted = this.is_mute;
        }
      }.bind(this)
    }
    VideoPlay.prototype.set_sound = function(obj){
      var _self = this;
      var set_sound = document.querySelector(obj.el);
      set_sound.children[0].style.left = (_self.el.volume-set_sound.children[0].offsetWidth/set_sound.offsetWidth)*100+'%';
      _self.drag(set_sound,function(pos){
        _self.el.volume = pos
      },function(){})
    }
    /**
     * 播放／暂停
     * @return {[type]} [description]
     */
    VideoPlay.prototype.video_switch = function(obj,play_callback,pause_callback){
      var video_switch = document.querySelector(obj.el);
      video_switch.onclick = function(){
        this.is_play = !this.is_play;
        if(this.is_play){
          play_callback(video_switch)
          this.play()
        }else{
          pause_callback(video_switch)
          this.pause()
        }
      }.bind(this)
    }
    /**
     * 设置时间进度
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    VideoPlay.prototype.video_time = function(obj){
      var _self = this;
      var all_time = null;
      var played_time = null;
      var video_time = document.querySelector(obj.el);
      setInterval(function(){
        all_time = (_self.duration()/60).toString().substring(0,4).replace(".",":");
        played_time = (_self.currentTime()/60).toString().substring(0,4).replace(".",":");
        video_time.innerHTML = played_time+"/"+all_time;
      },1000)
    }

    /**
     * 进度条
     * @return {[type]} [description]
     */
    VideoPlay.prototype.progress_bar = function(obj){
      var _self = this;
      var progress = null;
      var timeer   = null;
      var progress_bar = document.querySelector(obj.el);
      var p_w = progress_bar.offsetWidth;
      var c_w = progress_bar.children[0].offsetWidth;
      function listen(){
        clearInterval(timeer)
        timeer = setInterval(function(){
          progress = (_self.currentTime()/_self.duration())*100;
          if(progress>=(100-((c_w/p_w)*100))){
            progress = 100-((c_w/p_w)*100)
          }
          progress_bar.children[0].style.left =  progress+"%";
        },1000)
      }
      listen()
      _self.drag(progress_bar,function(pos){
        clearInterval(timeer)
        _self.el.currentTime = pos*_self.duration()
      },function(){
        listen()
      })
    }
    /**
     * 进度条拖拽
     * @param  {[type]} obj           [description]
     * @param  {[type]} drag_callback [description]
     * @param  {[type]} up_callback   [description]
     * @return {[type]}               [description]
     */
    VideoPlay.prototype.drag = function(obj,drag_callback,up_callback){
      obj.onclick = function(ev){
        var e = e || event;
        var x = (e.clientX - obj.offsetLeft)/(obj.offsetWidth+obj.children[0].offsetWidth);
        obj.children[0].style.left = x*100 +'%';
        drag_callback(x);
        console.log(x);
      }
      obj.children[0].onmousedown = function(ev){
        var e = ev || event;
        var x = e.clientX - obj.children[0].offsetLeft;
        document.onmousemove = function(ev){
          var e = ev || event;
          if((e.clientX - x) >=0 && (e.clientX - x) <= obj.offsetWidth-obj.children[0].offsetWidth){
            obj.children[0].style.left = e.clientX - x + 'px';
            drag_callback(obj.children[0].offsetLeft/(obj.offsetWidth-obj.children[0].offsetWidth))
          }
        }
        document.onmouseup = function(ev){
          up_callback()
　　　　　　document.onmousemove = null;
　　　　　　document.onmouseup = null;
　　　　  };
      }
    }
    VideoPlay.prototype.full_screen = function(){

    }