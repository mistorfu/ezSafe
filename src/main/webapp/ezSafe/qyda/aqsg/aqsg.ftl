<link rel="stylesheet" type="text/css" href="<@spring.url '/ezSafe/qyda/aqsg/aqsg.css'/>"/>
<div class="aqsg-main">
    <div class="aqsg-left float">
        <span class="aqsg-year" id="dqyear">0</span>
        <div class="line-circle" id="headys">
            <span class="line short"></span><span class="circle"></span><span class="line short"></span>
        </div>
        <div class="sgitem sgnext-sgpic" id="next" >

        </div>
    </div><div class="aqsg-center float" id="aqsg-center">
    <div class="aqsg-incenter" id="incenter">
        <div class="inleft" id="template">

        </div>

    </div>
</div>
    <div class="aqsg-right float">
    <span class="aqsg-year" id="preyear">0</span>
    <div class="line-circle " id="endys">
        <span class="line short "></span><span class="circle"></span><span class="line short "></span>
    </div>
    <div class="sgprev-pic" id="prev">
        <img/>
    </div>
</div>
    <script id="javascriptTemplate" type="text/x-kendo-template">
        #
            var len = 4
            if(data.length>4){
                len = data.length
            }

            var bcolor = '\\#ffffff';
            var count = data[i]&&data[i].SGJB.VALUE?data[i].SGJB.VALUE:"";
            switch(count){
            case 1:
                bcolor = '\\#178fe5';
                break;
            case 2:
                bcolor = '\\#ff9a35';
                break;
            case 3:
                bcolor = '\\#ffbf00';
                break;
            case 4:
                bcolor = '\\#ff6565';
                break;
            case 5:
                bcolor = '\\#red';
                break;
            default:
                bcolor = '';

            }
        #



        #for(var i = 0;i<len;i++){#
        #
            var sjid = 0;
            sjid = sjid+1;
            var message =[]
            var datemonth = "0000-00-00"
            if(data[i]){
                if(data[i].KSSJ ){
                    datemonth = data[i].KSSJ.slice(0,11)
                }
                if(data[i].SGMS){
                    message = [data[i].SGMS.slice(0,18),
                    data[i].SGMS.slice(18,36),data[i].SGMS.slice(36,54),data[i].SGMS.slice(54,72)]
                }
            }

        #
        <div class="aqsg-span float">
            <span class="aqsg-season" >#=datemonth?datemonth:""#</span>
            <div class="line-circle">
                <span class="line"></span><span class="circle-s"></span><span class="line"></span>
            </div>
            <div class="sgitem sgmessage-box">
                <div class="sgtasks">
                    <ul id="timeline-box">
                        <li>
                            <div class="content">
                                #if(!data[i]){#
                                <div class="time"><span class="sgmcbk">事故名称</span><a class="sgxq"  style="cursor:pointer;display: none ">详情></a></div>

                                #}else{#

                                <div class="time"><span class="sgmcbk">事故名称</span><a class="sgxq" id="#:data[i].XXBH#" style="cursor:pointer ">详情></a></div>
                                #}#

                                <div class="task-info">

                                    <table class="qyxq-tab">
                                        <tbody
                                        <tr>
                                            <td class="short">发生时间</td>
                                            <td class="long" >#=data[i]?data[i].KSSJ:""#</td>
                                        </tr>
                                        <tr>
                                            <td class="short">事故类别</td>
                                            <td class="long"  title="普通注册" >#=data[i]&&data[i].SGLB.VALUE?data[i].SGLB.VALUE:""#</td>
                                        </tr>
                                        <tr>
                                            <td class="short">事故级别</td>
                                            <td class="long"  title="营业状态">

                                                <div style="background: #=bcolor#" class="sgjb"></div>
                                                <span>#=data[i]&&data[i].SGJB.VALUE?data[i].SGJB.VALUE:""#</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="2">
                                                <table class="ssqk-table" cellspacing = "0">
                                                    <tr>
                                                        <td>
                                                            <span class="swzt">#=data[i]&&data[i].SWRS?data[i].SWRS:"0"#</span></br>
                                                            <span>死亡</span>
                                                        </td>
                                                        <td>
                                                            <span class="qtzt">#=data[i]&&data[i].ZSRS?data[i].ZSRS:"0"#</span></br>
                                                            <span class="wzys">重伤</span>
                                                        </td>
                                                        <td>
                                                            <span class="qtzt">#=data[i]&&data[i].QSRS?data[i].QSRS:"0"#</span></br>
                                                            <span class="wzys">轻伤</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="3" class="wzys">
                                                            经济损失&nbsp&nbsp&nbsp<span class="qtzt">#=data[i]&&data[i].JJSS?data[i].JJSS.JE:0#</span>
                                                            <span class="jjdw">万元</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="short">事故原因</td>
                                            <td class="long">#=data[i]&&data[i].SGYY?data[i].SGYY:""#</td>
                                        </tr>
                                        <tr>
                                            <td  class="short">事故描述</td>
                                        </tr>
                                        <tr>
                                            <td class="long" colspan="2">#=message.length>0?message[0]:""#</td>
                                        </tr>
                                        <tr>
                                            <td class="long" colspan="2">#=message.length>1?message[1]:""#</td>
                                        </tr>
                                        <tr>
                                            <td class="long" colspan="2">#=message.length>2?message[2]:""#</td>
                                        </tr>
                                        <tr>
                                            <td class="long" colspan="2">#=message.length>3?message[3]:""#</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        #}#
    </script>
    <div id="bdzyWindow" style="display: none">
        <#include "/ezSafe/qyda/aqsg/aqsgEdit.ftl">

    </div>
</div>
