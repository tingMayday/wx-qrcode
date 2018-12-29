let QRCode = require('../../utils/qrCode.js')
Page({
  data: {
    showLayerBox: false,
    qrCode: '',
    text: '智障250',
    colorLight: '#fff',
    colorDark: '#000',
    colorTypeSel: 'colorLight',
    cp_cColor: ['#000', '#fff', '#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'],
    cp_colorShow: ''
  },

  onLoad: function () {
    this.code()
  },
  bindText(e){
    this.setData({
      text: e.detail.value
    })
  },

  code(){
    let 
      _this = this;
    _this.data.qrCode = new QRCode('canvas', {
      text: _this.data.text,
      width: '200',
      height: '200',
      colorLight: _this.data.colorLight,
      colorDark: _this.data.colorDark,
      correctLevel: QRCode.CorrectLevel.H
    })
  },

  download(){
    this.data.qrCode.exportImage(function(res){
      wx.saveImageToPhotosAlbum({
        filePath: res,
        success(ret) { 
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          })
        }
      })
    })
  },

  showLayerBox(e){
    let
      _this = this,
      pageData = Object.assign({}, _this.data),
      dataset = e.currentTarget.dataset,
      animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      });
    animation.opacity("1").step()
    pageData.animationData = animation.export();
    pageData.showLayerBox = true;
    pageData.colorTypeSel = dataset.type
    pageData.cp_colorShow = pageData[dataset.type]
    _this.setData(pageData)
  },

  hideLayerBox(){
    let
      _this = this,
      pageData = Object.assign({}, _this.data),
      animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      });
    animation.opacity("0").step()
    pageData.animationData = animation.export();
    pageData.showLayerBox = false
    _this.setData(pageData)
  },

  // 模块数据通讯
  colorSel(e){
    let
     _this = this,
     pageData = Object.assign({}, _this.data);
    pageData[pageData.colorTypeSel] = e.detail.color
    _this.setData(pageData)
    _this.code()
    _this.hideLayerBox()
  }
})
