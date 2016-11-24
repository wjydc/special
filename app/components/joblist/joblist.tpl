<div class="w-joblist">
	<div class="joblist">
		<div>
			{%if count($data) gt 0%}
			{%foreach from=$data key="key" item="item"%}

			{%if $top!=0 and $key==0%}
			<div class="strong">
			{%/if%}
				<div class="job-child" data-id="{%$item.job_id%}">
					<ul class="base">
						<li class="job">
							<label><input type="checkbox"></label>
							<a href="//job.veryeast.cn/{%$item.c_userid%}/{%$item.job_id%}" target="_blank" class="ellipsis">{%$item.company_job_name|escape:none%}</a>
							<i class="buf">
								{%if $item.is_pressing_job eq 1%}（急）{%/if%}
								{%if $item.is_reserve_job eq 1%}（储备）{%/if%}
							</i>
							{%if in_array($item.contact_display_status, [1, 6, 7, 8])%}<i class="call"></i>{%/if%}
						</li>
						<li class="hotel">
							<a href="//job.veryeast.cn/{%$item.c_userid%}" target="_blank" class="comp ellipsis">{%$item.company_name%}</a>
							<a href="http://www.veryeast.cn/AdsShow/product/job/EvaluateIndex" target="_blank" title="雇主指数" class="compnum">{%$item.employer_index%}</a>
						</li>
						<li class="area">
							<span class="ellipsis">{%preg_replace("/[省市县区镇乡村]$/u", '', $item.job_province)%}{%if $item.job_city%}{%'-'|cat:preg_replace("/[省市县区镇乡村]$/u", '', $item.job_city)%}{%/if%}</span>
						</li>
						<li class="timer">
							<span>{%$item.job_update_time|truncate:10:''%}</span>
						</li>
						<li class="craze">
							<i class="p{%if $item.job_apply_num lte 10%}0{%elseif $item.job_apply_num gt 30%}2{%else%}1{%/if%}" title="已有{%$item.job_apply_num%}人申请"></i>
						</li>
					</ul>
					<div class="all">
						<div class="attr">
							经验：<i>{%if $item.work_year_min%}{%$item.work_year_min|cat:'年以上'%}{%else%}不限{%/if%}</i>
							学历：<i>{%$DROPDATA_INDEX.degree_id[$item.degree_id]%}</i>
							薪资：<i>{%if $item.salary_min or $item.salary_max%}{%$item.salary_min|cat:'-'|cat:$item.salary_max%}{%else%}面议{%/if%}</i>
							食宿：<i>{%$DROPDATA_INDEX.rations_quarters[$item.rations_quarters]%}</i>
							企业性质：<i>{%$DROPDATA_INDEX.company_type[$item.company_type]%}{%if $item.star_level%}{%'('|cat:$DROPDATA_INDEX.star_level[$item.star_level]|cat:')'%}{%/if%}</i>
							<div class="brief">{%$item.job_description|escape:none%}</div>
						</div>
						<div class="operate">
							<a href="javascript:;" class="apply"><span>立即申请</span><i></i></a>
							<a href="javascript:;" class="collect {%if in_array($item.job_id, $fav)%}active{%/if%}"><i></i>收藏职位</a>
						</div>
						<i class="clear"></i>
					</div>
				</div>
			{%if $top!=0 and $key==$top-1%}
			</div>
			{%/if%}

			{%/foreach%}
			{%else%}
			<div>
				<div class="no-jobs">当前没有符合条件的职位，请重新设置筛选条件</div>
			</div>
			{%/if%}
		</div>
	</div>
</div>

<!-- @require ../wukong/wukong.less -->
{%script%}
	require('joblist');
{%/script%}
