<?php
/**
 * $shimansky.biz
 *
 * Static web site core scripts
 * @category PHP
 * @access public
 * @copyright (c) 2012 Shimansky.biz
 * @author Serguei Shimansky <serguei@shimansky.biz>
 * @license http://opensource.org/licenses/bsd-license.php
 * @package shimansky.biz
 * @link https://bitbucket.org/englishextra/shimansky.biz
 * @link https://github.com/englishextra/shimansky.biz.git
 */
$relpa = ($relpa0 = preg_replace("/[\/]+/", "/", $_SERVER['DOCUMENT_ROOT'] . '/')) ? $relpa0 : '';
$a_inc = array(
	'lib/swamper.class.php',
	'inc/regional.inc',
	'inc/vars2.inc',
	'inc/pdo_mysql.inc',
	'inc/pdo_sqlite_cache.inc'
);
foreach ($a_inc as $v) {
	require_once $relpa . $v;
}
/* this script should be utf encoded */
class Search extends Swamper {
	function __construct() {
		parent::__construct();
	}
	public function conv_symbs_to_ents($s) {
		return $s = str_replace(array(
"‘",
"‚",
"„",
"“",
"”",
"€",
"@",
"№",
"«",
"»",
/*"-",*/
"–",
"—",
"’",
"'",
"…"
), array(
"&#8216;",
"&#8218;",
"&#8222;",
"&#8220;",
"&#8221;",
"&#8364;",
"&#64;",
"&#8470;",
"&#171;",
"&#187;",
/*"&#8211;",*/
"&#8211;",
"&#8212;",
"&#39;",
"&#39;",
"&#8230;"
), $s);
	}
	public function prepare_query($s) {
		$s = trim($s);
		$s = $this->safe_str($s);
		$s = str_replace("_", " ", $s);
		$s = $this->remove_tags($s);
		$s = $this->ord_hypher($s);
		$s = $this->ord_space($s);
		return $s;
	}
	public function db_table_exists($db_handler, $table) {
		return $r = $db_handler->query("SELECT count(*) from `" . $table . "`") ? true : false;
	}
	public function write_to_caching_db2($db_handler, $table, $marker, $q, $p) {
		if ($this->db_table_exists($db_handler, $table)) {
			$db_handler->exec("DELETE FROM " . $table . " WHERE `query`='" . $this->conv_symbs_to_ents($q) . "';");
			$SQL = "INSERT INTO `" . $table . "` ";
			$SQL .= "VALUES(null, :adddate, :query, :content);";
			$STH = $db_handler->prepare($SQL);
			$STH->bindValue(":adddate", $marker);
			$STH->bindValue(":query", $this->conv_symbs_to_ents($q));
			$STH->bindValue(":content", $this->conv_symbs_to_ents($p));
			$STH->execute();
		}
	}
}
if (!isset($Search) || empty($Search)) {
	$Search = new Search ();
}
$query = $Search->get_post('q') ? $Search->get_post('q') : ($Search->get_post('s') ? $Search->get_post('s') : '');
if (!$query) {$query = $Search->get_post('term') ? $Search->get_post('term') : ($Search->get_post('search') ? $Search->get_post('search') : '');}
if (!$query) {$query = $Search->get_post('query') ? $Search->get_post('query') : '';}
$query = $Search->prepare_query($query);
$length = $Search->get_post('length');
if (!$length) {
	$length = 255;
}
$limit = $Search->get_post('limit');
if (!$limit) {
	$limit = 4;
}
$ignore_length = 2;
$query_length = ($query_length0 = mb_strlen($query, mb_detect_encoding($query, "UTF-8, ASCII"))) ? $query_length0 : 0;
$table_name = $pt_pages_table_name;
$table_name1 = $options_more_movies_3gp_ipod_psp_table_name;
$table_name2 = $pt_search_history_table_name;
$table_name3 = $dict_enru_general_table_name;
$table_name4 = $dict_ruen_general_table_name;
$table_name5 = $options_downloads_table_name;
$r = '';
$p = '';
if (!empty($query) && $query_length > $ignore_length) {
	/* read from cache */
	$from_cache = '';
	$cache_table_name = 'cache_search';
	$SQLITE_CACHE->exec("CREATE TABLE IF NOT EXISTS `" . $cache_table_name . "` ( `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `adddate` INTEGER NOT NULL, `query` TEXT, `content` TEXT )");
	if ($Search->db_table_exists($SQLITE_CACHE, $cache_table_name)) {
		$SQL = "SELECT `id`, `adddate`, `query`, `content` ";
		$SQL .= "FROM `" . $cache_table_name . "` ";
		$SQL .= " WHERE `id`!='' AND `adddate`!='' AND `query`!='' AND `content`!='' AND `query`=:query LIMIT :limit;";
		$STH = $SQLITE_CACHE->prepare($SQL);
		$a = null;
		/**
		 * if-not-true-then-false.com/2012/php-pdo-sqlite3-example/
		 * php.net/manual/en/sqlite3stmt.bindvalue.php
		 */
		$a[] = array(":query", $Search->conv_symbs_to_ents($query));
		$a[] = array(":limit", (int) 1);
		for ($i = 0; $i < count($a); $i++) {
			if (!empty($a[$i][0])) {
				$STH->bindValue($a[$i][0], $a[$i][1]);
			}
		}
		$STH->execute();
		while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
			if ($fr[0]) {
				$r = 1;
				if ($fr[1] > $vars2_start_time && $fr[1] < $vars2_end_time) {
					$from_cache = 1;
				}
				$p = "\n\n" . "<!-- from " . $cache_table_name . " -->" . "\n\n" . $fr[3];
			}
		}
	}
	if (!$r) {
		try {
			/* $p = '<h2>&#1056;&#1077;&#1079;&#1091;&#1083;&#1100;&#1090;&#1072;&#1090;&#1099; &#1087;&#1086;&#1080;&#1089;&#1082;&#1072;</h2>' . "\n" . '<ol>' . "\n"; */
			/* $p = '<h2>&#1056;&#1077;&#1079;&#1091;&#1083;&#1100;&#1090;&#1072;&#1090;&#1099; &#1087;&#1086;&#1080;&#1089;&#1082;&#1072;</h2>' . "\n"; */
			$p .= '<ol class="jqm-list">' . "\n";
			if ($Search->db_table_exists($DBH, $table_name)) {
				$SQL = "SELECT `id`, `page_title`, `page_url`, `description`, `wordhash` ";
				$SQL .= "FROM `" . $table_name . "` ";
				$SQL .= " WHERE `page_title`!='' AND `page_url`!='' AND `description`!='' AND `wordhash`!='' AND `page_title` LIKE :query OR `description` LIKE :query OR `wordhash` LIKE :query ORDER BY `page_title` ASC LIMIT :limit;";
				$STH = $DBH->prepare($SQL);
				$a = null;
				/**
				 * php.net/manual/en/pdostatement.bindparam.php
				 * The CORRECT solution is to leave clean the placeholder like this:
				 * "SELECT * FROM `users` WHERE `firstname` LIKE :keyword";
				 * And then add the percentages to the php variable where you store the keyword:
				 * $keyword = "%".$keyword."%";
				 */
				$a[] = array(":query", '%' . $Search->conv_symbs_to_ents($query) . '%', PDO::PARAM_STR);
				$a[] = array(":limit", (int) $limit, PDO::PARAM_INT);
				for ($i = 0; $i < count($a); $i++) {
					if (!empty($a[$i][0])) {
						$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
					}
				}
				$STH->execute();
				if ($STH->rowCount() > 0) {
					$r = 1;
					while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
						$p .= '<li><a href="' . $Search->ensure_amp($fr[2]) . '" class="ui-link" data-ajax="false">' . $Search->safe_html($fr[3], 65) . '</a></li>' . "\n";
					}
				}
			}
			if ($Search->db_table_exists($DBH, $table_name1)) {
				$SQL = "SELECT `id`, `value`, `text` ";
				$SQL .= "FROM `" . $table_name1 . "` ";
				$SQL .= " WHERE `value`!='' AND `text`!='' AND `text` LIKE :query ORDER BY `text` ASC LIMIT :limit;";
				$STH = $DBH->prepare($SQL);
				$a = null;
				/**
				 * php.net/manual/en/pdostatement.bindparam.php
				 * The CORRECT solution is to leave clean the placeholder like this:
				 * "SELECT * FROM `users` WHERE `firstname` LIKE :keyword";
				 * And then add the percentages to the php variable where you store the keyword:
				 * $keyword = "%".$keyword."%";
				 */
				$a[] = array(":query", '%' . $Search->conv_symbs_to_ents($query) . '%', PDO::PARAM_STR);
				$a[] = array(":limit", (int) $limit, PDO::PARAM_INT);
				for ($i = 0; $i < count($a); $i++) {
					if (!empty($a[$i][0])) {
						$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
					}
				}
				$STH->execute();
				if ($STH->rowCount() > 0) {
					$r = 1;
					while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
						$p .= '<li><a href="' . $Search->ensure_amp($fr[1]) . '" class="ui-link" data-ajax="false">' . $Search->safe_html($fr[2], 65) . '</a></li>' . "\n";
					}
				}
			}
			if ($Search->db_table_exists($DBH, $table_name5)) {
				$SQL = "SELECT `id`, `value`, `text` ";
				$SQL .= "FROM `" . $table_name5 . "` ";
				$SQL .= " WHERE `value`!='' AND `text`!='' AND `text` LIKE :query ORDER BY `text` ASC LIMIT :limit;";
				$STH = $DBH->prepare($SQL);
				$a = null;
				/**
				 * php.net/manual/en/pdostatement.bindparam.php
				 * The CORRECT solution is to leave clean the placeholder like this:
				 * "SELECT * FROM `users` WHERE `firstname` LIKE :keyword";
				 * And then add the percentages to the php variable where you store the keyword:
				 * $keyword = "%".$keyword."%";
				 */
				$a[] = array(":query", '%' . $Search->conv_symbs_to_ents($query) . '%', PDO::PARAM_STR);
				$a[] = array(":limit", (int) $limit, PDO::PARAM_INT);
				for ($i = 0; $i < count($a); $i++) {
					if (!empty($a[$i][0])) {
						$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
					}
				}
				$STH->execute();
				if ($STH->rowCount() > 0) {
					$r = 1;
					while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
						$p .= '<li><a href="' . $Search->ensure_amp($fr[1]) . '" class="ui-link" data-ajax="false">' . $Search->safe_html($fr[2], 65) . '</a></li>' . "\n";
					}
				}
			}
			if ($Search->db_table_exists($DBH, $table_name3)) {
				$SQL = "SELECT `id`, `entry`, `description` ";
				$SQL .= "FROM `" . $table_name3 . "` ";
				$SQL .= " WHERE `entry`!='' AND `description`!='' AND `entry` LIKE :query ORDER BY `entry` ASC LIMIT :limit;";
				$STH = $DBH->prepare($SQL);
				$a = null;
				/**
				 * php.net/manual/en/pdostatement.bindparam.php
				 * The CORRECT solution is to leave clean the placeholder like this:
				 * "SELECT * FROM `users` WHERE `firstname` LIKE :keyword";
				 * And then add the percentages to the php variable where you store the keyword:
				 * $keyword = "%".$keyword."%";
				 */
				$a[] = array(":query", $Search->conv_symbs_to_ents($query) . '%', PDO::PARAM_STR);
				$a[] = array(":limit", (int) $limit, PDO::PARAM_INT);
				for ($i = 0; $i < count($a); $i++) {
					if (!empty($a[$i][0])) {
						$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
					}
				}
				$STH->execute();
				if ($STH->rowCount() > 0) {
					$r = 1;
					while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
						$p .= '<li>' . $Search->safe_html($fr[1], 28) . '&#160;&#8212; ' . $Search->safe_html($fr[2], 28) . '</li>' . "\n";
					}
				}
			}
			if ($Search->db_table_exists($DBH, $table_name4)) {
				$SQL = "SELECT `id`, `entry`, `description` ";
				$SQL .= "FROM `" . $table_name4 . "` ";
				$SQL .= " WHERE `entry`!='' AND `description`!='' AND `entry` LIKE :query ORDER BY `entry` ASC LIMIT :limit;";
				$STH = $DBH->prepare($SQL);
				$a = null;
				/**
				 * php.net/manual/en/pdostatement.bindparam.php
				 * The CORRECT solution is to leave clean the placeholder like this:
				 * "SELECT * FROM `users` WHERE `firstname` LIKE :keyword";
				 * And then add the percentages to the php variable where you store the keyword:
				 * $keyword = "%".$keyword."%";
				 */
				$a[] = array(":query", $Search->conv_symbs_to_ents($query) . '%', PDO::PARAM_STR);
				$a[] = array(":limit", (int) $limit, PDO::PARAM_INT);
				for ($i = 0; $i < count($a); $i++) {
					if (!empty($a[$i][0])) {
						$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
					}
				}
				$STH->execute();
				if ($STH->rowCount() > 0) {
					$r = 1;
					while ($fr = $STH->fetch(PDO::FETCH_NUM)) {
						$p .= '<li>' . $Search->safe_html($fr[1], 28) . '&#160;&#8212; ' . $Search->safe_html($fr[2], 28) . '</li>' . "\n";
					}
				}
			}
			$p .= '</ol>' . "\n";
			/* write search history */
			if ($Search->db_table_exists($DBH, $table_name2)) {
				if (mb_strlen($query, mb_detect_encoding($query)) > $ignore_length) {
					$SQL = "DELETE FROM `" . $table_name2 . "` ";
					$SQL .= "WHERE `query`=:query;";
					$STH = $DBH->prepare($SQL);
					$a = null;
					/**
					 * php.net/manual/en/pdostatement.bindparam.php
					 * The CORRECT solution is to leave clean the placeholder like this:
					 * "SELECT * FROM `users` WHERE `firstname` LIKE :keyword";
					 * And then add the percentages to the php variable where you store the keyword:
					 * $keyword = "%".$keyword."%";
					 */
					$a[] = array(":query", $Search->conv_symbs_to_ents($query), PDO::PARAM_STR);
					for ($i = 0; $i < count($a); $i++) {
						if (!empty($a[$i][0])) {
							$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
						}
					}
					$STH->execute();
					/* switching the value to 0 workes for AUTO_INCREMENT field */
					$SQL = "INSERT INTO `" . $table_name2 . "` ";
					$SQL .= "(`id`,`adddate`,`query`,`host`,`ip`) ";
					$SQL .= "VALUES (0, :adddate, :query, :host, :ip);";
					$STH = $DBH->prepare($SQL);
					$a = null;
					$a[] = array(":adddate", (int) $vars2_marker, PDO::PARAM_INT);
					$a[] = array(":query", $Search->conv_symbs_to_ents($query), PDO::PARAM_STR);
					$a[] = array(":host", $Search->ensure_amp($vars2_http_x_forwarded_for), PDO::PARAM_STR);
					$a[] = array(":ip", $Search->ensure_amp($vars2_remote_address), PDO::PARAM_STR);
					for ($i = 0; $i < count($a); $i++) {
						if (!empty($a[$i][0])) {
							$STH->bindValue($a[$i][0], $a[$i][1], $a[$i][2]);
						}
					}
					$STH->execute();
				}
			}
			if (!empty($r)) {
				if (!$from_cache) {
					$Search->write_to_caching_db2($SQLITE_CACHE, $cache_table_name, $vars2_marker, $query, $p);
				}
			}
			$DBH = null;
		} catch (PDOException $e) {
			echo $e->getMessage();
		}
	}
}
$SQLITE_CACHE = null;
?><!DOCTYPE html>
<html lang="ru">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
		<meta name="robots" content="noindex,nofollow" />
		<title>Поиск</title>
		<!-- <link rel="stylesheet" href="../libs/search/css/bundle.min.css" /> -->
		<style>
			body{color:transparent;background-color:#F0F0F0;}a,ul,li,.panel-nav-menu li a,.holder-panel-menu-more{color:inherit;}ul{list-style-type:none;}.panel-nav-menu{background:transparent;}.panel-nav-menu,.holder-panel-menu-more,.btn-nav-menu,.btn-menu-more,.btn-show-vk-like,.share-buttons,.holder-search-form,.holder-contents-select,.location-qr-code,.contacts-qr-code,.cd-prev,.cd-next,.pswp,.superbox,.github-fork-ribbon a{display:none;}.ya-site-form.ya-site-form_inited_no{visibility:hidden}.page{opacity:0;}
		</style>
	</head>
	<body>
		<div class="page" id="page" role="document">
			<div class="topbanner" role="banner"></div>
			<div id="wrapper">
				<div id="sidebar-wrapper" role="navigation">
					<ul class="sidebar-icon">
						<li class="sidebar-header"><a href="../index.html" title="На Главную"><span class="sitelogo"></span></a></li>
						<li><a href="https://vk.com/englishextragithubio" class="vk-50x50"></a></li>
						<li><a href="https://soundcloud.com/user633010415" class="soundcloud-50x50"></a></li>
						<li><a href="https://twitter.com/englishextra" class="twitter-50x50"></a></li>
						<li><a href="https://vimeo.com/album/3325167" class="vimeo-50x50"></a></li>
					</ul>
					<div class="tab-content">
						<ul class="sidebar-group tab-pane active" id="tabelements">
							<li class="navigation-header">
							</li>
				<li><a href="../pages/contents.html">Содержание</a></li>
				<li><a href="../pages/articles/articles_reading_rules_utf.html">Правила чтения</a></li>
				<li><a href="../pages/grammar/grammar_usage_of_articles_a_the.html">Артикли a&#160;/ an и&#160;the</a></li>
				<li><a href="../pages/grammar/grammar_usage_of_tenses.html">Употребление времен</a></li>
				<li><a href="../pages/grammar/grammar_phrasal_verbs.html">Фразовые глаголы</a></li>
				<li><a href="../pages/aids/aids_topics.html">Топики на&#160;английском</a></li>
				<li><a href="../pages/tests/tests_grammar_tests_with_answers.html">Тесты по&#160;грамматике</a></li>
				<li><a href="../pages/tests/tests_gia_ege_letter_sample.html">ГИА&#160;/ ЕГЭ: Задания&#160;33, 39</a></li>
				<li><a href="../pages/tests/tests_ege_essay_sample.html">ЕГЭ: Задание&#160;40</a></li>
				<li><a href="../sitemap.html">Карта сайта</a></li>
						</ul>
					</div>
				</div>
				<div id="content-wrapper">
					<div class="main-header" role="heading">
						<h3>
							<span id="show-menu" class="holder-btn-nav-menu"><a href="#" class="btn-nav-menu" title="Меню"></a></span>
							Поиск
						</h3>
					</div>
					<div class="main-content padding">
						<div class="row" role="grid">
							<div class="col-lg-8">
								<div id="search" class="module module-clean">
									<div class="module-header">
										<h4>Ваш запрос</h4>
									</div>
									<div class="module-content">
										<form class="form-horizontal" method="post" action="/search/" id="search_form" enctype="application/x-www-form-urlencoded">
											<div class="form-group">
												<p>
													<label class="control-label" for="text">Введите одно ключевое слово:</label>
													<input class="form-control" type="text" name="q" id="text" autocomplete="off" placeholder="Найти" />
												</p>
												<p class="textright">
													<input class="btn btn-default" id="search_form_reset_button" value="Очистить" type="reset" />
													<input class="btn btn-primary" id="search_form_submit_button" value="Отправить" type="submit" />
												</p>
											</div>
										</form>
									</div>
								</div>
								<?php
									if (!empty($query)) {
										if (!empty($r)) {
											echo '<div class="module module-clean">
													<div class="module-header">
														<h4>Результат</h4>
													</div>
													<div id="search_results" class="module-content">' . $p . '</div>
												</div>' . "\n";
										} else {
											echo '<div class="module module-clean">
													<div class="module-header">
														<h4>Результат</h4>
													</div>
													<div id="search_results" class="module-content">
														<p>Ничего не&#160;найдено. Однако Ваши запросы фиксируются и&#160;учитываются редактором. Некоторые страницы удаляются по причине недостаточного качества или сомнительного с&#160;точки зрения авторских прав контента. Стоит так&#160;же уточнить, что ресурс некоммерческий и&#160;неразвлекательный</p>
													</div>
												</div>' . "\n";
										}
									} else {
										echo '<div class="module module-clean">
												<div class="module-header">
													<h4>Результат</h4>
												</div>
												<div id="search_results" class="module-content">
													<p>Введите ключевое слово в поле поиска&#160;/ Type your keyword in the search box</p>
												</div>
											</div>' . "\n";
									}
								?>
							</div>
<div class="col-lg-4">
	<div class="module module-clean">
		<div class="module-header">
			<h4><a href="https://maps.yandex.ru/org/repetitor_sergey_shimanskiy/1085972151">Репетитор английского</a></h4>
		</div>
		<div class="module-content">
			<p>Преподаю английский школьникам, студентам и&#160;взрослым в&#160;частном порядке в&#160;Тушино. &#171;С нуля&#187;, подтянуть, улучшить, подготовка к&#160;ЕГЭ</p>
		</div>
	</div>
	<div class="module module-clean">
		<div class="module-header">
			<h4><a href="https://englishextra.github.io/libs/early.js/">early.js&#160;&#8212; to be included first</a></h4>
		</div>
		<div class="module-content">
			<p>This bunch of third-party JS libraries is meant to be included first in your HTML markup and helps to: detect user device, detect browser capabilities, conditionally load other JS scripts</p>
		</div>
	</div>
	<div class="module module-clean">
		<div class="module-header">
			<h4><a href="https://englishextra.github.io/portfolio/">Сделаю сайт-визитку</a></h4>
		</div>
		<div class="module-content">
			<p>В течение трех рабочих дней сверстаю макет сайта-визитки для Вашего бизнеса. Это&#160;обойдется Вам в&#160;среднем в&#160;4500&#8212;8000&#160;рублей в&#160;зависимости от&#160;требований к&#160;интерфейсу</p>
		</div>
	</div>
</div>
						</div>
						<div class="footer" role="contentinfo">
						</div>
					</div>
				</div>
			</div>
		</div>
		<script>
			;(function(){var loadJS=function(_src,callback){"use strict";var ref=document.getElementsByTagName("script")[0];var script=document.createElement("script");script.src=_src;script.async=true;ref.parentNode.insertBefore(script,ref);if(callback&&"function"===typeof callback){script.onload=callback;}return script;};("undefined"!==typeof window?window:this).loadJS=loadJS;}());
			;(function(){var loadCSS=function(_href,callback,media,before){"use strict";var doc=document;var ss=doc.createElement("link");var ref;if(before){ref=before;}else{var refs=(doc.body||doc.getElementsByTagName("head")[0]).childNodes;ref=refs[refs.length-1];}var sheets=doc.styleSheets;ss.rel="stylesheet";ss.href=_href;ss.media="only x";if(callback&&"function"===typeof callback){ss.onload=callback;}function ready(cb){if(doc.body){return cb();}setTimeout(function(){ready(cb);});}ready(function(){ref.parentNode.insertBefore(ss,(before?ref:ref.nextSibling));});var onloadcssdefined=function(cb){var resolvedHref=ss.href;var i=sheets.length;while(i--){if(sheets[i].href===resolvedHref){return cb();}}setTimeout(function(){onloadcssdefined(cb);});};function loadCB(){if(ss.addEventListener){ss.removeEventListener("load",loadCB);}ss.media=media||"all";}if(ss.addEventListener){ss.addEventListener("load",loadCB);}ss.onloadcssdefined=onloadcssdefined;onloadcssdefined(loadCB);return ss;};("undefined"!==typeof window?window:this).loadCSS=loadCSS;}());
			loadCSS("../libs/search/css/bundle.min.css");
		</script><link rel="stylesheet" property="stylesheet" href="../libs/search/css/bundle.min.css" /></noscript>
		<script>
				;(function(){var a=document.createElement("div");a.innerHTML="\x3c!--[if lt IE 9]><i></i><![endif]--\x3e";if(1==a.getElementsByTagName("i").length){loadJS("../cdn/es5-shim/4.5.9/js/es5-shim.fixed.min.js");}})();
				if(!window.requestAnimationFrame){loadJS("../cdn/paulirish/js/rAF.fixed.min.js");}
				if(!window.matchMedia){loadJS("../cdn/paulirish/js/matchMedia.fixed.min.js");}
				if("undefined"===typeof window.Element&&!("dataset"in document.documentElement)){loadJS("../cdn/polyfills/0.1/js/dataset.fixed.min.js");}
				if("undefined"===typeof window.Element&&!("classList"in document.documentElement)){if(navigator.userAgent.match(/Trident\/7\./)){loadJS("../cdn/classlist-polyfill/d94a623c25bc69caf09f7089c0066fd65e760e82/classList.fixed.min.js");}}
				if(!window.Promise){loadJS("../cdn/promise-polyfill/2.0.2/js/promise.fixed.min.js");}
				if(!window.fetch){loadJS("../cdn/fetch/1.0.0/js/fetch.fixed.min.js");}
				if(!self.WeakMap){loadJS("../cdn/weakmap-polyfill/2.0.0/js/weakmap-polyfill.fixed.min.js");}
				if(!self.MutationObserver){loadJS("../cdn/webcomponentsjs/0.7.22/MutationObserver/js/MutationObserver.fixed.min.js");}
				if(!("undefined"!==typeof window.localStorage&&"undefined"!==typeof window.sessionStorage)){loadJS("../cdn/polyfills/0.1/js/Storage.fixed.min.js");}
		</script>
		<script>
				loadJS("../libs/search/js/bundle.min.js",function(){});
		</script>
	</body>
</html>
