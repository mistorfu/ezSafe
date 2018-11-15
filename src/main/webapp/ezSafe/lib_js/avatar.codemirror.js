/**
 * Created by liwei on 2015/5/12.
 * composit codemirror mode
 * 包含了search,tag，xml格式化功能
 */

define(['./codemirror/lib/codemirror','./codemirror/mode/xml/xml','./codemirror/addon/search/search',
    './codemirror/addon/search/matchesonscrollbar','./codemirror/addon/edit/matchtags','bowser'],function(codemirror,xmlmode,search,matchbar,matchtags,bowser)
{
    window.CodeMirror = codemirror;
    window.bowser = bowser;
    mergely = require(['./codemirror/lib/mergely'])
    return {
        'codemirror':codemirror,
        'search':search,
        'xmlmode':xmlmode,
        'matchbar':matchbar,
        'matchtags':matchtags
    }
});
