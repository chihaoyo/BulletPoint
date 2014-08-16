<?php

mb_internal_encoding('UTF-8');
date_default_timezone_set(isset($__context['timezone']) ? $__context['timezone'] : 'Asia/Taipei');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// DEBUGGING /////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if(!isset($__app) || !isset($__app['is_debugging']) || $__app['is_debugging'] == true)  {
//	echo "<pre>report all errors</pre>";
	ini_set('display_errors', 'On');
	error_reporting(-1);
}

function ___($obj, $return = false, $table = false, $caption = 'data table') {
	$string = '';
	if($table) {
		if(!is_array($obj)) {
			$string = '<pre>not a table</pre>';
		}
		else if(count($obj) < 1) {
			$string = '<pre>table is empty</pre>';
		}
		else {
			$head = '<th><pre>#</pre></th>';
			foreach(reset($obj) as $k => $v) {
				$head .= "<th><pre>$k</pre></th>";
			}
			$head = "<tr>$head</tr>";
			$body = '';
			$counter = 0;
			foreach($obj as $row) {
				$row_html = "<th><pre>$counter</pre></th>";
				foreach($row as $col) {
					$row_html .= "<td><pre>$col</pre></td>";
				}
				$body .= "<tr>$row_html</tr>";
				$counter++;
			}
			$string = "<table><caption><pre>$caption</pre></caption><thead>$head</thead><tbody>$body></tbody></table>";
		}
	}
	else {
		if(is_string($obj))
			$string = $obj;
		else if(is_bool($obj))
			$string = ($obj ? 'true' : 'false');
		else
			$string = print_r($obj, true);
		
		$string = htmlspecialchars($string);
		
		if(strpos($string, '///') !== false) {
			$temp = explode('///', $string);
			$string = '<tr><td><pre>' . implode('</pre></td><td><pre>', $temp) . '</pre></td></tr>' . "\n";
		}
		else
			$string = '<pre>' . $string . '</pre>' . "\n";
	}

	if($return)
		return $string;
	else {
		echo $string;
		@ob_flush();
		@flush();
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// ARRAY /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function array_select($key, $array) {
	$result = array();
	foreach($array as $item) {
		$result[] = $item[$key];
	}
	return $result;
}

function array_promote($key, $array) {
	$result = array();
	foreach($array as $item) {
		if(!isset($item[$key]))
			continue;
			
		$value = $item[$key];
		unset($item[$key]);
		if(count($item) == 1) {
			$item = array_pop($item);
		}
		$result[$value] = $item;
	}
	return $result;
}

// https://raw.githubusercontent.com/ramsey/array_column/master/src/array_column.php
/**
 * This file is part of the array_column library
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright Copyright (c) 2013 Ben Ramsey <http://benramsey.com>
 * @license http://opensource.org/licenses/MIT MIT
 */

if (!function_exists('array_column')) {

    /**
     * Returns the values from a single column of the input array, identified by
     * the $columnKey.
     *
     * Optionally, you may provide an $indexKey to index the values in the returned
     * array by the values from the $indexKey column in the input array.
     *
     * @param array $input A multi-dimensional array (record set) from which to pull
     *                     a column of values.
     * @param mixed $columnKey The column of values to return. This value may be the
     *                         integer key of the column you wish to retrieve, or it
     *                         may be the string key name for an associative array.
     * @param mixed $indexKey (Optional.) The column to use as the index/keys for
     *                        the returned array. This value may be the integer key
     *                        of the column, or it may be the string key name.
     * @return array
     */
    function array_column($input = null, $columnKey = null, $indexKey = null)
    {
        // Using func_get_args() in order to check for proper number of
        // parameters and trigger errors exactly as the built-in array_column()
        // does in PHP 5.5.
        $argc = func_num_args();
        $params = func_get_args();

        if ($argc < 2) {
            trigger_error("array_column() expects at least 2 parameters, {$argc} given", E_USER_WARNING);
            return null;
        }

        if (!is_array($params[0])) {
            trigger_error('array_column() expects parameter 1 to be array, ' . gettype($params[0]) . ' given', E_USER_WARNING);
            return null;
        }

        if (!is_int($params[1])
            && !is_float($params[1])
            && !is_string($params[1])
            && $params[1] !== null
            && !(is_object($params[1]) && method_exists($params[1], '__toString'))
        ) {
            trigger_error('array_column(): The column key should be either a string or an integer', E_USER_WARNING);
            return false;
        }

        if (isset($params[2])
            && !is_int($params[2])
            && !is_float($params[2])
            && !is_string($params[2])
            && !(is_object($params[2]) && method_exists($params[2], '__toString'))
        ) {
            trigger_error('array_column(): The index key should be either a string or an integer', E_USER_WARNING);
            return false;
        }

        $paramsInput = $params[0];
        $paramsColumnKey = ($params[1] !== null) ? (string) $params[1] : null;

        $paramsIndexKey = null;
        if (isset($params[2])) {
            if (is_float($params[2]) || is_int($params[2])) {
                $paramsIndexKey = (int) $params[2];
            } else {
                $paramsIndexKey = (string) $params[2];
            }
        }

        $resultArray = array();

        foreach ($paramsInput as $row) {

            $key = $value = null;
            $keySet = $valueSet = false;

            if ($paramsIndexKey !== null && array_key_exists($paramsIndexKey, $row)) {
                $keySet = true;
                $key = (string) $row[$paramsIndexKey];
            }

            if ($paramsColumnKey === null) {
                $valueSet = true;
                $value = $row;
            } elseif (is_array($row) && array_key_exists($paramsColumnKey, $row)) {
                $valueSet = true;
                $value = $row[$paramsColumnKey];
            }

            if ($valueSet) {
                if ($keySet) {
                    $resultArray[$key] = $value;
                } else {
                    $resultArray[] = $value;
                }
            }

        }

        return $resultArray;
    }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// SERIALIZATION /////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function encode($obj) {
	return base64_encode(serialize($obj));
}

function decode($string) {
	return unserialize(trim(base64_decode($string)));
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// STRING VALIDATION /////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function _str_is_latin($string) {
//	return (preg_match('/[^A-Za-z\x{00C0}-\x{024F}\x{0400}-\x{A69F}]/', $string) == 0);
	return (preg_match('/[^A-Za-z\x{00C0}-\x{024F}]/u', $string) == 0);
}
function _str_is_literal_numerical($string) {
	return !preg_match('/[^a-zA-Z0-9]/i', $string);
}
function _str_is_literal($string) {
	return !preg_match('/[^a-zA-Z_]/i', $string);
}
function _str_is_pos_int($string) {
	return !preg_match('/[^0-9]/i', $string);
}
function _str_is_date($string) {
	return !preg_match('/[0-9]+\/[0-9]+\/[0-9]+/i', $string);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// NATURAL LANGUAGE //////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function to_plural($singular) {
	if(substr($singular, -1) == 'y') {
		return substr($singular, 0, strlen($singular) - 1) . 'ies';
	}
	else
		return $singular . 's';
}

function to_singular($plural) {
	if(substr($plural, -3) == 'ies')
		return substr($plural, 0, strlen($plural) - 3) . 'y';
	else
		return substr($plural, 0, strlen($plural) - 1);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// LIBRARIES /////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//include_once('lib-db.php');

?>