<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/qygl/qyglDetail.css'/>"/>
<div id="tab-container">
    <div class="tab-button selected" id="tab-jbxx">基本信息</div>
    <div class="tab-button" id="tab-jyxx">经营信息</div>
    <div class="tab-button" id="tab-xfxg">消防相关</div>
</div>
<div id="detail-container">
    <div class="content-container selected" id="detail-jbxx">
        <label>企业名称</label>
        <input type="text" data-bind="value:dataKendo.QYMC" class="long-input" disabled="disabled" />

        <label>工商注册号</label>
        <input type="text" data-bind="value:dataKendo.GSZCH" disabled="disabled" />

        <label>机构代码</label>
        <input type="text" data-bind="value:dataKendo.ZZJGDM" disabled="disabled" />

        <label>信用编码</label>
        <input type="text" data-bind="value:dataKendo.TYSHXYBM" disabled="disabled" />

        <label>注册类型</label>
        <input type="text" data-bind="value:dataKendo.ZCLX.VALUE" disabled="disabled" />

        <label>注册地址</label>
        <input type="text" data-bind="value:dataKendo.ZCDZ" class="long-input" disabled="disabled" />

        <label>经营地址</label>
        <input type="text" data-bind="value:dataKendo.JYDZ" class="long-input" disabled="disabled" />

        <label>邮政编码</label>
        <input type="text" data-bind="value:dataKendo.YZBM" disabled="disabled" />

        <label>所属网格</label>
        <input type="text" data-bind="value:dataKendo.SSWG.WGMC" disabled="disabled" />

        <label>地理位置</label>
        <input type="text" data-bind="value:dataKendo.DLWZ.VALUE" class="long-input" disabled="disabled" />

        <label>所属街镇</label>
        <input type="text" data-bind="value:dataKendo.SSJZ.JZMC" disabled="disabled" />

        <label>所属辖区</label>
        <input type="text" data-bind="value:dataKendo.SSXQ.XZQHMC" disabled="disabled" />

        <label>企业状态</label>
        <input type="text" data-bind="value:dataKendo.QYZT" disabled="disabled" />
        <label></label><input type="text" class="placeholder"/>

        <label>企业概况</label>
        <textarea data-bind="value:dataKendo.QYGK" class="long-input" disabled="disabled"></textarea>

        <label>企业备注</label>
        <textarea data-bind="value:dataKendo.QYBZ" class="long-input" disabled="disabled"></textarea>

        <label>企业图片</label>
        <div id="detail-QYTP" class="long-input">
            <div class="image-container">
                <ul class="image-wrapper">
                    <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
                </ul>
            </div>
            <span class="index"></span>
            <div id="btn-prev" class="image-switch"></div>
            <div id="btn-next" class="image-switch"></div>
        </div>
    </div>
    <div class="content-container" id="detail-jyxx">
        <label>企业分类</label>
        <input type="text" data-bind="value:dataKendo.QYFL.VALUE" disabled="disabled" />

        <label>企业规模</label>
        <input type="text" data-bind="value:dataKendo.QYGM.VALUE" disabled="disabled" />

        <label>规模情况</label>
        <input type="text" data-bind="value:dataKendo.QYGMQK" class="long-input" disabled="disabled" />

        <label>所属行业</label>
        <input type="text" data-bind="value:dataKendo.SSHYLY.VALUE" disabled="disabled" />

        <label>国民经济行业</label>
        <input type="text" data-bind="value:dataKendo.GMJJHY.VALUE" disabled="disabled" />

        <label>所属行业集团</label>
        <input type="text" data-bind="value:dataKendo.SSHYJT.VALUE" class="long-input" disabled="disabled" />

        <label>上级公司</label>
        <input type="text" data-bind="value:dataKendo.SJGSMC.VALUE" disabled="disabled" />

        <label>成立日期</label>
        <input type="text" data-bind="value:dataKendo.CLRQ" disabled="disabled" />

        <label>投产日期</label>
        <input type="text" data-bind="value:dataKendo.TCRQ" disabled="disabled" />

        <label>安全生产等级</label>
        <input type="text" data-bind="value:dataKendo.AQSCDJ.VALUE" disabled="disabled" />

        <label>经营范围</label>
        <textarea data-bind="value:dataKendo.JYFW" class="long-input" disabled="disabled"></textarea>

        <label>主要风险</label>
        <input type="text" data-bind="value:dataKendo.ZYFX.VALUE" disabled="disabled" />

        <label>投资方国籍</label>
        <input type="text" data-bind="value:dataKendo.TZFGJ.VALUE" disabled="disabled" />

        <label>风险说明</label>
        <textarea data-bind="value:dataKendo.ZYFXSM" class="long-input" disabled="disabled"></textarea>

        <label>法人代表</label>
        <div id="detail-FRDB" class="long-input">
            <span class="frdb-field">人员姓名</span>
            <span class="frdb-value"><nobr data-bind="text:dataKendo.FRDB.RYXM"></nobr></span>
            <span class="frdb-field">人员性别</span>
            <span class="frdb-value no-right-border" data-bind="text:dataKendo.FRDB.RYXB.VALUE"></span>

            <span class="frdb-field">人员职务</span>
            <span class="frdb-value" data-bind="text:dataKendo.FRDB.RYZW"></span>
            <span class="frdb-field">证件信息</span>
            <span class="frdb-value no-right-border" data-bind="text:dataKendo.FRDB.ZJXX.VALUE"></span>

            <span class="frdb-field">出生日期</span>
            <span class="frdb-value" data-bind="text:dataKendo.FRDB.CSRQ"></span>
            <span class="frdb-field">固定电话</span>
            <span class="frdb-value no-right-border" data-bind="text:dataKendo.FRDB.GDDH"></span>

            <span class="frdb-field no-bottom-border">移动电话</span>
            <span class="frdb-value no-bottom-border" data-bind="text:dataKendo.FRDB.YDDH"></span>
            <span class="frdb-field no-bottom-border">电子邮箱</span>
            <span class="frdb-value no-border" data-bind="text:dataKendo.FRDB.DZYX"></span>
        </div>

        <label>联系人员</label>
        <input type="text" data-bind="value:dataKendo.LXRY" disabled="disabled" />

        <label>固定电话</label>
        <input type="text" data-bind="value:dataKendo.GDDH" disabled="disabled" />

        <label>移动电话</label>
        <input type="text" data-bind="value:dataKendo.YDDH" disabled="disabled" />

        <label>电子邮箱</label>
        <input type="text" data-bind="value:dataKendo.DZYX" disabled="disabled" />

        <label>单位传真</label>
        <input type="text" data-bind="value:dataKendo.DWCZ" disabled="disabled" />

        <label>注册资本</label>
        <input type="text" data-bind="value:dataKendo.ZCZB.JE" disabled="disabled" />

        <label>投资总额</label>
        <input type="text" data-bind="value:dataKendo.TZZE.JE" disabled="disabled" />

        <label>固定资产总额</label>
        <input type="text" data-bind="value:dataKendo.GDZCZE.JE" disabled="disabled" />

        <label>年利润总额</label>
        <input type="text" data-bind="value:dataKendo.NLRZE.JE" disabled="disabled" />

        <label>年销售收入</label>
        <input type="text" data-bind="value:dataKendo.NXSSRZE.JE" disabled="disabled" />
    </div>
    <div class="content-container" id="detail-xfxg">
        <label class="width-9em">占地面积</label>
        <input type="text" data-bind="value:dataKendo.ZDMJ" class="short-input" disabled="disabled" />

        <label class="width-9em">仓库建筑面积</label>
        <input type="text" data-bind="value:dataKendo.CKJZMJ" class="short-input" disabled="disabled" />

        <label class="width-9em">办公楼建筑面积</label>
        <input type="text" data-bind="value:dataKendo.BGLJZMJ" class="short-input" disabled="disabled" />

        <label class="width-9em">车间厂房建筑面积</label>
        <input type="text" data-bind="value:dataKendo.CJCFJZMJ" class="short-input" disabled="disabled" />

        <label class="width-9em">厂房归属</label>
        <input type="text" data-bind="value:dataKendo.CFGS.VALUE" class="short-input" disabled="disabled" />

        <label class="width-9em">从业人员数量</label>
        <input type="text" data-bind="value:dataKendo.CYRYSL" class="short-input" disabled="disabled" />

        <label class="width-9em">安全工程师人数</label>
        <input type="text" data-bind="value:dataKendo.AQGCSRS" class="short-input" disabled="disabled" />

        <label class="width-9em">安全生产管理人数</label>
        <input type="text" data-bind="value:dataKendo.AQSCGLRS" class="short-input" disabled="disabled" />

        <label class="width-9em">是否有重大危险源</label>
        <input type="text" data-bind="value:dataKendo.SFYZDWXY" class="short-input" disabled="disabled" />

        <label class="width-9em">是否有易燃易爆物</label>
        <input type="text" data-bind="value:dataKendo.SFYYRYBW" class="short-input" disabled="disabled" />

        <label class="width-9em">是否有应急队伍</label>
        <input type="text" data-bind="value:dataKendo.SFYYJDW" class="short-input" disabled="disabled" />
        <label class="width-9em"></label><input type="text" class="short-input placeholder"/>
    </div>
</div>