define(['jquery', 'echarts/mapData/params'], function ($, mapGeoData) {

    // 基础数据
    var mapType = [
        'china',
        // 23个省
        '广东省', '青海省', '四川省', '海南省', '陕西省',
        '甘肃省', '云南省', '湖南省', '湖北省', '黑龙江省',
        '贵州省', '山东省', '江西省', '河南省', '河北省',
        '山西省', '安徽省', '福建省', '浙江省', '江苏省',
        '吉林省', '辽宁省', '台湾省',
        // 5个自治区
        '新疆', '广西', '宁夏', '内蒙古', '西藏',
        // 4个直辖市
        '北京', '天津', '上海', '重庆',
        // 2个特别行政区
        '香港', '澳门'
    ];
    // 基础数据
    var typeCodesMap = {
        '-1': 'china',
        // 23个省
        '440000': '广东', '630000': '青海', '510000': '四川', '460000': '海南', '610000': '陕西',
        '620000': '甘肃', '530000': '云南', '430000': '湖南', '420000': '湖北', '230000': '黑龙江',
        '520000': '贵州', '370000': '山东', '360000': '江西', '410000': '河南', '130000': '河北',
        '140000': '山西', '340000': '安徽', '350000': '福建', '330000': '浙江', '320000': '江苏',
        '220000':  '吉林', '210000': '辽宁', '710000':'台湾',
        // 5个自治区
        '650000': '新疆', '450000': '广西', '640000': '宁夏', '150000': '内蒙古',  '540000': '西藏',
        // 4个直辖市
        '110000': '北京','120000':  '天津', '310000': '上海', '500000': '重庆',
        // 2个特别行政区
        '810000': '香港', '820000': '澳门'
    };

    var cityMap = {
        '达州市': '511700', '滁州市': '341100', '大兴安岭地区': '232700', '陇南市': '621200', '长沙市': '430100',
        '呼和浩特市': '150100', '大庆市': '230600', '绥化市': '231200', '迪庆藏族自治州': '533400', '廊坊市': '131000',
        '铜陵市': '340700', '龙岩市': '350800', '张家界市': '430800', '无锡市': '320200', '宁夏回族自治区': '640000',
        '洛阳市': '410300', '拉萨市': '540100', '东营市': '370500', '怀化市': '431200', '日喀则地区': '542300',
        '来宾市': '451300', '汕头市': '440500', '安徽省': '340000', '宣城市': '341800', '兴安盟': '152200',
        '自贡市': '510300', '商洛市': '611000', '黔东南苗族侗族自治州': '522600', '昭通市': '530600', '肇庆市': '441200',
        '咸阳市': '610400', '葫芦岛市': '211400', '安庆市': '340800', '果洛藏族自治州': '632600', '朔州市': '140600',
        '市辖区': '120100', '湖州市': '330500', '内蒙古自治区': '150000', '扬州市': '321000', '武威市': '620600',
        '秦皇岛市': '130300', '滨州市': '371600', '锦州市': '210700', '景德镇市': '360200', '乌鲁木齐市': '650100',
        '吉林省': '220000', '襄阳市': '420600', '西双版纳傣族自治州': '532800', '海口市': '460100', '湖南省': '430000',
        '雅安市': '511800', '九江市': '360400', '铜仁市': '520600', '鄂州市': '420700', '永州市': '431100', '南平市': '350700',
        '包头市': '150200', '黑河市': '231100', '益阳市': '430900', '伊春市': '230700', '怒江傈僳族自治州': '533300',
        '淮北市': '340600', '西藏自治区': '540000', '烟台市': '370600', '开封市': '410200', '徐州市': '320300', '贵港市': '450800',
        '驻马店市': '411700', '丽江市': '530700', '成都市': '510100', '荆州市': '421000', '山南地区': '542200', '银川市': '640100',
        '合肥市': '340100', '吕梁市': '141100', '东莞市': '441900', '临夏回族自治州': '622900', '崇左市': '451400', '玉林市': '450900',
        '珠海市': '440400', '池州市': '341700', '黔南布依族苗族自治州': '522700', '朝阳市': '211300', '宝鸡市': '610300',
        '晋城市': '140500', '唐山市': '130200', '嘉兴市': '330400', '丽水市': '331100', '佳木斯市': '230800', '张掖市': '620700',
        '海南省': '460000', '玉树藏族自治州': '632700', '菏泽市': '371700', '新疆维吾尔自治区': '650000', '天津市': '120000',
        '萍乡市': '360300', '丹东市': '210600', '阜阳市': '341200', '重庆市': '500000', '长春市': '220100', '大理白族自治州': '532900',
        '黄南藏族自治州': '632300', '临沂市': '371300', '安阳市': '410500', '潍坊市': '370700', '广西壮族自治区': '450000',
        '海东市': '630200', '上饶市': '361100', '乌海市': '150300', '新余市': '360500', '吉林市': '220200', '喀什地区': '653100',
        '贵阳市': '520100', '潮州市': '445100', '漳州市': '350600', '黔西南布依族苗族自治州': '522300', '岳阳市': '430600',
        '黄冈市': '421100', '巴中市': '511900', '石嘴山市': '640200', '锡林郭勒盟': '152500', '贺州市': '451100',
        '塔城地区': '654200', '内江市': '511000', '四川省': '510000', '昌都地区': '542100', '周口市': '411600',
        '钦州市': '450700', '常州市': '320400', '亳州市': '341600', '金华市': '330700', '阿勒泰地区': '654300',
        '沈阳市': '210100', '清远市': '441800', '阜新市': '210900', '玉溪市': '530400', '三沙市': '460300',
        '长治市': '140400', '铁岭市': '211200', '江门市': '440700', '铜川市': '610200', '泉州市': '350500',
        '揭阳市': '445200', '沧州市': '130900', '和田地区': '653200', '贵州省': '520000', '台湾省': '710000',
        '宿州市': '341300', '白银市': '620400', '省直辖县级行政区划': '429000', '石家庄市': '130100', '阿坝藏族羌族自治州': '513200',
        '台州市': '331000', '德州市': '371400', '黑龙江省': '230000', '德宏傣族景颇族自治州': '533100', '文山壮族苗族自治州': '532600',
        '七台河市': '230900', '鹰潭市': '360600', '延边朝鲜族自治州': '222400', '信阳市': '411500', '博尔塔拉蒙古自治州': '652700',
        '赤峰市': '150400', '克孜勒苏柯尔克孜自治州': '653000', '四平市': '220300', '衡水市': '131100', '济宁市': '370800',
        '恩施土家族苗族自治州': '422800', '大同市': '140200', '吴忠市': '640300', '娄底市': '431300', '乐山市': '511100',
        '防城港市': '450600', '常德市': '430700', '咸宁市': '421200', '平顶山市': '410400', '甘孜藏族自治州': '513300',
        '白城市': '220800', '苏州市': '320500', '河北省': '130000', '绍兴市': '330600', '保山市': '530500', '佛山市': '440600',
        '河池市': '451200', '澳门特别行政区': '820000', '省直辖县级行政区划': '419000', '营口市': '210800', '辽宁省': '210000',
        '阳泉市': '140300', '三明市': '350400', '西安市': '610100', '盘锦市': '211100', '南宁市': '450100', '阳江市': '441700',
        '三亚市': '460200', '天水市': '620500', '宜昌市': '420500', '海南藏族自治州': '632500', '六安市': '341500',
        '聊城市': '371500', '哈尔滨市': '230100', '伊犁哈萨克自治州': '654000', '莆田市': '350300', '通辽市': '150500',
        '河源市': '441600', '蚌埠市': '340300', '遵义市': '520300', '固原市': '640400', '安康市': '610900', '太原市': '140100',
        '杭州市': '330100', '宿迁市': '321300', '南通市': '320600', '商丘市': '411400', '鞍山市': '210300', '甘南藏族自治州': '623000',
        '茂名市': '440900', '广州市': '440100', '随州市': '421300', '绵阳市': '510700', '柳州市': '450200', '遂宁市': '510900',
        '吉安市': '360800', '齐齐哈尔市': '230200', '张家口市': '130700', '辽阳市': '211000', '泰安市': '370900', '衡阳市': '430400',
        '县': '310200', '兰州市': '620100', '新乡市': '410700', '松原市': '220700', '莱芜市': '371200', '山东省': '370000',
        '巴音郭楞蒙古自治州': '652800', '凉山彝族自治州': '513400', '县': '110200', '黄石市': '420200', '自治区直辖县级行政区划': '659000',
        '吐鲁番地区': '652100', '阿克苏地区': '652900', '汕尾市': '441500', '六盘水市': '520200', '厦门市': '350200', '资阳市': '512000',
        '邵阳市': '430500', '鄂尔多斯市': '150600', '青岛市': '370200', '云浮市': '445300', '芜湖市': '340200', '金昌市': '620300',
        '中卫市': '640500', '榆林市': '610800', '曲靖市': '530300', '西宁市': '630100', '浙江省': '330000', '忻州市': '140900',
        '连云港市': '320700', '南阳市': '411300', '香港特别行政区': '810000', '山西省': '140000', '大连市': '210200', '眉山市': '511400',
        '陕西省': '610000', '南充市': '511300', '桂林市': '450300', '广元市': '510800', '十堰市': '420300', '湛江市': '440800',
        '百色市': '451000', '青海省': '630000', '广东省': '440000', '中山市': '442000', '鸡西市': '230300', '承德市': '130800',
        '嘉峪关市': '620200', '济南市': '370100', '白山市': '220600', '赣州市': '360700', '抚州市': '361000', '林芝地区': '542600',
        '鹤壁市': '410600', '日照市': '371100', '红河哈尼族彝族自治州': '532500', '省直辖县级行政区划': '469000', '德阳市': '510600',
        '海北藏族自治州': '632200', '濮阳市': '410900', '郑州市': '410100', '江苏省': '320000', '哈密地区': '652200',
        '湘西土家族苗族自治州': '433100', '庆阳市': '621000', '淄博市': '370300', '淮安市': '320800', '云南省': '530000',
        '呼伦贝尔市': '150700', '衢州市': '330800', '普洱市': '530800', '梅州市': '441400', '邯郸市': '130400', '北京市': '110000',
        '宜宾市': '511500', '汉中市': '610700', '深圳市': '440300', '福州市': '350100', '运城市': '140800', '镇江市': '321100',
        '郴州市': '431000', '马鞍山市': '340500', '三门峡市': '411200', '毕节市': '520500', '漯河市': '411100',
        '海西蒙古族藏族自治州': '632800', '上海市': '310000', '通化市': '220500', '温州市': '330300', '梧州市': '450400',
        '江西省': '360000', '本溪市': '210500', '株洲市': '430200', '邢台市': '130500', '威海市': '371000',
        '湖北省': '420000', '阿拉善盟': '152900', '平凉市': '620800', '泸州市': '510500', '阿里地区': '542500',
        '牡丹江市': '231000', '孝感市': '420900', '市辖区': '500100', '鹤岗市': '230400', '河南省': '410000',
        '南京市': '320100', '昆明市': '530100', '昌吉回族自治州': '652300', '临沧市': '530900', '安顺市': '520400',
        '盐城市': '320900', '巴彦淖尔市': '150800', '舟山市': '330900', '县': '120200', '临汾市': '141000',
        '枣庄市': '370400', '广安市': '511600', '延安市': '610600', '宁德市': '350900', '福建省': '350000',
        '晋中市': '140700', '克拉玛依市': '650200', '定西市': '621100', '淮南市': '340400', '黄山市': '341000',
        '泰州市': '321200', '许昌市': '411000', '市辖区': '310100', '辽源市': '220400', '宜春市': '360900',
        '宁波市': '330200', '渭南市': '610500', '韶关市': '440200', '抚顺市': '210400', '南昌市': '360100', '北海市': '450500',
        '甘肃省': '620000', '保定市': '130600', '荆门市': '420800', '武汉市': '420100', '市辖区': '110100', '酒泉市': '620900',
        '惠州市': '441300', '乌兰察布市': '150900', '湘潭市': '430300', '那曲地区': '542400', '焦作市': '410800', '县': '500200',
        '楚雄彝族自治州': '532300', '双鸭山市': '230500', '攀枝花市': '510400'
    }


    for (var city in cityMap) {
        if (typeof typeCodesMap[cityMap[city]] == "undefined") {
            typeCodesMap[cityMap[city]] = city;
        }
        mapType.push(city);
        // 自定义扩展图表类型
        mapGeoData.params[city] = {
            getGeoJson: (function (c) {
                var geoJsonName = cityMap[c];
                return function (callback) {
                    $.getJSON(CONTEXT_PATH + '/avatar/ezFireExt/lib_js/echarts/util/mapData/geoJson/china-main-city/' + geoJsonName + '.json', callback);
                }
            })(city)
        }
    }

    var china_map = {
        typeCodesMap: typeCodesMap,
        mapType: mapType,
        hashData: {},
        data: [
            { name: '市辖区', code: '110100', value: 0 },
            { name: '县', code: '110200', value: 0 },
            { name: '市辖区', code: '120100', value: 0 },
            { name: '县', code: '120200', value: 0 },
            { name: '石家庄市', code: '130100', value: 0 },
            { name: '唐山市', code: '130200', value: 0 },
            { name: '秦皇岛市', code: '130300', value: 0 },
            { name: '邯郸市', code: '130400', value: 0 },
            { name: '邢台市', code: '130500', value: 0 },
            { name: '保定市', code: '130600', value: 0 },
            { name: '张家口市', code: '130700', value: 0 },
            { name: '承德市', code: '130800', value: 0 },
            { name: '沧州市', code: '130900', value: 0 },
            { name: '廊坊市', code: '131000', value: 0 },
            { name: '衡水市', code: '131100', value: 0 },
            { name: '太原市', code: '140100', value: 0 },
            { name: '大同市', code: '140200', value: 0 },
            { name: '阳泉市', code: '140300', value: 0 },
            { name: '长治市', code: '140400', value: 0 },
            { name: '晋城市', code: '140500', value: 0 },
            { name: '朔州市', code: '140600', value: 0 },
            { name: '晋中市', code: '140700', value: 0 },
            { name: '运城市', code: '140800', value: 0 },
            { name: '忻州市', code: '140900', value: 0 },
            { name: '临汾市', code: '141000', value: 0 },
            { name: '吕梁市', code: '141100', value: 0 },
            { name: '呼和浩特市', code: '150100', value: 0 },
            { name: '包头市', code: '150200', value: 0 },
            { name: '乌海市', code: '150300', value: 0 },
            { name: '赤峰市', code: '150400', value: 0 },
            { name: '通辽市', code: '150500', value: 0 },
            { name: '鄂尔多斯市', code: '150600', value: 0 },
            { name: '呼伦贝尔市', code: '150700', value: 0 },
            { name: '巴彦淖尔市', code: '150800', value: 0 },
            { name: '乌兰察布市', code: '150900', value: 0 },
            { name: '兴安盟', code: '152200', value: 0 },
            { name: '锡林郭勒盟', code: '152500', value: 0 },
            { name: '阿拉善盟', code: '152900', value: 0 },
            { name: '沈阳市', code: '210100', value: 0 },
            { name: '大连市', code: '210200', value: 0 },
            { name: '鞍山市', code: '210300', value: 0 },
            { name: '抚顺市', code: '210400', value: 0 },
            { name: '本溪市', code: '210500', value: 0 },
            { name: '丹东市', code: '210600', value: 0 },
            { name: '锦州市', code: '210700', value: 0 },
            { name: '营口市', code: '210800', value: 0 },
            { name: '阜新市', code: '210900', value: 0 },
            { name: '辽阳市', code: '211000', value: 0 },
            { name: '盘锦市', code: '211100', value: 0 },
            { name: '铁岭市', code: '211200', value: 0 },
            { name: '朝阳市', code: '211300', value: 0 },
            { name: '葫芦岛市', code: '211400', value: 0 },
            { name: '长春市', code: '220100', value: 0 },
            { name: '吉林市', code: '220200', value: 0 },
            { name: '四平市', code: '220300', value: 0 },
            { name: '辽源市', code: '220400', value: 0 },
            { name: '通化市', code: '220500', value: 0 },
            { name: '白山市', code: '220600', value: 0 },
            { name: '松原市', code: '220700', value: 0 },
            { name: '白城市', code: '220800', value: 0 },
            { name: '延边朝鲜族自治州', code: '222400', value: 0 },
            { name: '哈尔滨市', code: '230100', value: 0 },
            { name: '齐齐哈尔市', code: '230200', value: 0 },
            { name: '鸡西市', code: '230300', value: 0 },
            { name: '鹤岗市', code: '230400', value: 0 },
            { name: '双鸭山市', code: '230500', value: 0 },
            { name: '大庆市', code: '230600', value: 0 },
            { name: '伊春市', code: '230700', value: 0 },
            { name: '佳木斯市', code: '230800', value: 0 },
            { name: '七台河市', code: '230900', value: 0 },
            { name: '牡丹江市', code: '231000', value: 0 },
            { name: '黑河市', code: '231100', value: 0 },
            { name: '绥化市', code: '231200', value: 0 },
            { name: '大兴安岭地区', code: '232700', value: 0 },
            { name: '市辖区', code: '310100', value: 0 },
            { name: '县', code: '310200', value: 0 },
            { name: '南京市', code: '320100', value: 0 },
            { name: '无锡市', code: '320200', value: 0 },
            { name: '徐州市', code: '320300', value: 0 },
            { name: '常州市', code: '320400', value: 0 },
            { name: '苏州市', code: '320500', value: 0 },
            { name: '南通市', code: '320600', value: 0 },
            { name: '连云港市', code: '320700', value: 0 },
            { name: '淮安市', code: '320800', value: 0 },
            { name: '盐城市', code: '320900', value: 0 },
            { name: '扬州市', code: '321000', value: 0 },
            { name: '镇江市', code: '321100', value: 0 },
            { name: '泰州市', code: '321200', value: 0 },
            { name: '宿迁市', code: '321300', value: 0 },
            { name: '杭州市', code: '330100', value: 0 },
            { name: '宁波市', code: '330200', value: 0 },
            { name: '温州市', code: '330300', value: 0 },
            { name: '嘉兴市', code: '330400', value: 0 },
            { name: '湖州市', code: '330500', value: 0 },
            { name: '绍兴市', code: '330600', value: 0 },
            { name: '金华市', code: '330700', value: 0 },
            { name: '衢州市', code: '330800', value: 0 },
            { name: '舟山市', code: '330900', value: 0 },
            { name: '台州市', code: '331000', value: 0 },
            { name: '丽水市', code: '331100', value: 0 },
            { name: '合肥市', code: '340100', value: 0 },
            { name: '芜湖市', code: '340200', value: 0 },
            { name: '蚌埠市', code: '340300', value: 0 },
            { name: '淮南市', code: '340400', value: 0 },
            { name: '马鞍山市', code: '340500', value: 0 },
            { name: '淮北市', code: '340600', value: 0 },
            { name: '铜陵市', code: '340700', value: 0 },
            { name: '安庆市', code: '340800', value: 0 },
            { name: '黄山市', code: '341000', value: 0 },
            { name: '滁州市', code: '341100', value: 0 },
            { name: '阜阳市', code: '341200', value: 0 },
            { name: '宿州市', code: '341300', value: 0 },
            { name: '六安市', code: '341500', value: 0 },
            { name: '亳州市', code: '341600', value: 0 },
            { name: '池州市', code: '341700', value: 0 },
            { name: '宣城市', code: '341800', value: 0 },
            { name: '福州市', code: '350100', value: 0 },
            { name: '厦门市', code: '350200', value: 0 },
            { name: '莆田市', code: '350300', value: 0 },
            { name: '三明市', code: '350400', value: 0 },
            { name: '泉州市', code: '350500', value: 0 },
            { name: '漳州市', code: '350600', value: 0 },
            { name: '南平市', code: '350700', value: 0 },
            { name: '龙岩市', code: '350800', value: 0 },
            { name: '宁德市', code: '350900', value: 0 },
            { name: '南昌市', code: '360100', value: 0 },
            { name: '景德镇市', code: '360200', value: 0 },
            { name: '萍乡市', code: '360300', value: 0 },
            { name: '九江市', code: '360400', value: 0 },
            { name: '新余市', code: '360500', value: 0 },
            { name: '鹰潭市', code: '360600', value: 0 },
            { name: '赣州市', code: '360700', value: 0 },
            { name: '吉安市', code: '360800', value: 0 },
            { name: '宜春市', code: '360900', value: 0 },
            { name: '抚州市', code: '361000', value: 0 },
            { name: '上饶市', code: '361100', value: 0 },
            { name: '济南市', code: '370100', value: 0 },
            { name: '青岛市', code: '370200', value: 0 },
            { name: '淄博市', code: '370300', value: 0 },
            { name: '枣庄市', code: '370400', value: 0 },
            { name: '东营市', code: '370500', value: 0 },
            { name: '烟台市', code: '370600', value: 0 },
            { name: '潍坊市', code: '370700', value: 0 },
            { name: '济宁市', code: '370800', value: 0 },
            { name: '泰安市', code: '370900', value: 0 },
            { name: '威海市', code: '371000', value: 0 },
            { name: '日照市', code: '371100', value: 0 },
            { name: '莱芜市', code: '371200', value: 0 },
            { name: '临沂市', code: '371300', value: 0 },
            { name: '德州市', code: '371400', value: 0 },
            { name: '聊城市', code: '371500', value: 0 },
            { name: '滨州市', code: '371600', value: 0 },
            { name: '菏泽市', code: '371700', value: 0 },
            { name: '郑州市', code: '410100', value: 0 },
            { name: '开封市', code: '410200', value: 0 },
            { name: '洛阳市', code: '410300', value: 0 },
            { name: '平顶山市', code: '410400', value: 0 },
            { name: '安阳市', code: '410500', value: 0 },
            { name: '鹤壁市', code: '410600', value: 0 },
            { name: '新乡市', code: '410700', value: 0 },
            { name: '焦作市', code: '410800', value: 0 },
            { name: '濮阳市', code: '410900', value: 0 },
            { name: '许昌市', code: '411000', value: 0 },
            { name: '漯河市', code: '411100', value: 0 },
            { name: '三门峡市', code: '411200', value: 0 },
            { name: '南阳市', code: '411300', value: 0 },
            { name: '商丘市', code: '411400', value: 0 },
            { name: '信阳市', code: '411500', value: 0 },
            { name: '周口市', code: '411600', value: 0 },
            { name: '驻马店市', code: '411700', value: 0 },
            { name: '省直辖县级行政区划', code: '419000', value: 0 },
            { name: '武汉市', code: '420100', value: 0 },
            { name: '黄石市', code: '420200', value: 0 },
            { name: '十堰市', code: '420300', value: 0 },
            { name: '宜昌市', code: '420500', value: 0 },
            { name: '襄阳市', code: '420600', value: 0 },
            { name: '鄂州市', code: '420700', value: 0 },
            { name: '荆门市', code: '420800', value: 0 },
            { name: '孝感市', code: '420900', value: 0 },
            { name: '荆州市', code: '421000', value: 0 },
            { name: '黄冈市', code: '421100', value: 0 },
            { name: '咸宁市', code: '421200', value: 0 },
            { name: '随州市', code: '421300', value: 0 },
            { name: '恩施土家族苗族自治州', code: '422800', value: 0 },
            { name: '省直辖县级行政区划', code: '429000', value: 0 },
            { name: '长沙市', code: '430100', value: 0 },
            { name: '株洲市', code: '430200', value: 0 },
            { name: '湘潭市', code: '430300', value: 0 },
            { name: '衡阳市', code: '430400', value: 0 },
            { name: '邵阳市', code: '430500', value: 0 },
            { name: '岳阳市', code: '430600', value: 0 },
            { name: '常德市', code: '430700', value: 0 },
            { name: '张家界市', code: '430800', value: 0 },
            { name: '益阳市', code: '430900', value: 0 },
            { name: '郴州市', code: '431000', value: 0 },
            { name: '永州市', code: '431100', value: 0 },
            { name: '怀化市', code: '431200', value: 0 },
            { name: '娄底市', code: '431300', value: 0 },
            { name: '湘西土家族苗族自治州', code: '433100', value: 0 },
            { name: '广州市', code: '440100', value: 0 },
            { name: '韶关市', code: '440200', value: 0 },
            { name: '深圳市', code: '440300', value: 0 },
            { name: '珠海市', code: '440400', value: 0 },
            { name: '汕头市', code: '440500', value: 0 },
            { name: '佛山市', code: '440600', value: 0 },
            { name: '江门市', code: '440700', value: 0 },
            { name: '湛江市', code: '440800', value: 0 },
            { name: '茂名市', code: '440900', value: 0 },
            { name: '肇庆市', code: '441200', value: 0 },
            { name: '惠州市', code: '441300', value: 0 },
            { name: '梅州市', code: '441400', value: 0 },
            { name: '汕尾市', code: '441500', value: 0 },
            { name: '河源市', code: '441600', value: 0 },
            { name: '阳江市', code: '441700', value: 0 },
            { name: '清远市', code: '441800', value: 0 },
            { name: '东莞市', code: '441900', value: 0 },
            { name: '中山市', code: '442000', value: 0 },
            { name: '潮州市', code: '445100', value: 0 },
            { name: '揭阳市', code: '445200', value: 0 },
            { name: '云浮市', code: '445300', value: 0 },
            { name: '南宁市', code: '450100', value: 0 },
            { name: '柳州市', code: '450200', value: 0 },
            { name: '桂林市', code: '450300', value: 0 },
            { name: '梧州市', code: '450400', value: 0 },
            { name: '北海市', code: '450500', value: 0 },
            { name: '防城港市', code: '450600', value: 0 },
            { name: '钦州市', code: '450700', value: 0 },
            { name: '贵港市', code: '450800', value: 0 },
            { name: '玉林市', code: '450900', value: 0 },
            { name: '百色市', code: '451000', value: 0 },
            { name: '贺州市', code: '451100', value: 0 },
            { name: '河池市', code: '451200', value: 0 },
            { name: '来宾市', code: '451300', value: 0 },
            { name: '崇左市', code: '451400', value: 0 },
            { name: '海口市', code: '460100', value: 0 },
            { name: '三亚市', code: '460200', value: 0 },
            { name: '三沙市', code: '460300', value: 0 },
            { name: '省直辖县级行政区划', code: '469000', value: 0 },
            { name: '市辖区', code: '500100', value: 0 },
            { name: '县', code: '500200', value: 0 },
            { name: '成都市', code: '510100', value: 0 },
            { name: '自贡市', code: '510300', value: 0 },
            { name: '攀枝花市', code: '510400', value: 0 },
            { name: '泸州市', code: '510500', value: 0 },
            { name: '德阳市', code: '510600', value: 0 },
            { name: '绵阳市', code: '510700', value: 0 },
            { name: '广元市', code: '510800', value: 0 },
            { name: '遂宁市', code: '510900', value: 0 },
            { name: '内江市', code: '511000', value: 0 },
            { name: '乐山市', code: '511100', value: 0 },
            { name: '南充市', code: '511300', value: 0 },
            { name: '眉山市', code: '511400', value: 0 },
            { name: '宜宾市', code: '511500', value: 0 },
            { name: '广安市', code: '511600', value: 0 },
            { name: '达州市', code: '511700', value: 0 },
            { name: '雅安市', code: '511800', value: 0 },
            { name: '巴中市', code: '511900', value: 0 },
            { name: '资阳市', code: '512000', value: 0 },
            { name: '阿坝藏族羌族自治州', code: '513200', value: 0 },
            { name: '甘孜藏族自治州', code: '513300', value: 0 },
            { name: '凉山彝族自治州', code: '513400', value: 0 },
            { name: '贵阳市', code: '520100', value: 0 },
            { name: '六盘水市', code: '520200', value: 0 },
            { name: '遵义市', code: '520300', value: 0 },
            { name: '安顺市', code: '520400', value: 0 },
            { name: '毕节市', code: '520500', value: 0 },
            { name: '铜仁市', code: '520600', value: 0 },
            { name: '黔西南布依族苗族自治州', code: '522300', value: 0 },
            { name: '黔东南苗族侗族自治州', code: '522600', value: 0 },
            { name: '黔南布依族苗族自治州', code: '522700', value: 0 },
            { name: '昆明市', code: '530100', value: 0 },
            { name: '曲靖市', code: '530300', value: 0 },
            { name: '玉溪市', code: '530400', value: 0 },
            { name: '保山市', code: '530500', value: 0 },
            { name: '昭通市', code: '530600', value: 0 },
            { name: '丽江市', code: '530700', value: 0 },
            { name: '普洱市', code: '530800', value: 0 },
            { name: '临沧市', code: '530900', value: 0 },
            { name: '楚雄彝族自治州', code: '532300', value: 0 },
            { name: '红河哈尼族彝族自治州', code: '532500', value: 0 },
            { name: '文山壮族苗族自治州', code: '532600', value: 0 },
            { name: '西双版纳傣族自治州', code: '532800', value: 0 },
            { name: '大理白族自治州', code: '532900', value: 0 },
            { name: '德宏傣族景颇族自治州', code: '533100', value: 0 },
            { name: '怒江傈僳族自治州', code: '533300', value: 0 },
            { name: '迪庆藏族自治州', code: '533400', value: 0 },
            { name: '拉萨市', code: '540100', value: 0 },
            { name: '昌都地区', code: '542100', value: 0 },
            { name: '山南地区', code: '542200', value: 0 },
            { name: '日喀则地区', code: '542300', value: 0 },
            { name: '那曲地区', code: '542400', value: 0 },
            { name: '阿里地区', code: '542500', value: 0 },
            { name: '林芝地区', code: '542600', value: 0 },
            { name: '西安市', code: '610100', value: 0 },
            { name: '铜川市', code: '610200', value: 0 },
            { name: '宝鸡市', code: '610300', value: 0 },
            { name: '咸阳市', code: '610400', value: 0 },
            { name: '渭南市', code: '610500', value: 0 },
            { name: '延安市', code: '610600', value: 0 },
            { name: '汉中市', code: '610700', value: 0 },
            { name: '榆林市', code: '610800', value: 0 },
            { name: '安康市', code: '610900', value: 0 },
            { name: '商洛市', code: '611000', value: 0 },
            { name: '兰州市', code: '620100', value: 0 },
            { name: '嘉峪关市', code: '620200', value: 0 },
            { name: '金昌市', code: '620300', value: 0 },
            { name: '白银市', code: '620400', value: 0 },
            { name: '天水市', code: '620500', value: 0 },
            { name: '武威市', code: '620600', value: 0 },
            { name: '张掖市', code: '620700', value: 0 },
            { name: '平凉市', code: '620800', value: 0 },
            { name: '酒泉市', code: '620900', value: 0 },
            { name: '庆阳市', code: '621000', value: 0 },
            { name: '定西市', code: '621100', value: 0 },
            { name: '陇南市', code: '621200', value: 0 },
            { name: '临夏回族自治州', code: '622900', value: 0 },
            { name: '甘南藏族自治州', code: '623000', value: 0 },
            { name: '西宁市', code: '630100', value: 0 },
            { name: '海东市', code: '630200', value: 0 },
            { name: '海北藏族自治州', code: '632200', value: 0 },
            { name: '黄南藏族自治州', code: '632300', value: 0 },
            { name: '海南藏族自治州', code: '632500', value: 0 },
            { name: '果洛藏族自治州', code: '632600', value: 0 },
            { name: '玉树藏族自治州', code: '632700', value: 0 },
            { name: '海西蒙古族藏族自治州', code: '632800', value: 0 },
            { name: '银川市', code: '640100', value: 0 },
            { name: '石嘴山市', code: '640200', value: 0 },
            { name: '吴忠市', code: '640300', value: 0 },
            { name: '固原市', code: '640400', value: 0 },
            { name: '中卫市', code: '640500', value: 0 },
            { name: '乌鲁木齐市', code: '650100', value: 0 },
            { name: '克拉玛依市', code: '650200', value: 0 },
            { name: '吐鲁番地区', code: '652100', value: 0 },
            { name: '哈密地区', code: '652200', value: 0 },
            { name: '昌吉回族自治州', code: '652300', value: 0 },
            { name: '博尔塔拉蒙古自治州', code: '652700', value: 0 },
            { name: '巴音郭楞蒙古自治州', code: '652800', value: 0 },
            { name: '阿克苏地区', code: '652900', value: 0 },
            { name: '克孜勒苏柯尔克孜自治州', code: '653000', value: 0 },
            { name: '喀什地区', code: '653100', value: 0 },
            { name: '和田地区', code: '653200', value: 0 },
            { name: '伊犁哈萨克自治州', code: '654000', value: 0 },
            { name: '塔城地区', code: '654200', value: 0 },
            { name: '阿勒泰地区', code: '654300', value: 0 },
            { name: '自治区直辖县级行政区划', code: '659000', value: 0 }
        ]
    }

    for (var i = 0; i < china_map.data.length; i++) {
        china_map.hashData[china_map.data[i].code] = china_map.data[i];
    }

    return china_map;
});