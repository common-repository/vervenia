<?php
/*
Plugin Name: Vervenia
version: 1.0
Plugin URI: http://vervenia.com
Description: Virtual Business Ecosystem for Online Marketers
Author: Seth Czerepak
Text Domain: vervenia-translate
Author URI: http://sethczerepak.com
Copyright: 2017 Vervenia LLC
*/

namespace Vervenia;

class Suite {
  
  private $app = 'vervenia';
  private $ver = '1.0';
  
  function __construct ( ) {
	
	defined( 'ABSPATH' ) or die( 'Hey, stay out!' );
	add_action( 'admin_menu' , array( $this , 'menu' ) );
	
	//Initialize
	register_activation_hook(  __FILE__  , array( $this , 'install' ) );
	register_deactivation_hook(  __FILE__  , array( $this , 'pause' ) );
	register_uninstall_hook( __FILE__ , array( $this , 'remove' ) );
	
	//Scripts
	add_action( 'admin_enqueue_scripts', array( $this , 'scripts' ) );
	add_action( 'wp_enqueue_scripts', array( $this , 'scripts' ) );
	add_action( 'admin_head' , array( $this , 'nonce' ) );
	
	//Ajax
	add_action( wp_ajax_ajax , array( $this , 'ajax' ) );
	add_action( wp_ajax_nopriv_ajax , array( $this , 'ajax' ) );
	
	//Editing hooks
	add_action( 'save_post', array( $this , 'cnames' ) );
	
	//Shortcodes
	add_shortcode( $this->app . '_content' , array( $this , 'wrapper' ) );
	add_shortcode( $this->app , array( $this , 'smartcode' ) );
	
	//Allow Shortcode Anywhere
	add_filter('widget_text', 'shortcode_unautop');
	add_filter('widget_text', 'do_shortcode');
	
	add_filter('comment_text', 'shortcode_unautop');
	add_filter('comment_text', 'do_shortcode');
	
	add_filter('the_excerpt', 'shortcode_unautop');
	add_filter('the_excerpt', 'do_shortcode');
	
	add_filter('term_description', 'shortcode_unautop');
	add_filter('term_description', 'do_shortcode');
	
	
  }
  
  function menu ( ) {
	
	add_menu_page(	ucfirst( $this->app ) ,	ucfirst( $this->app ) , 'manage_options' , $this->app , 
				  array( $this, 'dashboard' ) , $this->links( 'img' ) . 'favicon.jpg' , 0 
				 );
  }
  
  function links ( $i ) {
	
	switch ( $i ) {
	  
	  case 'api':
	  $o = 'http://' . $this->app . '.com/media/' . $i . '.php';
	  break;
	  
	  default:
	  $o = plugin_dir_url(  __FILE__  );
	  ( $i != 'suite' ) ? $o .= $i . '/':'';
	  break;
	  
	}
	
	return $o;
  }
  
  function mode( $i ) {
	
	( is_array( $_GET ) ) ? $_GET = $this->clean( 'get' , $_GET ): '';
	
	if ( is_array( $_GET ) && isset( $_GET[strtoupper( $this->app )] ) ) {
	  
	  $o = $_GET[strtoupper( $this->app )];
	  
	}
	else {
	  
	  $o = $i;
	  if ( $o == 'g' ) {
		
		$o = get_option( $this->app . '_mode' , FALSE );
		if ( $o == FALSE ) {
		  
		  $o = 'core';
		  //$o = 'dev';//TESTING
		  update_option( $this->app . '_mode' , $o );
		  
		}
		
	  }
	  else {
		
		update_option( $this->app . '_mode' , $o );
		
	  }
	  
	}
	
	return $o;
	
  }
  
  function dashboard ( ) {
	
	if( is_admin() ){
	  
	  echo '<div ' . $this->app . '="' . $this->app . '" class="wrap">';
	  echo '<span class="spinner is-active" style="float:left"></span>';
	  
	  $s = get_option( $this->app , FALSE );
	  
	  if ( ! is_array( $s ) ) {
		
		$txt = 'Installing' ;
		
		$s = $this->install( );
		
		( $s == FALSE ) ? $txt = 'Please reload this screen to finish installing' :'';
		
	  }
	  else {
		
		( $this->mode( 'g' ) == 'dev' ) ? define( 'WP_DEBUG' , TRUE ) : '';
		
		if ( $s['ver'] != $this->ver ) {
		  
		  $txt = 'Upgrading to';
		  $s['ver'] = $this->ver;
		  update_option( $this->app , $s );
		  
		}
		else {
		  
		  $txt = 'Loading';
		  
		}
		
	  }
	  
	  if ( isset( $s['ERROR'] ) ) {
		
		echo $s['ERROR'];
		
	  }
	  else {
		
		echo '<h2 style="display:inline">';
		echo $txt . ' ' . ucfirst( $this->app ) . ' ' . $this->ver . '...</h2>';
		echo '</div>';
		//echo ' TESTING : ' . $this->a2js( $this->track( 70 ) );//TESTING
		//echo $this->ww( array( 'body' , 'It shows this' , '500__1000' ) );//TESTING
		
	  }
	  
	}
  }
  
  function install ( ) {
	
	$cd = time();
	$o = array( 'app' => $this->app , 'host' => explode( '//' , get_site_url() )[1] , 
			   'a2c' => 'get' , 'timeout' => 5000 , 'ver' => $this->ver , 'locale' => get_locale() , 
			   'cd' => time() ,
			  );
	
	( filter_var( $_SERVER['REMOTE_ADDR'] , FILTER_VALIDATE_IP ) ) ? $o['ip'] = ip2long( $_SERVER['REMOTE_ADDR'] ) : '';
	( is_admin() ) ? $o['admins'] = array( get_current_user_id() ) : '';
	
	$o = $this->api( array( 'suite' , array( 'MODE' => 'INSTALL' , 'suite' => $o ) ) );
	
	( is_array( $o ) ) ? update_option( $this->app , $o ) : $o = FALSE;
	
	return $o;
	
  }
  
  function suite ( $i ) {
	
	$o = update_option( $this->app , $i['suite'] );
	
	return $o;
	
  }
  
  function api ( $i ) {
	
	( isset( $i[1]['suite'] ) ) ? $s = $i[1]['suite'] : $s = get_option( $this->app );
	
	$a = array( 'headers' => array( 'a2c' => $s['a2c'] ) , 'method' => 'POST' ,
			   'timeout' => $s['timeout'] , 'blocking' => TRUE , 'cookies' => array() ,
			  );
	
	( ! isset( $i[1]['suite'] ) ) ? $i[1]['suite'] = $s : '';
	( ! isset( $i[1]['DEV'] ) ) ? $i[1]['DEV'] = $this->mode( 'g' ) : '';
	
	$a['body'] = $i;
	
	$url = $this->links( 'api' );
	$o = wp_remote_get( $this->links( 'api' ) , $a );
	
	if ( is_wp_error( $o ) ) {
	  
	  $o = array( 'err' => 'wp' , 'error' => $o );
	  
	}
	else {
	  
	  ( gettype( $o ) == 'string' ) ? $o = $this->js2a( $o ) : '';
	  
	  ( gettype( $o['body'] ) == 'string' ) ? $o = json_decode( $o['body'] , TRUE ) : $o = $o['body'];
	  
	  if ( is_array( $o ) && isset( $o['UPD'] ) ) {
		
		$o = $this->update( $o['UPD'] );
		unset( $o['UPD'] );
		
	  }
	  
	  $o = $this->clean( 'out' , $o );
	  
	}
	
	return $o;
	
  }
  
  function update ( $i ) {
	
	$o = get_option( $this->app , FALSE );
	
	update_option( $o , $i );
	
	return $o;
	
  }
  
  function a2js ( $i ) {
	
	return json_encode( $i );
  }
  
  function js2a ( $i ) {
	
	return json_decode( stripslashes( $i ) , TRUE );
  }
  
  function pause ( ) {
	
	$o = get_option( $this->app , FALSE );
	
	( $o != FALSE ) ? $o = $this->api( array( 'remove' , array( 'suite' => $o ) ) ) : '';
	
	return $o;
  }
  
  function remove ( ) {
	
	$o = get_option( $this->app , FALSE );
	
	if ( $o != FALSE ) {
	  
	  ( isset( $o['db'] ) ) ? $o['st'] = $o['db'] : $o['st'] = 'd';//NEEDS WORK
	  $o = $this->api( array( __FUNCTION__ , array( 'suite' => $o ) ) );
	  
	}
	
	return $o;
  }
  
  function scripts ( ) {
	
	$i = get_option( $this->app , FALSE );
	
	if ( $i != FALSE ) {
	  
	  $js = $this->js( $i );
	  
	  ( function_exists( 'wp_enqueue_media' ) ) ? wp_enqueue_media() : '' ;
	  
	  wp_enqueue_script( 'jquery' , '' , '' , '' , TRUE );
	  
	  //WORDPRESS JQUERY UI INSTRUCTIONS FROM THE CODEX WERE NOT WORKING HERE
	  wp_register_style( 'jqueryui_styles' , 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css' , FALSE , FALSE ); 	  
	  wp_enqueue_style( 'jqueryui_styles');
	  
	  $u = 'core,widget,accordion,autocomplete,button,datepicker,dialog,draggable,droppable,menu,';
	  $u .= 'mouse,position,progressbar,selectable,resizable,selectmenu,sortable,slider,tooltip,tabs'; 

	  foreach( explode( ',' , $u ) as $uk ) {
		
		wp_enqueue_script( 'jquery-ui-'. $uk );
		
	  }
	  wp_enqueue_style( 'main_styles');
	  wp_enqueue_style( 'dashicons' );
	  
	  wp_enqueue_script( $this->app . '_stripejs' , 'https://js.stripe.com/v2/' , array( 'jquery' ) , TRUE );
	  wp_enqueue_script( $this->app . '_js' , $this->links( 'js' ) . 'core.js' , array( 'jquery' ) , TRUE );
	  
	  echo $js;
	  echo $this->css( $i );
	  
	}
	
	return TRUE;
	
  }
  
  function js ( $i ) {
	
	if ( $i != FALSE ) {
	  
	  $C = $i;
	  
	  global $current_screen;
	  $APP = strtoupper( $this->app );
	  
	  $o = '<script type="text/javascript">';
	  
	  $o .= 'var ' . $APP . ' = [];';
	  
	  $o .= $APP . '.DATA = { "app":"' . $this->app . '" , "host": "' . $C['host'] . '" ,  "ver":"' . $C['ver'] . '" };';
	  
	  $geo = $this->geo( 'live' );
	  $o .= $APP . '.DATA.geo = ' . $this->a2js( $geo ) . ';';
	  
	  $date = getdate();
	  
	  ( isset( $geo['time_zone'] ) ) ? $date['time_zone'] = $geo['time_zone'] : '';
	  
	  $o .= $APP . '.DATA.date = ' . $this->a2js( $date ) . ';';
	  $o .= $APP . '.DATA.tracking = ' . $this->a2js( $this->tracking( 'live' ) ) . ';';
	  ( $this->mode( 'g' ) == 'dev' ) ? $o .= $APP . '.DATA.tracking.cookies = ' . $this->a2js( $_COOKIE ) . ';' : '';//WORKING
	  
	  $o .= $APP . '.DATA.tracking.page_fragment = location.hash.replace( "#" , "" );';
	  
	  $o .= $APP . '.DATA.user = ' . $this->a2js( $this->user( 'live' ) ) . ';';
	  
	  $o .= $APP . '.DATA.dash = "' . get_site_url() . '/wp-admin/admin.php?page=' . $this->app . '";';
	  
	  $o .= $APP . '.SYS = { "mode":"' . $this->mode( 'g' ) . '" , "nonce":"' . $this->nonce() . '", "busy": false , "def" : "' . $C['def'] . '" };';
	  
	  $o .= $APP . '.SYS.ajax = "' . admin_url( 'admin-ajax.php' ) . '";';
	  
	  $o .= $APP . '.SYS.suite = ' . $this->a2js( $C ) . ';';
	  $o .= $APP . '.SYS.live = ' . $this->a2js( $C['live'] ) . ';';
	  
	  $o .= $APP . '.SYS.track = ' . $this->a2js( $C['track'] ) . ';';
	  
	  $o .= ';</script>';
	  
	}
	
	return $o;
	
  }
  
  function nonce ( ) {
	
	$o = wp_create_nonce( $this->app . 'nonce' );
	
	echo '<div ' . $this->app . '="nonce" data-nonce="' . $o . '" style="display:none !important;"></div>';
	
	return $o;
  }
  
  function css ( $i ) {
	
	foreach ( array( 'core' , 'font' , 'jqui' ) as $css ) {
	  
	  $o .= '<link rel="stylesheet" type="text/css" href="' . $this->links( 'css' ) . $css . '.css">';
	  
	}
	
	return $o;
	
  }
  
  function geo ( $i ) {
	
	( $i == 'live' ) ? $i = $_SERVER['REMOTE_ADDR'] : '';
	
	$o = array( 'ip' => $i , 'locale' => get_locale() );
	
	if ( filter_var( $i , FILTER_VALIDATE_IP ) ){
	  
	  $g = $this->api( array( __FUNCTION__ , $o ) );
	  
	  ( is_array( $g ) && isset( $g['country_code'] ) ) ? $o = array_merge( $o , $g ) : $o['ip'] = ip2long( $o['ip'] );
	  
	}
	
	return $o;
	
  }
  
  function track ( $i ) {//get_the_id()
	
	$key = $this->app . '_track';
	
	$o = get_option( $key );
	
	if ( ! is_array( $o ) ) {
	  
	  $o = array( 'page' , 'post' );
	  update_option( $key , $o );
	}
	
	if ( is_array( $i ) ) {
	  
	  $o = array_merge( $o , $i );
	  update_option( $key , $o );

	}
	else {
	  
	  $i = get_post( $i );
	  
	  switch ( gettype( $i ) ) {
		
		case 'array':
		( in_array( $i['post_type'] , array_values( $o ) ) ) ? $o = TRUE : $o = FALSE;
		break;
		
		case 'object':
		( in_array( $i->post_type , array_values( $o ) ) ) ? $o = TRUE : $o = FALSE;
		break;
		
		default:
		$o = FALSE;
		break;
		
	  }
	  
	}
	
	return $o;
  }
  
  function tracking ( $i ) {
	
	$o = array( 'host' => explode( '//' , get_site_url() )[1] );//DEPREDATED :  'loadtime' => time() 
	
	if ( is_404() ) {
	  
	  $o['where'] = 'error';
	  
	  $o['error'] = '404';
	  
	}
	else {
	  
	  ( is_admin() ) ? $o['where'] = 'admin' : $o['where'] = 'front';
	  
	  ( ( isset( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] !== 'off' ) || $_SERVER['SERVER_PORT'] == 443 ) ? $o['ssl'] = TRUE : $o['ssl'] = FALSE;
	  
	  if ( isset( $_GET ) ) {
		
		$GET = $this->clean( 'get' , $_GET );
		
		$o['page_query'] = $_GET;
		
		if ( $o['where'] == 'front' ) {
		  
		  ( isset( $_GET[$this->app.'_aff'] ) ) ? $o['affiliate'] = $_GET[$this->app.'_aff'] : '';
		  
		  ( isset( $_GET[$this->app.'_email'] ) ) ? $o['email'] = $_GET[$this->app.'_email'] : '';
		  
		  ( isset( $_GET[$this->app.'_ad'] ) ) ? $o['ad'] = $_GET[$this->app.'_ad'] : '';
		  
		  ( isset( $_GET[$this->app.'_suite'] ) ) ? $o['ad'] = $_GET[$this->app.'_suite'] : '';
		  
		  ( isset( $_GET['q'] ) ) ? $o['keywords'] = $_GET['keywords'] : '';
		  
		}
		
	  }
	  
	  if ( $o['where'] == 'admin' ) {
		
		if ( isset( $_GET['page'] ) && $_GET['page'] == $this->app ) {
		  
		  $o['where'] = 'dash';
		  
		}
		else {
		  
		  ( strpos( $_SERVER['PHP_SELF'] , 'editor' , 0 ) !== FALSE ) ? 
			
			$o['where'] = 'edit' : '';
		  
		}
		
	  }
	  
	  if ( $o['where'] == 'front' ) {
		
		$o['page_id'] = get_the_id();
		( $o['page_id'] < 1 ) ? $o['page_id'] = $this->homeid(): '';
		
		if ( $this->track( $o['page_id'] ) == FALSE ) {
		  
		  $o['where'] = 'error';
		  $o['error'] = 'notrack';
		  
		}
		else {
		  
		  //$o['id'] = 1;//TESTING
		  
		  //$_SERVER['HTTP_REFERER'] = 'http://this.com/hit?hi=hi&hi2=hi2#hi';// #q=keywords TESTING
		  
		  if ( isset( $_SERVER['HTTP_REFERER'] ) ) {
			
			( filter_var( $_SERVER['HTTP_REFERER'] , FILTER_VALIDATE_URL ) ) ? 
			  
			  $o = array_merge( $o , $this->url2a( array( 'k' => 'prev' , 'v' => $_SERVER['HTTP_REFERER'] ) ) ) :'';
			
			if ( $o['prev_host'] == $o['host'] ) {
			  
			  if ( strlen( $o['prev_path'] ) > 1 ) {
				
				$o['prev_page'] = url_to_postid( $o['prev_url'] );
				
			  }
			  else {
				
				$o['prev_page'] = $this->homeid();
				
			  }
			  
			}
			else {
			  
			  $o['prev_page'] = 'Outside';
			  
			}
			
		  }
		  else {
			
			$o['prev_url'] = 'Direct';
			$o['prev_page'] = 'Outside';
			
		  }
		  
		  if ( $o['prev_page'] == 'Outside' ) {
			
			$c = $this->cookie( array( 'k' => 'ref' , 'v' => $o['prev_url'] , 'r' => TRUE ) );
			
			( filter_var( $o['prev_url'] , FILTER_VALIDATE_URL ) ) ? $o = array_merge( $o , $this->url2a( array( 'k' => 'ref' , 'v' => $c ) ) ) : 
			
			$o['ref_url'] = $o['prev_url'];
			
			$o['session_start_page'] = $o['page_id'];
			
		  }
		  
		  $url = get_permalink( $o['page_id'] );
		  
		  ( $o['ssl'] == TRUE && strpos( $url , 'https' , 0 ) === FALSE ) ? $url = str_replace( 'http' , 'https' , $url ) : '';
		  
		  ( filter_var( $url , FILTER_VALIDATE_URL ) ) ? $o = array_merge( $o , $this->url2a( array( 'k' => 'page' , 'v' => $url ) ) ) :'';
		  
		  $o['page_type'] = get_post_type( $o['page_id'] );
		  $o['page_cats'] = $this->o2kv( array('t' => 'n' , 'o' => get_the_category( $o['page_id'] ) , 'k' => 'cat_ID' ) ) ;
		  
		  $o['page_tags'] = $this->o2kv( array('t' => 'n' , 'o' =>  wp_get_post_tags( $o['page_id'] ) , 'k' => 'term_id' ) ) ;
		  
		  
		  $o['ip'] = ip2long( $_SERVER['REMOTE_ADDR'] );
		  
		}
		
	  }
	  else {
		
		( filter_var( $_SERVER['HTTP_REFERER'] , FILTER_VALIDATE_URL ) ) ? 
		  
		  $o['aref'] = $this->url2a( array( 'k' => 'aref' , 'v' => $_SERVER['HTTP_REFERER'] ) ) : '';
	  }
	  
	}
	
	return $o;
  }
  
  function clean ( $i , $o ) {
	
	switch( $i ){
	  
	  case 'get':
	  $o = array_map( 'esc_js' , $o );
	  $o = array_map( 'strip_tags' , $o );
	  $o = array_map( 'esc_html' , $o );
	  break;
	  case 'post':
	  if ( isset( $o['AJ'] ) && is_string( $o['AJ'] ) ) {
		
		( isset( $o['wysiwyg'] ) ) ? $o['wysiwyg'] = esc_js( sanitize_textarea_field( $o['wysiwyg'] ) ) : '';
		
	  } else {
		
		$o['AJ'] = 'error';
	  }
	  break;
	  case 'out':
	  if ( isset( $o[$this->app . '_html'] ) ) {
		
		$o[$this->app . '_html'] = esc_js( esc_html( $o[$this->app . '_html'] ) );	
		
	  }
	  break;
	  
	}
	
	return $o;
	
  }
  
  function homeid ( ) {
	
	$o = get_option( 'page_for_posts', FALSE );
	
	( $o == FALSE ) ? $o = get_option( 'page_on_front' ):'';
	
	return $o;
	
  }
  
  function cookie ( $i ) {
	
	//ob_start();//DEPRECATED
	
	$o = FALSE;
	
	if ( isset( $i['kp'] ) ) {
	  
	  $k = $i['kp'];
	  
	}
	else {
	  
	  ( ! isset( $i['p'] ) ) ? $i['p'] = $this->app . '_' . implode( '*' , explode( '.' , explode( '//' , get_site_url() )[1] ) ) : '';
	  
	  
	  ( $i['k'] == '_' ) ? $k = $i['p'] : $k = $i['p'] . '_' . $i['k'];
	  
	}
	
	( isset( $i['r'] ) && $i['r'] == TRUE ) ? setcookie( $k , '' , time() - 1000 , '/' , FALSE , FALSE ) : '';
	
	if ( isset( $i['v'] ) ) {
	  
	  setcookie( $k , $i['v'] , ( time() + 60*60*24*1200 ), '/' , FALSE , FALSE );
	}
	
	( ! isset( $_COOKIE[$k] ) ) ? $o = FALSE : $o = $_COOKIE[$k];
	
	//ob_end_flush();//DEPRECATED
	
	return $o;
	
  }
  
  function url2a ( $i ) {
	
	$o = parse_url( $i['v'] );
	
	$o['url'] = $i['v'];
	
	( isset( $o['path'] ) ) ? 
	  
	  $o['path'] = ltrim( rtrim( $o['path'] , '/' ) , '/'): '';
	
	if( isset( $o['query'] ) ){
	  
	  $o['url'] = explode( '?' , $o['url'])[0];
	  $o['query'] = $this->str2a( $o['query'] );
	  
	  if ( isset( $o['query']['q'] ) ) {
		
		$o['keywords'] = $o['query']['q'];
		unset( $o['query']['q'] );
		
	  }
	  
	}
	
	if ( isset( $o['fragment'] ) && strpos( $o['fragment'] , '=' , 0 ) !== FALSE && substr( $o['fragment'] , 0 , 1) == 'q' ) {
	  
	  $ex = explode( '=' , $o['fragment'] );
	  
	  ( isset( $o['query'] ) ) ? $o['query'][$ex[0]] = $ex[1] : $o['query'] = array( $ex[0] => $ex[1] ) ;
	  
	  unset( $o['fragment'] );
	}
	
	if( $i['k'] != FALSE ) {
	  
	  $ka = $i['k'] . '_' . str_replace( ',' , ',' . $i['k'] . '_' , implode( ',' , array_keys( $o ) ) );
	  
	  $o = array_combine( explode( ',' , $ka) , array_values($o) );
	  
	}
	
	return $o;
  }
  
  function o2kv ( $i ) {
	
	$o = FALSE;
	
	if ( count( $i['o'] ) > 0 ) {
	  
	  $o = array();
	  
	  ( isset( $i[$this->def] ) ) ? $o[$this->def] = $i[$this->def] : '';
	  
	  ( isset( $i['before'] ) ) ? $o = array_merge( $o , $i['before'] ) : '';
	  
	  $n = 0;
	  foreach ( $i['o'] as $kv2 ) {
		
		$set = TRUE;
		
		if ( $i['t'] != $this->app ) {
		  
		  if( gettype( $kv2 ) == 'object') {
			
			( ! isset( $kv2->$i['k'] ) ) ? $set = FALSE : '';
			
		  }
		  else {
			
			( ! isset( $kv2[$i['k']] ) ) ? $set = FALSE : '';
			
		  }
		  
		}
		
		if( $set == TRUE ){
		  
		  switch ( $i['t'] ) {
			
			case 'n':
			
			( gettype( $kv2 ) == 'object') ? $o[] = $kv2->$i['k']: $o[] = $kv2[$i['k']];
			break;
			
			case 'm':
			
			( gettype( $kv2 ) == 'object') ? $o[] = array( 'v' => $kv2->$i['k'] , 'n' => $kv2->$i['v'] ): 
			$o[] = array( 'v' => $kv2[$i['k']] , 'n' => $kv2[$i['v']] );
			break;
			
			default:
			
			( gettype( $kv2 ) == 'object') ? $o[$kv2->$i['k']] = $kv2->$i['v'] : $o[$kv2[$i['k']]] = $kv2[$i['v']];
			break;
		  }
		}
		
		$n++;
	  }
	}
	
	( isset( $i['after'] ) ) ? $o = array_merge( $o , $i['after'] ) : '';
	
	return $o;
  }
  
  function str2a ( $i ) {
	
	if ( ! is_array( $i ) ) {
	  
	  $i = rtrim( ltrim( stripslashes( $i ) , '"' ) , '"' );
	  
	  parse_str( $i , $o );
	  
	}
	else {
	  
	  $o = array();
	  foreach ( $i as $k => $v ) {
		
		$v = rtrim( ltrim( stripslashes( $v ) , '"' ) , '"' );
		
		parse_str( $v , $a );
		$o = array_merge( $o , $a );
		
	  }
	  
	}
	
	return $o;
	
  }
  
  function user ( $i ) {
	
	//$i = 'id_1';////ip_IP , id_ID , app_APP - TESTING	
	
	$o = array( 'type' => 'ghost', 'logged' => FALSE , 'spammer' => FALSE );
	
	//$o = $this->api( array( 'user' , $o ) );//TESTING
	
	if ( $i == 'live' ) {
	  
	  $i = FALSE;
	  
	  $o['browser'] = $this->browser( $_SERVER['HTTP_USER_AGENT'] );
	  $o['cookie'] = $this->cookie( array( 'k' => '_' ) );
	  
	  ( $o['cookie'] != FALSE ) ? $i = $o['cookie'] : '';
	  
	  $o['ip'] = filter_var( $_SERVER['REMOTE_ADDR'] , FILTER_VALIDATE_IP );
	  
	  if ( $o['ip'] != FALSE ) {
		
		$o['ip'] = ip2long( $_SERVER['REMOTE_ADDR'] );
		$o['spammer'] = $this->spammer( 'ip_' . $o['ip'] );
		
	  }
	  
	  if ( is_user_logged_in() ) {
		
		$o['logged'] = TRUE;
		
		$o['wp'] = get_current_user_id();
		
		$i = 'wp_' . $o['wp'];
		
	  }
	  else {
		
		if ( $o['cookie'] == FALSE )  {
		  
		  ( $o['ip'] !== FALSE ) ? $i = 'ip_' . $o['ip'] : '';
		  
		}
		else {
		  
		  $i = $o['cookie'];
		  
		}
		
	  }
	  
	  if ( $i != FALSE ) {
		
		$e = explode ( '_' , $i );
		
		$o['type'] = $e[0];
		$o[$e[0]] = $e[1];
		
		if ( $o['type'] == 'id'  ) {
		  
		  $ud = array( 'id' => $o['id'] );
		  $kv = array();
		}
		else {
		  
		  $ud['kv'] = 'Class=Log,item=user,';
		  ( isset( $o['wp'] ) && $o['wp'] > 0 ) ? $ud['kv'] .= 'wp=' . $o['wp'] : $ud['kv'] .= 'ip=' . $o['ip'];
		  $kv = array( 'Class' => 'Log' , 'item' => 'user' );
		  
		}
		
		$ud['row'] = array( 'kv' => $kv , 'js' => array( 'ips' => array() , 'browsers' => array() ) , 'st' => 'a' );
		
		( isset( $o['wp'] ) && $o['wp'] > 0 ) ? $ud['row']['kv']['wp'] = $o['wp'] : '';
		
		$ud['row']['kv']['geo'] = array( 'locale' => get_locale() );
		( filter_var( $_SERVER['REMOTE_ADDR'] , FILTER_VALIDATE_IP ) ) ? $ud['row']['kv']['geo']['ip'] = ip2long( $_SERVER['REMOTE_ADDR'] ) : '';
		
		( $o['ip'] != FALSE ) ? $ud['row']['kv']['ip'] = $o['ip'] : '';
		( $o['browser'] != FALSE ) ? $ud['row']['kv']['browser'] = $o['browser'] : '';
		
		$g = $this->api( array( __FUNCTION__ , $ud ) );
		
		//$o['ROW'] = $g['ROW'];//TESTING
		
		if ( is_array( $g ) ) {
		  
		  $u = $g;
		  
		  $o['type'] = 'id';
		  $o['id'] = $u['id'];
		  
		  ( $o['cookie'] != 'id_' . $u['id'] ) ? $o['cookie'] = $this->cookie( array( 'k' => '_' , 'v' => 'id_' . $u['id'] , 'r' => TRUE ) ) : '';
		  
		}
		else {
		  
		  $u = $o;
		  
		}
		
	  }
	  
	}
	else {
	  
	  $e = explode ( '_' , $i );
	  
	  $o['type'] = $e[0];
	  $o[$e[0]] = $e[1];
	  
	  ( $o['type'] == $this->app ) ? $uq = array( 'id' => $o[$this->app] ) : 
	  $uq = array( 'kv' => 'Class=Log,item=user,' . str_replace( '_' , '=' , $i ) );
	  
	  $u = $this->api( array( 'user' , $uq ) );
	  
	  if ( $u == NULL ) {
		
		$i = FALSE;
		
	  }
	  else {
		
		$o['type'] = 'id';
		$o['id'] = $u['id'];
		
		( $u['kv']['ip'] != FALSE ) ? $o['ip'] = $u['kv']['ip'] : '';
		
		( isset( $u['kv']['geo']) ) ? $o['geo'] = $u['kv']['geo'] : '';
		
	  }
	  
	}
	
	if ( $i != FALSE ) {
	  
	  ( isset( $u['kv']['shopper']) ) ? $o['shopper'] = $u['kv']['shopper'] : '';
	  
	  ( ! isset( $o['wp'] ) && $u['kv']['wp'] > 0 ) ? $o['wp'] = $u['kv']['wp'] : '';
	  
	  ( isset( $u['kv'] ) && isset( $u['kv']['spammer'] ) ) ? $o['spammer'] = $this->spammer( 'id_' . $u['kv']['spammer'] ) : '';
	  ( isset( $u['js'] ) && isset( $u['js']['ips']['SPAM'] ) ) ? $o['spammer'] = $this->spammer( 'ip_' . $u['js']['ips']['SPAM'] ) : '';
	  
	  //$o['SHOWME'] = $u;//WORKING
	  
	  if ( isset( $o['wp'] ) && $o['wp'] > 0 ) {
		
		$u = get_user_by( 'id' , $o['wp'] );
		
		if ( isset( $u->data ) ) {
		  
		  $o['login'] = $u->user_login;
		  
		  ( $o['login'] != FALSE ) ? $o['show'] = $o['login'] : '' ;
		  
		  $o['email'] = $u->user_email;
		  
		  $o['firstname'] = $u->user_firstname;
		  $o['lastname'] = $u->user_lastname;
		  $o['display_name'] = $u->display_name;
		  
		  ( $o['display_name'] != FALSE ) ? $o['show'] = $o['display_name'] : '' ;
		  
		  $o['roles'] = $u->roles;
		}
	  }
	  
	  ( ! isset( $o['show'] ) || $o['show'] == FALSE ) ? $o['show'] = 'Visitor' : '';
	  
	  
	}
	
	return $o;
  }
  
  function browser ( $i ) {
	
	$o = FALSE;
	
	( strpos( $i , 'MSIE' ) ) ? $o = 'Explorer' : $o = 'Unknown';
	
	( $o == 'Unknown' && strpos( $i, 'Chrome' , 0 ) !== FALSE ) ? $o = 'Chrome' : '';
	( $o == 'Unknown' && strpos( $i, 'Firefox' , 0 ) !== FALSE ) ? $o = 'Firefox' : '';
	( $o == 'Unknown' && strpos( $i, 'Opera' , 0 ) !== FALSE ) ? $o = 'Opera' : '';
	( $o == 'Unknown' && strpos( $i, 'Safari' , 0 ) !== FALSE ) ? $o = 'Safari' : '';
	
	return $o;
  }
  
  function spammer ( $i ) {
	
	$C = TRUE;
	
	$ci = array( 'k' => 'spammer' );
	
	//$ci['r'] = TRUE;//TESTING
	
	$o = $this->cookie( $ci );
	
	if ( ! filter_var( $o , FILTER_VALIDATE_URL ) ) {
	  
	  $C = FALSE;
	  
	  ( ! is_array( $i ) ) ? $i = explode( '_' , $i ) : '';
	  
	  ( isset( $i[1] ) ) ? $o = $i[1] : '';
	  
	  if ( ! filter_var( $o , FILTER_VALIDATE_URL ) ) {
		
		$o = get_option( $this->app . '_spammer_' . $i[0], FALSE );
		
	  }
	  
	}
	
	if ( filter_var( $o , FILTER_VALIDATE_URL ) ) {
	  
	  ( $C == FALSE ) ? $this->cookie( array( 'k' => 'spammer' , 'v' => $o ) ) : '';
	  update_option( $this->app . '_spammer_' . $i[0] , $o );
	  
	}
	
	return $o;
	
  }
  
  function ajax ( $i ) {
	
	$_REQUEST = $this->clean( 'get' , $_REQUEST );
	  
	if ( ! wp_verify_nonce( $_REQUEST['nonce'] , $this->app . 'nonce' ) ) {
	  
	  exit();
	}
	
	$o['st'] = FALSE;
	$o['fb'] = 'Unauthorized Request!';
	
	if( TRUE ) {
	
	  $_POST = $this->clean( 'post' , $_POST );
	  
	  $o['st'] = TRUE;
	  
	  $o['fb'] = 'Ajax Worked!';
	  
	  switch ( $_POST['AJ'] ) {
		
		case 'suite':
		$o['i'] = $this->suite( $_POST['i'] );
		break;
		
		case 'cron':
		$o['i'] = $this->cron( $_POST['i'] );
		break;
		
		case 'ww':
		$o['i'] = $this->ww( $_POST['i']['d'] );
		break;
		
		default:
		$o['i'] = $this->api( array( 'ajax' , $_POST ) );
		break;
		
	  }
	  
	}
	
	if( ! TRUE ) {
	  
	  $o['st'] = FALSE;
	  $o['fb'] = 'Connection Unavailable!';
	  
	  //$o['i'] = array( 'ERROR' , $this->error( array( 'api_fail' , $i ) ) );//DEPRECATED
	  
	}
	
	if ( $o['i'] == NULL ) {
	  
	  $o['i'] = array( 'ERROR' , $this->error( array( 'api_null' , $i ) ) );
	}
	
	header( 'Content-Type: application/json' );
	
	echo $this->a2js( $o['i'] );
	
	die();
  }
  
  function error ( $i ) {
	
	switch( $i[0] ) {
	  
	  default:
	  $o = array( 'fb' , $i );
	  break;
	}
	
	return $o;
	
  }
  
  function cron ( $i ) {
	
	$o = FALSE;
	$s = get_option( $this->app , FALSE );
	
	if ( is_array( $s ) ) {
	  
	  $o = get_option( $this->app . '_cron' , FALSE );
	  
	  if ( ! is_array( $o ) ) {
		
		$o = $this->jobs( 'all' );
		
	  }
	  
	  ( isset( $i['new'] ) && ! isset( $o[$i['new'][0]] ) ) ? $o[$i['new'][0]] = $i['new'][1] : '';
	  
	  ( isset( $i['job'] ) && $i['job'] != 'all' ) ? $jobs = array( $i['job'] => $o[$i['job']] ): $jobs = $o;

	  //update_option( $this->app . '_testing' , $o );
	  
	  foreach ( $jobs as $k => $v ) {
		
		( ! isset( $o[$k] ) ) ? $o[$k] = $v: '';
		
		$j = FALSE;
		
		( $o[$k][1] == 's' ) ? $j = TRUE : '';
		( $j == FALSE && ( $o[$k][1] + $o[$k][0] ) <= time() ) ? $j = TRUE : '';
		
		( $j == TRUE ) ? $o[$k] = $this->job( array( $k , $o[$k] , $s ) ) : '';
		
	  }
	  
	  update_option( $this->app . '_cron' , $o );
	  
	}
	
	return $o;
	
  }
  
  function jobs ( $i ) {
	
	$o = array();
	
	/*FREQUENCIES: minute = 60 , 15 minutes = 900 , 30 minutes = 1800 , hour = 3600 , day = 86400
	week = 604800 , month (30.44 days) = 2629743 , year (365.24 days) = 31556926 seconds*/
	
	$o['emails'] = array( 60 , 's' , array() );//frequency , last run , info	
	$o['cnames'] = array( 86400 , 's' , array() );
	$o['users'] = array( 604800 , 's' , array() );
	$o['checkup'] = array( 604800 , 's' , array() );
	
	$o = $this->key( $i , $o );

	return $o;
	
  }
  
  function job ( $i ) {
	
	$o = $i[1];
	
	$o[0] = time();
	
	$d = array();
	
	switch ( $i[0] ) {
	  
	  case 'cnames':
	  $d = array( 'pages' => $this->pages( 'all' ) , 'cats' => $this->cats( 'all' ) , 'tags' => $this->tags( 'all' ) );
	  break;
	  
	  case 'checkup':
	  $d = array( 'bloginfo' => get_bloginfo() ) ;
	  break;
	  
	  default:
	  $m = array( 'users' );
	  ( in_array( $i[0] , $m ) ) ? $d = $this->domet( array( $i[0] , array( 'all' ) ) ): $d = 'all';
	  break;
	  
	}
	
	$o[2] = $this->api( array( $i[0] , array( $i[0] => $d , 'suite' => $i[2] , 'i' => $o[2] ) ) );
	
	return $o;
	
  }
  
  function domet ( $i ) {
	
	$o = array();
	
	( method_exists( $this , $i[0] ) ) ? $o = $this->{
	  $i[0]}
	( $i[1] ) : '';
	
	return $o;
  }
  
  function pages ( $i ) {
	
	( is_array( $i ) ) ? $o = $i : $o = array();
	
	foreach ( get_posts( array( $args = '' ) ) as $k => $v ) {
	  
	  $o[$v->ID] = array( 'title' => get_the_title( $v->ID ) , 'link' => get_permalink( $v->ID ) );
	  
	}
	
	foreach ( get_pages( array( $args = '' ) ) as $k => $v ) {
	  
	  $o[$v->ID] = array( 'title' => get_the_title( $v->ID ) , 'link' => get_permalink( $v->ID ) );
	  
	}
	
	return $o;
  }
  
  function cats ( $i ) {
	
	( is_array( $i ) ) ? $o = $i : $o = array();
	
	foreach ( get_categories( array( $args = '' ) ) as $k => $v ) {
	  
	  $o[$v->cat_ID] = $v->cat_name;
	  
	}
	
	$o = $this->key( $i , $o );
	
	
	return $o;
	
  }
  
  function tags ( $i ) {
	
	( is_array( $i ) ) ? $o = $i : $o = array();
	
	foreach ( get_tags( array( $args = '' ) ) as $k => $v ) {
	  
	  $o[$v->term_id] = $v->name;
	  
	}
	
	$o = $this->key( $i , $o );

	return $o;
	
  }
  
  function users ( $i ) {
	
	$o = array();
	foreach( get_users( array( 'orderby' => 'login' ) ) as $k => $v ) {
	  
	  $o[$v->ID] = $v->data;
	  
	}
	
	return $o;
	
  }
  
  function key ( $i , $o ) {
	
	if ( is_array( $i ) ) {
	  
	  $o = array_merge( $i , $o );
		
	} else {
	  
	  ( $i != 'all' ) ? $o = $o[$i]: '';
	  
	}
	
	return $o;
  }
  
  function cnames ( $i ) {
	
	$s = get_option( $this->app , FALSE );
	
	if ( is_array( $s ) ) {
	  
	  $o = get_option( $this->app . '_cron' , FALSE );
	  
	  $k = __FUNCTION__;
	  
	  if ( ! isset( $o[$k] ) ) {
		
		$o[$k] = $this->jobs( $k );
		
	  }
	  
	  $o[$k] = $this->job( array( $k , $o[$k] , $s ) );
	  
	  update_option( $this->app . '_cron' , $o );
	  
	}
	
	return $o;
	
  }
  
  function wrapper ( $i , $c ) {
	
	( isset( $_GET ) ) ? $i['GET'] = $this->clean( 'get' , $_GET ) : '';
	
    $i['user'] = $this->user( 'live' );
    $i['tracking'] = $this->tracking( 'live' );
	
	$o = $this->api( array( $i['class'] , array( $i , $c ) ) );
	
	( $o != FALSE ) ? $o = do_shortcode( $this->phtml( $o ) ): '';
	
	return $o;
	
  }
  
  function smartcode ( $i ) {
	
	( isset( $_GET ) ) ? $i['GET'] = $this->clean( 'get' , $_GET ) : '';
	
    $i['user'] = $this->user( 'live' );
    $i['tracking'] = $this->tracking( 'live' );
	
	$o = $this->api( array( $i['class'] , $i ) );
	
	( $o != FALSE ) ? $o = do_shortcode( $this->phtml( $o ) ): '';
	
	return $o;
	
  }
  
  function phtml ( $i ) {
	
	$o = $i;
	$o = htmlspecialchars_decode( $o , ENT_QUOTES );
	
	return $o;
	
  }
  
  function ww ( $i ) {//https://codex.wordpress.org/Function_Reference/wp_editor
	
	//$i = array( 'body' , $this->a2js( $i ) , '500__1000' );//TESTING
	
	( ! is_array( $i[2] ) ) ? $i[2] = explode( '__' , $i[2] ) : '';
	
	$wi = [];
	$wi['wpautop'] = TRUE;
	$wi['media_buttons'] = TRUE;
	$wi['textarea_name'] = $i[0];
	$wi['editor_height'] = $i[2][1];
	$wi['quicktags'] = TRUE;
	$wi['tinymce'] = TRUE;
	$wi['drag_drop_upload'] = TRUE;
	
	ob_start();
	
	$o = wp_editor( $this->phtml( $i[1] ) , $i[0] , $wi );
	
	\_WP_Editors::enqueue_scripts();
	print_footer_scripts();
	\_WP_Editors::editor_js();
	
	$o = ob_get_contents();
	ob_end_clean();
	
	$c = $o;
	$e = '[' . $this->app . '="wysiwyg"]';
	( isset( $i[3] ) ) ? $e .= '[data-wysiwyg="' . $i[3] . '"]' : '';
	
	$o = array( 'MULTIPLE' , array() );
	$o[1][] = array( 'CONTENT' , array( 'e' => $e , 'm' => 'replaceWith' , 'c' => $c ) );
	
	( isset( $i[3] ) && in_array( $i[3] , array( 'optbody' ) ) ) ? $o[1][] = array( 'RELOADING' , 'done2' ) : '';
	
	return $o;
  }
  
}

ob_start( );
use Vervenia\Suite;
$GLOBALS['VERVENIA'] = new Suite;