<?php

App::uses('HtmlHelper', 'View/Helper');

class HtmlVersionHelper extends HtmlHelper {
    
    public $version = '0.0.0';
    
    public function __construct(View $View, $settings = array()) {
        parent::__construct($View, $settings);
        
        
    }
    
    public function css($path, $rel = null, $options = array()) {
		$options += array('block' => null, 'inline' => true);
		if (!$options['inline'] && empty($options['block'])) {
			$options['block'] = __FUNCTION__;
		}
		unset($options['inline']);

		if (is_array($path)) {
			$out = '';
			foreach ($path as $i) {
				$out .= "\n\t" . $this->css($i, $rel, $options);
			}
			if (empty($options['block'])) {
				return $out . "\n";
			}
			return;
		}

		if (strpos($path, '//') !== false) {
			$url = $path;
		} else {
			$url = $this->assetUrl($path, $options + array('pathPrefix' => CSS_URL, 'ext' => '.css'));
			$options = array_diff_key($options, array('fullBase' => null));

			if (Configure::read('Asset.filter.css')) {
				$pos = strpos($url, CSS_URL);
				if ($pos !== false) {
					$url = substr($url, 0, $pos) . 'ccss/' . substr($url, $pos + strlen(CSS_URL));
				}
			}
		}

		if ($rel === 'import') {
			$out = sprintf($this->_tags['style'], $this->_parseAttributes($options, array('inline', 'block'), '', ' '), '@import url(' . $url . '?v='.$this->version.');');
		} else {
			if (!$rel) {
				$rel = 'stylesheet';
			}
			$out = sprintf('<link rel="%s" type="text/css" href="%s?v='.$this->version.'" %s/>', $rel, $url, $this->_parseAttributes($options, array('inline', 'block'), '', ' '));
		}

		if (empty($options['block'])) {
			return $out;
		}
		$this->_View->append($options['block'], $out);
	}
    
    public function script($url, $options = array()) {
		if (is_bool($options)) {
			list($inline, $options) = array($options, array());
			$options['inline'] = $inline;
		}
		$options = array_merge(array('block' => null, 'inline' => true, 'once' => true), $options);
		if (!$options['inline'] && empty($options['block'])) {
			$options['block'] = __FUNCTION__;
		}
		unset($options['inline']);

		if (is_array($url)) {
			$out = '';
			foreach ($url as $i) {
				$out .= "\n\t" . $this->script($i, $options);
			}
			if (empty($options['block'])) {
				return $out . "\n";
			}
			return null;
		}
		if ($options['once'] && isset($this->_includedScripts[$url])) {
			return null;
		}
		$this->_includedScripts[$url] = true;

		if (strpos($url, '//') === false) {
			$url = $this->assetUrl($url, $options + array('pathPrefix' => JS_URL, 'ext' => '.js'));
			$options = array_diff_key($options, array('fullBase' => null));

			if (Configure::read('Asset.filter.js')) {
				$url = str_replace(JS_URL, 'cjs/', $url);
			}
		}
		$attributes = $this->_parseAttributes($options, array('block', 'once'), ' ');
		$out = sprintf('<script type="text/javascript" src="%s?v='.$this->version.'" %s></script>', $url, $attributes);

		if (empty($options['block'])) {
			return $out;
		} else {
			$this->_View->append($options['block'], $out);
		}
	}

}
