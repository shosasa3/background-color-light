/*****


	簡易多色ライトアプリ
	#背景色を変えて、その画面をライト代わりにする。


*****/

//グローバル展開
phina.globalize();


//画面サイズ取得
let SCREEN_X = document.documentElement.clientWidth;
let SCREEN_Y = document.documentElement.clientHeight;


/***


	MainScene
	#簡易ライト画面
	##適当な場所を1回タッチして、設定画面に移るボタン表示


***/
phina.define("MainScene", {
	
	superClass: 'DisplayScene',

	//初期化
	init: function( param,option ) {

		this.superInit( param,option );


		this.COLOR_RGB = 1;	//フラグがRGB
		this.COLOR_HSL = 2;	//フラグがHSL

		if( typeof param.data === 'undefined' )
		{
			//初期値
			this.colorData = new Array( 127,127,127 );
			this.colorFlg  = this.COLOR_RGB;
		}
		else
		{
			this.colorData = param.data;
			this.colorFlg  = param.flg;
		}

		//背景色
		if( this.colorFlg == this.COLOR_RGB )
		{
			this.backgroundColor = 'rgb({0}, {1}, {2})'.format( this.colorData[0],this.colorData[1],this.colorData[2] );
		}
		else
		{
			this.backgroundColor = 'hsl({0}, {1}%, {2}%)'.format( this.colorData[0],this.colorData[1],this.colorData[2] );
		}

		let self = this;  //参照用


		/*
			ボタン作成
		*/
		//設定画面遷移ボタン
		this.toSettingButton = Button({
			text : '色を変更する',
			fill : 'white',
			fontColor: '#000000',
			fontSize: 28,
			stroke: 'rgb(100, 100, 100)',

		}).addChildTo( this ).setPosition( this.gridX.center(),this.gridY.center() );
		this.toSettingButton.hide();

		//もしボタンが押されたら?
		this.toSettingButton.onclick = function(){

			self.exit( "setting" ,{data: self.colorData,flg: self.colorFlg} );	//go to SettingScene
		};

		//画面をタッチしたら？
		this.onpointstart = function( e ) {

			if( this.toSettingButton.visible )
			{
				this.toSettingButton.hide();
			}
			else
			{
				this.toSettingButton.show();
			}
		};


	},//end init()


	//更新
	update: function() {

	},//end update()


});//end MainScene

/***


	TitleScene
	#一応タイトル画面を作っておく

***/
phina.define("TitleScene", {
	
	superClass: 'DisplayScene',

	//初期化
	init: function( param,option ) {

		this.superInit( param,option );


		this.backgroundColor = 'rgb(255, 255, 255)';
		
		let self = this;  //参照用

		//タイトルテキスト
		this.titleText = Label( "簡易多色ライト" ).addChildTo( this ).setPosition( this.gridX.center(),this.gridY.center() );
		this.titleText.fill = 'black';	//文字色

		/*
			ボタン作成
		*/
		//設定画面遷移ボタン
		this.toMainButton = Button({
			text : '始める',
			fill : 'white',
			fontColor: '#000000',
			fontSize: 28,
			stroke: 'rgb(100, 100, 100)',

		}).addChildTo( this ).setPosition( this.gridX.center(),this.gridY.center()+180 );

		//もしボタンが押されたら?
		this.toMainButton.onclick = function(){

			self.exit( "main" );	//go to SettingScene
		};

	},//end init()


	//更新
	update: function() {

	},//end update()


});//end TitleScene



/***


	SettingScene
	#色を変更する設定画面


***/
phina.define("SettingScene", {
	
	superClass: 'DisplayScene',

	//初期化
	init: function( param,option ) {

		this.superInit( param,option );

		this.COLOR_RGB = 1;	//フラグがRGB
		this.COLOR_HSL = 2;	//フラグがHSL

		this.colorFlg = param.flg;

		//色設定
		this.colorRGB = new Array( 3 );
		this.colorHSL = new Array( 3 );


		//背景色初期化
		if( this.colorFlg == this.COLOR_RGB )
		{
			this.colorRGB = param.data;
			this.backgroundColor = 'rgb({0}, {1}, {2})'.format( this.colorRGB[0],this.colorRGB[1],this.colorRGB[2] );
		}
		else
		{
			this.colorHSL = param.data;
			this.backgroundColor = 'hsl({0}, {1}%, {2}%)'.format( this.colorHSL[0],this.colorHSL[1],this.colorHSL[2] );
		}

		let sliderSize;
		if( SCREEN_X >= 700 )	//画面サイズが700px以上なら
		{
			sliderSize = 400;
		}
		else	//スマホにリサイズ
		{
			sliderSize = SCREEN_X * 0.6;
		}

		let sliderSpace;
		if( SCREEN_Y >= 700 )	//画面heightが700px以上なら
		{
			sliderSpace = 360;
		}
		else	//スマホにリサイズ
		{
			sliderSpace = SCREEN_Y * 0.5;
		}


		this.MIN_SLIDER_POS = this.gridX.center() - ( sliderSize / 2 );	//スライダー範囲の最小値
		this.MAX_SLIDER_POS = this.gridX.center() + ( sliderSize / 2 );	//スライダー範囲の最大値

		this.RGB_MAX = new Array( 255,255,255 );
		this.HSL_MAX = new Array( 360,100,100 );


		let self = this;  //参照用


		/*
		  スライダーのライン作成
		  ボタンよりも前に初期化しないと表示順の関係で隠れてしまう
		*/
		this.sliderLine = new Array( 3 );
		( 3 ).times( function( i ) {
			
			//スライダーのライン初期化
			self.sliderLine[i] = RectangleShape().addChildTo( self ).setPosition( self.gridX.center(),self.gridY.center() + ( ( i * (sliderSpace / 2) ) - (sliderSpace / 2) ) - 40 );
			self.sliderLine[i].setSize( ( self.MAX_SLIDER_POS - self.MIN_SLIDER_POS ),24 );
			self.sliderLine[i].fill = 'rgb(230, 230, 230)';
			self.sliderLine[i].stroke = 'white';
			self.sliderLine[i].strokeWidth = 4
			self.sliderLine[i].cornerRadius = 8;	//角の丸さ

		});
		
		//スライダー ボタンまでのライン
		this.sliderFillLine = new Array( 3 );
		( 3 ).times( function( i ) {
			
			//スライダーのライン初期化
			self.sliderFillLine[i] = RectangleShape().addChildTo( self ).setPosition( self.gridX.center(),self.gridY.center() + ( ( i * (sliderSpace / 2) ) - (sliderSpace / 2) ) - 40 );
			self.sliderFillLine[i].setSize( ( self.MAX_SLIDER_POS - self.MIN_SLIDER_POS ),24 );
			self.sliderFillLine[i].fill = 'rgb(180, 180, 180)';
			self.sliderFillLine[i].stroke = 'white';
			self.sliderFillLine[i].strokeWidth = 4
			self.sliderFillLine[i].cornerRadius = 8;	//角の丸さ

		});

		this.sliderGroup = DisplayElement().addChildTo( this );	//ボタンスライダーグループ

		//ボタンスライダー生成
		( 3 ).times( function( i ) {
			
			let slider = CircleSlider().addChildTo( self.sliderGroup ).setPosition( self.sliderLine[i].x,self.sliderLine[i].y );

			//ボタンX座標調整
			if( self.colorFlg == self.COLOR_RGB )
			{
				let sSize = self.MAX_SLIDER_POS - self.MIN_SLIDER_POS;
				let xPlus = ( self.colorRGB[i] / self.RGB_MAX[i] ) * sSize;
				slider.x = self.MIN_SLIDER_POS + xPlus;
			}
			else
			{
				let sSize = self.MAX_SLIDER_POS - self.MIN_SLIDER_POS;
				let xPlus = ( self.colorHSL[i] / self.HSL_MAX[i] ) * sSize;
				slider.x = self.MIN_SLIDER_POS + xPlus;
			}

			slider.radius = 20;	//サイズ
			slider.fill = 'white';
			slider.stroke = 'rgb(100, 100, 100)';
			slider.setInteractive( true );	//タッチ有効に
		});

		/*
			スライダーテキスト作成
		*/
		this.colorValueText = new Array( 3 );	//色の値を表示するテキスト
		this.colorNameText  = new Array( 3 );	//色の名前を表示するテキスト(ex:RGB,)
		this.COLOR_RGB_NAME = new Array( "RED","GREEN","BLUE" );
		this.COLOR_HSL_NAME = new Array( "H","S","L" );

		this.sliderGroup.children.each( function( slider,i ) {
			
			//テキスト関連初期化
			self.colorValueText[i] = Label( "" ).addChildTo( self ).setPosition( self.MAX_SLIDER_POS,slider.y + 60 );
			self.colorValueText[i].fill = 'black';	//文字色
			self.colorValueText[i].stroke = 'white'; //縁の色
			self.colorValueText[i].strokeWidth = 4;	//縁のサイズ

			if( self.colorFlg == self.COLOR_RGB )
			{
				self.colorNameText[i] = Label( self.COLOR_RGB_NAME[i] ).addChildTo( self ).setPosition( self.MIN_SLIDER_POS,slider.y + 60 );
			}
			else
			{
				self.colorNameText[i] = Label( self.COLOR_HSL_NAME[i] ).addChildTo( self ).setPosition( self.MIN_SLIDER_POS,slider.y + 60 );
			}
			self.colorNameText[i].fill = 'black';	//文字色
			self.colorNameText[i].stroke = 'white'; //縁の色
			self.colorNameText[i].strokeWidth = 4;	//縁のサイズ

		});

		/*
			ボタン作成
		*/
		//RGBorHSL変更
		this.cChangeButton = Button({
			text : '',
			fill : 'white',
			fontColor: '#000000',
			fontSize: 28,
			stroke: 'rgb(100, 100, 100)',

		}).addChildTo( this ).setPosition( this.gridX.center(),this.colorValueText[this.colorValueText.length - 1].y + 84 );

		//RGBorHSL ボタンテキスト初期化
		if( self.colorFlg == self.COLOR_RGB )
		{
			self.cChangeButton.text = 'RGB->HSL';
		}
		else
		{
			self.cChangeButton.text = 'HSL->RGB';
		}


		//戻る
		this.backButton = Button({
			text : '←戻る',
			fill : 'white',
			fontColor: '#000000',
			fontSize: 20,
			stroke: 'rgb(100, 100, 100)',

		}).addChildTo( this ).setPosition( this.gridX.center() - ( sliderSize / 2 ), this.sliderLine[0].y - 84 ).setSize( 90,60 );

		/*
			戻るボタンが押されたら？
		*/
		this.backButton.onclick = function(){

			let colorData;
			if( self.colorFlg == self.COLOR_RGB )
			{
				colorData = self.colorRGB;
			}
			else
			{
				colorData = self.colorHSL;
			}

			self.exit( "main",{data: colorData,flg: self.colorFlg} );	//go to MainScene
		};

		/*
			カラー変更ボタンが押されたら？
		*/
		this.cChangeButton.onpointstart = function() {

			if( self.colorFlg == self.COLOR_RGB )
			{
				self.cChangeButton.text = 'HSL→RGB';

				self.colorFlg = self.COLOR_HSL;
				self.colorHSL = self.RGBToHSL( self.colorRGB[0],self.colorRGB[1],self.colorRGB[2] );	//RGB->HSL変換

				//スライダーの位置を変更
				self.sliderGroup.children.each( function( slider,i ) {

					let sSize = self.MAX_SLIDER_POS - self.MIN_SLIDER_POS;
					let plus = ( self.colorHSL[i] / self.HSL_MAX[i] ) * sSize;
					
					slider.x =  self.MIN_SLIDER_POS + plus;

					self.colorValueText[i].text = self.colorHSL[i];	//スライダーの値テキストを変更
					self.colorNameText[i].text  = self.COLOR_HSL_NAME[i];	//スライダーの名前を変更

				});
			}
			else
			{
				self.cChangeButton.text = 'RGB→HSL';

				self.colorFlg = self.COLOR_RGB;
				self.colorRGB = self.HSLToRGB( self.colorHSL[0],self.colorHSL[1],self.colorHSL[2] );	//HSL->RGB変換

				//スライダーの位置を変更
				self.sliderGroup.children.each( function( slider,i ) {

					let sSize = self.MAX_SLIDER_POS - self.MIN_SLIDER_POS;
					let plus = ( self.colorRGB[i] / self.RGB_MAX[i] ) * sSize;
					
					slider.x =  self.MIN_SLIDER_POS + plus;

					self.colorValueText[i].text = self.colorRGB[i];	//スライダーの値テキストを変更
					self.colorNameText[i].text  = self.COLOR_RGB_NAME[i];	//スライダーの名前を変更

				});

			}
		};


		
		this.sliderGroup.children.each( function( slider,i ) {
			
			//タッチされたら？
			slider.onpointstart = function() {

				slider.isTouched = 1;
			};

			//タッチして移動されたら？
			slider.onpointmove = function( e ) {
				
				if( slider.isTouched )
				{
					if( e.pointer.x >= self.MIN_SLIDER_POS && e.pointer.x <= self.MAX_SLIDER_POS )
					{
						slider.x = e.pointer.x;
					}
					else
					{
						if( e.pointer.x > self.MAX_SLIDER_POS )
						{
							slider.x = self.MAX_SLIDER_POS;
						}
						else
						{
							slider.x = self.MIN_SLIDER_POS;
						}
					}

				}

			};

		});//end this.sliderGroup.children.each


	},//end init()


	//更新
	update: function() {
		
		let self = this;  //参照用

		//RBG設定
		if( self.colorFlg == self.COLOR_RGB )
		{
			this.sliderGroup.children.each( function( slider,i ) {

				//スライダーの位置から色決定
				let c;
				let sSize = self.MAX_SLIDER_POS - self.MIN_SLIDER_POS;
				let nowSize = slider.x - self.MIN_SLIDER_POS;

				c = Math.floor( ( nowSize / sSize ) * self.RGB_MAX[i] );

				self.colorRGB[i] = c;
				self.colorValueText[i].text = c;

				//スライダー 調整
				self.sliderFillLine[i].width = nowSize;
				self.sliderFillLine[i].x = self.MIN_SLIDER_POS + ( nowSize / 2 )
			});
			
			this.backgroundColor = 'rgb({0}, {1}, {2})'.format( this.colorRGB[0],this.colorRGB[1],this.colorRGB[2] );	//背景色設定
		}

		//HSL設定
		if( self.colorFlg == self.COLOR_HSL )
		{
			this.sliderGroup.children.each( function( slider,i ) {

				//スライダーの位置から色決定
				let c;
				let sSize = self.MAX_SLIDER_POS - self.MIN_SLIDER_POS;
				let nowSize = slider.x - self.MIN_SLIDER_POS;

				c = Math.floor( ( nowSize / sSize ) * self.HSL_MAX[i] );

				self.colorHSL[i] = c;
				self.colorValueText[i].text = c;

				//スライダー 調整
				self.sliderFillLine[i].width = nowSize;
				self.sliderFillLine[i].x = self.MIN_SLIDER_POS + ( nowSize / 2 )
			});
			
			this.backgroundColor = 'hsl({0}, {1}%, {2}%)'.format( this.colorHSL[0],this.colorHSL[1],this.colorHSL[2] );	//背景色設定
		}

	},//end update()


	/*
		@class RGBToHSL( r,g b )
		#RGBをHSLに変換

		@param {Number}r ...赤(0~255)
		@param {Number}g ...緑(0~255)
		@param {Number}b ...青(0~255)
		@return {Array}hsl ...h色相(0~360),s彩度(0~100),l輝度(0~100

	*/
	RGBToHSL: function( r,g,b ) {
		
		let hsl = new Array( 3 );

		const HUE_MAX = 360;
		const RGB_MAX = 255;
		const SATURATION_MAX = 100;
		const LIGHTNESS_MAX  = 100;

		const max = Math.max( r, g, b );
		const min = Math.min( r, g, b );

		
		//Hue 色相
		let a = HUE_MAX / 6;

		if( max == min )
		{
			hsl[0] = 0;
		}
		else if( r == max )
		{
			hsl[0] = a * (( g - b ) / ( max - min ));
		}
		else if( g == max )
		{
			hsl[0] = a * (( b - r ) / ( max - min )) + HUE_MAX / 3;
		}
		else
		{
			hsl[0] = a * (( r - g ) / ( max - min )) + HUE_MAX * 2 / 3;
		}

		//360を足して0~360の範囲に収める
		if( hsl[0] < 0 )
		{
			hsl[0] += HUE_MAX;
		}


		//Saturation 彩度
		let cnt = ( max + min ) / 2;	//収束値

		if( cnt < ( RGB_MAX / 2 ))
		{
			if( max + min <= 0 )
			{
				hsl[1] = 0;
			}
			else
			{
				hsl[1] = ( max - min ) / ( max + min ) * SATURATION_MAX;
			}
		}
		else
		{
			if( max - min <= 0 )
			{
				hsl[1] = 0;
			}
			else
			{
				hsl[1] = ( max - min ) / ( (RGB_MAX * 2) - max - min ) * SATURATION_MAX;
			}
		}


		//Lightness 輝度
		hsl[2] = ( max + min ) / RGB_MAX / 2 * LIGHTNESS_MAX;


		//四捨五入
		hsl[0] = Math.round( hsl[0] );
		hsl[1] = Math.round( hsl[1] );
		hsl[2] = Math.round( hsl[2] );


		return hsl;


	},//end RGBToHSL
	

	/*
		@class HSLToRGB( h,s,l )
		#HSLをRGBに変換

		@param {Number}h ...色相(0~360)
		@param {Number}s ...彩度(0~100)
		@param {Number}l ...輝度(0~100)
		@return {Array}rgb ...r(0~255),g(0~255),b(0~255)

	*/
	HSLToRGB: function( h,s,l ) {

		let rgb = new Array( 3 );

		let max = 0;
		let min = 0;

		if( l >= 50 )
		{
			max = 2.55 * ( l + (100 - l) * ( s / 100) );
			min = 2.55 * ( l - (100 - l) * ( s / 100) );
		}
		else
		{
			max = 2.55 * ( l + l * ( s / 100) );
			min = 2.55 * ( l - l * ( s / 100) );
		}


		if( h >= 0 && h < 60 )
		{
			rgb[0] = max;
			rgb[1] = ( h / 60 ) * ( max - min ) + min;
			rgb[2] = min;
		}
		else if( h >= 60 && h < 120 )
		{
			rgb[0] = ( (120 - h) / 60) * ( max - min ) + min;
			rgb[1] = max;
			rgb[2] = min;
		}
		else if( h >= 120 && h < 180 )
		{
			rgb[0] = min;
			rgb[1] = max;
			rgb[2] = ( (h - 120) / 60) * ( max - min ) + min;
		}
		else if( h >= 180 && h < 240 )
		{
			rgb[0] = min;
			rgb[1] = ( (240 - h) / 60) * ( max - min ) + min;
			rgb[2] = max;
		}
		else if( h >= 240 && h < 300 )
		{
			rgb[0] = ( (h - 240) / 60) * ( max - min ) + min;
			rgb[1] = min;
			rgb[2] = max;
		}
		else if( h >= 300 && h <= 360 )
		{
			rgb[0] = max;
			rgb[1] = min;
			rgb[2] = ( (360 - h) / 60) * ( max - min ) + min;
		}

		//小数点四捨五入
		rgb[0] = Math.round( rgb[0] );
		rgb[1] = Math.round( rgb[1] );
		rgb[2] = Math.round( rgb[2] );


		return rgb;

	},//end HSLToRGB


});//end SettingScene


/***
   
   @class CircleSlider
   @extend CircleShape

   CircleSliderクラス
   #ボタンスライダーを生成するクラス

***/
phina.define("CircleSlider", {

	//継承
	superClass: 'CircleShape',

	init: function() {
		
		//親クラス初期化
		this.superInit('');

		this.isTouched = 0;	//タッチされたかどうか？
	},

});//end CircleSlider


/***


   メイン処理


***/
phina.main(function() {
	  
	  var app = GameApp({
	  
	    startLabel: 'title',
	    //画面をフィットさせない
	    //fit: false,
	    //画面サイズ変更
	    width : SCREEN_X,
            height: SCREEN_Y,
	    //独自scene
	    scenes: [
		   {
			className: 'MainScene',
			label: 'main',
		   },

		   {
			className: 'SettingScene',
			label: 'setting',
		   },

		   {
			className: 'TitleScene',
			label: 'title',
		   },

		]

	  });

	  //fps計測
	  //app.enableStats();

	  //実行
	  app.run();

});

