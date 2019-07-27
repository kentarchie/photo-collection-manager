var DrawBox = (function () {
   var DrawBoxConfig = {};

   var start_mousex = start_mousey = 0;
   var canvasx = canvasy = 0;
   var current_mousex = current_mousey = 0;
   var mousedown = false;
   var result = {
				'end_x' : 0
				,'end_y' : 0
				,'start_x' : 0
				,'start_y' : 0
   };

	var init = function( settings )
	{
      logger('DrawBox.init: START');
      DrawBoxConfig = {
			lineWidth : 2
			,strokeStyle : 'red'
			,canvas : null
			,ctx : null
      };
      	// Allow overriding the default config
		$.extend( DrawBoxConfig, settings );
      logger('DrawBox.init: settings.canvas is ' + (settings.canvas == null) ? 'null' : 'not null');
      logger('DrawBox.init: DrawBoxConfig.canvas is ' + (DrawBoxConfig.canvas == null) ? 'null' : 'not null');

      canvasx = DrawBoxConfig.canvas.getBoundingClientRect().left;
      canvasy = DrawBoxConfig.canvas.getBoundingClientRect().top;
      console.log('DrawBox.init: DrawBox: canvasx,y (%d,%d)',canvasx,canvasy);
		this.showConfig();
	}; // init

		function mouseDown(e) {
         console.log('DrawBox.mouseDown: START');
         e.stopPropagation();
    		start_mousex = parseInt(e.clientX - canvasx);
			start_mousey = parseInt(e.clientY - canvasy);
    		mousedown = true;
        	DrawBoxConfig.ctx.strokeStyle = DrawBoxConfig.strokeStyle;
        	DrawBoxConfig.ctx.lineWidth = DrawBoxConfig.lineWidth;
         console.log('DrawBox.mouseDown: DONE: x,y (%d,%d)',start_mousex,start_mousey);
		};

		function mouseUp(e) {
         logger('DrawBox.mouseUp START:');
         e.stopPropagation();
    		mousedown = false;
			result['end_x']   = current_mousex;
			result['end_y']   = current_mousey;
			result['start_x'] = start_mousex;
			result['start_y'] = start_mousey;
         logger('DrawBox.mouseUp :' + JSON.stringify(result,null,'\t'));
		};

		function mouseMove(e) {
         e.stopPropagation();
    		current_mousex = parseInt(e.clientX - canvasx);
			current_mousey = parseInt(e.clientY - canvasy);
         //console.log('DrawBox.mouseMove: x,y (%d,%d)',current_mousex,current_mousey);
    		if(mousedown) {
        		var width = current_mousex - start_mousex;
        		var height = current_mousey - start_mousey;
        		DrawBoxConfig.ctx.clearRect(start_mousex,start_mousey,width,height);
        		DrawBoxConfig.ctx.beginPath();
        		DrawBoxConfig.ctx.rect(start_mousex,start_mousey,width,height);
        		DrawBoxConfig.ctx.stroke();
    		}
		};

   var showConfig = () => { logger('DrawBox.showConfig :' + JSON.stringify(DrawBoxConfig,null,'\t')); }
   var getNewBoxInfo = () => { 
       logger('DrawBox.getNewBoxInfo :' + JSON.stringify(result,null,'\t'));
       return result;
   }

   var startDrawing = function() {
      console.log('DrawBox.startDrawing: START');
		DrawBoxConfig.canvas.addEventListener('mousedown', mouseDown);
		DrawBoxConfig.canvas.addEventListener('mouseup', mouseUp);
		DrawBoxConfig.canvas.addEventListener('mousemove', mouseMove);
      console.log('DrawBox.startDrawing: DONE');
   }; // startDrawing

   var clearBox = function() {
      console.log('DrawBox.clearBox: START');
      console.log('DrawBox.clearBox: DONE');
   }; // clearBox

   var stopDrawing = function() {
      console.log('DrawBox.stopDrawing: START');
		DrawBoxConfig.canvas.removeEventListener('mousedown', mouseDown);
		DrawBoxConfig.canvas.removeEventListener('mouseup', mouseUp);
		DrawBoxConfig.canvas.removeEventListener('mousemove', mouseMove);
      console.log('DrawBox.stopDrawing: DONE');
   }; // stopDrawing

   return {
	 init: init
	 ,startDrawing  : startDrawing
	 ,stopDrawing   : stopDrawing
	 ,getNewBoxInfo : getNewBoxInfo
	 ,showConfig    : showConfig
	 ,clearBox      : clearBox
  };
})();
