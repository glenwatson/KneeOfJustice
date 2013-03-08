//Don't use IE
if(navigator.appName.indexOf('Internet Explorer') != -1) alert('IE can DIAF');

var loadKnee = function ()
{
	// http://stackoverflow.com/questions/754607/can-jquery-get-all-css-styles-associated-with-an-element
	function css(a){
		var sheets = document.styleSheets, o = {};
		for(var i in sheets) {
			var rules = sheets[i].rules || sheets[i].cssRules;
			for(var r in rules) {
				if(a.is(rules[r].selectorText)) {
					o = $.extend(o, css2json(rules[r].style), css2json(a.attr('style')));
				}
			}
		}
		return o;
	}

	function css2json(css){
		var s = {};
		if(!css) return s;
		if(css instanceof CSSStyleDeclaration) {
			for(var i in css) {
				if((css[i]).toLowerCase) {
					s[(css[i]).toLowerCase()] = (css[css[i]]);
				}
			}
		} else if(typeof css == 'string') {
			css = css.split('; ');          
			for (var i in css) {
				var l = css[i].split(': ');
				s[l[0].toLowerCase()] = (l[1]);
			};
		}
		return s;
	}
	
	// store the value of <body>'s overflow value
	var bodyCss;
	$(function()
	{
		bodyCss = window.getComputedStyle(document.getElementsByTagName('body')[0]).getPropertyValue('overflow', null);
	});
	function storeBodyCss()
	{
		$('body').css('overflow', 'hidden');
	}
	function restoreBodyCss()
	{
		$('body').css('overflow', bodyCss);
	}
	
	// add sound
	$(function()
	{
		var yesSound = $('<audio id="yes" preload="auto">'
			+'<source src="yes.wav" />'
			+'<source src="yes.mp3" />'
			+'</audio>');
		$('body').append(yesSound);
	});
	
	//animate koj on element
	function knee(ele)
	{
		var koj = $('<img src="http://glenwatson.github.com/KneeOfJustice/master/KOJ.png" />');
		
		var target = $(ele);
		var targetRight = target.offset().left+target.width();
		var targetTop = target.offset().top;
		koj.css({
			'position':'absolute',
			'top':targetTop + 150,
			'left':targetRight + window.innerWidth
		});
		
		replace(ele);
		storeBodyCss();
		$('body').append(koj);
		koj.animate(
			{
				left: targetRight,
				top: targetTop
			}, 
			600, 
			'linear', 
			function()
			{
				document.getElementById('yes').play();
				target.animate({'margin-left': '-1000px'}, function()
				{
					target.remove();
					koj.animate(
						{
							top: targetTop + 150,
							left: targetRight - window.innerWidth
						}, 
						600, 
						'linear', 
						function()
						{
							koj.remove();
							restoreBodyCss();
							target.trigger('kneed');
							$('body').trigger('kneed');
						}
					);
				});
			}
		);
	}
	
	// replace ele with a placeholder
	function replace(ele)
	{
		var style = window.getComputedStyle(ele, null);
		var holder = $('<img src="blank.gif" />')
			// copy over all positioning css ele -> holder
			.css({
				width: style.getPropertyValue('width'),
				height: style.getPropertyValue('height'),
				display: style.getPropertyValue('display'),
				position: style.getPropertyValue('position'),
				top: style.getPropertyValue('top'),
				left: style.getPropertyValue('left'),
				'margin-top': style.getPropertyValue('margin-top'),
				'margin-left': style.getPropertyValue('margin-left'),
				'margin-right': style.getPropertyValue('margin-right'),
				'margin-bottom': style.getPropertyValue('margin-bottom'),
				'padding-top': style.getPropertyValue('padding-top'),
				'padding-left': style.getPropertyValue('padding-left'),
				'padding-right': style.getPropertyValue('padding-right'),
				'padding-bottom': style.getPropertyValue('padding-bottom')
			});
		
		//holder[0].style.cssText = style.cssText;
		
		//var cssStyleObj = css($(ele));
		//holder.css(cssStyleObj);
		
		$(ele).css({
			position: 'absolute',
			top: $(ele).position().top,
			left: $(ele).position().left
			/*'margin-top': '',
			'margin-left': '',
			'margin-right': '',
			'margin-bottom': '',
			'padding-top': '',
			'padding-left': '',
			'padding-right': '',
			'padding-bottom': ''*/
		});
		
		$(ele).after(holder)
	}
	
	// add click event to all leaf elements
	$(function()
	{
		$(':not(:has(*))').click(function()
		{
			if(!$(this).hasClass('kneed'))
			{
				$(this).addClass('kneed');
				knee(this);
			}
		});
	});
}

// ensure jQuery is loaded, then call loadKnee()
if (typeof jQuery === 'undefined')
{
	var j = document.createElement('script');
	j.type = 'text/javascript';
	j.src = 'jQuery1.9.0.js';
	j.onload = loadKnee;
	document.getElementsByTagName('head')[0].appendChild(j);
}
else
{
	loadKnee();
}