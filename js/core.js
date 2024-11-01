VERVENIA.JQ = jQuery;//https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_slice_array
VERVENIA.JQ( document ).ready( function( e ){

  VERVENIA.CLOCK( 0 );
  
  VERVENIA.SYS.loaded = false;  
  VERVENIA.DATA.date = VERVENIA.GETDATE( VERVENIA.DATA.date );
  //alert( 'Loading' + VERVENIA.DATA.date.t );

  VERVENIA.FEEDBACK( ' DATA ' , VERVENIA.DATA );
  VERVENIA.FEEDBACK( ' SYS ' , VERVENIA.SYS );
  
  if ( VERVENIA.DATA.user.spammer ) {
	
	if ( VERVENIA.REGEXP( 'url' , VERVENIA.DATA.user.spammer ) ) {

            window.location.assign( VERVENIA.DATA.user.spammer );

        }
	
  }
  
  switch ( VERVENIA.DATA.tracking.where ) {
	  
	case 'dash':
	  
	  if ( [ "wp" , "id" ].indexOf( VERVENIA.DATA.user.type ) >= 0 ) {
		
		VERVENIA.AJAX( {
		  "AJ": "workspace" , "mode":"load" , "NOSPINNER" : true , "d": VERVENIA.DATA }
					 );		
	  }
	  break;
	  
	case 'front':
	  
	  if ( VERVENIA.DATA.user.type != 'ghost' && VERVENIA.DATA.tracking.page_id >= 1 ) {
		
		var ai = {
		  "event": {
			"type": "visit" }
		  , "content": "page" }
			;
		
		if ( VERVENIA.DATA.tracking.prev_page == 'Outside' ) {
		  
		  ai['event']['target'] = 'site';
		  ai['event']['id'] = VERVENIA.DATA.tracking.prev_url;
		  
		}
		else {
		  
		  ai['event']['target'] = 'page';
		  ai['event']['id'] = VERVENIA.DATA.tracking.prev_page;
		  
		}
		
		ai['event']['subid'] = 'session__tracking[session_num]';
		
		//VERVENIA.FEEDBACK( 'LOGVISIT' , ai );
		
		VERVENIA.LOGEVENT( ai );
	  }
	  break;
	  
	case 'edit':
	  break;
	  
  }
  
}
							 );

VERVENIA.JQ( window ).on( 'load' , function( ) {
  
  VERVENIA.SYS.loaded = true;
  
  VERVENIA.DATA.date = VERVENIA.GETDATE( VERVENIA.DATA.date );

  //alert( 'Loaded' + VERVENIA.DATA.date.t );
  
  switch ( VERVENIA.DATA.tracking.where ) {
	  
	case 'dash':
	  break;
	  
	case 'front':
	  VERVENIA.DATA.tracking.where
	  if ( VERVENIA.IG( [ 'location' , location ] ) == true ) {
		
		  VERVENIA.VIEW( [ 'load' , [ VERVENIA.JQ( window ).scrollTop() ] ] );
		  
		  VERVENIA.JQ( window ).scroll( function ( e ) {
			
			VERVENIA.VIEW( [ 'scroll' , [ VERVENIA.JQ( window ).scrollTop() ] ] );
			
		  }
									  );
	  }
	  break;
	  
	case 'edit':
	  break;
	  
  }
}
						);

VERVENIA.CLOCK = function ( i ) {
  
  var o = i;
  
  VERVENIA.SETDATA( VERVENIA.ATTE( 'nonce' ) , 'clock' , 1000 );  
  VERVENIA.SETDATA( VERVENIA.ATTE( 'nonce' ) , 'ticking' , i );  
  VERVENIA.SETDATA( VERVENIA.ATTE( 'nonce' ) , 'interval' , i );
  
  //VERVENIA.JQ( VERVENIA.ATTE( 'nonce' ) ).show().html( i );//WORKING
  VERVENIA.TICKING( VERVENIA.JQ( VERVENIA.ATTE( 'nonce' ) ).data( 'ticking' ) );
  
  return o;
  
};

VERVENIA.TICKING = function ( i ) {
  
  var o = i;
  
  setTimeout(function(){
	
	var o = ( VERVENIA.JQ( VERVENIA.ATTE( 'nonce' ) ).data( 'ticking' ) + 1 ); 
		
	var int = VERVENIA.JQ( VERVENIA.ATTE( 'nonce' ) ).data( 'interval' );
	
	( int == 30 ) ? int = 1 : int = ( int + 1 );
	
	VERVENIA.SETDATA( VERVENIA.ATTE( 'nonce' ) , 'interval' , int );
	
	VERVENIA.SETDATA( VERVENIA.ATTE( 'nonce' ) , 'ticking' , o );	
	//VERVENIA.JQ( VERVENIA.ATTE( 'nonce' ) ).html( o );//WORKING
	
	( VERVENIA.SYS.mode == 'dev' ) ? console.log( 'Ticking ' + o + ' and Interval ' + VERVENIA.JQ( VERVENIA.ATTE( 'nonce' ) ).data( 'interval' ) ):'';
	
	VERVENIA.TICKING( VERVENIA.JQ( VERVENIA.ATTE( 'nonce' ) ).data( 'ticking' ) ); 

  }
			 , VERVENIA.JQ( VERVENIA.ATTE( 'nonce' ) ).data( 'clock' ) );
  
  if ( VERVENIA.JQ( VERVENIA.ATTE( 'nonce' ) ).data( 'interval' ) == 30 ) {
	
	VERVENIA.REFRESH( 'clock' , VERVENIA.JQ( VERVENIA.ATTE( 'nonce' ) ).data( 'ticking' ) );
	
  }
  
  return o;
  
};

VERVENIA.REFRESH = function ( i , i2 ) {
  
  var o = i;
  
  console.log( 'Running Refresh Because Interval = ' + i2 );
  
  return o;
  
};

VERVENIA.GETDATE = function ( i ) {
  
  var o = new Date();
  
  var t = Math.floor( o.getTime()/1000 );
  
  var w = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var m = ["January","February","March","April","May","June",
		   "July","August","September","October","November","December"]
  o = {
	"t": t , "year": o.getFullYear() , "yday" : i.yday , 	 
	"mon": o.getMonth() ,  "month": m[o.getMonth()] , "mday" : o.getDate() , 
	"wday": o.getDay() , "weekday": w[o.getDay()] , "hours": o.getHours() , 
	"seconds" : o.getSeconds() , "minutes" : o.getMinutes() , 
	"time_zone" : i.time_zone}
	;
  
  //Array ( [0] => 1491398972 [seconds] => 32 [minutes] => 29 [hours] => 9 
  //[[mday] => 5 wday] => 3 [mon] => 4 [year] => 2017 [yday] => 94 
  //[weekday] => Wednesday [month] => April ) 
  
  return o;
  
};

VERVENIA.SHOWSAVE = function ( i ) {
  
  ( VERVENIA.JQ.type( i ) != 'array' ) ? i = [ "s" , i ]: '';
	
  var o = i[1];
		
  if ( VERVENIA.JQ( o ).closest( VERVENIA.ATTE( 'opteditor' ) ).length > 0 ) {
	
	var e = '[' + VERVENIA.DATA.app + '="saveform"][data-form="editor"]';
	
  }
  else {
	
	if ( VERVENIA.JQ( o ).closest( VERVENIA.ATTE( 'form' ) ).length > 0 ) {
	  
	  var e = '[' + VERVENIA.DATA.app + '="saveform"][data-form="' + form + '"]';
	  
	  var form = VERVENIA.JQ( o ).closest( VERVENIA.ATTE( 'form' ) ).data( 'form' );
	}
	
  }
  
  switch ( i[0] ) {
	  
	case 's':
	  ( VERVENIA.JQ( e ).is( ':visible' ) == false ) ? 
		VERVENIA.JQ( e ).fadeIn( VERVENIA.SYS.live.form.submit.fadein ) : '';
	  break;
	  
	case 'h':
	  ( VERVENIA.JQ( e ).is( ':visible' ) == true ) ? VERVENIA.JQ( e ).fadeOut( 250 ) :'';
	  break;	  
  }
  
  return o;
  
};

VERVENIA.JQ( document ).on( 'focusin focusout' , 'body' , function ( e ) {
  
  if ( VERVENIA.DATA.tracking.where == 'dash' && VERVENIA.JQ( VERVENIA.ATTE( 'editor' ) ).html() != '' ) {
	
	//alert( VERVENIA.JQ( VERVENIA.ATTE( 'editor' ) ).html().length );
	
	var nww = [ 1 ];
	if ( nww.indexOf( VERVENIA.JQ( VERVENIA.ATTE( 'opteditor' ) ).data( 'opt' ) ) < 0 ) {
	  
	  VERVENIA.WW( 'e' );
	  //alert( 'Opt ' + VERVENIA.JQ( VERVENIA.ATTE( 'opteditor' ) ).data( 'opt' ) );
	  
	}
	
  }
}
						  );

VERVENIA.WW = function( i ) {
	  
  if ( tinyMCE.activeEditor ) {
	
	try {
	  
	  var ww = tinyMCE.activeEditor;
	  
	  var e = '[name="' + ww.id + '"]';
	  var c = tinyMCE.activeEditor.getContent();
	  
	  switch ( i ) {
		  
		case 'e'://edit
		  
		  var s = 's';
		  VERVENIA.JQ( e ).val( c );
		  break;
		  
		case 's'://save
		  
		  var s = 's';
		  VERVENIA.JQ( e ).val( VERVENIA.REPQUOTE( [ i , c ] ) );
		  break;
		  
		case 'r'://restore
		  
		  var s = 'h';
		  VERVENIA.JQ( e ).val( VERVENIA.REPQUOTE( [ i , c ] ) );
		  break;
		  
	  }
	  
	  VERVENIA.SHOWSAVE( [ s , e ] );
	  
	}
	catch( err ) {
	  //console.log( err );
	}
	
  }

}
  ;		

VERVENIA.JQ( document ).on( 'sortupdate', '[' + VERVENIA.DATA.app + '="sort"]' , function( e ) {
  
  if ( VERVENIA.JQ( VERVENIA.ATTE( 'sortids_' + VERVENIA.JQ( this ).data( 'sort' ) ) ).length > 0 ) {
	
	if ( VERVENIA.JQ( this ).data( 'sort' ).search( 'formchild' ) == 0 ) {
	  
	  VERVENIA.JQ( VERVENIA.ATTE( 'saveform' ) + '[data-form="editor"]' ).fadeIn( 250 ); 
	  
	}
  
	var l = '';  
	
	VERVENIA.JQ( VERVENIA.ATTE( 'sort_' + VERVENIA.JQ( this ).data( 'sort' ) ) ).each( function( n ) {
	  
	  //console.log( ' Adding ID : ' + VERVENIA.JQ( this ).data( 'sort' ) );//WORKING
	  l += VERVENIA.JQ( this ).data( 'sort' ) + ',';
	  
	}
																					 );
	
	l = l.substring( 0 , ( l.length - 1 ) );
	VERVENIA.JQ( VERVENIA.ATTE( 'sortids_' + VERVENIA.JQ(this).data( 'sort' ) ) ).val( l );
	
	if ( VERVENIA.JQ( this ).data( 'aj' ) ) {
	  
	  var ai = {
		"AJ" : "resort" , "resort" : VERVENIA.JQ(this).data( 'sort' ) }
		  ;
	  
	  ai['ids'] = VERVENIA.JQ( VERVENIA.ATTE( 'sortids_' + VERVENIA.JQ(this).data( 'sort' ) ) ).val();
	  if ( VERVENIA.JQ( VERVENIA.ATTE( 'sortaj_' + VERVENIA.JQ(this).data( 'sort' ) ) ) ) {
		
		ai['d'] = VERVENIA.JQ( VERVENIA.ATTE( 'sortaj_' + VERVENIA.JQ(this).data( 'sort' ) ) ).data();
		( ai.d.met ) ? ai['AJ'] = ai.d.met : '';
		
	  } else {
		
		ai['key'] = VERVENIA.JQ( VERVENIA.ATTE( 'sortkey_' + VERVENIA.JQ(this).data( 'sort' ) ) ).val();	  
		
	  }
	  
	  //alert( ai.AJ );
	  
	  VERVENIA.AJAX( ai );
	  
	}
	
  }
}
);

VERVENIA.JQ( window ).on( 'unload' , function( ) {
	
  var i = VERVENIA.DATA;
  if( i.user.type != 'ghost' && i.tracking.where == 'front' && VERVENIA.IG( ['page' , i.tracking.page_id] ) == true ) {
	
	var ai = {
	  "event": {
		"type": "exit" , "target": "site" , "content": "page" , 
		"id" : "length__tracking[session_length]" , 
		"subid" : "session__tracking[session_num]"}
	}
		;
	
	( window.closed == true ) ? ai.window = 'closed':ai.window = 'open';
	
	if ( VERVENIA.JQ( '['+i.app+'][data-reject="true"]' ).length ) {
	  
	  ai['reject'] = {
	  }
		;
	  
	  VERVENIA.JQ.each( VERVENIA.JQ('['+i.app+'][data-status="reject"]'), function( k , v ) {
		
		var r = {
		  "d": VERVENIA.JQ(this).data() , "html" : VERVENIA.JQ(this).html() }
			;
		r[VERVENIA.DATA.app] = VERVENIA.ATTR( this );
		
		( VERVENIA.ATTR(this) == 'form' ) ? r['fields'] = VERVENIA.FORMDATA( this ): '';
		
		ai['reject'].push( r );
		
	  }
					  );
	  
	}
	
	ai.date = VERVENIA.GETDATE( VERVENIA.DATA.date );
	VERVENIA.LOGEVENT( ai );
  }
}
						);

VERVENIA.VIEW = function ( i ) {
  
  var o = true;
  
  var etype = i[0];
  
  var wt = i[1];
  
  VERVENIA.JQ( '[' + VERVENIA.DATA.app + ']' ).each( function ( e ) {
		
	if ( VERVENIA.SYS.suite.track.indexOf( VERVENIA.ATTR( this ) ) >= 0 && VERVENIA.IG( VERVENIA.DATA.app , VERVENIA.ATTR( this ) ) == true ) {
	  
	  var d = VERVENIA.JQ( this ).data( ); 	  
	  var vis = VERVENIA.JQ( this ).is( ':visible' );
	  
	  if ( vis != false && ! d.view ) {
		
		var wh = window.innerHeight;
		
		console.log( 'Is ' + VERVENIA.ATTR( this ) + ' #' + d.id + ' visible? ...' + vis + '!' );//WORKING
				
		var wb = ( wt + wh );//Window Bottom
		
		var et = VERVENIA.JQ( this ).offset().top;//Element Top
		var eh = VERVENIA.JQ( this ).outerHeight();//Element Height
		
		var eb = ( et + eh );//Element Bottom
		
		console.log( 'Window Bottom is ' + wb + ', Element Top : ' + et + ', Element Height : ' + eh + ' , Element Bottom ' + eb );//WORKING
		
		if ( et > wt && eb < wb ) { //Only happens if Element is within the visible window (greater than top of window and less than bottom){	
		  
		  VERVENIA.SETDATA( this , 'view' , 1 );//VERVENIA.JQ( this ).data( 'view' );
		  
		  var ai = { "event": { "type": "view" , "target" : VERVENIA.ATTR( this ) , "id" : d.id } , 
					"content": VERVENIA.JQ( this ).html( ) , "data" : d };
		  
		  ( d.category ) ? ai['event']['target_category'] = d.category : '';
		  
		  if ( d.version ) {
			
			ai['event']['subid'] = d.version;
			ai['event']['subid'] = 'version__event[target_version]';
			
		  } else {
			
			ai['event']['subid'] = 'category__event[target_category]';
			
		  }
		  
		  var scroll = { "window_top" : wt , "window_height" : wh , "window_bottom" : wb ,
						 "target_top" : et , "target_height" : eh , "target_bottom" : eb };
	
		  ai['event']['scroll'] = scroll;
		  
		  //alert( 'Logging' );
		  ai.date = VERVENIA.GETDATE( VERVENIA.DATA.date );
		  VERVENIA.LOGEVENT( ai );
		  
		}
		
	  }
	  
	}
  }
												   );
  return o;
}
  ;

VERVENIA.IG = function ( i ) {//NEEDS WORK - NON TRACKING PAGES
  
  var o = true;
  
  switch ( i[0] ) {
	  
	case 'page':
	  break;
	  
	case 'location':
	  break;
	  
	case 'link':
	  ( i[1].search( 'http' ) != 0 ) ? o = false : '';
	  break;
	  
	case VERVENIA.DATA.app:
	  ( [ "nonce" , "case" , "formwrap" , "cart" , "field" ].indexOf( i[1] ) >= 0 ) ? o = false : '';
	  break;
	  
  }
  
  return o;
  
}
  ;

VERVENIA.RELOAD = function ( i ) {
	
  var o = i;
  
  var ai = {
	"AJ": "workspace" , "mode":"reload" , "d": VERVENIA.DATA }
	  ;
  
  ( i != VERVENIA.SYS.def ) ? ai['id'] = i : ''; 
  
  VERVENIA.AJAX( ai );
  
  return o;
  
};

VERVENIA.LIVE = function ( i ) {
  
  var o = false;
  var d = VERVENIA.JQ( i.e ).data();
  
  if ( [ "mousedown" , "tap" , "taphold" , "click" , "dblclick" ].indexOf( i.t ) >= 0 ) {
	
	o = true;
	i.t = 'click';
	
  }
  
  if ( [ "mouseover" , "mouseout" ].indexOf( i.t ) >= 0 ) {
	
	if ( VERVENIA.SYS.suite.live[VERVENIA.ATTR( i.e )].touch ) {
		
	  var dt = VERVENIA.GETDATE( VERVENIA.DATA.date );
	  var t = dt.t;
	  
	  if ( [ "mouseover" ].indexOf( i.t ) >= 0 ) {
		
		console.log(' Touching ' + VERVENIA.ATTR( i.e ) + ' ' + d.id + ' at ' + t + ' !');
		
		VERVENIA.SETDATA( i.e , 'over' , t );
		
	  }
	  else {
		
		var tt = ( t - d.over );
		
		console.log( ' Touched ' + VERVENIA.ATTR( i.e ) + ' ' + d.id + ' for ' + tt + '!');
		
		if ( tt >= ( VERVENIA.SYS.suite.live[VERVENIA.ATTR( i.e )].touch / 1000 ) ) {
		  
		  o = true;
		  i.t = 'touch';
		  d.touchtime = tt;
		  console.log(' Logging Because Touched ' + VERVENIA.ATTR( i.e ) + ' ' + d.id + ' for ' + d.touchtime );
		  
		  ( d.touch ) ? VERVENIA.SETDATA( i.e , 'touch' , ( d.touch + 1 ) ):VERVENIA.SETDATA( i.e , 'touch' , 1 );
		}
		
		VERVENIA.SETDATA( i.e , 'over' , 0 );
		
	  }
	  
	}
	
  }
  
  if ( o == true ) {
	
	var ai = {
	  "event": {
		"type" : i.t , "target" : VERVENIA.ATTR( i.e ) , "id" : d.id }
	  , "content" : VERVENIA.JQ( i.e ).html() , "data" : d }
		;
	
	ai['event']['target_category'] = d.category;
	ai['event']['subid'] = 'category__event[target_category]';

    ai.date = VERVENIA.GETDATE( VERVENIA.DATA.date );
	VERVENIA.LOGEVENT( ai );
	
  }
  
  return o;
  
}
  ;

VERVENIA.UNSET = function ( i ) {
  
  console.log( 'Unsetting ' + i[1] + ' From ' + i[0] );
  
  VERVENIA.FEEDBACK( 'UNSET (BEFORE) ' , i[0] );
  
  if ( VERVENIA.JQ.type( i[0] ) == 'array' ) {
	
	var o = i[0];
	
	o = VERVENIA.JQ.unique( o );
	
	var n = o.indexOf( '' + i[1] + '' );
	
	console.log( i[1] + ' is ' + n + ' of ' + o );
	
	switch ( n ) {
		
	  case 0:
		o.shift( );
		break;
		
	  case ( o.length - 1 ):
		o.pop( );
		break;
		
	  default:	
		o = o.slice( 0 , n ).concat( o.slice( ( n + 1 ) , o.length ) );
		break;
		
	}
	
  }
  else {
	
	var o = {
	};
	VERVENIA.JQ.each( i[0] , function ( k , v ) {
	  
	  ( k != i[1] ) ? o[k] = v : '';
	  
	}
					);
	
  }
  
  VERVENIA.FEEDBACK( 'UNSET (AFTER) ' , o );
  
  return o;
  
}
  ;

VERVENIA.TOGGLE = function ( i , i2 ) {
  
  var o = true;
  
  i2 = i2.split( '__' );
  
  //toggle,show,next,select,2
  console.log( 'Toggle ' + i2[1] );
  
  //VERVENIA.JQ( i.e )[i2[1]]();
  
  return o;
  
}
  ;

VERVENIA.SET = function ( i ) {
  
  var set = i.d.set.split( '_' );
  
  var o = VERVENIA[set[0].toUpperCase(set[0])]( i , set );
  
  return o;
  
}
  ;

VERVENIA.UNIQUE = function ( i , set ) {
  
  var o = i.v;//LIVE FIELD
  var r = [];
  
  VERVENIA.JQ.each( VERVENIA.JQ( '['+VERVENIA.DATA.app+'][data-set="'+set.join( '_' )+'"]' ) , function ( k , v ) {
	
	var u = false;
	  
	switch ( i.t ) {//mselect, checklist or radio etc.
		
	  default:
		
		var v = VERVENIA.JQ( this ).val();
		
		v = VERVENIA.JQ( v ).not( o ).get();
		
		//console.log( 'V (before) (length : ' + v.length + ') : ' + v );//TESTING
		
		( v.length < 1 ) ? v.push( VERVENIA.SYS.def ) : '';
		
		//console.log( 'V (after) : ' + v );//TESTING
		
		VERVENIA.JQ( this ).val( v );
		break;
		
	}
	
  }
  );
  
  return o;
  
}
  ;

VERVENIA.DATE = function ( i ) {
  
  var o = true;
  i.d = VERVENIA.JQ(i.e).data();
  
  ( i.d.set ) ? i.v = VERVENIA.SET( i ) : '';
  
  return o;
  
}
  ;

VERVENIA.RANGE = function ( i , set ) {
  
  var o = i.v;
  var w = set[(set.length - 1)];
  
  if ( w == 's' ) {
	
	var oe = set.join( '_' ).replace( '_' + w, '_e' );
	
  }
  else {
	
	var oe = set.join( '_' ).replace( '_' + w, '_s' );
	
  }
  
  var ov = VERVENIA.JQ( '['+VERVENIA.DATA.app+'][data-set="'+oe+'"]' ).val();
  
  switch ( i.t ) {
	  
	case 'date':
	  
	  var ivd = new Date( i.v );
	  var ivt = ivd.getTime();
	  
	  var ovd = new Date( ov );
	  var ovt = ovd.getTime();
	  
	  //console.log( 'This Date ' + ivt + ' , Other Date ' + ovt );//TESTING 
	  
	  ( w == 's' && ivt > ovt ) ? VERVENIA.JQ('['+VERVENIA.DATA.app+'][data-set="'+oe+'"]').val(i.v) : '';	  
	  ( w == 'e' && ivt < ovt ) ? VERVENIA.JQ('['+VERVENIA.DATA.app+'][data-set="'+oe+'"]').val(i.v) : '';
	  break;
	  
	default:
	  
	  var go = true;
	  
	  ( i.t == 'select' && i.a == 'focusout' ) ? go = false : '';
	  
	  if ( go == true ) {
		
		( w == 's' && i.v > ov ) ? VERVENIA.JQ('['+VERVENIA.DATA.app+'][data-set="'+oe+'"]').val(i.v) : '';
		
		( w == 'e' && i.v < ov ) ? VERVENIA.JQ('['+VERVENIA.DATA.app+'][data-set="'+oe+'"]').val(i.v) : '';
		
	  }
	  break;
	  
  }
  
  return o;
  
}
  ;

VERVENIA.HINT = function ( i ) {
  
  var o = true;
  var e = '[' + VERVENIA.DATA.app + '="hint"][data-hint="';
  
  ( VERVENIA.JQ( i.e ).data( 'hint' ) ) ? e += VERVENIA.JQ( i.e ).data( 'hint' ) + '"]' : e += VERVENIA.ATTR( i.e ) + '"]';
  
  if ( i.hint == 'hide' ) {
	
	o = false;
	VERVENIA.JQ( e ).hide();
	
  } else {
	
	var h = VERVENIA.JQ( e ).data( 'hints' );

	//alert( 'Showing Hint : ' + h[i.hint] + ', Inside : ' + e + ', Show in : ' + VERVENIA.SYS.live.form.hint.fadein );
	
	VERVENIA.JQ( e ).children().html( h[i.hint] );
	
	VERVENIA.JQ( e ).fadeIn( VERVENIA.SYS.live.form.hint.fadein );
	
	( [ "max" ].indexOf( i.hint ) >= 0 ) ? VERVENIA.JQ( e ).fadeOut( VERVENIA.SYS.live.form.hint.fadeout ): '';
	( i.fade ) ? VERVENIA.JQ( e ).fadeOut( VERVENIA.SYS.live.form.hint.fadeout ) : '';
	
	( VERVENIA.JQ( e ).is( ':visible' ) == true ) ? o = false: '';
	
  }
  
  return o;
  
}
  ;

VERVENIA.VALIDATE = function ( i ) {
  
  var o = true;
  
  VERVENIA.FEEDBACK( 'VALIDATE' , i );
  
  ( ! i.d ) ? i['d'] = VERVENIA.JQ( i.e ).data( ) : '';
	
  switch ( i.t ) {
	  
	case 'html'://https://api.jquery.com/jQuery.trim/ - $.trim()
	  
	  if ( i.d.min && i.v.length < i.d.min && i.a == 'focusout' ) {
		
		o = false;
		i.hint = 'min';
		
		if ( VERVENIA.JQ( i.e ).data( VERVENIA.SYS.def.toLowerCase() ) ) {
		  
		  i.fade = true;
		  VERVENIA.JQ( i.e ).html( VERVENIA.JQ( i.e ).data( VERVENIA.SYS.def.toLowerCase() ) );
		  
		}
		  
		VERVENIA.HINT( i );
		
	  }
	  
	  if ( i.d.max && i.v.length > i.d.max ) {
		
		o = false;
		i.v = i.v.substring( 0 , i.d.max );
		VERVENIA.JQ( i.e ).html( i.v );
		
		i.hint = 'max';
		VERVENIA.HINT( i );
		
	  }
	  break;
	  
	case 'text':
	  
	  ( i.d.set ) ? i.v = VERVENIA.SET( i ) : '';
		
	  if ( i.d.min && i.v.length < i.d.min && i.a == 'focusout' ) {
		
		o = false;
		i.hint = 'min';
		
		if ( VERVENIA.JQ( i.e ).data( VERVENIA.SYS.def.toLowerCase() ) ) {
		  
		  i.fade = true;
		  
		  VERVENIA.JQ( i.e ).val( VERVENIA.JQ( i.e ).data( VERVENIA.SYS.def.toLowerCase() ) );
		  
		}
		  
		VERVENIA.HINT( i );
		
	  }
	  
	  if ( i.d.max && i.v.length > i.d.max ) {
		
		o = false;
		i.v = i.v.substring( 0 , i.d.max );
		VERVENIA.JQ( i.e ).val( i.v );
		
		i.hint = 'max';
		o = VERVENIA.HINT( i );
		
	  }
	  
	  if ( o == true && VERVENIA.JQ( i.e ).data( 'validate' ) && i.v != '' ) {
		
		o = VERVENIA.REGEXP( VERVENIA.JQ( i.e ).data( 'validate' ) , VERVENIA.JQ( i.e ).val() );
		
		if ( o == false ) {
		  
		  i.hint =  'validate';
		  VERVENIA.HINT( i );
		  
		}
	  }
	  
	  ( ! i.hint ) ? o = false :'';
	  break;
	  
	case 'number':
	  
	  ( i.d.set ) ? i.v = VERVENIA.SET( i ) : '';
	  break;
	  
	case 'select':
	  
	  ( i.d.set ) ? i.v = VERVENIA.SET( i ) : '';
	  break;
	  
	case 'mselect':
	  
	  ( i.v.length > 1 && i.v.indexOf( VERVENIA.SYS.def ) >= 0 ) ? i.v = VERVENIA.UNSET([ i.v , VERVENIA.SYS.def ]) : '';
	  
	  if ( i.d.min && i.v.length < i.d.min ) {
		
		o = false;
		i.hint = 'min';
		VERVENIA.HINT(i);
		
	  }
	  
	  if ( i.d.max && i.v.length > i.d.max ) {

		o = false;
		
		i.v = i.v.slice( 0 , ( i.d.max - 1 ) );
		
		i.hint = 'max';
		VERVENIA.HINT( i );
		
	  }
	  
	  ( i.d.set ) ? i.v = VERVENIA.SET( i ) : '';
	  VERVENIA.JQ( i.e ).val( i.v );
	  break;
	  
	case 'file':
	  
	  if ( [ "upload" ].indexOf( i.a ) >= 0 ) {
		
		var ta = i.v.type.split( '/' );
		
		//alert( ' File Type ' + ta[0] + ' ,Ext ' + ta[1] + ' , Size ' + i.v.size );//File Type image/jpeg , Size 138082
		
		//i.d.type = 'image,dodo';//TESTING
		if ( i.d.type ) {
		  
		  var a = i.d.type.split( ',' );
		  
		  //alert( 'Type Arra ' + a );
		  
		  if ( a.indexOf( ta[0] ) < 0 ) {
			
			i.hint = 'type';
			VERVENIA.HINT( i );
			
		  }
		  
		}
		
		//i.d.ext = 'jpg,jpeg';//TESTING
		
		if ( i.d.ext ) {
		  
		  var a = i.d.ext.split( ',' );
		  
		 // alert( 'Ext Arra ' + ta );
		  
		  if ( a.indexOf( ta[1] ) < 0 ) {
			
			i.hint = 'ext';
			VERVENIA.HINT( i );
			
		  }
		}
		
		if ( i.d.min && i.v.size < i.d.min ) {
		  
		  i.hint = 'min';
		  VERVENIA.HINT( i );
		}
		
		if ( i.d.max && i.v.size > i.d.max ) {
		  
		  i.hint = 'max';
		  VERVENIA.HINT( i );
		}
		
	  }
	  break;
	  
  }
  
  if ( o == true ) {

	console.log( 'Field Hint is ' + i.hint + ' & Type is ' + i.t );
	
	i.hint = 'hide';
	VERVENIA.HINT( i );
	
  }
  
  return o;
  
}
  ;

VERVENIA.FIELD = function ( i ) {
  
  VERVENIA.FEEDBACK( 'FIELDING', i );
	
  i.d = VERVENIA.JQ( i.e ).data();
  
  ( i.s ) ? i.sd = VERVENIA.JQ( i.sd ).data() : '';
  
  if ( [ "keyup" , "keydown" ].indexOf( i.a ) < 0 ) { 
	
    var o = VERVENIA.VALIDATE( i );
	
  } else {
	
	var o = true;
  }
  
  if ( o == true ) {
	
	( i.d.toggle ) ? i.v = VERVENIA.TOGGLE( i , i.d.toggle ) : '';
	
	if ( i.v && i.v != null && VERVENIA.JQ.type( i.v ) == 'string' ) {
	  
	  ( i.v.substring( 0 , 8 ) == 'toggle__' ) ? i.v = VERVENIA.TOGGLE( i , i.v ) : '';
	  
	}
	
	if ( i.d.fflive ) {//atte, val
	  
	  VERVENIA.FFLIVE( i );
	}
	
	switch ( i.t ) {
		
	  case 'html':
		break;
		
	  case 'text':
		break;
		
	  case 'number':
		break;
		
	  case 'select':		
		break;
		
	  case 'mselect':
		break;
		
	}
	
  }
  
  return o;
  
}
  ;

VERVENIA.FFLIVE = function ( i ) {
	 
  var o = i.d.fflive;
  
 if ( o.search( '__' ) >= 0 ) {
	
	o = o.split( '__' );
	( ! o[2] ) ? o[2] = o[1]:'';
	
  }
  else {
	
	o = [ o , 'val' , 'val' ];
	
  }
  
  switch( o[1] ) {
	  
	default:
	  o[1] = VERVENIA.JQ( i.e )[ o[1] ]();
	  break;
	  
  }
  
  if ( o[2].search( '_' ) >= 0 ) {
	
	var ka = o[2].split( '_' );
	
	//alert( 'KA '+ ka );
	
	if ( ka[0] == 'a' ) {
	  
	  if ( ka[1] == 'src' ) {
		
		o[1] = 'http://' + VERVENIA.DATA.app + '.com/media/img/' + o[1] + '.';
		( ka[2] ) ? o[1] += ka[2] : o[1] += 'png';
		
	  }
	  
	  VERVENIA.JQ( VERVENIA.ATTE( o[0] ) ).attr( ka[1] , o[1] );
	  
	}
	else {
	  
	  VERVENIA.SETDATA( VERVENIA.ATTE( o[0] ) , ka[1] , o[1] );
	  
	}
  }
  else {
	
	VERVENIA.JQ( VERVENIA.ATTE( o[0] ) )[ o[2] ]( o[1] );
	
  }
  
  return o;
};

VERVENIA.FILE = function ( i ) {
  
  var d = VERVENIA.JQ( i ).data();

  var o = VERVENIA.VALIDATE( { "e" : i , "t" : "file" , "a" : "upload" , "v" : i.files[0] } );
  
  if ( o == true ) {//Check if file : (type, extension size and dimensions) are valid
	
	  var fr = new FileReader();
	
	if ( d.show != false ) {
	  
	  d.show = VERVENIA.ATTE( d.show );

	  fr.addEventListener( 'load' , function () {
		
		//alert( VERVENIA.JQ( d.show ).is( 'img' ) );
		if ( VERVENIA.JQ( d.show ).is( 'img' ) == true ) {
		  
		  var e = 'img';
		  
		}
		else {
		  
		  var e = 'img';
		}
		
		var r = {
		  "a" : {
			"src" : fr.result }
		}
			;
		
		VERVENIA.REPLACE( [ d.show , e , r ] );
	  }
						  , false);
	  
	}

	if ( d.show != false ) {
	  
	  fr.readAsDataURL( i.files[0] );
	  
	}
	
	if ( d.save ) {
	  
	  var f = i.files[0];
	  var ta = f.type.split( '/' );
	  
	  var fd = { "type" : ta[0] , "ext" : ta[1] , "size" : f.size , "name" : f.name };
	  
	  //alert( ' Type ' + fd.type + ', Extension ' + fd.ext + ', Size ' + fd.size + ', Name ' + fd.name );
	  //alert( fr.result );

	  VERVENIA.AJAX( { "AJ" : "savefile" , "file" : fr.result , "fd" : fd , "d" : d } );
	  
	}
	  
  }
  
  return o;
  
}
  ;

VERVENIA.REPLACE = function ( i ) {
  
  //i[1] = 'span';//TESTING
  var o = '<' + i[1] + ' ' + VERVENIA.DATA.app + '="' + VERVENIA.ATTR( i[0] ) + '"';
  
  var d = VERVENIA.JQ( i[0] ).data();
  
  VERVENIA.JQ.each( VERVENIA.JQ( i[0] ).data() , function( k , v ) {
    
	if ( i[2] && i[2].d && i[2].d.k ) {  
	  
	  ( i[2].a.k != 'DELETE' ) ? o += ' data-' + k + '="' + i[2].d.k + '"' : '';
	  
	  VERVENIA.UNSET([ i[2].d , k ]);
	  
	} else {
	  
	  o += ' data-' + k + '="' + v + '"';
	  
	}
	
  }
				  );
  
  if ( i[2] && i[2].d ) {

	VERVENIA.JQ.each( i[2].d , function( k , v ) {
	  
	  if ( v != '' ) {
		
		o += ' data-' + k + '="' + v + '"';
		
	  }
	  
	}
					);
	
  }
  
  VERVENIA.JQ.each( VERVENIA.JQ( i[0] )[0].attributes , function( idx , attr ) {
    
    var k = attr.nodeName;
    var v = attr.nodeValue;
    
	if ( i[2] && i[2].a && i[2].a.k ) { 
	  
	  ( i[2].a.k != 'DELETE' ) ? o += ' ' + k + '="' + i[2].d.k + '"' : '';

	  VERVENIA.UNSET([ i[2].d , k ]);
	  
	} else {
	  
	  o += ' ' + k + '="' + v + '"';
	  
	}
	
  }
				  );
  
  if ( i[2] && i[2].a ) {

	VERVENIA.JQ.each( i[2].a , function( k , v ) {
	  
	  if ( v != '' ) {
		
		o += '' + k + '="' + v + '"';
		
	  }
	  
	}
					);
	
  }
  
  o += '>';
  
  ( [ "img" ].indexOf( i[1] ) < 0 ) ? o += VERVENIA.JQ( i[0] ).html() + '</' + i[1] + '>' : '';
  
  //alert( 'Replacing (Other Computer)' + VERVENIA.ATTE( i[0] ) + ', With ' + o );
  
  VERVENIA.JQ( i[0] ).replaceWith( o );
  
  return o;
  
};

VERVENIA.JQ( document ).on( 'mouseover mouseout mousedown mouseup focusin focusout tap taphold click dblclick change keydown keyup' , '[' + VERVENIA.DATA.app + ']', function( e ){
    
  var visible = VERVENIA.JQ( this ).is( ':visible' );
  if ( [ "keydown" , "change" ].indexOf( e.type ) >= 0 ) {
	
	( VERVENIA.JQ( this ).attr( 'name' ) ) ? VERVENIA.SHOWSAVE( [ 's' , this ] ) : '';
	
  }
  
  ( VERVENIA.ATTR( this ) == 'file' && [ "change" ].indexOf( e.type ) >= 0 ) ? VERVENIA.FILE( this ): '';
  
  //Touch
  var touch = [ "mouseover" ];
  
  if ( touch.indexOf( e.type ) >= 0 ) {
	
	var pointer = [ "tab" , "applyfilter" , "clearfilter" , "reorder" , "save" , "viewurl" ,  "dialog" , "flag" , "trash" , 
				   "saveform" , "exitopt" , "newcond" , "remove" , "show" , "hide" , "toggle" , "sort" , "newsort" , "workspacemenu" , 
				   "optview" , "cloneopt" , "editopt" , "newopt" , "newitem" , "newemail" , "editemail" , "ffmergeval" , "newajax" , 
				   "tos" , "ajax" , "hover" ];
	
	( pointer.indexOf( VERVENIA.JQ( this ).attr( VERVENIA.DATA.app ) ) >= 0 ) ? VERVENIA.JQ( this ).css( 'cursor' , 'pointer' ) : '';
	
	( VERVENIA.JQ(this).data( 'tab' ) ) ? VERVENIA.JQ(this).css( 'cursor' , 'pointer' ) : '';
	
  }

  if ( VERVENIA.ATTR( this ) == 'tos' && e.type == 'click' ) {
      
	VERVENIA.LOADING( VERVENIA.JQ( VERVENIA.ATTE( 'tos' ) ).data( 'message' ) );
    ( VERVENIA.JQ( this ).prop( 'checked' ) ) ? VERVENIA.AJAX( { "AJ": "tos" , "tos": VERVENIA.JQ( this ).data() , "d": VERVENIA.DATA } ): '';
  }
  
  //Clean Html
  if ( VERVENIA.JQ( this ).attr( 'contenteditable' ) == 'true' && [ "focusout" ].indexOf( e.type) >= 0 )  {
	
	//console.log( 'Before : ' + VERVENIA.JQ( this ).html() );
	VERVENIA.JQ( this ).html( VERVENIA.JQ( this ).text().replace(/<(\w+)[^>]*>.*<\/\1>/gi,'') );
	//console.log( ' After : ' + VERVENIA.JQ( this ).html() );
	
  }
	  
  //Live
  ( VERVENIA.SYS.suite.track.indexOf( VERVENIA.ATTR( this ) ) >= 0 && VERVENIA.DATA.tracking.where == 'front' && visible == true ) ? 
	VERVENIA.LIVE( { "e" : this , "t" : e.type } ) : '';
  
  //Date
  if ( [ "focusin" , "mouseover" ].indexOf( e.type ) >= 0 && VERVENIA.ATTR( this ) == 'date' ) {
	
	VERVENIA.JQ( this ).datepicker();
	
  }  
  
  //Click
  var click = [ "tap" , "click" , "dblclick" ];
  
  ( click.indexOf( e.type ) >= 0 ) ? VERVENIA.CLICK({
	"e" : this , "t" : e.type }
												   ) : '';
  
  //Sort
  if( VERVENIA.ATTR( this ) == 'sort' ){
    
    VERVENIA.JQ( this ).sortable();
  }
  
  //Field
  if ( VERVENIA.JQ( this ).is( 'input' ) || VERVENIA.JQ( this ).is( 'select' ) ) {

	var input = [ "focusin" , "focusout" , "change" , "keydown" , "keyup" ];
	
	if ( input.indexOf( e.type ) >= 0 ) {
	  
	  var ai = {
		"e" : this , "a" : e.type }
		  ;
	  
	  if ( VERVENIA.JQ( this ).is( 'select' ) ) {
		
		ai['v'] = VERVENIA.JQ( this ).val();
		
		( VERVENIA.JQ( this ).prop( 'multiple' ) ) ? ai['t'] = 'mselect': ai['t'] = 'select';
		
	  }
	  else {
		
		( VERVENIA.ATTR( this ) == 'date' ) ? ai['t'] = 'date' : ai['t'] = VERVENIA.JQ( this ).attr( 'type' );
		
		if ( [ "radio" , "checkbox" ].indexOf( VERVENIA.JQ( this ).attr( 'type' ) ) >= 0 ) {
		  
		  ai['s'] = '[' + VERVENIA.DATA.app + '="valset"][data-valset="' + VERVENIA.JQ( this ).data( 'valset' ) + '"]';
		  
		  ai['v'] = [];
		  
		  ai['v'][0] = VERVENIA.JQ(ai.s).val();
		  
		  ai['v'][1] = VERVENIA.JQ(this).data( 'value' );
		  ai['v'][2] = VERVENIA.JQ(this).prop( 'checked' );
		  
		}
		else {
		  
		  ai['v'] = VERVENIA.CLEAN( VERVENIA.JQ( this ).val( ) );
		  VERVENIA.JQ( this ).val( ai['v'] );
		  
		}
		
	  }
	  
	  ( ai.t == 'date' ) ? VERVENIA.DATE( ai ) : VERVENIA.FIELD( ai );
	  
	}
	
  }
  
  //Html Input Fields
  var input = [ "focusin" , "focusout" ];
  
  if( input.indexOf( e.type ) >= 0 ){
	
	var quickedit = [ "quickedit" ];
	
	if ( quickedit.indexOf( VERVENIA.ATTR( this ) ) >= 0 ) {
	  
	  if ( VERVENIA.FIELD({
		"e" : this , "t" : 'html' , "a" : e.type , "v" : VERVENIA.JQ(this).html() }
						 ) == true &&  e.type == 'focusout' ) {
		
		var d = VERVENIA.JQ(this).data();
		var val = VERVENIA.JQ(this)[d.val]();
		
		val = VERVENIA.CLEAN( val );
		
		VERVENIA.JQ(this)[d.val]( val );
		
		//TO DO LIST - ADD NAME CLEANER (mETHOD?) HERE
		
		var id = d.id;
		
		if ( VERVENIA.JQ.type( id ) == 'string' && id.search('_') >= 0 ) {
		  
		  var ida = id.split('_');
		  
		  ( ida.length == 3 ) ? id = VERVENIA.JQ( VERVENIA.ATTE( ida[0] ) )[ida[1]](ida[2]) : 
			id = VERVENIA.JQ( VERVENIA.ATTE( ida[0]) )[ida[1]]();

		  if ( [ "workspace" ].indexOf( ida[2] ) >= 0 ) {
			
			switch ( ida[2] ) {
				
			  case 'workspace':
				var stg = VERVENIA.JQ( '['+VERVENIA.DATA.app+'="dashboard"]' ).data( 'settings' );				
				stg['name'] = val;	
				VERVENIA.SETDATA( VERVENIA.ATTE( 'dashboard' ) , 'settings' , VERVENIA.JSVAL( stg ) );
				break;
				
			}
			
		  }
		  
		}
		
		console.log( 'Saving Quickedit' + val );
		
		VERVENIA.AJAX( {
		  "AJ": "quickedit" , "tbl": d.tbl , "val" : val , "id" : id , "key" : d.key }
					 );
		
	  }
	  
	}
	
  }
  
  //Change
  var change = [ "change" ];
  
  ( change.indexOf( e.type ) >= 0 ) ? VERVENIA.CHANGE({
	"e" : this , "t" : e.type }
													 ) : '';
  
}
);

VERVENIA.CLICKS = function ( i ) {
  
  var o = false;
  
  ( [ "mousedown" , "tap" , "taphold" , "click" , "dblclick" ].indexOf( i ) >= 0 ) ? o = true:'';
  
  return o;
};

VERVENIA.LINKS = function ( i ) {
  
  var o = false;
  
  if ( VERVENIA.JQ( i ).data( 'click' ) != 'hold' && VERVENIA.IG( [ 'link' , VERVENIA.JQ( i ).attr( 'href' ) ] ) == true ) {
	  
	o = true;
	
  }
  
  return o;
};

VERVENIA.JQ( document ).on( 'mouseover mouseout tap taphold click dblclick' , '[href]', function( e ){
  
  var type = e.type;
	  
  if ( VERVENIA.DATA.tracking.where == 'front' ) {

	if ( VERVENIA.CLICKS( e.type ) == true && VERVENIA.LINKS( this ) == true ) {
	  
	VERVENIA.SETDATA( i , 'click' , 'hold' );
	  
	  var ai = {//mouseover mouseout - need action for these!
		"event": {
		  "target" : "link" , "id" : VERVENIA.JQ( this ).attr( 'href' )  , "type" : "click" , 
		  "subid" : "no_link_description" , "subtype" : e.type }
		, "content": "link" , "attr" : {} }
		  ;

	  ai['date'] = VERVENIA.GETDATE( VERVENIA.DATA.date );
	
	  //alert( ai.event.id );

	  ai['event']['target_name'] = 'link';
	  ai['event']['subid_name'] = 'link_description';
	  
	  ( VERVENIA.JQ( this ).data() ) ? ai['data'] = VERVENIA.JQ( this ).data(): '';	  
	  ( VERVENIA.JQ( this ).attr( 'target' ) ) ? ai['attr']['target'] = VERVENIA.JQ( this ).attr( 'target' ): '';
	  ( VERVENIA.JQ( this ).attr( 'src' ) ) ? ai['attr']['src'] = VERVENIA.JQ( this ).attr( 'src' ): '';
	  ( VERVENIA.JQ( this ).attr( 'title' ) ) ? ai['attr']['title'] = VERVENIA.JQ( this ).attr( 'title' ):'';
	  ( VERVENIA.JQ( this ).attr( 'alt' ) ) ? ai['event']['subid'] = VERVENIA.JQ( this ).attr( 'alt' ):'';
	  
	  VERVENIA.FEEDBACK( 'LOG LINK ACTION : ' , ai );
	  
	  VERVENIA.LOGEVENT( ai );
	  
	  VERVENIA.SETDATA( this , 'click' , 'go' );
	  
	}
	
  }
}
);

VERVENIA.SETDATA = function ( i , i2 , i3 ) {
  
  var o = true;
  
  if ( VERVENIA.JQ.type( i ) == 'array' ) {

	if ( i.length == 3 ) {
	  
	  VERVENIA.JQ( i[0] )[i[1]]( i[2] ).attr( 'data-' + i2 , i3 );
	  VERVENIA.JQ( i[0] )[i[1]]( i[2] ).data( i2 , i3 );
	  
	}
	else {
	  
	  VERVENIA.JQ( i[0] )[i[1]]().attr( 'data-' + i2 , i3 );
	  VERVENIA.JQ( i[0] )[i[1]]().data( i2 , i3 );
	  
	}
	
  }
  else {
	
	VERVENIA.JQ( i ).attr( 'data-' + i2 , i3 );	
	VERVENIA.JQ( i ).data( i2 , i3 );
	
  }
  
  return o;
  
}
  ;

VERVENIA.CLEAN = function ( i ) {
  
  var o = i;
  
  //console.log( 'Clean ' + o );
  
  o = o.replace(/\\/g, '' );
  
  if ( o.replace(/^\s+|\s+$/g,'') != '' ) {
	
	//console.log( 'Cleaning... ' + o );
	
	o = o.replace(/<(\w+)[^>]*>.*<\/\1>/gi,'');
	o = o.replace(/<script>/gi,'');
	o = o.replace(/<\/script>/gi,'');
	o = o.replace(/&#x3C;script&#x3E;/gi,'');
	o = o.replace(/&#x3C;\/script&#x3E;/gi,'');
	o = o.replace(/&lt;script&gt;/gi,'');
	o = o.replace(/&lt;\/script&gt;/gi,'');
	
	//console.log( 'Cleaning... ' + o );
	
  }
  
  //console.log( 'Cleaned ' + o );
  
  return o;
  
}
  ;

VERVENIA.REPQUOTE = function ( i ) {
  
  var o = i[1];
  
  //alert( 'Before (' + i[0] + ') ' + o );
  
  switch ( i[0] ) {
	  
	case 's':
	  o = o.replace(/"/gi, VERVENIA.DATA.app.toUpperCase( ) + '_DQUOTE' );
	  break;
	  
	case 'r':
	  o = o.replace(/VERVENIA_DQUOTE/gi, '"' );
	  break;
	  
  }
  
  //alert( 'After (' + i[0] + ') ' + o );
  
  return o;
  
}
  ;

VERVENIA.S2OBJ = function ( i ) {
  
  var o = JSON.stringify( i );
  
  o = o.replace(/\\/g, '' );
  //o.replace(/\\/g, '' );
  
  return o;
  
}
  ;

VERVENIA.CHANGE = function ( i ) {
  
  if ( VERVENIA.ATTR( i.e ) == 'load' ) {
	
	var ai = { "AJ": "workspace" , "d": VERVENIA.DATA , "id" : VERVENIA.JQ( i.e ).val() };
	( [ "clone" , "new" ].indexOf( ai.id ) >= 0 ) ? ai['mode'] = ai.id: ai['mode'] = 'load';
	VERVENIA.AJAX( ai );
	
  }
  
  if ( VERVENIA.ATTR( i.e ) == 'optmenu' ) {
	
	VERVENIA.OPT( 'man' , VERVENIA.JQ( i.e ).val() );
	
  }
  
  var paginate = [ "changepage" , "pagesize" ];
  
  if ( paginate.indexOf( VERVENIA.ATTR( i.e ) ) >= 0 ) {
	
	var ai = { "AJ": "paginate" };
	
	ai['f'] = [ VERVENIA.ATTR( i.e ) , VERVENIA.JQ( i.e ).val() ];
	ai['opt'] = VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'opt' ) ).data( 'opt' );
	ai['view'] = VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'tablefooter' ) ).data( 'view' );
	
	ai['save'] = VERVENIA.JQ( VERVENIA.ATTE( 'save' ) + '[save="opt"][opt="' + ai['opt'] + '"]' ).is( ':visible' );
	
	VERVENIA.AJAX( ai );
	
  }
  
  var mode = [ "include_date_mode" , "ignore_date_mode" , "include_hours_mode" , "ignore_hours_mode" , "geo_filter_include_mode" , "geo_filter_ignore_mode" ];
  
  if ( mode.indexOf( VERVENIA.ATTR( i.e ) ) >= 0 ) {
	
	console.log( 'Mode : '+ VERVENIA.ATTR( i.e ) );
	
	if ( VERVENIA.ATTR( i.e ).substring( 0 , 3 ) == 'geo' ) {
	  
	  var ma = VERVENIA.ATTR( i.e ).split( '_' );
	  
	  VERVENIA.JQ( VERVENIA.ATTE( ma[2] + '_geo_country' ) ).hide().val( VERVENIA.SYS.def );
	  VERVENIA.JQ( VERVENIA.ATTE( ma[2] + '_geo_region' ) ).hide().val( VERVENIA.SYS.def );
	  VERVENIA.JQ( VERVENIA.ATTE( ma[2] + '_geo_city' ) ).hide().val( VERVENIA.SYS.def );
	  VERVENIA.JQ( VERVENIA.ATTE( ma[2] + '_geo_m' ) ).hide().val( VERVENIA.SYS.def );
	  
	  VERVENIA.JQ( VERVENIA.ATTE( 'spinner' ) + '[data-spinner="' + ma[2] + '_geomenu"]' ).show();
	  
	  if ( VERVENIA.JQ( i.e ).val() == 'country' ) {
		
		VERVENIA.AJAX( {
		  "AJ" : "geomenu" , "mode" : VERVENIA.JQ( i.e ).val() , "w" : ma[2] + '_mode' }
					 );
		
	  }
	  else {
		
		( VERVENIA.JQ( i.e ).val() == VERVENIA.SYS.def ) ? VERVENIA.JQ( VERVENIA.ATTE( ma[2] + '_geo_country' ) ).hide( ) : 
		  VERVENIA.JQ( VERVENIA.ATTE( ma[2] + '_geo_country' ) ).show( );
		
		VERVENIA.JQ( VERVENIA.ATTE( 'spinner' ) + '[data-spinner="' + ma[2] + '_geomenu"]' ).hide();
		
	  }
	  
	}
	else {
	  
	  switch ( VERVENIA.ATTR( i.e ) ) {
		  
		case 'include_date_mode':
		  
		  var sh = 'show';
		  ( VERVENIA.JQ( i.e ).val() == VERVENIA.SYS.def ) ? sh = 'hide' : '';
		  
		  VERVENIA.JQ('['+VERVENIA.DATA.app+'][data-set="range_include_date_s"]')[sh]();
		  
		  VERVENIA.JQ('['+VERVENIA.DATA.app+'][data-set="range_include_date_e"]')[sh]();
		  break;
		  
		case 'ignore_date_mode':
		  
		  var sh = 'show';
		  ( VERVENIA.JQ( i.e ).val() == VERVENIA.SYS.def ) ? sh = 'hide' : '';
		  
		  VERVENIA.JQ('['+VERVENIA.DATA.app+'][data-set="range_ignore_date_s"]')[sh]();
		  
		  VERVENIA.JQ('['+VERVENIA.DATA.app+'][data-set="range_ignore_date_e"]')[sh]();
		  break;
		  
		case 'include_hours_mode':
		  
		  var sh = 'show';
		  ( VERVENIA.JQ( i.e ).val() == VERVENIA.SYS.def ) ? sh = 'hide' : '';
		  
		  VERVENIA.JQ('['+VERVENIA.DATA.app+'][data-set="range_include_hours_s"]')[sh]();
		  
		  VERVENIA.JQ('['+VERVENIA.DATA.app+'][data-set="range_include_hours_e"]')[sh]();
		  break;
		  
		case 'ignore_hours_mode':
		  
		  var sh = 'show';
		  ( VERVENIA.JQ( i.e ).val() == VERVENIA.SYS.def ) ? sh = 'hide' : '';
		  
		  VERVENIA.JQ('['+VERVENIA.DATA.app+'][data-set="range_ignore_hours_s"]')[sh]();
		  
		  VERVENIA.JQ('['+VERVENIA.DATA.app+'][data-set="range_ignore_hours_e"]')[sh]();
		  break;
	  }
	  
	}
	
  }
  
  var geo = [ "include_geo_country" , "ignore_geo_country" , "include_geo_region" , "ignore_geo_region" , "include_geo_city" , "ignore_geo_city" ];
  
  if ( geo.indexOf( VERVENIA.ATTR( i.e ) ) >= 0 ) {
	
	var w = VERVENIA.ATTR( i.e );
	
	if ( VERVENIA.JQ( i.e ).val() == VERVENIA.SYS.def ) {
	  
	  VERVENIA.JQ( VERVENIA.ATTE( w.split( '_' )[0] + '_geo_country' ) ).hide().val( VERVENIA.SYS.def );
	  VERVENIA.JQ( VERVENIA.ATTE( w.split( '_' )[0] + '_geo_region' )  ).hide().val( VERVENIA.SYS.def );
	  VERVENIA.JQ( VERVENIA.ATTE( w.split( '_' )[0] + '_geo_city' ) ).hide().val( VERVENIA.SYS.def );
	  VERVENIA.JQ( VERVENIA.ATTE( w.split( '_' )[0] + '_geo_m' ) ).hide().val( VERVENIA.SYS.def );
	  
	}
	else {
	  
	  VERVENIA.JQ( VERVENIA.ATTE( 'spinner' ) + '[data-spinner="' + w.split( '_' )[0] + '_geomenu"]' ).show();
	  
	  var ai = {
		"AJ" : "geomenu" , "mode" : VERVENIA.JQ( VERVENIA.ATTE( 'geo_filter_' + w.split( '_' )[0] + '_mode' ) ).val() , "w" : w }
		  ;
	  
	  VERVENIA.JQ( VERVENIA.ATTE( w.split( '_' )[0] + '_geo_m' ) ).hide().val( VERVENIA.SYS.def );
	  
	  switch ( w.split( '_' )[2] ) {
		  
		case 'country':
		  
		  ai['geo'] = {
			"country" : VERVENIA.JQ( VERVENIA.ATTE( w.split( '_' )[0] + '_geo_country' ) ).val() }
			;
		  
		  VERVENIA.JQ( VERVENIA.ATTE( w.split( '_' )[0] + '_geo_region' ) ).hide().val( VERVENIA.SYS.def );
		  VERVENIA.JQ( VERVENIA.ATTE( w.split( '_' )[0] + '_geo_city' ) ).hide().val( VERVENIA.SYS.def );
		  break;
		  
		case 'region':
		  
		  ai['geo'] = {
			"country" : VERVENIA.JQ( VERVENIA.ATTE( w.split( '_' )[0] + '_geo_country' ) ).val() , 
			"region" : VERVENIA.JQ( VERVENIA.ATTE( w.split( '_' )[0] + '_geo_region' ) ).val() , 
		  }
			;
		  VERVENIA.JQ( VERVENIA.ATTE( w.split( '_' )[0] + '_geo_city' ) ).hide().val( VERVENIA.SYS.def );
		  break;
		  
		case 'city':
		  
		  ai['geo'] = {
			"country" : VERVENIA.JQ( VERVENIA.ATTE( w.split( '_' )[0] + '_geo_country' ) ).val() , 
			"region" : VERVENIA.JQ( VERVENIA.ATTE( w.split( '_' )[0] + '_geo_region' ) ).val() , 
			"city" : VERVENIA.JQ( VERVENIA.ATTE( w.split( '_' )[0] + '_geo_city' ) ).val() ,
		  }
			;
		  break;
		  
	  }
	  
	  VERVENIA.JQ( '*' ).css( 'cursor' , 'default' );
	  
	  VERVENIA.FEEDBACK( ' GEO ' , ai ); 
	  VERVENIA.AJAX( ai );
	  
	}
	
  }
  
  if ( VERVENIA.ATTR( i.e ) == 'editcat' ) {
	
	( VERVENIA.JQ( i.e ).val() == 'newcat' ) ? VERVENIA.JQ( VERVENIA.ATTE( 'newcat' ) ).show() : 
	  VERVENIA.JQ( VERVENIA.ATTE( 'newcat' ) ).hide();
	
  }
  
  if ( VERVENIA.ATTR( i.e ) == 'optchild' ) {
	
	var hide = VERVENIA.ATTE( 'opteditor' );
	
	VERVENIA.AJAX( {
	  "AJ": "editopt" , "hide": hide , "id" : VERVENIA.JQ( VERVENIA.ATTE( 'opteditor' ) ).data( 'id' ) , "child" : VERVENIA.JQ( i.e ).val() }
				 );	
  }
  
  if ( VERVENIA.ATTR( i.e ) == 'optgrandchild' ) {
	
	ai =  { "AJ": "editopt" , "id" : VERVENIA.JQ( VERVENIA.ATTE( 'opteditor' ) ).data( 'id' ) };
	ai['child'] = VERVENIA.JQ( VERVENIA.ATTE( 'optchild' ) ).val();
	ai['grandchild'] = VERVENIA.JQ( i.e ).val();
	
	//alert( 'Child ' + ai.child );
				 
	VERVENIA.AJAX( ai );	
  }
  
  if ( VERVENIA.ATTR( i.e ) == 'optdescendent' ) {
	
	ai =  { "AJ": "editopt" , "id" : VERVENIA.JQ( VERVENIA.ATTE( 'opteditor' ) ).data( 'id' ) };
	ai['child'] = VERVENIA.JQ( VERVENIA.ATTE( 'optchild' ) ).val();
	ai['grandchild'] = VERVENIA.JQ( VERVENIA.ATTE( 'optgrandchild' ) ).val();
	ai['descendent'] = VERVENIA.JQ( i.e ).val();
	
	//alert( 'Child ' + ai.child );
				 
	VERVENIA.AJAX( ai );
  }
  
  if ( VERVENIA.ATTR( i.e ) == 'condkey' ) {
	
	VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'togglecond' ) ).children( VERVENIA.ATTE( 'conditem' ) ).val( '' );
  }
  
  var dialog = [ "sysmenu" ];
  if ( dialog.indexOf( VERVENIA.ATTR( i.e ) ) >= 0 && VERVENIA.JQ( i.e ).val() != VERVENIA.SYS.def ) {
	
	var d = { "dialog" : "sys" , "sys" : VERVENIA.JQ( i.e ).val() };

	d.spinner = VERVENIA.SHOWSPINNER( VERVENIA.ATTR( i.e ) );
	
	d.dim = d.sys + '_settings__';
	
	if ( d.sys == 'tabs' ) {
	  
		d.dialog = 'sort';
		d.sort = 'tabs';
	    d.dim += '850__850';
	  
	} else {
	
	  switch ( d.sys ) {
		  
		default:
		  d.dim += '800__600';
		  break;
	  }
	  
	}
	
	VERVENIA.AJAX( {
	  "AJ": "dialog" , "d" : d }
				 );	
	
	VERVENIA.JQ( i.e ).val( VERVENIA.SYS.def );
  }
  
  if ( VERVENIA.ATTR( i.e ) == 'aj' ) {
	
	var d = VERVENIA.JQ( i.e ).data();
	d.val = VERVENIA.JQ( i.e ).val();
	
	var ai = { "AJ": d.aj , "d" : d };
	
	switch( d.aj ) {
		
	  case 'editff':
		ai.LIVE = true;
		break;
		
	  default:
		break;
	  
	}
	
	VERVENIA.AJAX( ai );
	
  }
  
  return o;
}
  ;

VERVENIA.OPT = function ( i , i2 ) {
  
  var o = true;
  
  //alert( 'option' + i2 );
  
  ( i == 'tab' ) ? VERVENIA.JQ( VERVENIA.ATTE( 'optmenu' ) ).val( i2 ): '';
  var stgs = VERVENIA.JQ( VERVENIA.ATTE( 'dashboard' ) ).data( 'settings' );  

  ( VERVENIA.JQ.type( stgs ) == 'string' ) ? stgs = JSON.parse( stgs ) : ''; 
  
  VERVENIA.JQ( VERVENIA.ATTE( 'editor' ) ).html( '' );
  
  stgs['menu'] = i2;
  
  if ( stgs['opts'][i2]['q'][1] == 'c' ) {
	
	VERVENIA.JQ( VERVENIA.ATTE( 'newopt') ).show();
	
  }
  else {
	
	VERVENIA.JQ( VERVENIA.ATTE( 'newopt') ).hide();
	
  }
  
  VERVENIA.SETDATA( VERVENIA.ATTE( 'dashboard' ) , 'settings' , VERVENIA.S2OBJ( stgs ) );
  
  VERVENIA.JQ( VERVENIA.ATTE( 'opt' ) ).hide();
  VERVENIA.JQ( VERVENIA.ATTE( 'stats' ) ).hide();
  
  VERVENIA.JQ( VERVENIA.ATTE( 'opt' ) + '[data-opt="' + i2 + '"]').show();
  VERVENIA.JQ( VERVENIA.ATTE( 'opt' ) + '[data-opt="' + i2 + '"]').show();
  
  ( ! VERVENIA.JQ( VERVENIA.ATTE( 'main' ) + '[data-opt="' + i2 + '"]').is( ':visible' ) ) ? 
	VERVENIA.JQ( VERVENIA.ATTE( 'main' ) + '[data-opt="' + i2 + '"]').show() : '';
	
  VERVENIA.JQ( VERVENIA.ATTE( 'save' ) + '[data-save="workspace"]').fadeIn( 250 );
  
  return o;
  
};

VERVENIA.TAB = function ( i ) {
  
  var o = true;
  
  var stgs = VERVENIA.JQ( VERVENIA.ATTE( 'dashboard' ) ).data( 'settings' );  

  ( VERVENIA.JQ.type( stgs ) == 'string' ) ? stgs = JSON.parse( stgs ) : ''; 
  
  if ( VERVENIA.JQ( i[0] ).data( 'tab' ) != stgs.tab ) {
	
    VERVENIA.JQ( VERVENIA.ATTE( 'editor' ) ).html( '' );
	
    var c = VERVENIA.JQ( i[1] ).closest( VERVENIA.ATTE( 'tabs' ) ).data( 'color' );
	
	c = c.split( '?' );
	
	stgs['tab'] = VERVENIA.JQ( i[1] ).data( 'tab' );
	
	//console.log( stgs.tab + ' (' + VERVENIA.JQ.type( stgs ) + ') = ' + VERVENIA.ATTE( 'dashboard' ) );//TESTING
	
	VERVENIA.JQ( i[1] ).closest( VERVENIA.ATTE( 'tabs' ) ).children().css( 'background-color' , c[1] );
	VERVENIA.SETDATA( VERVENIA.ATTE( 'dashboard' ) , 'settings' , VERVENIA.JSVAL( stgs ) );	
	
	VERVENIA.JQ( i[1] ).css( 'background-color' , c[0] );
	
	console.log( ' Drama : ' + stgs.tabs[VERVENIA.JQ( i[1] ).data( 'tab' )][0] );//TESTING
	
	VERVENIA.OPT( 'tab' , stgs.tabs[VERVENIA.JQ( i[1] ).data( 'tab' )][0] );
	
  }
  
  return o;
  
};

VERVENIA.CLICK = function ( i ) {
  
  var o = true;
  
  if ( VERVENIA.ATTR( i.e ).substring( 0 , 3 ) == 'tab' ) {
	
	( VERVENIA.JQ( i.e ).data( 'tab' ) ) ? VERVENIA.TAB( [ 'man' , i.e ] ) :'';
  }
  
  if ( VERVENIA.ATTR( i.e ) == 'optview' ) {
	
	var fade = 250;
	var opt = VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'opt' ) ).data( 'opt' );
	
	switch ( VERVENIA.JQ( i.e ).data( 'view' ) ) {
		
	  case 'opt':
		VERVENIA.JQ( '[' + VERVENIA.DATA.app + '="newopt"]' ).fadeOut( fade );
		VERVENIA.JQ( '[' + VERVENIA.DATA.app + '="main"][data-opt="' + opt + '"]' ).fadeOut( fade );
		VERVENIA.JQ( '[' + VERVENIA.DATA.app + '="stats"][data-opt="' + opt + '"]' ).fadeIn( fade );
		break;
	  case 'stats':
		VERVENIA.JQ( '[' + VERVENIA.DATA.app + '="newopt"]' ).fadeIn( fade );
		VERVENIA.JQ( '[' + VERVENIA.DATA.app + '="stats"][data-opt="' + opt + '"]' ).fadeOut( fade );
		VERVENIA.JQ( '[' + VERVENIA.DATA.app + '="main"][data-opt="' + opt + '"]' ).fadeIn( fade );
		break;
		
	}
	
  }
  
  var filter = [ "applyfilter" , "clearfilter" ];
  
  if ( filter.indexOf( VERVENIA.ATTR( i.e ) ) >= 0 ) {
	
	var ai = { "AJ": "filter" };
	
	ai['f'] = VERVENIA.JQ( i.e ).data();
	ai['opt'] = VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'opt' ) ).data( 'opt' );
	
	( VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'stats' ) ).length > 0 ) ? ai['view'] = 'stats': ai['view'] = 'main';
	
	VERVENIA.AJAX( ai );
	
  }
  
  if ( VERVENIA.ATTR( i.e ) == 'ajax' ) {
	
	var d = VERVENIA.JQ( i.e ).data();
	d['AJ'] = d.ajax;
	
	( [ "upgrade" ].indexOf( d['AJ'] ) >= 0 ) ? d.d = VERVENIA.DATA : '';
	
	switch( d['AJ'] ){
		
	  case 'upgrade': 
		if ( d.delay ) {
		  
		  d.delay = VERVENIA.JQ( VERVENIA.ATTE( 'delay_time' ) ).val();
		  VERVENIA.JQ( VERVENIA.ATTE( 'billboard' ) ).fadeOut( 500 );
		  VERVENIA.JQ( VERVENIA.ATTE( 'billboard' ) ).remove();
		  VERVENIA.MAINSPINNER( 'reminder' );
		  
		} else {		  
		
		  VERVENIA.LOADING( VERVENIA.JQ( VERVENIA.ATTE( 'billboard' ) ).data( 'message' ) );
		  
		}
		break;
		
	}
	
	VERVENIA.AJAX( d );
	
  }
  
  var save = [ "save" ];
  
  if ( save.indexOf( VERVENIA.ATTR( i.e ) ) >= 0 ) {
	
	VERVENIA.AJAX( {
	  "AJ": "save" , "s": VERVENIA.JQ( i.e ).data() }
				 );
	
  }
  
  var reorder = [ "reorder" ];
  
  if ( reorder.indexOf( VERVENIA.ATTR( i.e ) ) >= 0 ) {
	
	var ai = { "AJ": "paginate" };
	
	ai['f'] = [ "reorder" , VERVENIA.JQ( i.e ).data() ];
	ai['opt'] = VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'opt' ) ).data( 'opt' );

	( VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'optheader' ) ).length > 0 ) ? ai['view'] = 'main': ai['view'] = 'stats';
	
	//alert(' f ' + ai['f'][1]['order'] + ' opt ' + ai['opt'] + ' view ' + ai['view'] );//TESTING
	
	VERVENIA.AJAX( ai );
	
  }
  
  var url = [ "viewurl" ];
  
  if ( url.indexOf( VERVENIA.ATTR( i.e ) ) >= 0 ) {
	
	window.open( VERVENIA.JQ( i.e ).data( 'url' ) );
	
  }
  
  var dialog = [ "dialog" ];
  
  if ( dialog.indexOf( VERVENIA.ATTR( i.e ) ) >= 0 ) {
	
	var d = VERVENIA.JQ( i.e ).data();
	
	d.spinner = VERVENIA.SHOWSPINNER( VERVENIA.ATTR( i.e ) );
	
	switch ( d.dialog ) {
		
	  case 'spam':
		d['opt'] = VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'opt' ) ).data( 'opt' );
		d['row'] = VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'tablerow' ) ).data( 'row' );
		( VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'stats' ) ).length > 0 ) ? d['view'] = 'stats': d['view'] = 'main';
		break;
		
	  case 'sort':
		( d.sort == 'children' ) ? d['child'] = VERVENIA.JQ( VERVENIA.ATTE( 'optchild' ) ).val(): '';
		break;
		
	  case 'item':
		d['key'] = VERVENIA.JQ( i.e ).prev( VERVENIA.ATTE( 'condkey' ) ).val();
		break;
		
	}
	
	if ( d.cond ) {
	  
	  switch ( d.dialog ) {
		  
		case 'tracking':
		  d['qy'] = VERVENIA.JQ( i.e ).next( VERVENIA.ATTE( 'condcontent' ) ).val();
		  console.log( 'Tracking : '+ d.qy );//TESTING
		  break;
		  
		case 'geo':
		  d['qy'] = VERVENIA.JQ( i.e ).next( VERVENIA.ATTE( 'condlocation' ) ).val();
		  console.log( 'GEO : '+ d.qy );//TESTING
		  break;
		  
		default:
		  d['qy'] = VERVENIA.JQ( i.e ).next( VERVENIA.ATTE( 'cond' + d.cond ) ).val();
		  console.log( 'Default (' + d.cond + ') : '+ d.qy );//TESTING
		  break;
		  
	  }
	  
	  d['ind'] = VERVENIA.IND( i.e , VERVENIA.ATTE( 'togglecond' ) );
	  //alert( 'Index ' + d.ind );//WORKING
	  
	}
	
	if (  VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'togglecond' ) ).length > 0 && VERVENIA.JQ( i.e ).next().val() != null ) {
	  
	  d['conds'] = VERVENIA.JQ( i.e ).next().val();
	  //alert( VERVENIA.JQ( i.e ).next().val() );//WORKING
	  
	}
	  
	VERVENIA.AJAX( { "AJ": "dialog" , "d": d } );
	
  }
  
  if ( VERVENIA.ATTR( i.e ) == 'flag' ) {
	
	//v__Valid____f__Flagged__#FFECEF
	var d = VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'tablerow' ) ).data();
	
	var st = d.sts.split( '__' );
	
	var st = st.reverse();
	
	VERVENIA.JQ( '*' ).css( 'cursor' , 'default' );
	
	VERVENIA.SETDATA( [ i.e , 'next' , '['+VERVENIA.DATA.app+'="applyfilter"][data-key="st"]' ] , 'val' , st[0] );
	
	VERVENIA.JQ( i.e ).next('['+VERVENIA.DATA.app+'="applyfilter"][data-key="st"]').html( st[1] );
	
	VERVENIA.JQ( i.e ).closest('['+VERVENIA.DATA.app+'="tablerow"]').css( 'background-color' ,  st[2] );
	
	( [ "i" , "f" ].indexOf( st[0] ) >= 0 ) ? VERVENIA.JQ( i.e ).next('['+VERVENIA.DATA.app+'="applyfilter"][data-key="st"]').next('['+VERVENIA.DATA.app+'="dialog"]').show() : '';
	
	( [ "a" , "v" ].indexOf( st[0] ) >= 0 ) ? VERVENIA.JQ( i.e ).next('['+VERVENIA.DATA.app+'="applyfilter"][data-key="st"]').next('['+VERVENIA.DATA.app+'="dialog"]').hide() : '';
	
	var st = st.join( '__' );
	
	VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'tablerow' ) ).attr( 'data-sts' , st );
	VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'tablerow' ) ).data( 'sts' , st );
	
	var ai = {
	  "AJ": "stchange" , "st": st , "row" : VERVENIA.JQ( i.e ).closest('['+VERVENIA.DATA.app+'="tablerow"]').data( 'row' ) , "live" : true }
		;
	
	ai['opt'] = VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'opt' ) ).data( 'opt' );
	( VERVENIA.JQ( VERVENIA.ATTE( 'optview' ) + '[data-view="stats"]' ).is( ':visible' ) == true ) ? ai['stats'] = true: '';
	
	VERVENIA.AJAX( ai );
	
  }
  
  //NEW OR CLONE	
  var newopt = [ "newopt" , "cloneopt" ];
  if ( newopt.indexOf( VERVENIA.ATTR( i.e ) ) >= 0 ) {
	
	var ai = {
	  "AJ": "newopt" , "mode" : VERVENIA.ATTR( i.e ) }
		;
	
	if ( VERVENIA.ATTR( i.e ) == 'cloneopt' ) {

	  VERVENIA.JQ( VERVENIA.ATTE( 'newopt') ).hide();
	  ai['opt'] = VERVENIA.JQ( i.e ).closest('[' + VERVENIA.DATA.app + '="opt"]').data( 'opt' );
	  ai['id'] =  VERVENIA.JQ( i.e ).closest('[' + VERVENIA.DATA.app + '="edit"]').data( 'id' );
	  
	}
	
	VERVENIA.AJAX( ai );
	
  }
  
  //Edit
  if ( VERVENIA.ATTR( i.e ) == 'editopt' ) {
	
	VERVENIA.JQ( VERVENIA.ATTE( 'newopt' ) ).hide( );	
	VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'main' ) ).fadeOut( 250 );
	
	VERVENIA.AJAX( {
	  "AJ": "editopt" , "id" : VERVENIA.JQ( i.e ).data( 'id' ) }
				 );
	
  }

  if ( VERVENIA.ATTR( i.e ) == 'exitopt' ) {
	
	var opt = VERVENIA.JQ('[' + VERVENIA.DATA.app + '="opteditor"]').data( 'opt' );
	
	VERVENIA.JQ( '[' + VERVENIA.DATA.app + '="editor"]' ).html('');
	VERVENIA.JQ('[' + VERVENIA.DATA.app + '="opt"][data-opt="' + opt + '"]').show();
	
	VERVENIA.JQ('[' + VERVENIA.DATA.app + '="newopt"]').show();
	VERVENIA.JQ( '[' + VERVENIA.DATA.app + '="main"][data-opt="' + opt + '"]' ).fadeIn( 250 );
	
  }
  
  if ( VERVENIA.ATTR( i.e ) == 'saveform' ) {
	
	var form = VERVENIA.JQ( i.e ).closest('form').attr( VERVENIA.DATA.app );
	
	VERVENIA.JQ( i.e ).fadeOut( 250 );
	
	form = '[' + VERVENIA.DATA.app + '="' + form + '"]';
	
	var ai = VERVENIA.FORMDATA( form + '__AJ' );
	VERVENIA.AJAX( ai );
			
  }
  
  if ( VERVENIA.ATTR( i.e ) == 'newcond' ) {
	
	VERVENIA.JQ( i.e ).hide( );
	
	var d = VERVENIA.JQ( i.e ).data();
	
	d['count'] = VERVENIA.JQ( '[' + VERVENIA.DATA.app + '="editcond"][data-cond="' + d.cond + '"]' ).length;
	
	d.count++;
	
	var ai = { "AJ": "editcond" , "d" : d , "spinner" : "newcond_" + d.cond };
	
	VERVENIA.AJAX( ai );
			
  }
  
  if ( VERVENIA.ATTR( i.e ) == 'newsort' ) {
	
	VERVENIA.JQ( i.e ).hide( );
	VERVENIA.JQ( VERVENIA.ATTE( 'spinner' ) + '[data-spinner="newsort"]' ).show( );
	
	var ai = { "AJ": "sortrow" , "sort" : VERVENIA.JQ( i.e ).data( 'sort' ) };
	ai['ids'] = VERVENIA.JQ( VERVENIA.ATTE( 'sortids_' + ai.sort ) ).val();
	
	ai['d'] = VERVENIA.JQ( '[' + VERVENIA.DATA.app + '="sort"][data-sort="' + ai.sort + '"]' ).data( 'mm' );

	VERVENIA.AJAX( ai );
			
  }
  
  var toggle = [ "show" , "hide" , "toggle" , "remove" ];
  if ( toggle.indexOf( VERVENIA.ATTR( i.e ) ) >= 0 ) {
	
	if ( VERVENIA.JQ( i.e ).data( VERVENIA.ATTR( i.e ) ) ) {
	  
	  var met = VERVENIA.ATTR( i.e );
		  
	} else {
	  
	  var met = VERVENIA.JQ( i.e ).data( VERVENIA.ATTR( i.e ) );
	  
	}
	
	switch ( VERVENIA.ATTR( i.e ) ) {
		
	  case 'remove':
		
		var p = VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( VERVENIA.JQ( i.e ).data( VERVENIA.ATTR( i.e ) ) ) );
		
		if ( VERVENIA.JQ( p ).data( 'sort' ) ) {
		  
		  var s = VERVENIA.JQ( p ).closest( VERVENIA.ATTE( 'sort' ) );
		  var ids = VERVENIA.JQ( VERVENIA.ATTE( 'sortids_' + VERVENIA.JQ( s ).data( 'sort' ) ) ).val( );
		  
		  ids = VERVENIA.UNSET([ ids.split( ',' ) , VERVENIA.JQ( p ).data( 'sort' ) ]);
		  
		  VERVENIA.JQ( VERVENIA.ATTE( 'sortids_' + VERVENIA.JQ( s ).data( 'sort' ) ) ).val( ids.join( ',' ) );
		
		  if ( VERVENIA.JQ( s ).data( 'limit' ) ) {
			
			if ( VERVENIA.JQ( s ).children( VERVENIA.ATTE( 'sort_' + VERVENIA.JQ( s ).data( 'sort' ) ) ).length < VERVENIA.JQ( s ).data( 'limit' ) ) {
			  
			  VERVENIA.JQ( VERVENIA.ATTE( 'newsort' ) ).fadeIn( 500 );
			  
			}
			
		  }
		}
		
		if ( VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'sort' ) ).data( 'limit' ) > 0 ) {
		  
		  ( VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'sort' ) ).data( 'limit' ) > ( VERVENIA.JQ( VERVENIA.ATTE( met ) ).length - 1 ) ) ? 
			VERVENIA.JQ( VERVENIA.ATTE( VERVENIA.JQ( i.e ).closest( VERVENIA.ATTE( 'sort' ) ).data( 'new' ) ) ).fadeIn( 250 ) : '';
		}
		
		VERVENIA.SHOWSAVE( [ 's' , i.e ] );
		
		VERVENIA.JQ( p )[VERVENIA.ATTR( i.e )]();
		break;
		
	  default:
		
		if ( VERVENIA.JQ( i.e ).data( 'target' ) ) {
		  
		  var t = VERVENIA.JQ( i.e ).data( 'target' );
		  ( t.search('__') >= 0 ) ? t = t.split( '__' ): t = [t];
		  ( t[0] == 'next' ) ? VERVENIA.JQ( i.e ).next()[VERVENIA.ATTR( i.e )](): 
			VERVENIA.JQ( VERVENIA.ATTE( t[0] ) )[VERVENIA.ATTR( i.e )]();
		  
		}
		
		( VERVENIA.JQ( i.e ).data( VERVENIA.ATTR( i.e ) + 'set' ) ) ? 
		  VERVENIA.JQ('[' +VERVENIA.DATA.app+ '][data-set="' + VERVENIA.JQ( i.e ).data( VERVENIA.ATTR( i.e ) + 'set' ) + '"]')[VERVENIA.ATTR( i.e )]() : '';
		break;
		
	}

  }
  
  if ( VERVENIA.ATTR( i.e ) == 'newitem' ) {
	
	var k = VERVENIA.JQ( i.e ).data( 'key' );
	
	if ( k.search('__') < 0 ) {
	  
	  var v = VERVENIA.JQ( VERVENIA.ATTE( 'new' + k + 'item' ) ).val( );
	  
	  //alert( 'Key ' + k + ', Item : ' + v );
	  
	  if ( v != '' ) {
		
		var id = 'id';
		
		( k == 'ignore' ) ? id = 'ignore_' + id: '';
		
		var e = '[' + VERVENIA.DATA.app + '="' + id + '"][data-set="unique_id_filters"]';
		
		var c = '<option ' + VERVENIA.DATA.app + '="' + id + '_val" value="' + v + '"';
		c += ' selected="selected">' + v + '</option>';
		
		var a = VERVENIA.JQ( e ).val();
		
		var val = VERVENIA.VALIDATE( {
		  "e" : VERVENIA.ATTE( 'new' + k + 'item' ) , "t" : VERVENIA.JQ( VERVENIA.ATTE( 'new' + k + 'item' ) ).attr( 'type' ) , "a" : 'validate' , "v" : v }
								   );
		
		if ( ( a == null || a.indexOf( v ) < 0 ) && val == true ) {
		  
		  VERVENIA.JQ( i.e ).hide( );
		  
		  VERVENIA.JQ( e ).prepend( c );
          
          //a.push( v );		  
		  //VERVENIA.JQ( e ).val( a );
		  
		  VERVENIA.JQ( i.e ).fadeIn( 500 );
		  
		  VERVENIA.JQ( VERVENIA.ATTE( 'new' + k + 'item' ) ).val( '' );
		  
		  //alert( 'Vaue ' + v );
		  
		  VERVENIA.AJAX( {
			"AJ": "newitem" , "d" : VERVENIA.JQ( i.e ).data() , "item" : v }
					   );
		  
		  VERVENIA.FIELD( {
			"e" : e , "t" : 'mselect' , "a" : 'change' , "v" : v }
						);
		}
		
	  }
	  
	} else {
	
	}
			
  }
  
  if ( VERVENIA.ATTR( i.e ) == 'ffmergeval' ) {
	
	var d = VERVENIA.JQ( i.e ).data();
	var key = VERVENIA.JQ( '[' + VERVENIA.DATA.app + '="aj"][name="ff[t]"]' ).val( );
	VERVENIA.JQ( '[' + VERVENIA.DATA.app + '="v"][name="ff[v]"]' ).val( '[' + VERVENIA.DATA.app + '_merge key="' + key + '"]' );
			
  }
  
  if ( VERVENIA.ATTR( i.e ) == 'newajax' ) {
	
	var ai = VERVENIA.JQ( i.e ).data( );
	ai['AJ'] = 'newajax';
	VERVENIA.AJAX( ai );
			
  }
  
  return o;
  
}
  ;

VERVENIA.INDCONT = function ( i ) {//p,e,i,m,c
  
  var o = true;
  
  //[\"INDCONT\",{\"p\":\"[vervenia=\\\"togglecond\\\"]\",\"e\":\"condshow\",\"i\":\"1\",\"m\":\"val\",
  //\"c\":{\"include\":[\"2_1\",\"2_2\",\"2_3\",\"2_4\",\"2_5\",\"2_6\"]}}]
  
  VERVENIA.FEEDBACK( 'INDEX CONTENT' , i );
  
  var n = 1;
  VERVENIA.JQ( i.p ).each( function( p ) {
	
	if ( n == i.i ) {
	  
	  //alert( 'Number ' + n + ', ' + i.i );
	  
	  VERVENIA.JQ( this ).children().each( function( c ) {
		
		if ( VERVENIA.ATTR( this ) == i.e ) {
		  
		  //alert( 'Before Change ' + i.c );
		  
		  ( i.m == 'val' ) ? i.c = VERVENIA.JSVAL( i.c ):'';
		  
		  //alert( 'After Change ' + i.c );
		  
		  VERVENIA.JQ( this )[i.m]( i.c );
		
		  return false;
		  
		}
		
	  }
										 );
	}
	
	n++;
	
  }
						 );
  
  
  return o;
  
}
  ;

VERVENIA.JSVAL = function ( i ) {
		  
  var o = i;
  
( VERVENIA.JQ.type( i ) == 'object' ) ? o = JSON.stringify( o ):'';
  
  return o;
  
};

VERVENIA.IND = function ( i , i2 ) {
  
  var o = VERVENIA.JQ( i2 ).index( VERVENIA.JQ( i ).closest( i2 ) );
  o++;
  
  return o;
  
}
  ;

VERVENIA.FORMDATA = function ( i ) {//Gets Data from a Form
  
  if ( i.search('__') >= 0 ) {
	
	i = i.split( '__' );
	
	var o = {
	};
	VERVENIA.JQ.each( i , function( k , v ) {
	  
	  switch ( k ) {
		  
		case 0:
		  o['f'] = JSON.stringify( VERVENIA.JQ( v ).serialize() );
		  break;
		default:
		  o[v] = VERVENIA.JQ( i[0] ).children( '[' + VERVENIA.DATA.app + '][name="' + v + '"]' ).val();
		  console.log( 'Getting Field ' + v + ' = ' + o[v] );
		  break;
		  
	  }
	  
	}
					);
	
  }
  else {
	
	VERVENIA.WW( 's' );	
	var o = JSON.stringify( VERVENIA.JQ( i ).serialize() );
	VERVENIA.WW( 'r' );
	
  }
  
  VERVENIA.FEEDBACK( 'FORM DATA' , o );
  
  return o;
  
}
  ;

VERVENIA.DIALOG = function(i){//Which, Content , Dmin, No (name,(met,i)) , Yes (name,(met,i))
  
  VERVENIA.FEEDBACK( 'DIALOG' , i );
  
  var btns = {
  }
	  ;
  
  ( i[4] ) ? btns[i[4][0]] = function () {
	
	console.log( 'Getting Data ' + i[4] );
	
	var f = '[' + VERVENIA.DATA.app + '="' + i[4][1] + '"]';
	
	VERVENIA.AJAX( VERVENIA.FORMDATA( f + '__AJ' ) );
	VERVENIA.JQ(i[0]).remove()}
	:'';
  
  ( i[3] ) ? btns[i[3][0]] = function () {
	
	( i[3][1] ) ? VERVENIA[i[3][1][0]](i[3][1][0]) : '';
  
  VERVENIA.JQ(i[0]).remove()}
  :'';

VERVENIA.JQ(i[1]).dialog({
  
  open: function( event, ui ) {
  }
  ,  	  
  resizable: true, modal: true,
  title: i[2][0] + ':', height: i[2][1], width: i[2][2],
  buttons: btns,
}
						);

VERVENIA.SHOWSPINNER( i.spinner );
VERVENIA.JQ('[class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close"]').hide();

}
  ;

VERVENIA.ATTE = function ( i ) {
  
  var o = '[' + VERVENIA.DATA.app + '="' + i + '"]';
  
  return o;
  
}
  ;

VERVENIA.ATTR = function ( i ) {
  
  var o = VERVENIA.JQ( i ).attr( VERVENIA.DATA.app );
  
  return o;
  
}
  ;

VERVENIA.MULTIPLE = function ( i ) {//Ferforms Multiple Functions
  
  var o = true;
  
  VERVENIA.SYS.busy = true;
  VERVENIA.JQ( '*' ).css( 'cursor' , 'wait' );
  
  VERVENIA.FEEDBACK( 'MULTIPLES' , i );
  
  var n = 1;
  VERVENIA.JQ.each( i , function ( k , v ) {
	
	VERVENIA.FEEDBACK( 'MULTIPLE # ' + n + ' (' + k + ') : ' , v );
	VERVENIA[v[0]]( v[1] );
	
	n++;
	
  }
				  );
  
  
  VERVENIA.SYS.busy = false;
  VERVENIA.JQ( '*' ).css( 'cursor' , 'default' );
  
  return o;
  
}
  ;

VERVENIA.CONTENT = function( i ) {//Performs Custom Ajax Callback
  
  var o = false;
  
  VERVENIA.FEEDBACK( 'CONTENT ' , i );
  
  if ( i.c[1] ) {
	
	i.c[1] = JSON.stringify( i.c[1] );
	VERVENIA.FEEDBACK( 'OBJECT ' , i.c[1] );
	
  }
  
  if ( i.b ) {
	
	VERVENIA[i.b[0]](i.b[1]);
	VERVENIA.FEEDBACK( 'BEFORE ' , i.b );
	
  }
  
  if ( i.e ) {
	
	o = true;
	
	if ( VERVENIA.JQ.type (i.e ) == 'string' ) {
	  
	  if ( VERVENIA.JQ.type( i.m ) == 'string' ) {
		
		if ( VERVENIA.JQ.type( i.c ) == 'string' ) {
		  
		  VERVENIA.JQ( i.e )[i.m]( i.c );
		  
		}
		else {
		  
		  //alert( 'Setting ' + i.m + ' For ' + i.e );
		  
		  ( i.m == 'data' ) ? VERVENIA.SETDATA( i.e , i.c[0] , i.c[1] ) : VERVENIA.JQ( i.e )[i.m]( i.c[0] , i.c[1] );
		  
		}
		
	  }
	  else {
		
		if ( VERVENIA.JQ.type( i.c ) == 'string' ) {
		  
		  VERVENIA.JQ( i.e )[i.m[0]]( )[i.m[1]]( i.c );
		  
		}
		else {
		  
		  ( i.m == 'data' ) ? VERVENIA.SETDATA( [ i.e , i.m[0] ] , i.c[0] , i.c[1] ) : VERVENIA.JQ( i.e )[i.m[0]]( )[i.m[1]]( i.c[0] , i.c[1] );
		  
		}
		
	  }
	  
	}
	else {
	  
	  if ( VERVENIA.JQ.type( i.c ) == 'string' ) {
		
		VERVENIA.JQ( i.e[0] )[i.m[0]]( i.e[1] )[i.m[1]]( i.c );
		
	  }
	  else {
		
		( i.m == 'data' ) ? VERVENIA.SETDATA( [ i.e[0] , i.m[0] , i.e[1] ] , i.c[0] , i.c[1] ) : VERVENIA.JQ( i.e[0] )[i.m[0]]( i.e[1] )[i.m[1]]( i.c[0] , i.c[1] );
		
	  }
	  
	}
	
  }
  else {
	
	//FOR STUFF WITHOUT ELEMENT
  }
  
  if ( i.a ) {
	
	VERVENIA[i.a[0]](i.a[1]);
	VERVENIA.FEEDBACK( 'AFTER' , i.a );
	
  }
  
  return o;
  
}
  ;

VERVENIA.LOGEVENT = function( i ) {
  
  var o = i;
  
  o['AJ'] = 'logevent';
  
  o['clock'] = VERVENIA.JQ( VERVENIA.ATTE( 'nonce' ) ).data( 'ticking' );
  
  ( ! o.user ) ? o['user'] = VERVENIA.DATA.user :'';
  ( ! o.date ) ? o['date'] = o['date'] = VERVENIA.DATA.date : '';
  ( ! o.tracking ) ? o['tracking'] = VERVENIA.DATA.tracking : '';  
  ( ! o.geo ) ? o['geo'] = VERVENIA.DATA.geo : '';
  
  o['logevent'] = VERVENIA.SYS.suite.live.logevent; 
  
  var lid = o['event']['id'];
  
  if ( ! o['event']['child'] && VERVENIA.JQ( '[' +VERVENIA.DATA.app + '="' + o['event']['target'] + '"][data-id="' + o['event']['id'] + '"]' ).children( ':visible' ).data( 'child' ) ) {
	
	//alert( o['event']['target'] + ' #' + o['event']['id'] );//WORKING
	
	o['event']['child'] = VERVENIA.JQ( '[' +VERVENIA.DATA.app + '="' + o['event']['target'] + '"][data-id="' + o['event']['id'] + '"]' ).children( ':visible' ).data( 'child' );
	
	//alert( o['event']['target'] + ' #' + o['event']['id'] + '(' + o['event']['child'] + ')' );//WORKING
	
	var la = o.event.child.split( '__' );
	( la[2] != VERVENIA.SYS.def.toLowerCase() ) ? lid += '_' + la.slice( 2 ).join( '_' ): '';
	
  } 
  
  //VERVENIA.FEEDBACK( 'LOGEVENT' , o );//WORKING
  
  //var d = new Date();//DEPRECATED
  o['event']['time'] = o.date.t;//Math.floor( d.getTime()/1000 );//DEPRECATED
  
  //alert( 'Time ' + o.date.t + ' & ' + o.event.time );
  
  var le = '[data-live__event_' + o['event']['target'] + '_' + o['event']['type'].toLowerCase() + '*=";' + lid + ';"]';
  
  console.log( 'Using ' + le + ' to check for live conditions' );
  
  ( VERVENIA.JQ( '[' + VERVENIA.DATA.app + ']' + le ).length > 0 ) ? VERVENIA.LIVECOND( [ le , o['event'] , lid ] ) : '';
	
  VERVENIA.AJAX( o );
  
  return o;
  
}
  ;

VERVENIA.LIVECOND = function ( i ) {//Element , event , lid
  
  var o = true;	
  
  var ai = {};  
  
  var tk = 'live__event_' + i[1].target + '_' + i[1].type.toLowerCase();
  
  var trigger = i[1];
  
  var n = 1;
  var elog = false;
  VERVENIA.JQ.each( VERVENIA.JQ( '[' + VERVENIA.DATA.app + ']' + i[0] ) , function( k , v ) {
	
	var d = VERVENIA.JQ( this ).data();
	var vis = VERVENIA.JQ( this ).is( ':visible' );
	
	//alert( 'Element : ' + VERVENIA.ATTR( this ) + ' , Handle : ' + d.live_h+ ' , Method : ' + d.live_m + ' , Test : ' + d[tk] );//WORKING
	
	if ( d.live_h == 'all' ) {
	  
	  o = false;
	  
	} 
	
	if ( o == true ) {
	  
	  var opt = VERVENIA.ATTR( this );
	  
	  if ( opt == 'child' ) {
		
		var ca = d.child.split( '__' );
		
		opt = ca[0];
		
		  //alert( opt + ' # ' + ca[1] + ' Child : ' + ca[2] );//WORKING
		
		if ( [ "smartcode" , "product" ].indexOf( opt ) >= 0 ) {
		
		  //alert( opt + ' # ' + ca[1] + ' Child : ' + ca[2] );//WORKING
		  ( vis == false ) ? VERVENIA.JQ( '[data-child^="' + opt + '__' + ca[1] + '"]' ).fadeOut( VERVENIA.SYS.live[opt].fadeOut ) : '';
		  
		}
		
	  }
	  
	  elog = false;
	  switch ( d.live_m ) {
		  
		case 'show':
		  if ( vis == false ) {
			
			elog = 'view';
			VERVENIA.JQ( this ).fadeIn( VERVENIA.SYS.live[opt].fadeIn );
			
		  }
		  break;
		  
		case 'hide':
		  ( vis == true ) ? VERVENIA.JQ( this ).fadeOut( VERVENIA.SYS.live[opt].fadeOut ) : '';
		  break;
		  
		case 'toggle':
		  if ( vis == true ) {
			
			VERVENIA.JQ( this ).fadeToggle( VERVENIA.SYS.live[opt].fadeOut );
			
		  } else {
			
			elog = 'view';
			VERVENIA.JQ( this ).fadeToggle( VERVENIA.SYS.live[opt].fadeIn );
			
		  }
		  break;
		  
		default:
		  ( vis == false && [ "show" , "fadeIn" ].indexOf( d.live_m) >= 0 ) ? elog = 'view': '';
		  VERVENIA.JQ( this )[d.live_m]();
		  break;
		  
	  }
	  
	  if ( elog != false ) {//d.live_m
	
		//smartcode__35__2
	    console.log( 'Element ' + n + ' will yeild a logged event!');
		
		elog = { "event": { "type": elog , "target" : VERVENIA.ATTR( this ) , "id" : d.id , "met" : d.live_m } , 
				"content": VERVENIA.JQ( this ).html( ) , "data" : d };
		
		if ( elog.event.target == 'child' ) {
		  
		  elog.event.child = d.child;
		  
		  var child = d.child.split( '__' );
		  
		  elog.event.target = child[0];
		  elog.event.id = child[1];
		  
		  elog.parent = VERVENIA.JQ( VERVENIA.ATTE( elog.event.target ) + '[data-id="' + child[1] + '"]' ).data();
		  
		  ( elog.parent.category ) ? elog['event']['target_category'] = elog.parent.category : '';		  
		  elog['event']['subid'] = 'category__event[target_category]';
		  
		}
		else {
		  
		  ( d.category ) ? elog['event']['target_category'] = d.category : '';		  
		  elog['event']['subid'] = 'category__event[target_category]';
		  
		}
		
		elog.trigger = trigger;
		elog.date = VERVENIA.GETDATE( VERVENIA.DATA.date );
		
		ai[n] = elog;
		
		n++;
		
	  }
	  
	}
	
  }
				  );
  
  if ( ai[1] ) {
	
	console.log( 'Logging ' + n + ' events!');

	VERVENIA.JQ.each( ai , function( k , v ) {
	  
	  //VERVENIA.FEEDBACK( 'Logging ' , v );
						
	  if ( v.event ) {
		
	    console.log( 'Logging ' + n + ' event #' + k);
		
		VERVENIA.LOGEVENT( v );
		
	  }
	  
	}
					);
  }
  
  
  return o;
  
}
  ;

VERVENIA.REGEXP = function ( i , i2 ) {
  
  var o = true;
    
  switch ( i ) {
	  
	case 'number':
	  var r = new RegExp(/\[0-9]/g);
	  break;
	  
	case 'email':		
      var r = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i);          
      break;
	  
	case 'url':
	  
	  if ( i2.search('https') >= 0 ) {
		
		var r = new RegExp(/https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/i);//secure
		
	  } else {
		
		var r = new RegExp(/https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/i);//regular
	  }
	  break;
	  
	case 'tel': 
      var r = new RegExp(/^[2-9]\d{2}-\d{3}-\d{4}$/);  
	  break;
	  
	case 'date':
      var r = new RegExp(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/);
	  break;
	  
  }
  
  o = r.test( i2 );
  
  return o;
  
};

VERVENIA.FEEDBACK = function( k , i ){
  
  ( VERVENIA.JQ.type( i ) == 'object' ) ? i = JSON.stringify( i ) : '';
	
  ( VERVENIA.SYS.mode == 'dev' ) ? console.log( k + ' = ' + i ) : '';

}
  ;

VERVENIA.ALERT = function( i ) {
  
  ( VERVENIA.JQ.type( i ) == 'object' ) ? i = JSON.stringify( i ) : '';
	
	alert( i );

}
  ;

VERVENIA.ERROR = function( i ) {

  if( VERVENIA.DATA.tracking.where == 'front' ) {//MEEDS WORK - ADD "IF SYSTEM PAGE" FEATURE FOR PREVIEW PAGES

	VERVENIA.FEEDBACK( 'Vervenia System Error : ' , i );
	
  } else {
	
	switch ( i[0] ) {//NEEDS WORK - ALERTS TO USER FOR FAILED CALLS IN DASHBOARD
		
	  default:
	  //VERVENIA[ i.met ]( i.i );
	  VERVENIA.FEEDBACK( 'Vervenia System Error : ' , i );
	  break;
	
	}
	
  }

}
  ;

VERVENIA.LOADING = function( i ) {
  
  var o = '<span class="spinner is-active" style="float:left"></span>';
  o += '<h2 style="display:inline">' + i + '...</h2></div>';
  
  VERVENIA.JQ( VERVENIA.ATTE( VERVENIA.DATA.app ) ).html( o );
  
}
  ;

VERVENIA.AJAX = function ( i ) {
  
  ( i.spinner ) ? VERVENIA.SHOWSPINNER( i.spinner ) : 
	VERVENIA.SHOWSPINNER( i.AJ );
  
  ( VERVENIA.DATA.mode == 'dev' ) ? 
	
	VERVENIA.FEEDBACK(' AJAX ' , i ) :'';
  
  ( [ "newopt" , "editopt" ].indexOf( i.AJ ) >= 0 ) ? VERVENIA.RELOADING( i.AJ ) : '';
  
  if ( VERVENIA.JQ( VERVENIA.ATTE( 'dashboard' ) ).length > 0 ) {
		
	i.dashboard = VERVENIA.JQ( VERVENIA.ATTE( 'dashboard' ) ).data();
	
	( VERVENIA.JQ.type( i.dashboard.settings ) == 'string' ) ? 
	  
	  i.dashboard.settings = JSON.parse( i.dashboard.settings ): '';
	
  }
  
  var hide = false;

  if ( VERVENIA.JQ( '[' + VERVENIA.DATA.app + '][data-ajwhile*="' + i.AJ + ';"]' ).length > 0 ) {
	
	var mess = '[' + VERVENIA.DATA.app + '][data-ajwhile*="' + i.AJ + ';"]';
	
	var rmess = VERVENIA.JQ( mess ).data( 'ajrmess' );
	
	i.rmess = rmess;
	
	VERVENIA.JQ( mess ).html( VERVENIA.JQ( mess ).data( 'ajmess' ) + VERVENIA.SPINNER( 'l' ) );
	if ( VERVENIA.JQ( mess ).data( 'fontsize' ) ) {
	  
	  var efx = VERVENIA.JQ( mess ).data( 'fontsize' ).split( ',' );
	  VERVENIA.JQ( mess ).css( 'color' , 'red' ).animate( {'font-size' : efx[0] }, efx[1] );
	}
	
	if ( [ "filter" , "mfilter" , "paginate" ].indexOf( i.AJ ) >= 0 ) {//main,opt
	  
	  switch( i.AJ ) {
		  
		case 'mfilter':
		  ( VERVENIA.JQ( VERVENIA.ATTE( 'main' ) + '[data-opt="' + i.dashboard.settings.menu + '"]' ).is(':visible') == true ) ? 
			hide = VERVENIA.ATTE( 'opt' ): hide = VERVENIA.ATTE( 'stats' );
		  hide += '[data-opt="' + i.dashboard.settings.menu + '"]';
		  break;
		default:
		  ( i.view == 'main' ) ? hide = VERVENIA.ATTE( 'opt' ): hide = VERVENIA.ATTE( 'stats' );
		  hide += '[data-opt="' + i.opt + '"]';
		  break;
	  }
	  
	  hide += '[data-optcase="table"]';
	  
	}
	
  } else {
  
  ( i.hide ) ? hide = i.hide : '';
	
  }
  
  ( hide != false ) ? VERVENIA.JQ( hide ).hide() : '';
  
  if ( [ "workspace" ].indexOf( i.AJ ) >= 0 ) {
	
	var spinner = true;
	
	( i.NOSPINNER ) ? spinner = false:''; 
	
	  if ( spinner == true ) {
		
		spinner = i.AJ;		
		( i.mode ) ? spinner += '_' + i.mode: '';
		VERVENIA.MAINSPINNER( spinner );
	  
	  }
	
  }

  if ( [ "logevent" , "dashboard" ].indexOf( i.AJ ) < 0 && ! i.suite ) {
     
      i.suite = VERVENIA.SYS.suite;
  }
  
  var r = VERVENIA.JQ.ajax({
	
	type : 'post', 
	dataType : 'json', 
	url: VERVENIA.SYS.ajax,
	
	data: {
	  action: 'ajax',
	  load: 'ajax',
	  nonce: VERVENIA.SYS.nonce,
	  AJ: i.AJ,
	  i: i
	}
	
  }
						  );
  
  r.done( function ( o ) {
	
	VERVENIA.JQ( '*' ).css( 'cursor' , 'default' );
	
	VERVENIA.SYS.busy = false;
	//VERVENIA.FEEDBACK( 'AJAX DONE ' , r );//TESTING
	VERVENIA.FEEDBACK( 'AJAX CALLBACK ' , o );
	
	if ( o ) {
	  
	  if ( o[0] != 'FALSE' && o[1] != null ) {
		
		VERVENIA[o[0]]( o[1] );
		
		if ( o[2] ) {
		  
		  if ( o[2]['rmess'] ) {
			
			rmess = o[2]['rmess'];
		  }
		}
		
	  }
	  
	  ( rmess ) ? VERVENIA.JQ( mess ).html( rmess ).css( 'color' , 'inherit' ).css( 'font-size' , '' ) : '';
	  
	  ( hide != false ) ? VERVENIA.JQ( hide ).fadeIn( 5000 ) : '';
	  
	}
	
  }
		);
  
  r.fail( function ( jqXHR , o ) {
	
	VERVENIA.SYS.busy = false;
	
	VERVENIA.JQ( '*' ).css( 'cursor' , 'default' );
	
	VERVENIA.FEEDBACK( 'AJAX ERROR ' , r );
  }
		);
};

VERVENIA.SPINNER = function( i ) {

  var s = ' style="float:left"';
  
  switch ( i ) {
	  
	case 'n':
	  s = '';
	  break;
	  
  }

  var o = '<span class="spinner is-active"' + s + '></span>';
  
  return o;
  
};

VERVENIA.RELOADING = function( i ) {
  
  var t = '';
  var br = 'add';
  
  if ( [ "done" , "done2" ].indexOf( i ) >= 0 ) {
	
	t = 500;
	br = 'rem';
	var m = 'fadeIn';
  }
  else {
	
	var m = 'hide';	
  
	if ( VERVENIA.JQ( VERVENIA.ATTE( 'saveform' ) + '[data-form="editor"]' ).length > 0 ) {
	  
	  ( VERVENIA.JQ( VERVENIA.ATTE( 'saveform' ) + '[data-form="editor"]' ).is( ':visible' ) == true ) ? 
		VERVENIA.JQ( VERVENIA.ATTE( 'saveform' ) + '[data-form="editor"]' ).hide(): '';
	}
  }
  
  VERVENIA.JQ( VERVENIA.ATTE( 'dialog') + '[data-dialog="sort"]' )[m]( t );  
  VERVENIA.JQ( VERVENIA.ATTE( 'optmenu') )[m]( t );
  
  ( m == 'hide' ) ? VERVENIA.JQ( VERVENIA.ATTE( 'spinner') + '[data-spinner="newopt"]' ).fadeIn( 500 ):
	VERVENIA.JQ( VERVENIA.ATTE( 'spinner') + '[data-spinner="newopt"]' ).hide();
  
  ( [ "done" ].indexOf( i ) >= 0 ) ? m = [ "fadeIn" , "500" ] : m = [ "hide" , "" ];
  
  VERVENIA.JQ( VERVENIA.ATTE( 'newopt') )[m[0]]( m[1] );
  
  ( br == 'add' ) ? VERVENIA.JQ( '<span ' + VERVENIA.DATA.app + '="reloading"><br><br></span>' ).insertAfter( VERVENIA.ATTE( 'sysmenu' ) ):
	VERVENIA.JQ( VERVENIA.ATTE( 'reloading' ) ).remove();

};

VERVENIA.SHOWSPINNER = function ( i ) {
  
  var o = i;
  var s = VERVENIA.ATTE( 'spinner' );
  
  s += '[data-spinner="' + i + '"]';
  
  if ( VERVENIA.JQ( s ).length > 0 ) {
	
	( VERVENIA.JQ( s ).is( ':visible' ) ) ? VERVENIA.JQ( s ).hide() : VERVENIA.JQ( s ).show();
	
  }
  
  //alert( o );
  
  return o;
  
};

VERVENIA.MAINSPINNER = function( i ) {
  
  var h = VERVENIA.JQ( VERVENIA.ATTE( 'reloadhints' ) ).data();
  
  switch ( i ) {
	  
	default:
	  ( h[i] ) ? i = h[i]: '';
	  break;
	  
  }
    
  var o = '<h1 style="display:inline">' + i + '...</h1>';
  o += '<span class="spinner is-active" style="float:left"></span>';

  VERVENIA.JQ( VERVENIA.ATTE( VERVENIA.DATA.app ) ).html( o );
  
  return o;
  
};