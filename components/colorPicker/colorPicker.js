Component({
  behaviors: [],
  properties: {
    cusColor: {
      type: Array,
      value: ['#000', '#fff', '#f00', '#0f0', '#00f', '#ff0', '#0ff','#f0f']
    },
    colorShow: {
      type: String,
      value: 'rgba(0,0,0,1)',
      observer(newVal, oldVal, changedPath) {
        this._colorShowChange(newVal, oldVal)
      }
    }
  },
  data: {
    showMore: false,
    hslaArr: [0, 0, 0, 100]
  },

  pageLifetimes: {
    show: function () { },
  },

  methods: {
    // show more color
    _showMore(){
      this.setData({
        showMore: true
      })
    },
    // hsla slider change
    _hslaSlider(e){
      let
        _this = this,
        pageData = Object.assign({}, _this.data),
        dataset = e.currentTarget.dataset,
        detail = e.detail;
      pageData.hslaArr[dataset.idx] = detail.value
      // 转换为rgba
      pageData.colorShow = _this._hslaToRgba(pageData.hslaArr)
      _this.setData(pageData)
    },

    // coutom color select
    colorSel(e) {
      let
        dataset = e.currentTarget.dataset,
        rgba = this._hexToRgba(dataset.color)
      this.triggerEvent('colorsel', {color: rgba});
      this.setData({
        colorShow: rgba
      })
    },

    _colorConfirm(){
      this.triggerEvent('colorsel', {color: this.data.colorShow});
    },

    // 监听颜色变化
    _colorShowChange(newVal, oldVal){
      let 
        _this = this,
        pageData = Object.assign({}, _this.data),
        reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/,
        rgba = [];
      if (reg.test(newVal)){
        newVal = this._hexToRgba(newVal)
      }
      if (newVal){
        rgba = newVal.split('(')[1].split(')')[0].split(',')
      } else {
        rgba = oldVal.split('(')[1].split(')')[0].split(',')
      }
      pageData.hslaArr = this.rgbaToHsla(rgba)
      _this.setData(pageData)
    },

    /**
     * HSLA 转换为 RGBA.
     * @init Array HSLA各值数组
     * h, s, l 和 a 需要在 [0, 100] 范围内
     * @return String 格式：rgba(xx，xx，xx，x))
     */
    _hslaToRgba(hsla){
      console.log(88,hsla)
      let 
        r, g, b,
        h = hsla[0]/100, 
        s = hsla[1]/100, 
        l = hsla[2]/100, 
        a = hsla[3]/100,
        rgbaArr = [];
      if (s == 0) {
        r = g = b = l; 
      } else {
        var hue2rgb = function hue2rgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        }
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      } 
      rgbaArr = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), parseFloat(a)];
      return "rgba(" + rgbaArr.join(",") + ")";
    },

    /**
     * 16进制颜色值 转换为 RGBA.
     * @init String 16进制颜色值字符串
     * @return String 格式：rgba(xx，xx，xx，x))
     */
    _hexToRgba(HEX, opacity=1) {
      let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
      if (HEX && reg.test(HEX)) {
        if (HEX.length === 4) {
          var HEXNew = "#";
          for (var i = 1; i < 4; i += 1) {
            HEXNew += HEX.slice(i, i + 1).concat(HEX.slice(i, i + 1));
          }
          HEX = HEXNew;
        }
        var HEXChange = [];
        for (var i = 1; i < 7; i += 2) {
          HEXChange.push(parseInt("0x" + HEX.slice(i, i + 2)));
        }
        return "rgba(" + HEXChange.join(",") + ',' + opacity + ")";
      } else {
        return HEX;
      }
    },

    /**
     * RGBA 颜色值转换为 HSLA.
     * @init Array RGBA各值数组
     * r, g, 和 b 需要在 [0, 255] 范围内 a在[0,1]范围内
     * 返回的 h, s, l和 a 在 [0, 100] 之间
     * @return  Array HSLA各值数组
     */
    rgbaToHsla(rgba) {
      let 
        r = rgba[0] /= 255, 
        g = rgba[1] /= 255, 
        b = rgba[2] /= 255,
        a = rgba[3],
        hslaArr = [];
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;
      if (max == min) {
        h = s = 0; // achromatic
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return [Math.round(h * 100), Math.round(s * 100), Math.round(l * 100), Math.round(a * 100)];
    }
  }

})