{%function name="searchScreenItem" pla="" vid=""%}
    <span control="select" onclick="runga('send','event','search','searchScreenItem', '{%$pla%}')" class="select" data-v="{%$vid%}"><i pla="{%$pla%}">{%$pla%}</i><input type="hidden" name="{%$vid%}"></span>
{%/function%}

<div class="w-screen">

    <div class="screen">
        共<i class="num">{%$data.result_count%}</i>个职位，在结果中筛选：
        <input type="text" placeholder="请输入关键字" maxlength="50">
        <a class="btn-n1" href="javascript:;" onclick="runga('send','event','search','排除')">排除</a>
    </div>
    <div class="child"></div>
    <i class="clear"></i>


    <div class="drops">
        <form>
            {%call name="searchScreenItem" pla="更新日期" vid="job_update_time"%}
            {%call name="searchScreenItem" pla="工作经验" vid="work_year_min"%}
            {%call name="searchScreenItem" pla="月薪范围" vid="salary"%}
            {%call name="searchScreenItem" pla="学历要求" vid="degree_id"%}
            {%call name="searchScreenItem" pla="职位性质" vid="work_mode"%}
            {%call name="searchScreenItem" pla="食宿情况" vid="rations_quarters"%}
            {%call name="searchScreenItem" pla="性别" vid="gender_id"%}
            {%call name="searchScreenItem" pla="联系方式公开程度" vid="contact_display_status"%}
        </form>
    </div>

</div>


{%script%}
    require('screen');
{%/script%}