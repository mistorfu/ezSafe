<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/qyxx/aqyh/aqyh.css'/>"/>

<script id="aqyh-javascriptTemplate" type="text/x-kendo-template">
#for(var i=0;i<data.length;i++){#
    <li data-rwbh="#:data[i].RWBH#">
        <div class="aqyh-content">
                <div class="time" mark="datas#:i#"><span>#=data[i].SJKSSJ#</span><a href="javascript:void(0)">详情<label>&gt;</label></a></div>
                <div class="aqyh-task-info">
                    <table class="aqyh-tab">
                        <tbody>
                        <tr>
                            <td class="short">巡查分类</td>
                            <td class="long"  style="width: 10%;">#=data[i].XCFL?data[i].XCFL.VALUE:"网格巡查"#</td>
                            <td class="long" style="width: 14%;">
                                <table>
                                    <tbody class="aqyh-tab">
                                    <tr >
                                        <td title="类别" style="color: white;" class="short">类别</td>
                                        <td class="blue" title="#=data[i].XCLB.VALUE#">#=data[i].XCLB.VALUE?data[i].XCLB.VALUE:""#</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td class="short">巡查内容</td>
                            <td class="long" title="#=data[i].JHXCNR.XJSM?data[i].JHXCNR.XJSM:'无'#" colspan="2">#=data[i].JHXCNR.XJSM?data[i].JHXCNR.XJSM:'无'#</td>
                        </tr>
                        <tr>
                            <td class="short">隐患情况</td>
                            <td class="long" title="" colspan="2"><strong>#=data[i].YHSL?data[i].YHSL:0#</strong>处隐患</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </li>
#}#
</script>

 <div class="aqyh-main">
     <div class="aqyh-left float">
         <strong class="aqyh-year" id="aqyh-year-left">1940</strong>
         <div class="aqyh-line-circle">
             <span class="aqyh-line short"></span><span class="aqyh-circle-s" ></span><span class="aqyh-line short"></span>
         </div>
         <div class="aqyh-item yh-next-pic" id="aqyh-next">
         </div>
     </div>
     <div class="aqyh-center float" id="aqyh-center">
         <div class="aqyh-incenter" id="incenter">
             <div class="inleft">
                 <div class="aqyh-span float">
                     <span class="aqyh-season">第一季度</span>
                     <div class="aqyh-line-circle">
                         <span class="aqyh-line"></span><span class="aqyh-circle-s" id="s1"></span><span class="aqyh-line"></span>
                     </div>
                     <div class="aqyh-item aqyh-message-box">
                         <div class="aqyh-tasks" >
                             <ul class="aqyh-timeline-box" id="season1">

                             </ul>
                         </div>
                     </div>
                 </div>
                 <div class="aqyh-span float">
                     <span class="aqyh-season">第二季度</span>
                     <div class="aqyh-line-circle">
                         <span class="aqyh-line"></span><span class="aqyh-circle-s" id="s2"></span><span class="aqyh-line"></span>
                     </div>
                     <div class="aqyh-item aqyh-message-box">
                         <div class="aqyh-tasks" >
                             <ul class="aqyh-timeline-box"  id="season2"></ul>
                         </div>
                     </div>
                 </div>
                 <div class="aqyh-span float">
                     <span class="aqyh-season">第三季度</span>
                     <div class="aqyh-line-circle">
                         <span class="aqyh-line"></span><span class="aqyh-circle-s" id="s3"></span><span class="aqyh-line"></span>
                     </div>
                     <div class="aqyh-item aqyh-message-box">
                         <div class="aqyh-tasks">
                             <ul class="aqyh-timeline-box"  id="season3"></ul>
                         </div>
                     </div>
                 </div>
                 <div class="aqyh-span float">
                     <span class="aqyh-season">第四季度</span>
                     <div class="aqyh-line-circle">
                         <span class="aqyh-line"></span><span class="aqyh-circle-s" id="s4"></span><span class="aqyh-line"></span>
                     </div>
                     <div class="aqyh-item aqyh-message-box">
                         <div class="aqyh-tasks" >
                             <ul class="aqyh-timeline-box"  id="season4"></ul>
                         </div>
                     </div>
                 </div>
             </div>

         </div>
     </div>
     <div class="aqyh-right float">
         <strong class="aqyh-year" id="aqyh-year-right">1941</strong>
         <div class="aqyh-line-circle ">
             <span class="aqyh-line short "></span><span class="aqyh-circle-s"></span><span class="aqyh-line short "></span>
         </div>
         <div class="yh-prev-pic" id="aqyh-prev">
         </div>
     </div>
 </div>
<div id="aqyhWindow" style="display: none">
        <#include "/ezSafe/qyda/qyxx/aqyh/details/xcrwEdit.ftl">
</div>

<div id="aqyhdetil-window" style="display: none">
        <#include "/ezSafe/qyda/qyxx/aqyh/details/aqyhDetail.ftl">
</div>

