<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/qygl/qyglEdit.css'/>"/>

<#--图片文件-->
<script type="text/kendo-ui-template" id="qygl-pic-template">
    <div class="list-pic-item" tabindex="0">
        <div class="qygl-pic-content">
            <img src="#:TPDZ#"/>
            <div class="pic-remove" data-bind="events:{click: removeFile}"></div>
        </div>
        <div class="pic-desc">
            <input type="text" data-bind="value:TPMS"/>
        </div>
    </div>
</script>

<div class="custom-window-head">
    <div class="window-title-background1"></div>
    <div class="window-title-background2"></div>
    <div class="custom-window-title" id="edit-window-title"></div>
    <div class="window-close-button" id="edit-window-close"></div>
</div>


<div class="qyglEdit-wrap">
<#--基本信息-->
    <div class="qyglEdit-content" id="qyglEdit-jbxx">
        <label class="required-red">企业名称</label>
            <input class="long-input must" type="text" data-bind="value:dataKendo.QYMC"/>
        <label class="required-red">工商注册号</label>
            <input type="text" class="must" data-bind="value:dataKendo.GSZCH"/>
        <label class="required-red">机构代码</label>
            <input type="text" class="must" data-bind="value:dataKendo.ZZJGDM"/>
        <label class="required-red">信用编码</label>
            <input type="text" class="must" data-bind="value:dataKendo.TYSHXYBM"/>
        <label class="required-red">注册类型</label>
            <div type="text" class="dropdownzdx" id="zclxDropDown" data-bind="value:dataKendo.ZCLX"></div>
        <label class="required-red">注册地址</label>
            <input class="long-input must" type="text" data-bind="value:dataKendo.ZCDZ"/>
        <label class="required-red">经营地址</label>
            <input class="long-input must" type="text" data-bind="value:dataKendo.JYDZ"/>
        <label>邮政编码</label>
            <input type="text" data-bind="value:dataKendo.YZBM"/>
        <label>所属网格</label>
            <input type="text" id="qygl-wgxxSelectIpt" data-bind="value:dataKendo.SSWG.WGMC,events:{click:openWgxx}"/>
        <label>地理位置</label>
            <div type="text" class="dropdownzdx long-input" id="dlwzDropDown" data-bind="value:dataKendo.DLWZ"></div>
        <label class="required-red">所属街镇</label>
            <input type="text" class="must" data-bind="value:dataKendo.SSJZ.JZMC"/>
        <label class="required-red">所属辖区</label>
            <input type="text" id="qygl-xzqhSelectIpt" data-bind="value:dataKendo.SSXQ.XZQHMC,events:{click:openXzqh}">
        <label>企业状态</label>
            <div class="whp-input-style dropdownzdx" data-bind="value:dataKendo.QYZT"
                 data-role="dropdownzdx" data-zdlx="20002" data-double-bind="true"></div>
            <label></label>
            <input type="text" class="placeholder">
        <label>企业概况</label>
            <textarea class="long-input" data-bind="value:dataKendo.QYGK"></textarea>
        <label>企业备注</label>
            <textarea class="long-input" data-bind="value:dataKendo.QYBZ"></textarea>

            <label>企业图片</label>
            <div class="qygl-upload-image-button" data-bind="events:{ click : uploadFile}"></div>
            <div class="qygl-list-pic" data-bind="source:dataKendo.QYTP"
                 data-template="qygl-pic-template"></div>
    </div>
<#--经营信息-->
    <div class="qyglEdit-content" id="qyglEdit-jyxx">
        <label>企业分类</label>
            <div class="whp-input-style dropdownzdx" data-bind="value:dataKendo.QYFL" id="qygl-qyfl-lx"></div>
        <label>企业规模</label>
            <div class="whp-input-style dropdownzdx" data-bind="value:dataKendo.QYGM" id="qygl-qygm-lx"></div>
        <label>规模情况</label>
            <input class="long-input" type="text" data-bind="value:dataKendo.QYGMQK"/>
        <label>所属行业</label>
            <div class="whp-input-style dropdownzdx" data-bind="value:dataKendo.SSHYLY" id="qygl-sshyly-lx"></div>
        <label>国民经济行业</label>
            <input type="text" data-bind="value:dataKendo.GMJJHY.VALUE"/>
        <label>上级公司</label>
            <input type="text" data-bind="value:dataKendo.SJGSMC"/>
        <label>所属行业集团</label>
            <input type="text" data-bind="value:dataKendo.SSHYJT"/>
        <label>成立日期</label>
            <input type="text" id="clrq-date-pick" data-bind="value:dataKendo.CLRQ" />
        <label>投产日期</label>
            <input type="text" id="tcrq-date-pick" data-bind="value:dataKendo.TCRQ" />
        <label>安全生产等级</label>
            <div class="whp-input-style dropdownzdx" data-bind="value:dataKendo.AQSCDJ"
                 data-role="dropdownzdx" data-zdlx="20007" data-double-bind="true"></div>
        <label></label>
        <input type="text" class="placeholder">
        <label>经营范围</label>
            <textarea class="long-input" data-bind="value:dataKendo.JYFW"></textarea>
        <label>主要风险</label>
            <div class="whp-input-style dropdownzdx" data-bind="value:dataKendo.ZYFX"
                 data-role="dropdownzdx" data-zdlx="20006" data-double-bind="true"></div>
        <label>投资方国籍</label>
            <div class="whp-input-style dropdownzdx" data-bind="value:dataKendo.TZFGJ"
                 data-role="dropdownzdx" data-zdlx="20008" data-double-bind="true"></div>
        <label>风险说明</label>
            <textarea class="long-input" data-bind="value:dataKendo.ZYFXSM"></textarea>
        <label>法人代表</label>
        <div class="qygl-text">
            <label class="required-red">人员姓名</label>
                <input type="text" data-bind="value:dataKendo.FRDB.RYXM"/>
            <label>人员性别</label>
                <div class="whp-input-style qygl-td flex5 dropdownzdx" data-bind="value:dataKendo.FRDB.RYXB" data-role="dropdownzdx" data-zdlx="1" data-double-bind="true"></div>
            <label>人员职务</label>
                <input type="text" data-bind="value:dataKendo.FRDB.RYZW"/>
            <label>证件信息</label>
                <input type="text" data-bind="value:dataKendo.FRDB.ZJXX.VALUE"/>
            <label>出生日期</label>
                <input type="text" data-bind="value:dataKendo.FRDB.CSRQ" class="date-pick"  />
            <label>固定电话</label>
                <input type="text" data-bind="value:dataKendo.FRDB.GDDH"/>
            <label>移动电话</label>
                <input type="text" data-bind="value:dataKendo.FRDB.YDDH"/>
            <label>电子邮箱</label>
                <input type="text" data-bind="value:dataKendo.FRDB.DZYX"/>
        </div>
        <label>联系人员</label>
            <input type="text" data-bind="value:dataKendo.LXRY"/>
        <label>固定电话</label>
            <input type="text" data-bind="value:dataKendo.GDDH"/>
        <label>移动电话</label>
            <input type="text" data-bind="value:dataKendo.YDDH"/>
        <label>电子邮箱</label>
            <input type="text" data-bind="value:dataKendo.DZYX"/>
        <label>单位传真</label>
            <input type="text" data-bind="value:dataKendo.DWCZ"/>
        <label>注册资本</label>
            <input type="text" data-bind="value:dataKendo.ZCZB.JE"/>
        <label>投资总额</label>
            <input type="text" data-bind="value:dataKendo.TZZE.JE"/>
        <label>固定资产总额</label>
            <input type="text" data-bind="value:dataKendo.GDZCZE.JE"/>
        <label>年利润总额</label>
            <input type="text" data-bind="value:dataKendo.NLRZE.JE"/>
        <label>年销售收入</label>
            <input type="text" data-bind="value:dataKendo.NXSSRZE.JE"/>
    </div>
<#--消防相关-->
    <div class="qyglEdit-content" id="qyglEdit-xfxg">
            <label>占地面积</label>
                <input type="text" data-bind="value:dataKendo.ZDMJ"/>
            <label>仓库建筑面积</label>
                <input type="text" data-bind="value:dataKendo.CKJZMJ"/>
            <label>办公楼建筑面积</label>
                <input type="text" data-bind="value:dataKendo.BGLJZMJ"/>
            <label>车间厂房建筑面积</label>
                <input type="text" data-bind="value:dataKendo.CJCFJZMJ"/>
            <label>厂房归属</label>
                <input type="text" data-bind="value:dataKendo.CFGS.VALUE"/>
            <label>从业人员数量</label>
                <input type="text" data-bind="value:dataKendo.CYRYSL"/>
            <label>安全工程师人数</label>
                <input type="text" data-bind="value:dataKendo.AQGCSRS"/>
            <label>安全生产管理人数</label>
                <input type="text" data-bind="value:dataKendo.AQSCGLRS"/>
            <label>是否有重大危险源</label>
                <div class="whp-input-style dropdownzdx" data-bind="value:dataKendo.SFYZDWXY" id="qygl-sfyzdwxy-lx"></div>
            <label>是否有易燃易爆物</label>
                <div class="whp-input-style dropdownzdx" data-bind="value:dataKendo.SFYYRYBW" id="qygl-sfyyrybw-lx"></div>
            <label>是否有应急队伍</label>
                <div class="whp-input-style dropdownzdx" data-bind="value:dataKendo.SFYYJDW" id="qygl-sfyyjdw-lx"></div>
            <label></label>
            <div></div>
    </div>
</div>
<div class="window-button-row">
    <div class="window-one-button" id="saveButton"></div>
    <div class="window-one-button" id="cancelButton"></div>
</div>

<#--行政区划选择-->
<div class="xzqh-window">
</div>

<#--网格选择-->
<div class="wgxx-window">
</div>




